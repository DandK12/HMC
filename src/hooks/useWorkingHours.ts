import { useState, useCallback } from 'react';
import { workingHoursService } from '../services/workingHoursService';
import { discordNotifications } from '../utils/discord';
import type { Employee } from '../types';

interface UseWorkingHoursReturn {
  isProcessing: boolean;
  error: string | null;
  startDuty: (employee: Employee) => Promise<void>;
  endDuty: (employee: Employee) => Promise<void>;
  clearError: () => void;
}

export function useWorkingHours(onSuccess: () => Promise<void>): UseWorkingHoursReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startDuty = async (employee: Employee) => {
    if (!employee?.id) {
      setError('Please select an employee first');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Check for active session first
      const lastEntry = employee.workingHours[employee.workingHours.length - 1];
      if (lastEntry && !lastEntry.checkOut) {
        throw new Error('Employee already has an active duty session');
      }

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const checkIn = now.toISOString();

      await workingHoursService.checkIn(employee.id, date, checkIn);
      await discordNotifications.checkIn(employee.name, employee.position, now);
      await onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start duty';
      setError(errorMessage);
      console.error('Start duty error:', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const endDuty = async (employee: Employee) => {
    if (!employee?.id) {
      setError('Please select an employee first');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const now = new Date();
      const checkOut = now.toISOString();
      
      const lastEntry = employee.workingHours[employee.workingHours.length - 1];
      if (!lastEntry?.id) {
        throw new Error('No active duty session found');
      }

      if (lastEntry.checkOut) {
        throw new Error('Employee is not on duty');
      }

      const checkInTime = new Date(lastEntry.checkIn);
      const totalHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      // Handle long duration sessions
      if (totalHours > 48) {
        // Split into multiple entries for sessions longer than 48 hours
        await workingHoursService.handleLongDurationSession(
          lastEntry.id,
          checkInTime,
          now,
          employee.id
        );
      } else {
        await workingHoursService.checkOut(lastEntry.id, checkOut, totalHours);
      }
      
      await discordNotifications.checkOut(employee.name, employee.position, now, totalHours);
      await onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end duty';
      setError(errorMessage);
      console.error('End duty error:', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearError = useCallback(() => setError(null), []);

  return {
    isProcessing,
    error,
    startDuty,
    endDuty,
    clearError,
  };
}