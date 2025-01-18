import { useState, useEffect } from 'react';
import { UserPlus, Download, Search } from 'lucide-react';
import { employeeService } from '../../../services/employeeService';
import { exportToCSV } from '../../../utils/csv';
import { sortEmployees } from '../../../utils/sorting';
import type { Employee } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { ConfirmationDialog } from '../../../components/ui/ConfirmationDialog';

const POSITIONS = [
  'Kepala',
  'Dokter',
  'Perawat',
  'Training',
  'Resigned',
] as const;

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    employee: Employee | null;
  }>({ show: false, employee: null });
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: POSITIONS[0],
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower)
    );
  });

  // Apply custom sorting
  const sortedEmployees = sortEmployees(filteredEmployees);

  const handleAddEmployee = async () => {
    try {
      if (!newEmployee.name.trim()) {
        setError('Employee name is required');
        return;
      }

      const employee = await employeeService.create({
        name: newEmployee.name,
        position: newEmployee.position,
        joinDate: new Date().toISOString(),
      });
      
      setEmployees([...employees, employee]);
      setShowAddModal(false);
      setNewEmployee({ name: '', position: POSITIONS[0] });
      setError(null);
    } catch (err) {
      setError('Gagal menambahkan anggota');
      console.error(err);
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingEmployee) return;

    try {
      const updated = await employeeService.update(editingEmployee.id, editingEmployee);
      setEmployees(employees.map(emp => emp.id === updated.id ? updated : emp));
      setShowEditModal(false);
      setEditingEmployee(null);
      setError(null);
    } catch (err) {
      setError('Gagal memperbarui anggota');
      console.error(err);
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setDeleteConfirmation({ show: true, employee });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.employee) return;

    try {
      await employeeService.delete(deleteConfirmation.employee.id);
      setEmployees(employees.filter(emp => emp.id !== deleteConfirmation.employee?.id));
      setDeleteConfirmation({ show: false, employee: null });
      setError(null);
    } catch (err) {
      setError('Gagal menghapus anggota');
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(sortedEmployees, 'employees');
    } catch (err) {
      setError('Gagal export data anggota');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#2D85B2] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-[#105283]">Anggota</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D85B2] focus:border-transparent sm:text-sm"
                placeholder="Cari nama atau posisi..."
              />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-[#105283] hover:bg-[#0A3B5C] text-white inline-flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Tambah Anggota
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="secondary"
                className="inline-flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Masuk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEmployees.map((employee) => (
                <tr 
                  key={employee.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    employee.position === 'Resigned' ? 'bg-gray-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.position === 'Resigned' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-[#105283]/10 text-[#105283]'
                    }`}>
                      {employee.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditClick(employee)}
                        className="text-[#2D85B2] hover:text-[#105283] p-2 rounded-full hover:bg-[#F8FAFC] transition-colors duration-200"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(employee)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambahkan Anggota Baru"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Batal
            </Button>
            <Button onClick={handleAddEmployee}>
              Tambah Anggota
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2D85B2] focus:ring-[#2D85B2] sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jabatan</label>
            <select
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value as typeof POSITIONS[number] })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2D85B2] focus:ring-[#2D85B2] sm:text-sm"
            >
              {POSITIONS.filter(pos => pos !== 'Resigned').map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingEmployee(null);
        }}
        title="Edit Anggota"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setEditingEmployee(null);
              }}
            >
              Batal
            </Button>
            <Button onClick={handleEditSave}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        {editingEmployee && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                value={editingEmployee.name}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2D85B2] focus:ring-[#2D85B2] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jabatan</label>
              <select
                value={editingEmployee.position}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value as typeof POSITIONS[number] })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2D85B2] focus:ring-[#2D85B2] sm:text-sm"
              >
                {POSITIONS.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.show}
        onClose={() => setDeleteConfirmation({ show: false, employee: null })}
        onConfirm={handleDeleteConfirm}
        title="Hapus Anggota"
        message={`Apakah kamu yakin ingin menghapus ${deleteConfirmation.employee?.name}?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
      />
    </div>
  );
}