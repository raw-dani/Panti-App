import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { donorsApi } from '../../api';
import type { Donor } from '../../types';
import DonorForm from './DonorForm';
import { Search, Filter, Plus, Edit3, Trash2, User, Mail, Phone, MapPin, Hash, CheckCircle, XCircle } from 'lucide-react';

const DonorsPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    is_active: true as boolean | undefined,
  });

  const { data: donorsData, isLoading, refetch } = useQuery({
    queryKey: ['donors', filters],
    queryFn: () => donorsApi.getAll(filters),
    placeholderData: previousData => previousData,
  });

  const donors = Array.isArray(donorsData) ? donorsData : (donorsData?.data || []);

  const createMutation = useMutation({
    mutationFn: donorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      setShowForm(false);
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Donor> }) => donorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      setEditingDonor(null);
      setShowForm(false);
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: donorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      refetch();
    },
  });

  const handleEdit = (donor: Donor) => {
    setEditingDonor(donor);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus donor ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetFilters = () => {
    setFilters({ search: '', is_active: true });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Donor</h1>
          <p className="text-gray-600 mt-1">Kelola database donor panti asuhan</p>
        </div>
        <button
          onClick={() => {
            setEditingDonor(null);
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ml-auto lg:ml-0"
        >
          <Plus className="h-5 w-5" />
          Tambah Donor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari donor</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Nama, email, atau telepon..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="active"
                checked={filters.is_active === true}
                onChange={(e) => setFilters({ ...filters, is_active: true })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Aktif</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="inactive"
                checked={filters.is_active === false}
                onChange={(e) => setFilters({ ...filters, is_active: false })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Nonaktif</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                id="all"
                checked={filters.is_active === undefined}
                onChange={(e) => setFilters({ ...filters, is_active: undefined })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Semua</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2 lg:pt-0">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              onClick={resetFilters}
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
            Memuat data donor...
          </div>
        ) : donors.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <User className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada data donor</h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-all"
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Telepon</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden 2xl:table-cell">Kota</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Tax ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Total Donasi</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donors.map((donor: Donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{donor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-500">
                      {donor.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell text-sm text-gray-500">
                      {donor.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden 2xl:table-cell text-sm text-gray-500">
                      {donor.city || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3 text-gray-400" />
                        <span className="font-mono text-sm text-gray-900">{donor.tax_id || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        donor.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {donor.is_active ? <CheckCircle className="h-3 w-3 inline mr-1" /> : <XCircle className="h-3 w-3 inline mr-1" />}
                        {donor.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right hidden lg:table-cell">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{donor.total_donations || 0} donasi</div>
                        <div className="text-xs text-green-600">{formatCurrency(donor.total_amount || 0)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                      <button
                        onClick={() => handleEdit(donor)}
                        className="text-blue-600 hover:text-blue-900 p-2 -m-2 rounded-lg hover:bg-blue-50 transition-all"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(donor.id)}
                        className="text-red-600 hover:text-red-900 p-2 -m-2 rounded-lg hover:bg-red-50 transition-all"
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
      </div>

      {showForm && (
        <DonorForm
          donor={editingDonor}
          onClose={() => {
            setShowForm(false);
            setEditingDonor(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['donors'] });
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default DonorsPage;

