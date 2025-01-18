import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
import type { Employee, WorkingHours } from '../../types';

interface TimeActivityProps {
  employees: Employee[];
}

interface TimeEntry {
  type: 'check-in' | 'check-out';
  employeeName: string;
  employeePosition: string;
  timestamp: string;
}

export function TimeActivity({ employees }: TimeActivityProps) {
  // Get all time entries and sort by most recent
  const timeEntries: TimeEntry[] = employees.flatMap(employee => {
    return employee.workingHours.flatMap(hours => {
      const entries: TimeEntry[] = [
        {
          type: 'check-in',
          employeeName: employee.name,
          employeePosition: employee.position,
          timestamp: hours.checkIn,
        }
      ];

      if (hours.checkOut) {
        entries.push({
          type: 'check-out',
          employeeName: employee.name,
          employeePosition: employee.position,
          timestamp: hours.checkOut,
        });
      }

      return entries;
    });
  }).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5); // Get only the 5 most recent entries

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-[#2F8FC9]" />
        <h2 className="text-lg font-semibold text-[#105283]">Recent Time Activity</h2>
      </div>
      
      <div className="space-y-4">
        {timeEntries.map((entry, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${
              entry.type === 'check-in' ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <div className="flex-1">
              <p className="text-sm text-[#105283]">
                <span className="font-medium">{entry.employeeName}</span>
                {' '}{entry.type === 'check-in' ? 'started' : 'ended'} duty
              </p>
              <p className="text-xs text-[#706B68] mt-1">
                {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              entry.type === 'check-in' 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {entry.type === 'check-in' ? 'Check In' : 'Check Out'}
            </span>
          </div>
        ))}
        {timeEntries.length === 0 && (
          <p className="text-center text-gray-500 text-sm">No recent activity</p>
        )}
      </div>
    </div>
  );
}