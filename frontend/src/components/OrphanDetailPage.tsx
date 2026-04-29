import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { orphansApi } from '../api';
import type { Orphan } from '../types';
import { ArrowLeft, Edit3, Calendar, User, MapPin, Heart, BookOpen, FileText, Image } from 'lucide-react';
import OrphanForm from './OrphanForm';
import MedicalHistorySection from './MedicalHistorySection';
import EducationTrackingSection from './EducationTrackingSection';
import FamilyContactSection from './FamilyContactSection';

const STORAGE_BASE = 'http://127.0.0.1:8000/storage';

const OrphanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = React.useState(false);

  const { data: orphan, isLoading } = useQuery({
    queryKey: ['orphan', id],
    queryFn: () => orphansApi.getById(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <div className="p-12 text-gray-500">Memuat data anak asuh...</div>
      </div>
    );
  }

  if (!orphan) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <div className="p-12 text-gray-500">Data anak asuh tidak ditemukan</div>
        <button
          onClick={() => navigate('/orphans')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/orphans')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Daftar Anak Asuh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-6">
            {orphan.photo ? (
              <img
                src={`${STORAGE_BASE}/${orphan.photo}`}
                alt={orphan.name}
                className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                <Image className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Anak Asuh</h1>
              <p className="text-gray-500 mt-1">{orphan.code}</p>
            </div>
          </div>
          <button
            onClick={() => setShowEditForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Edit Data
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <User className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Nama Lengkap</p>
                <p className="font-semibold text-lg">{orphan.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Tanggal Lahir</p>
                <p className="font-semibold">{new Date(orphan.birth_date).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <User className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Jenis Kelamin</p>
                <p className="font-semibold">{orphan.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Heart className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Agama</p>
                <p className="font-semibold">{orphan.religion}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Tanggal Masuk</p>
                <p className="font-semibold">{new Date(orphan.entry_date).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Tingkat Pendidikan</p>
                <p className="font-semibold">{orphan.education_level || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Alamat Asal</p>
                <p className="font-semibold">{orphan.address_origin || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Catatan Kesehatan</p>
                <p className="font-semibold">{orphan.health_notes || '-'}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <Heart className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Status Keluarga</p>
              <p className="font-semibold">{orphan.parent_status || '-'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                orphan.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {orphan.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Kode Anak Asuh: <span className="font-semibold">{orphan.code}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MedicalHistorySection orphanId={orphan.id} />
      </div>

      <div className="mt-6">
        <EducationTrackingSection orphanId={orphan.id} />
      </div>

      <div className="mt-6">
        <FamilyContactSection orphanId={orphan.id} />
      </div>

      {showEditForm && (
        <OrphanForm
          orphan={orphan}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            navigate(`/orphans/${id}`, { replace: true });
          }}
        />
      )}
    </div>
  );
};

export default OrphanDetailPage;
