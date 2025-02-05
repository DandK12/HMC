import { Clock, Calendar } from 'lucide-react';
import type { Employee } from '../../../types';
import { formatDuration } from '../../../utils/time';

interface EmployeeStatsProps {
  employee: Employee;
}

export function EmployeeStats({ employee }: EmployeeStatsProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const monthlyHours = employee.workingHours
    .filter(hours => hours.date.startsWith(currentMonth))
    .reduce((total, hours) => total + hours.totalHours, 0);

  const workDays = employee.workingHours
    .filter(hours => hours.date.startsWith(currentMonth))
    .length;

  const averageHours = workDays > 0 ? monthlyHours / workDays : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-[#01082e] to-[#03071c] rounded-lg p-4 sm:p-6 transform transition-all duration-200 hover:scale-[1.02]">
        <div className="flex items-center">
          <div className="p-3 bg-[#105283]/10 rounded-lg">
            <Clock className="h-6 w-6 text-[#E5F2F9]" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white">Total Jam Duty</p>
            <p className="text-xl sm:text-2xl font-semibold text-[#E5F2F9] mt-1">
              {formatDuration(monthlyHours)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#01082e] to-[#03071c] rounded-lg p-4 sm:p-6 transform transition-all duration-200 hover:scale-[1.02]">
        <div className="flex items-center">
          <div className="p-3 bg-[#2D85B2]/10 rounded-lg">
            <Calendar className="h-6 w-6 text-[#E5F2F9]" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-white">Rata-Rata Jam Harian</p>
            <p className="text-xl sm:text-2xl font-semibold text-[#E5F2F9] mt-1">
              {formatDuration(averageHours)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}