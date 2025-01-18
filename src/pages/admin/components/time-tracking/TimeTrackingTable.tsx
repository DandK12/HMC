import { Edit2, Trash2 } from 'lucide-react';
import { formatDate, formatFullDateTime } from '../../../../utils/dateTime';
import { formatDuration } from '../../../../utils/time';
import type { Employee, WorkingHours } from '../../../../types';

interface TimeTrackingTableProps {
  entries: Array<{
    hours: WorkingHours;
    employee: Employee;
  }>;
  onEdit: (hours: WorkingHours, employee: Employee) => void;
  onDelete: (hours: WorkingHours) => void;
}

export function TimeTrackingTable({ entries, onEdit, onDelete }: TimeTrackingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Anggota
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jabatan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check In
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map(({ hours, employee }) => (
            <tr 
              key={hours.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {employee.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {employee.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(hours.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatFullDateTime(hours.checkIn)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {hours.checkOut ? (
                  formatFullDateTime(hours.checkOut)
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDuration(hours.totalHours)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onEdit(hours, employee)}
                    className="text-[#2D85B2] hover:text-[#105283] p-2 rounded-full hover:bg-[#F8FAFC] transition-colors duration-200"
                    aria-label="Edit time entry"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(hours)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                    aria-label="Delete time entry"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                Tidak ada waktu duty
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}