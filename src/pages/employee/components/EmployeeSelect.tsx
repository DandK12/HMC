import { UserCircle } from 'lucide-react';
import type { Employee } from '../../../types';

interface EmployeeSelectProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelect: (employee: Employee | null) => void;
  onClearError: () => void;
}

export function EmployeeSelect({
  employees,
  selectedEmployee,
  onSelect,
  onClearError,
}: EmployeeSelectProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-white mb-2">
        Nama Anggota HMC
      </label>
      <div className="relative">
        <select
          className="bg-[#03071c] text-white block w-full pl-10 pr-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#03071c] focus:border-[#03071c] sm:text-sm rounded-lg shadow-sm transition-all duration-200"
          value={selectedEmployee?.id || ''}
          onChange={(e) => {
            const employee = employees.find((emp) => emp.id === e.target.value);
            onSelect(employee || null);
            onClearError();
          }}
        >
          <option className="text-white" value="">Pilih Nama Kamu</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id} className="text-white" >
              {employee.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <UserCircle className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}