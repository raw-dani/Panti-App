import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { orphansApi } from '../api';
import type { OrphanFamilyContact } from '../types';
import { Plus, Edit2, Trash2, Users, X, Save, Phone, Mail, MapPin, Star } from 'lucide-react';

interface Props {
  orphanId: number;
}

const FamilyContactSection = ({ orphanId }: Props) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<OrphanFamilyContact | null>(null);
  const [formData, setFormData] = useState<Partial<OrphanFamilyContact>>({
    name: '',
    relationship: '',
    phone: '',
    address: '',
    email: '',
    is_primary_contact: false,
    notes: '',
  });

  const { data: contactsData, isLoading } = useQuery({
    queryKey: ['familyContacts', orphanId],
    queryFn: () => orphansApi.getFamilyContacts(orphanId),
  });

  const contacts = Array.isArray(contactsData) ? contactsData : (contactsData?.data || []);

  const createMutation = useMutation({
    mutationFn: (data: Partial<OrphanFamilyContact>) => orphansApi.createFamilyContact(orphanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyContacts', orphanId] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<OrphanFamilyContact>) =>
      orphansApi.updateFamilyContact(editingContact!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyContacts', orphanId] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => orphansApi.deleteFamilyContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyContacts', orphanId] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingContact(null);
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      address: '',
      email: '',
      is_primary_contact: false,
      notes: '',
    });
  };

  const handleEdit = (contact: OrphanFamilyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone || '',
      address: contact.address || '',
      email: contact.email || '',
      is_primary_contact: contact.is_primary_contact,
      notes: contact.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.relationship) return;
    if (editingContact) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus kontak keluarga ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Kontak Keluarga</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Memuat kontak keluarga...</div>
      ) : contacts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Belum ada data kontak keluarga</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {contacts.map((contact: OrphanFamilyContact) => (
            <div key={contact.id} className="p-6 hover:bg-gray-50 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    {contact.is_primary_contact && (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                        <Star className="w-3 h-3" />
                        Utama
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Hubungan:</span> {contact.relationship}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {contact.phone}
                      </span>
                    )}
                    {contact.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </span>
                    )}
                  </div>
                  {contact.address && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {contact.address}
                    </p>
                  )}
                  {contact.notes && (
                    <p className="text-sm text-gray-500 mt-2 bg-gray-100 p-2 rounded-lg">{contact.notes}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">
                {editingContact ? 'Edit' : 'Tambah'} Kontak Keluarga
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hubungan *</label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ayah / Ibu / Kakak / Paman / dll"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nomor telepon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={formData.is_primary_contact}
                  onChange={(e) => setFormData({ ...formData, is_primary_contact: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_primary" className="text-sm font-medium text-gray-700">
                  Kontak Utama
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Catatan tambahan"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyContactSection;

