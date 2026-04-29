import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { orphansApi } from '../api';
import type { Orphan } from '../types';
import OrphanForm from './OrphanForm';
import { Search, Filter, Plus, Edit3, Trash2, Heart, Eye, Cake } from 'lucide-react';

const OrphansPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingOrphan, setEditingOrphan] = useState<Orphan | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    gender: '',
    status: '',
    minEntryDate: '',
    maxEntryDate: '',
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: orphansData, isLoading, refetch } = useQuery({
    queryKey: ['orphans', filters, page],
    queryFn: () => orphansApi.getAll({
      search: filters.search,
      gender: filters.gender || undefined,
      status: filters.status || undefined,
      entry_date_from: filters.minEntryDate ? `${filters.minEntryDate}-01` : undefined,
      entry_date_to: filters.maxEntryDate ? `${filters.maxEntryDate}-01` : undefined,
    }),

    placeholderData: previousData => previousData,
  });

  const orphans = Array.isArray(orphansData) ? orphansData : (orphansData?.data || []);
  const totalPages = 1;


  const createMutation = useMutation({
    mutationFn: orphansApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orphans'] });
      setShowForm(false);
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => orphansApi.update(editingOrphan!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orphans'] });
      setEditingOrphan(null);
      setShowForm(false);
      refetch();
    },
  });


  const deleteMutation = useMutation({
    mutationFn: (id: number) => orphansApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orphans'] });
      refetch();
    },
  });

  const handleEdit = (orphan: Orphan) => {
    setEditingOrphan(orphan);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus anak asuh ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetFilters = () => {
    setFilters({ search: '', gender: '', status: '', minEntryDate: '', maxEntryDate: '' });
  };

  const isUpcomingBirthday = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const currentYear = today.getFullYear();
    let birthdayThisYear = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (birthdayThisYear < today) {
      birthdayThisYear = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const diffTime = birthdayThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Anak Asuh</h1>
          <p className="text-gray-600 mt-1">Kelola data anak asuh panti asuhan</p>
        </div>
        <button
          onClick={() => {
            setEditingOrphan(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ml-auto lg:ml-0"
        >
          <Plus className="h-5 w-5" />
          Tambah Anak Asuh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari nama/kode</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Cari nama anak asuh atau kode..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 min-w-[300px]">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Semua</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Semua</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Masuk Dari</label>
              <input
                type="month"
                value={filters.minEntryDate}
                onChange={(e) => setFilters({ ...filters, minEntryDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sampai</label>
              <input
                type="month"
                value={filters.maxEntryDate}
                onChange={(e) => setFilters({ ...filters, maxEntryDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2">
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
            Memuat data anak asuh...
          </div>
        ) : orphans.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada data anak asuh</h3>
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Gender</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Agama</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Masuk</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orphans.map((orphan: Orphan) => (
                    <tr key={orphan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{orphan.code}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">{orphan.name}</div>
                          {isUpcomingBirthday(orphan.birth_date) && (
                            <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                              <Cake className="w-3 h-3" />
                              Ultah
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          orphan.gender === 'male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {orphan.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-900">{orphan.religion}</td>
                      <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell text-sm text-gray-500">{new Date(orphan.entry_date).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          orphan.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {orphan.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                        <button
                          onClick={() => navigate(`/orphans/${orphan.id}`)}
                          className="text-gray-600 hover:text-gray-900 p-2 -m-2 rounded-lg hover:bg-gray-50 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(orphan)}
                          className="text-blue-600 hover:text-blue-900 p-2 -m-2 rounded-lg hover:bg-blue-50 transition-all"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(orphan.id)}
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
                    Menampilkan <span className="font-medium">{orphans.length}</span> data

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
        <OrphanForm
          orphan={editingOrphan}
          onClose={() => {
            setShowForm(false);
            setEditingOrphan(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['orphans'] });
            refetch();
            setShowForm(false);
            setEditingOrphan(null);
          }}
        />
      )}
    </div>
  );
};

export default OrphansPage;

