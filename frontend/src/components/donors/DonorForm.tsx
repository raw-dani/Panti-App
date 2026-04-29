import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { donorsApi } from '../../api';
import type { Donor } from '../../types';
import { X, Save, Mail, Phone, MapPin, Home, Hash, ClipboardList, CheckSquare, Square, User, StickyNote } from 'lucide-react';

interface DonorFormProps {
  donor?: Donor | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DonorForm = ({ donor, onClose, onSuccess }: DonorFormProps) => {
  const [formData, setFormData] = useState({
    donor_id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    tax_id: '',
    preferred_contact_method: 'email' as 'email' | 'phone' | 'mail',
    notes: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (donor) {
      setFormData({
        donor_id: '',
        name: donor.name,
        email: donor.email || '',
        phone: donor.phone || '',
        address: donor.address || '',
        city: donor.city || '',
        postal_code: donor.postal_code || '',
        tax_id: donor.tax_id || '',
        preferred_contact_method: donor.preferred_contact_method,
        notes: donor.notes || '',
        is_active: donor.is_active,
      });
    } else {
      setFormData({
        donor_id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        tax_id: '',
        preferred_contact_method: 'email',
        notes: '',
        is_active: true,
      });
    }
  }, [donor]);

  const createMutation = useMutation({
    mutationFn: donorsApi.create,
    onSuccess: onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Donor>) => donorsApi.update(donor!.id, data),
    onSuccess: onSuccess,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nama donor wajib diisi';
    if (formData.tax_id && !/^[A-Z0-9]{15}$/.test(formData.tax_id)) newErrors.tax_id = 'Format Tax ID tidak valid';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const donorData: Partial<Donor> = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      postal_code: formData.postal_code || undefined,
      tax_id: formData.tax_id || undefined,
      preferred_contact_method: formData.preferred_contact_method,
      notes: formData.notes || undefined,
      is_active: formData.is_active,
    };

    if (donor) {
      await updateMutation.mutateAsync(donorData);
    } else {
      await createMutation.mutateAsync(donorData);
    }
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {donor ? 'Edit' : 'Tambah'} Donor
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Donor *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="hidden" name="donor_id" value={formData.donor_id || ''} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nama lengkap donor"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="email@donor.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="0812 3456 7890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metode Kontak Utama</label>
              <select
                value={formData.preferred_contact_method}
                onChange={(e) => setFormData({ ...formData, preferred_contact_method: e.target.value as 'email' | 'phone' | 'mail' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="email">Email</option>
                <option value="phone">Telepon</option>
                <option value="mail">Surat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kota</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Jakarta"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pos</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="12120"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / NPWP</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.tax_id}
                  onChange={(e) => setFormData({ ...formData, tax_id: e.target.value.toUpperCase() })}
                  className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.tax_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="NPWPxxxxxxxxxxx"
                  maxLength={15}
                />
              </div>
              {errors.tax_id && <p className="text-red-500 text-sm mt-1">{errors.tax_id}</p>}
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Aktif</span>
                {formData.is_active ? <CheckSquare className="h-4 w-4 text-green-500" /> : <Square className="h-4 w-4 text-gray-400" />}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-10 pt-9 pb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-vertical"
                rows={3}
                placeholder="Catatan tambahan tentang donor..."
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <Save className="h-4 w-4" />
              {isLoading ? 'Menyimpan...' : donor ? 'Update' : 'Tambah Donor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorForm;

