import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { orphansApi, dashboardApi } from '../api';
import OrphansList from './OrphansList';
import { Users, Heart, Gift, Calendar, FileText, LogOut, Cake, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const { data: upcomingBirthdaysData } = useQuery({
    queryKey: ['upcomingBirthdays'],
    queryFn: () => orphansApi.getUpcomingBirthdays(30),
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardApi.getStats(),
  });

  const upcomingBirthdays = Array.isArray(upcomingBirthdaysData) ? upcomingBirthdaysData : (upcomingBirthdaysData?.data || []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const stats = [
    {
      label: 'Total Anak Asuh',
      value: statsLoading ? '...' : (dashboardStats?.total_orphans?.toString() || '0'),
      icon: Heart,
      color: 'bg-gradient-to-br from-pink-500 to-rose-500'
    },
    {
      label: 'Staff Aktif',
      value: statsLoading ? '...' : (dashboardStats?.total_active_staff?.toString() || '0'),
      icon: Users,
      color: 'bg-gradient-to-br from-blue-600 to-blue-700'
    },
    {
      label: 'Donasi Bulan Ini',
      value: statsLoading ? '...' : formatCurrency(dashboardStats?.donations_this_month || 0),
      icon: Gift,
      color: 'bg-gradient-to-br from-emerald-500 to-green-600'
    },
    {
      label: 'Event Terjadwal',
      value: statsLoading ? '...' : (dashboardStats?.upcoming_events?.toString() || '0'),
      icon: Calendar,
      color: 'bg-gradient-to-br from-amber-500 to-orange-600'
    },
  ];

  return (
    <div className="pb-8">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-blue-600 bg-clip-text text-transparent">
                Dashboard Panti Asuhan
              </h1>
              <p className="text-gray-500 mt-1">Selamat datang kembali, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {user?.role}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white rounded-lg hover:bg-[#0b3a65] transition-all duration-200 shadow-sm hover:shadow"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                  {statsLoading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <stat.icon className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {statsLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        ...
                      </>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              Anak Asuh
            </h3>
            <div className="flex flex-col gap-3">
              <a 
                href="/orphans" 
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium text-center hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow"
              >
                Lihat Semua
              </a>
              <a 
                href="/orphans/new" 
                className="w-full py-3 border-2 border-dashed border-rose-200 text-rose-600 rounded-lg font-medium text-center hover:bg-rose-50 transition-all duration-200"
              >
                Tambah Baru +
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-500" />
              Donasi
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="/donations"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-medium text-center hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-sm hover:shadow"
              >
                Lihat Donasi
              </a>
              <a
                href="/donations"
                className="w-full py-3 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-lg font-medium text-center hover:bg-emerald-50 transition-all duration-200"
              >
                Tambah Donasi +
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0F4C81]" />
              Laporan
            </h3>
            <div className="flex flex-col gap-3">
              <button 
                className="w-full py-3 bg-gradient-to-r from-[#0F4C81] to-blue-600 text-white rounded-lg font-medium text-center hover:from-[#0b3a65] hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow cursor-not-allowed opacity-50"
                disabled
              >
                Laporan (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Birthdays */}
        {upcomingBirthdays.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Cake className="w-6 h-6 text-purple-500" />
                Ulang Tahun Mendatang
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBirthdays.map((orphan: any) => (
                  <div key={orphan.id} className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Cake className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{orphan.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(orphan.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Orphans List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              Anak Asuh Terbaru
            </h3>
          </div>
          <div className="p-6">
            <OrphansList />


          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;