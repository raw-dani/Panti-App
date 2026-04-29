import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { orphansApi } from '../api';
import type { OrphanMedicalRecord } from '../types';
import { Plus, Edit2, Trash2, Stethoscope, X, Save, Calendar } from 'lucide-react';

interface Props {
  orphanId: number;
}

const MedicalHistorySection = ({ orphanId }: Props) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OrphanMedicalRecord | null>(null);
  const [formData, setFormData] = useState<Partial<OrphanMedicalRecord>>({
    date: new Date().toISOString().split('T')[0],
    doctor_name: '',
    description: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  const { data: recordsData, isLoading } = useQuery({
    queryKey: ['medicalRecords', orphanId],
    queryFn: () => orphansApi.getMedicalRecords(orphanId),
  });

  const records = Array.isArray(recordsData) ? recordsData : (recordsData?.data || []);

  const createMutation = useMutation({
    mutationFn: (data: Partial<OrphanMedicalRecord>) => orphansApi.createMedicalRecord(orphanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords', orphanId] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<OrphanMedicalRecord>) =>
      orphansApi.updateMedicalRecord(editingRecord!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords', orphanId] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => orphansApi.deleteMedicalRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords', orphanId] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingRecord(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      doctor_name: '',
      description: '',
      diagnosis: '',
      treatment: '',
      notes: '',
    });
  };

  const handleEdit = (record: OrphanMedicalRecord) => {
    setEditingRecord(record);
    setFormData({
      date: new Date(record.date).toISOString().split('T')[0],
      doctor_name: record.doctor_name || '',
      description: record.description,
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      notes: record.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.date) return;
    if (editingRecord) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus riwayat medis ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Riwayat Kesehatan</h2>
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
        <div className="p-8 text-center text-gray-500">Memuat riwayat kesehatan...</div>
      ) : records.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Belum ada riwayat kesehatan</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {records.map((record: OrphanMedicalRecord) => (
            <div key={record.id} className="p-6 hover:bg-gray-50 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString('id-ID')}
                    </span>
                    {record.doctor_name && (
                      <span className="text-sm text-gray-500">| {record.doctor_name}</span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium mb-1">{record.description}</p>
                  {record.diagnosis && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                    </p>
                  )}
                  {record.treatment && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Pengobatan:</span> {record.treatment}
                    </p>
                  )}
                  {record.notes && (
                    <p className="text-sm text-gray-500 mt-2 bg-gray-100 p-2 rounded-lg">{record.notes}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
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
                {editingRecord ? 'Edit' : 'Tambah'} Riwayat Kesehatan
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokter</label>
                  <input
                    type="text"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nama dokter"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Gejala/keluhan yang dirasakan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Diagnosis penyakit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengobatan</label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Obat/tindakan yang diberikan"
                />
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

export default MedicalHistorySection;

