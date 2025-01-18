import { utils, writeFile } from 'xlsx';
import type { Employee, LeaveRequest } from '../../types';
import { formatDayMonthYear, formatDateTime } from '../dateTime';

interface LeaveRequestExportData {
  'Employee Name': string;
  'Position': string;
  'Start Date': string;
  'End Date': string;
  'Reason': string;
  'Status': string;
  'Created At': string;
}

export function exportLeaveRequests(requests: LeaveRequest[], employees: Employee[]): void {
  try {
    const exportData: LeaveRequestExportData[] = requests.map(request => {
      const employee = employees.find(emp => emp.id === request.employeeId);
      return {
        'Employee Name': employee?.name || 'Unknown',
        'Position': employee?.position || 'Unknown',
        'Start Date': formatDayMonthYear(request.startDate),
        'End Date': formatDayMonthYear(request.endDate),
        'Reason': request.reason,
        'Status': request.status.charAt(0).toUpperCase() + request.status.slice(1),
        'Created At': formatDateTime(request.createdAt),
      };
    });

    // Create workbook and worksheet
    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Leave Requests');

    // Auto-size columns
    const maxWidth = 50;
    worksheet['!cols'] = Object.keys(exportData[0]).map(() => ({ width: maxWidth }));

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `leave_requests_${date}.xlsx`;

    // Save file
    writeFile(workbook, filename);
  } catch (error) {
    console.error('Failed to export leave requests:', error);
    throw new Error('Failed to export leave requests');
  }
}