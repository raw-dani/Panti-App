import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { orphansApi } from '../api';
import type { Orphan } from '../types';
import { X, Upload, Save } from 'lucide-react';

const STORAGE_BASE = 'http://127.0.0.1:8000/storage';

interface OrphanFormProps {
  orphan?: Orphan | null;
  onClose: () => void;
  onSuccess: () => void;
}

const OrphanForm = ({ orphan, onClose, onSuccess }: OrphanFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '' as 'male' | 'female',
    birth_date: '',
    religion: '',
    parent_status: '',
    entry_date: '',
    status: 'active' as 'active' | 'inactive',
    address_origin: '',
    health_notes: '',
    education_level: '',
    photo: null as File | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (orphan) {
      setFormData({
        name: orphan.name,
        gender: orphan.gender,
        birth_date: new Date(orphan.birth_date).toISOString().split('T')[0],
        religion: orphan.religion,
        entry_date: new Date(orphan.entry_date).toISOString().split('T')[0],
        status: orphan.status,
        address_origin: orphan.address_origin || '',
        health_notes: orphan.health_notes || '',
        parent_status: orphan.parent_status || '',
        education_level: orphan.education_level || '',
        photo: null,
      });
      setPhotoPreview(orphan.photo ? `${STORAGE_BASE}/${orphan.photo}` : null);
    } else {
      setFormData({
        name: '',
        gender: '' as 'male' | 'female',
        birth_date: '',
        religion: '',
        parent_status: '',
        entry_date: new Date().toISOString().split('T')[0],
        status: 'active',
        address_origin: '',
        health_notes: '',
        education_level: '',
        photo: null,
      });
      setPhotoPreview(null);
    }
  }, [orphan]);

  const createMutation = useMutation({
    mutationFn: orphansApi.create,
    onSuccess: onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => orphansApi.update(orphan!.id, data),
    onSuccess: onSuccess,
  });




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.gender) newErrors.gender = 'Pilih gender';
    if (!formData.birth_date) newErrors.birth_date = 'Tanggal lahir wajib';
    if (!formData.religion.trim()) newErrors.religion = 'Agama wajib';
    if (!formData.entry_date) newErrors.entry_date = 'Tanggal masuk wajib';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('birth_date', formData.birth_date);
      formDataToSend.append('religion', formData.religion);
      formDataToSend.append('parent_status', formData.parent_status);
      formDataToSend.append('entry_date', formData.entry_date);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('address_origin', formData.address_origin || '');
      formDataToSend.append('health_notes', formData.health_notes || '');
      formDataToSend.append('education_level', formData.education_level || '');
      
      if (formData.photo && formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
      }

    if (orphan) {
      await updateMutation.mutateAsync(formDataToSend);
    } else {
      await createMutation.mutateAsync(formDataToSend);
    }
    onSuccess();
  };


  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {orphan ? 'Edit' : 'Tambah'} Anak Asuh
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nama anak asuh"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih Gender</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir *</label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.birth_date ? 'border-red-500' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Masuk Panti *</label>
              <input
                type="date"
                value={formData.entry_date}
                onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.entry_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.entry_date && <p className="text-red-500 text-sm mt-1">{errors.entry_date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agama *</label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.religion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Agama anak"
              />
              {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Keluarga</label>
              <input
                type="text"
                value={formData.parent_status}
                onChange={(e) => setFormData({ ...formData, parent_status: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Yatim piatu / yatim / dhuafa"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Pendidikan</label>
              <input
                type="text"
                value={formData.education_level}
                onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="TK / SD / SMP / dll"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
            <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="flex flex-col items-center cursor-pointer p-4 hover:bg-gray-50 rounded-lg transition-all flex-1">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 font-medium">Pilih foto (JPG/PNG, max 2MB)</span>
              </label>
              {photoPreview && (
                <div className="flex flex-col items-center">
                  <img src={photoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                  <span className="text-xs text-gray-500 mt-1 truncate max-w-24">{photoPreview.startsWith('blob') ? 'Baru' : 'Saat ini'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Asal</label>
              <textarea
                value={formData.address_origin}
                onChange={(e) => setFormData({ ...formData, address_origin: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-vertical"
                placeholder="Alamat lengkap asal anak"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Kesehatan</label>
              <textarea
                value={formData.health_notes}
                onChange={(e) => setFormData({ ...formData, health_notes: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-vertical"
                placeholder="Riwayat kesehatan, alergi, dll"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Menyimpan...' : orphan ? 'Update' : 'Tambah Anak'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrphanForm;

