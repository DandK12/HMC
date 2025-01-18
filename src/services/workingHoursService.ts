import {
  checkIn as apiCheckIn,
  checkOut as apiCheckOut,
  updateTimeEntry as apiUpdateTimeEntry,
  deleteTimeEntry as apiDeleteTimeEntry,
  create as apiCreate
} from '../lib/api/workingHoursApi';
import { validateEmployeeId, validateWorkingHoursData } from './validation';
import type { WorkingHours } from '../types';

const MAX_SESSION_HOURS = 24; // Maximum hours per session

export const workingHoursService = {
  async create(employeeId: string, data: Partial<WorkingHours> | Partial<WorkingHours>[]): Promise<WorkingHours[]> {
    validateEmployeeId(employeeId);

    const entries = Array.isArray(data) ? data : [data];
    
    entries.forEach(entry => {
      validateWorkingHoursData({
        date: entry.date,
        checkIn: entry.checkIn,
        checkOut: entry.checkOut,
      });
    });

    const processedEntries = entries.flatMap(entry => splitTimeEntryAcrossMonths(entry));
    const finalEntries = processedEntries.map(entry => {
      if (entry.checkIn && entry.checkOut) {
        const checkInTime = new Date(entry.checkIn).getTime();
        const checkOutTime = new Date(entry.checkOut).getTime();
        entry.totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
      }
      return entry;
    });

    return apiCreate(employeeId, finalEntries);
  },

  async checkIn(employeeId: string, date: string, checkIn: string): Promise<WorkingHours> {
    validateEmployeeId(employeeId);
    validateWorkingHoursData({ date, checkIn });
    return apiCheckIn(employeeId, date, checkIn);
  },

  async checkOut(id: string, checkOut: string, totalHours: number): Promise<WorkingHours> {
    if (!id) throw new Error('Working hours ID is required');
    return apiCheckOut(id, checkOut, totalHours);
  },

  async handleLongDurationSession(
    originalEntryId: string,
    checkInTime: Date,
    checkOutTime: Date,
    employeeId: string
  ): Promise<void> {
    const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    const numberOfSessions = Math.ceil(totalHours / MAX_SESSION_HOURS);
    
    // Split into multiple sessions
    for (let i = 0; i < numberOfSessions; i++) {
      const sessionStart = new Date(checkInTime.getTime() + (i * MAX_SESSION_HOURS * 60 * 60 * 1000));
      const sessionEnd = new Date(Math.min(
        sessionStart.getTime() + (MAX_SESSION_HOURS * 60 * 60 * 1000),
        checkOutTime.getTime()
      ));

      if (i === 0) {
        // Update the original entry
        await apiUpdateTimeEntry(originalEntryId, {
          checkOut: sessionEnd.toISOString(),
          totalHours: MAX_SESSION_HOURS,
        });
      } else {
        // Create new entries for subsequent periods
        await apiCreate(employeeId, [{
          date: sessionStart.toISOString().split('T')[0],
          checkIn: sessionStart.toISOString(),
          checkOut: sessionEnd.toISOString(),
          totalHours: (sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60 * 60),
        }]);
      }
    }
  },

  async updateTimeEntry(id: string, updates: Partial<WorkingHours>): Promise<WorkingHours> {
    if (!id) throw new Error('Working hours ID is required');
    
    if (updates.checkIn && updates.checkOut) {
      const checkInTime = new Date(updates.checkIn).getTime();
      const checkOutTime = new Date(updates.checkOut).getTime();
      
      if (checkInTime >= checkOutTime) {
        throw new Error('Check-out time must be after check-in time');
      }
      
      updates.totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    }

    return apiUpdateTimeEntry(id, updates);
  },

  async delete(id: string): Promise<void> {
    if (!id) throw new Error('Working hours ID is required');
    return apiDeleteTimeEntry(id);
  },
};

function splitTimeEntryAcrossMonths(entry: Partial<WorkingHours>): Partial<WorkingHours>[] {
  if (!entry.checkIn || !entry.checkOut) {
    return [entry];
  }

  const checkIn = new Date(entry.checkIn);
  const checkOut = new Date(entry.checkOut);
  
  if (checkIn.getMonth() === checkOut.getMonth() && 
      checkIn.getFullYear() === checkOut.getFullYear()) {
    return [entry];
  }

  const endOfFirstMonth = new Date(checkIn.getFullYear(), checkIn.getMonth() + 1, 0, 23, 59, 59, 999);
  const firstMonthHours = (endOfFirstMonth.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

  const startOfSecondMonth = new Date(checkOut.getFullYear(), checkOut.getMonth(), 1, 0, 0, 0, 0);
  const secondMonthHours = (checkOut.getTime() - startOfSecondMonth.getTime()) / (1000 * 60 * 60);

  return [
    {
      date: checkIn.toISOString().split('T')[0],
      checkIn: checkIn.toISOString(),
      checkOut: endOfFirstMonth.toISOString(),
      totalHours: firstMonthHours,
    },
    {
      date: startOfSecondMonth.toISOString().split('T')[0],
      checkIn: startOfSecondMonth.toISOString(),
      checkOut: checkOut.toISOString(),
      totalHours: secondMonthHours,
    },
  ];
}