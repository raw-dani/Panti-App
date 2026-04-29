import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { staffApi, authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { Staff, StaffAttendance, StaffPayroll, StaffPerformanceReview, User } from '../types';
import {
  Search, Filter, Plus, Edit3, Trash2, Users, X, Save, Briefcase, Phone, MapPin, Calendar,
  DollarSign, User as UserIcon, Mail, Lock, Shield, Eye, Clock, CheckCircle, Star, TrendingUp,
  AlertCircle, XCircle, Coffee, FileText, Award, MessageSquare, CalendarDays
} from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
};

const StaffPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [detailStaff, setDetailStaff] = useState<Staff | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    minHireDate: '',
    maxHireDate: '',
    minSalary: '',
    maxSalary: '',
  });

  const { data: staffData, isLoading, refetch } = useQuery({
    queryKey: ['staff', filters],
    queryFn: () => staffApi.getAll({
      search: filters.search || undefined,
      position: filters.position || undefined,
      hire_date_from: filters.minHireDate || undefined,
      hire_date_to: filters.maxHireDate || undefined,
      salary_min: filters.minSalary ? Number(filters.minSalary) : undefined,
      salary_max: filters.maxSalary ? Number(filters.maxSalary) : undefined,
    }),
    placeholderData: previousData => previousData,
  });

  const staffList = Array.isArray(staffData) ? staffData : (staffData?.data || []);

  const createMutation = useMutation({
    mutationFn: staffApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setShowForm(false);
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; body: Partial<Staff> }) => staffApi.update(data.id, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setEditingStaff(null);
      setShowForm(false);
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      refetch();
    },
  });

  const handleEdit = (s: Staff) => {
    setEditingStaff(s);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus staff ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetFilters = () => {
    setFilters({ search: '', position: '', minHireDate: '', maxHireDate: '', minSalary: '', maxSalary: '' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  // Check if current user can edit a staff member
  const canEditStaff = (staff: Staff) => {
    if (!currentUser) return false;
    // Admin can edit all staff
    if (currentUser.role === 'admin') return true;
    // Staff can only edit themselves
    if (currentUser.role === 'staff' && staff.user_id === currentUser.id) return true;
    return false;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-600 mt-1">Kelola data staff panti asuhan</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => {
              setEditingStaff(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ml-auto lg:ml-0"
          >
            <Plus className="h-5 w-5" />
            Tambah Staff
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari nama</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Cari nama staff..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
            <input
              type="text"
              value={filters.position}
              onChange={(e) => setFilters({ ...filters, position: e.target.value })}
              placeholder="Filter posisi..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Masuk Dari</label>
            <input
              type="date"
              value={filters.minHireDate}
              onChange={(e) => setFilters({ ...filters, minHireDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sampai</label>
            <input
              type="date"
              value={filters.maxHireDate}
              onChange={(e) => setFilters({ ...filters, maxHireDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gaji Min</label>
            <input
              type="number"
              value={filters.minSalary}
              onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
              placeholder="Min"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gaji Max</label>
            <input
              type="number"
              value={filters.maxSalary}
              onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
              placeholder="Max"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-2 md:col-span-2 lg:col-span-2 items-end">
            <button
              type="button"
              onClick={() => refetch()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              onClick={resetFilters}
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            Memuat data staff...
          </div>
        ) : staffList.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada data staff</h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Tambah yang pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Telepon</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Tanggal Masuk</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffList.map((s: Staff) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{s.user?.name || '-'}</div>
                      <div className="text-xs text-gray-500">{s.user?.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                        {s.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-900">{s.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell text-sm text-gray-500">
                      {new Date(s.hire_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(s.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      <button
                        onClick={() => setDetailStaff(s)}
                        className="text-green-600 hover:text-green-900 p-2 -m-2 rounded-lg hover:bg-green-50 transition-all"
                        title="Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEditStaff(s) && (
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-blue-600 hover:text-blue-900 p-2 -m-2 rounded-lg hover:bg-blue-50 transition-all"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600 hover:text-red-900 p-2 -m-2 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <StaffFormModal
          staff={editingStaff}
          onClose={() => {
            setShowForm(false);
            setEditingStaff(null);
          }}
          onSubmit={(data) => {
            if (editingStaff) {
              // For updates, only send relevant fields
              const updateData: any = {
                position: data.position,
                phone: data.phone,
                address: data.address,
                hire_date: data.hire_date,
                salary: data.salary,
              };

              // Only include password if it's provided (data includes extra fields)
              const formData = data as any;
              if (formData.password && formData.password.trim() !== '') {
                updateData.password = formData.password;
              }

              // Only include role if current user can edit roles
              const canEditRole = currentUser?.role === 'admin' ||
                (currentUser?.role === 'staff' && editingStaff.user_id === currentUser.id);
              if (canEditRole && formData.role) {
                updateData.role = formData.role;
              }

              updateMutation.mutate({ id: editingStaff.id, body: updateData });
            } else {
              createMutation.mutate(data);
            }
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Detail Modal */}
      {detailStaff && (
        <StaffDetailModal
          staff={detailStaff}
          onClose={() => setDetailStaff(null)}
        />
      )}
    </div>
  );
};

/* ==================== STAFF FORM MODAL ==================== */

interface StaffFormModalProps {
  staff: Staff | null;
  onClose: () => void;
  onSubmit: (data: Partial<Staff>) => void;
  isPending: boolean;
}

const StaffFormModal = ({ staff, onClose, onSubmit, isPending }: StaffFormModalProps) => {
  const { user: currentUser } = useAuth();
  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState<Partial<Staff> & { name?: string; email?: string; password?: string; role?: 'admin' | 'staff' }>({
    user_id: staff?.user_id || undefined,
    position: staff?.position || '',
    phone: staff?.phone || '',
    address: staff?.address || '',
    hire_date: formatDateForInput(staff?.hire_date),
    salary: staff?.salary || undefined,
    name: '',
    email: '',
    password: '',
    role: staff?.user?.role || 'staff',
  });

  // Check if current user can edit roles
  const canEditRole = () => {
    if (!currentUser) return false;
    // Admin can always edit roles
    if (currentUser.role === 'admin') return true;
    // Staff can only edit their own role
    if (currentUser.role === 'staff' && staff && staff.user_id === currentUser.id) return true;
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">{staff ? 'Edit' : 'Tambah'} Staff</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!staff && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nama lengkap staff"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email staff"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          {staff && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru (Opsional)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Biarkan kosong jika tidak ingin mengubah"
                  />
                </div>
              </div>
              {canEditRole() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role || staff.user?.role || 'staff'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posisi *</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Posisi staff"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nomor telepon"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alamat lengkap"
                rows={3}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gaji *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Gaji bulanan"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              {isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <Save className="w-4 h-4" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==================== STAFF DETAIL MODAL ==================== */

interface StaffDetailModalProps {
  staff: Staff;
  onClose: () => void;
}

const StaffDetailModal = ({ staff, onClose }: StaffDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'attendance' | 'payroll' | 'performance'>('details');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Detail Staff - {staff.user?.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserIcon className="w-4 h-4 inline mr-2" />
              Detail
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payroll'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Payroll
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Performance
            </button>
          </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'details' && <StaffDetailsTab staff={staff} />}
          {activeTab === 'attendance' && <StaffAttendanceTab staff={staff} />}
          {activeTab === 'payroll' && <StaffPayrollTab staff={staff} />}
          {activeTab === 'performance' && <StaffPerformanceTab staff={staff} />}
        </div>
      </div>
    </div>
  );
};

/* ==================== STAFF DETAILS TAB ==================== */

const StaffDetailsTab = ({ staff }: { staff: Staff }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-semibold mb-4">Informasi Pribadi</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <UserIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Nama:</span>
              <span className="text-sm font-medium">{staff.user?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium">{staff.user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Telepon:</span>
              <span className="text-sm font-medium">{staff.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-sm text-gray-600">Alamat:</span>
              <span className="text-sm font-medium">{staff.address}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-4">Informasi Kerja</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Posisi:</span>
              <span className="text-sm font-medium">{staff.position}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Tanggal Masuk:</span>
              <span className="text-sm font-medium">{new Date(staff.hire_date).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Gaji:</span>
              <span className="text-sm font-medium">{formatCurrency(staff.salary)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== STAFF ATTENDANCE TAB ==================== */

const StaffAttendanceTab = ({ staff }: { staff: Staff }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<StaffAttendance | null>(null);

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['staff-attendances', staff.id],
    queryFn: () => staffApi.getAttendances(staff.id),
  });

  const attendanceList = Array.isArray(attendanceData) ? attendanceData : (attendanceData?.data || []);

  const createMutation = useMutation({
    mutationFn: (data: Partial<StaffAttendance>) => staffApi.createAttendance(staff.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-attendances', staff.id] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; body: Partial<StaffAttendance> }) => staffApi.updateAttendance(data.id, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-attendances', staff.id] });
      setEditingAttendance(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => staffApi.deleteAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-attendances', staff.id] });
    },
  });

  const handleEdit = (attendance: StaffAttendance) => {
    setEditingAttendance(attendance);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus absensi ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'leave': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Hadir';
      case 'absent': return 'Absen';
      case 'late': return 'Terlambat';
      case 'leave': return 'Cuti';
      case 'sick': return 'Sakit';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-semibold">Absensi Staff</h4>
        <button
          onClick={() => {
            setEditingAttendance(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Absensi
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">
          Memuat data absensi...
        </div>
      ) : attendanceList.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Belum ada data absensi</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Tambah yang pertama
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceList.map((attendance: StaffAttendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(attendance.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(attendance.status)}`}>
                      {getStatusLabel(attendance.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {attendance.check_in || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {attendance.check_out || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                    {attendance.notes || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
                    <button
                      onClick={() => handleEdit(attendance)}
                      className="text-blue-600 hover:text-blue-900 p-1 -m-1 rounded hover:bg-blue-50 transition-all"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(attendance.id)}
                      className="text-red-600 hover:text-red-900 p-1 -m-1 rounded hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Form Modal */}
      {showForm && (
        <AttendanceFormModal
          attendance={editingAttendance}
          onClose={() => {
            setShowForm(false);
            setEditingAttendance(null);
          }}
          onSubmit={(data) => {
            if (editingAttendance) {
              updateMutation.mutate({ id: editingAttendance.id, body: data });
            } else {
              createMutation.mutate(data);
            }
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

/* ==================== ATTENDANCE FORM MODAL ==================== */

interface AttendanceFormModalProps {
  attendance: StaffAttendance | null;
  onClose: () => void;
  onSubmit: (data: Partial<StaffAttendance>) => void;
  isPending: boolean;
}

const AttendanceFormModal = ({ attendance, onClose, onSubmit, isPending }: AttendanceFormModalProps) => {
  const [formData, setFormData] = useState<Partial<StaffAttendance>>({
    date: attendance?.date || new Date().toISOString().split('T')[0],
    status: attendance?.status || 'present',
    check_in: attendance?.check_in || '',
    check_out: attendance?.check_out || '',
    notes: attendance?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">{attendance ? 'Edit' : 'Tambah'} Absensi</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as StaffAttendance['status'] })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="present">Hadir</option>
              <option value="absent">Absen</option>
              <option value="late">Terlambat</option>
              <option value="leave">Cuti</option>
              <option value="sick">Sakit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <input
                type="time"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <input
                type="time"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Catatan tambahan"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              {isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <Save className="w-4 h-4" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==================== STAFF PAYROLL TAB ==================== */

const StaffPayrollTab = ({ staff }: { staff: Staff }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<StaffPayroll | null>(null);

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['staff-payrolls', staff.id],
    queryFn: () => staffApi.getPayrolls(staff.id),
  });

  const payrollList = Array.isArray(payrollData) ? payrollData : (payrollData?.data || []);

  const createMutation = useMutation({
    mutationFn: (data: Partial<StaffPayroll>) => staffApi.createPayroll(staff.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-payrolls', staff.id] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; body: Partial<StaffPayroll> }) => staffApi.updatePayroll(data.id, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-payrolls', staff.id] });
      setEditingPayroll(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => staffApi.deletePayroll(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-payrolls', staff.id] });
    },
  });

  const handleEdit = (payroll: StaffPayroll) => {
    setEditingPayroll(payroll);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus data payroll ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'approved': return 'Disetujui';
      case 'paid': return 'Dibayar';
      default: return status;
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1] || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-semibold">Payroll Staff</h4>
        <button
          onClick={() => {
            setEditingPayroll(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Payroll
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">
          Memuat data payroll...
        </div>
      ) : payrollList.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <DollarSign className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Belum ada data payroll</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Tambah yang pertama
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji Pokok</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potongan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payrollList.map((payroll: StaffPayroll) => (
                <tr key={payroll.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {getMonthName(payroll.month)} {payroll.year}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(payroll.base_salary)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(payroll.bonus)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(payroll.deductions)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(payroll.total)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(payroll.status)}`}>
                      {getStatusLabel(payroll.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
                    <button
                      onClick={() => handleEdit(payroll)}
                      className="text-blue-600 hover:text-blue-900 p-1 -m-1 rounded hover:bg-blue-50 transition-all"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(payroll.id)}
                      className="text-red-600 hover:text-red-900 p-1 -m-1 rounded hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payroll Form Modal */}
      {showForm && (
        <PayrollFormModal
          payroll={editingPayroll}
          staffSalary={staff.salary}
          onClose={() => {
            setShowForm(false);
            setEditingPayroll(null);
          }}
          onSubmit={(data) => {
            if (editingPayroll) {
              updateMutation.mutate({ id: editingPayroll.id, body: data });
            } else {
              createMutation.mutate(data);
            }
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

/* ==================== PAYROLL FORM MODAL ==================== */

interface PayrollFormModalProps {
  payroll: StaffPayroll | null;
  staffSalary: number;
  onClose: () => void;
  onSubmit: (data: Partial<StaffPayroll>) => void;
  isPending: boolean;
}

const PayrollFormModal = ({ payroll, staffSalary, onClose, onSubmit, isPending }: PayrollFormModalProps) => {
  const [formData, setFormData] = useState<Partial<StaffPayroll>>({
    month: payroll?.month || new Date().getMonth() + 1,
    year: payroll?.year || new Date().getFullYear(),
    base_salary: payroll?.base_salary || staffSalary,
    bonus: payroll?.bonus || 0,
    deductions: payroll?.deductions || 0,
    total: payroll?.total || staffSalary,
    status: payroll?.status || 'draft',
    notes: payroll?.notes || '',
  });

  // Calculate total
  const calculateTotal = (baseSalary: number, bonus: number, deductions: number) => {
    return (baseSalary || 0) + (bonus || 0) - (deductions || 0);
  };

  // Update form data with calculated total
  const updateFormData = (updates: Partial<StaffPayroll>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      // Always recalculate total when financial fields change
      if ('base_salary' in updates || 'bonus' in updates || 'deductions' in updates) {
        newData.total = calculateTotal(
          newData.base_salary || 0,
          newData.bonus || 0,
          newData.deductions || 0
        );
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">{payroll ? 'Edit' : 'Tambah'} Payroll</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bulan *</label>
              <select
                value={formData.month}
                onChange={(e) => updateFormData({ month: Number(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun *</label>
              <select
                value={formData.year}
                onChange={(e) => updateFormData({ year: Number(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gaji Pokok *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={formData.base_salary}
                onChange={(e) => updateFormData({ base_salary: Number(e.target.value) })}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.bonus}
                  onChange={(e) => updateFormData({ bonus: Number(e.target.value) })}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Potongan</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.deductions}
                  onChange={(e) => updateFormData({ deductions: Number(e.target.value) })}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <div className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 flex items-center">
                {formatCurrency(formData.total || 0)}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Otomatis dihitung: Gaji Pokok + Bonus - Potongan</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => updateFormData({ status: e.target.value as StaffPayroll['status'] })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="draft">Draft</option>
              <option value="approved">Disetujui</option>
              <option value="paid">Dibayar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
              value={formData.notes}
              onChange={(e) => updateFormData({ notes: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Catatan tambahan"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              {isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <Save className="w-4 h-4" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StaffPerformanceTab = ({ staff }: { staff: Staff }) => {
  return (
    <div className="p-8 text-center text-gray-500">
      <Star className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium mb-2">Performance Review</h3>
      <p>Fitur performance review akan diimplementasikan selanjutnya</p>
    </div>
  );
};

export default StaffPage;