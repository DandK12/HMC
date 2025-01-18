import { Calendar, Clock } from 'lucide-react';
import type { WorkingHours } from '../../../types';
import { formatDuration } from '../../../utils/time';
import { formatDateTime, formatDayMonthYear } from '../../../utils/dateTime';

interface ActivityLogProps {
  workingHours: WorkingHours[];
}

export function ActivityLog({ workingHours }: ActivityLogProps) {
  return (
    <div className="bg-gradient-to-br from-[#01082e] to-[#03071c] rounded-lg p-4 sm:p-6 transform transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-white/10 rounded-lg">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-white ml-3">Aktivitas Terakhir</h2>
      </div>
      
      <div className="space-y-2 [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 max-h-28 overflow-y-auto">
        {workingHours.slice(-5).map((hours, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#03188c] to-[#03071c] rounded-lg p-4 sm:p-6 transform transition-all duration-200 hover:border-white border-dashed hover:border-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">
                  {formatDayMonthYear(hours.date)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white">
                <Clock className="h-4 w-4 text-white" />
                <span>
                  {formatDateTime(hours.checkIn)} -{' '}
                  {hours.checkOut ? formatDateTime(hours.checkOut) : (
                    <span className="text-green-600 font-medium">Active</span>
                  )}
                </span>
              </div>
            </div>
            {hours.checkOut && (
              <div className="mt-2 text-sm font-medium text-white">
                Total Jam: {formatDuration(hours.totalHours)}
              </div>
            )}
          </div>
        ))}
        {workingHours.length === 0 && (
          <div className="text-center py-6 text-white">
            Tidak ada aktivitas
          </div>
        )}
      </div>
    </div>
  );
}