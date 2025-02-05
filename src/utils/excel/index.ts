import { utils, writeFile } from 'xlsx';
import { saveAs } from 'file-saver';
import type { Employee, LeaveRequest } from '../../types';
import { employeeFormatter, leaveRequestFormatter, timeTrackingFormatter, wageCalculationFormatter } from './formatters';
import { autoSizeColumns } from './helpers';
import type { ExcelOptions, WageExportData } from './types';
import { formatDate } from '../dateTime';

export function exportToExcel(
  data: any[],
  type: 'employees' | 'leave-requests' | 'time-tracking' | 'wage-calculation',
  options?: Partial<ExcelOptions>
): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const defaultOptions: ExcelOptions = {
      filename: `${type}_${formatDate(new Date())}`,
      sheetName: 'Data',
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Select formatter based on type
    const formatter = {
      employees: employeeFormatter,
      'leave-requests': leaveRequestFormatter,
      'time-tracking': timeTrackingFormatter,
      'wage-calculation': wageCalculationFormatter,
    }[type];

    if (!formatter) {
      throw new Error(`Invalid export type: ${type}`);
    }

    // Format data
    const formattedData = data.map(item => formatter.format(item));

    // Create workbook and worksheet
    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, finalOptions.sheetName);

    // Auto-size columns
    autoSizeColumns(worksheet);

    // Generate Excel file
    const excelBuffer = writeFile(workbook, finalOptions.filename + '.xlsx', { bookType: 'xlsx', type: 'array' });
    
    // Create Blob and save file
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${finalOptions.filename}.xlsx`);
  } catch (error) {
    console.error('Failed to export Excel file:', error);
    throw new Error('Failed to generate Excel file');
  }
}