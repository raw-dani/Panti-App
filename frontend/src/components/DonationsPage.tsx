import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { donationsApi } from '../api';
import type { Donation } from '../types';
import DonationForm from './DonationForm';
import { Search, Filter, Plus, Edit3, Trash2, DollarSign, Calendar, Receipt } from 'lucide-react';

const DonationsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: donationsData, isLoading, refetch } = useQuery({
    queryKey: ['donations', filters, page],
    queryFn: () => donationsApi.getAll({
      search: filters.search || undefined,
      type: filters.type || undefined,
      amount_min: filters.minAmount ? Number(filters.minAmount) : undefined,
      amount_max: filters.maxAmount ? Number(filters.maxAmount) : undefined,
      date_from: filters.startDate || undefined,
      date_to: filters.endDate || undefined,
    }),
    placeholderData: previousData => previousData,
  });

  const donations = Array.isArray(donationsData) ? donationsData : (donationsData?.data || []);
  const totalPages = 1;

  const createMutation = useMutation({
    mutationFn: donationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      setShowForm(false);
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Donation>) => donationsApi.update(editingDonation!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      setEditingDonation(null);
      setShowForm(false);
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => donationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      refetch();
    },
  });

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus data donasi ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetFilters = () => {
    setFilters({ search: '', type: '', minAmount: '', maxAmount: '', startDate: '', endDate: '' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Donasi</h1>
          <p className="text-gray-600 mt-1">Kelola data donasi panti asuhan</p>
        </div>
        <button
          onClick={() => {
            setEditingDonation(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ml-auto lg:ml-0"
        >
          <Plus className="h-5 w-5" />
          Tambah Donasi
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari donatur</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Cari nama/email donatur..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Semua</option>
                <option value="cash">Uang Tunai</option>
                <option value="goods">Barang</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min. Jumlah</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max. Jumlah</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                  placeholder="∞"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
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
            Memuat data donasi...
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <DollarSign className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada data donasi</h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Tambah yang pertama
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Resi</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donatur</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Telepon</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Jumlah</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donations.map((donation: Donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{donation.receipt_no}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{donation.donor_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-500">
                        {donation.donor_email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-500">
                        {donation.donor_phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          donation.type === 'cash'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {donation.type === 'cash' ? 'Uang Tunai' : 'Barang'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-green-600">
                        {formatCurrency(donation.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell text-sm text-gray-500">
                        {new Date(donation.date_received).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                        <button
                          onClick={() => handleEdit(donation)}
                          className="text-blue-600 hover:text-blue-900 p-2 -m-2 rounded-lg hover:bg-blue-50 transition-all"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(donation.id)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4">
                <nav className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Menampilkan <span className="font-medium">{donations.length}</span> data
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Sebelumnya
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                      Hal {page} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {showForm && (
        <DonationForm
          donation={editingDonation}
          onClose={() => {
            setShowForm(false);
            setEditingDonation(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['donations'] });
            refetch();
            setShowForm(false);
            setEditingDonation(null);
          }}
        />
      )}
    </div>
  );
};

export default DonationsPage;
