import { useState } from 'react';
import { Clock, Search } from 'lucide-react';
import type { Employee } from '../../types';
import { formatDuration } from '../../utils/time';
import { SearchBar } from '../ui/SearchBar';

interface MonthlyHoursTrackerProps {
  employees: Employee[];
  selectedMonth: string;
}

export function MonthlyHoursTracker({ employees, selectedMonth }: MonthlyHoursTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const monthlyHours = employees
    .map(employee => {
      const totalHours = employee.workingHours
        .filter(hours => hours.date.startsWith(selectedMonth))
        .reduce((total, hours) => total + hours.totalHours, 0);

      return {
        id: employee.id,
        name: employee.name,
        position: employee.position,
        totalHours,
      };
    })
    .filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.totalHours - a.totalHours);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#105283]/10 rounded-lg">
            <Clock className="h-5 w-5 text-[#105283]" />
          </div>
          <h2 className="text-lg font-semibold text-[#105283]">Monthly Hours Overview</h2>
        </div>

        <div className="w-full sm:w-64">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search employees..."
          />
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyHours.map((employee) => (
                <tr 
                  key={employee.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(employee.totalHours)}
                  </td>
                </tr>
              ))}
              {monthlyHours.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}