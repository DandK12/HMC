import { utils, writeFile } from 'xlsx';
import type { Employee, ResignationRequest } from '../../types';
import { formatDayMonthYear, formatDateTime } from '../dateTime';

interface ResignationRequestExportData {
  'Employee Name': string;
  'Position': string;
  'Passport': string;
  'Request Date': string;
  'Status': string;
  'Reason (IC)': string;
  'Reason (OOC)': string;
  'Created At': string;
}

export function exportResignationRequests(requests: ResignationRequest[], employees: Employee[]): void {
  try {
    const exportData: ResignationRequestExportData[] = requests.map(request => {
      const employee = employees.find(emp => emp.id === request.employeeId);
      return {
        'Employee Name': employee?.name || 'Unknown',
        'Position': employee?.position || 'Unknown',
        'Passport': request.passport,
        'Request Date': formatDayMonthYear(request.requestDate),
        'Status': request.status.charAt(0).toUpperCase() + request.status.slice(1),
        'Reason (IC)': request.reasonIC,
        'Reason (OOC)': request.reasonOOC,
        'Created At': formatDateTime(request.createdAt),
      };
    });

    // Create workbook and worksheet
    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Resignation Requests');

    // Auto-size columns
    const maxWidth = 50;
    worksheet['!cols'] = Object.keys(exportData[0]).map(() => ({ width: maxWidth }));

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `resignation_requests_${date}.xlsx`;

    // Save file
    writeFile(workbook, filename);
  } catch (error) {
    console.error('Failed to export resignation requests:', error);
    throw new Error('Failed to export resignation requests');
  }
}