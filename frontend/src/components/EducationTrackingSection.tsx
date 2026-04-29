import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { orphansApi } from '../api';
import type { OrphanEducationRecord } from '../types';
import { Plus, Edit2, Trash2, GraduationCap, X, Save } from 'lucide-react';

interface Props {
  orphanId: number;
}

const EducationTrackingSection = ({ orphanId }: Props) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OrphanEducationRecord | null>(null);
  const [formData, setFormData] = useState<Partial<OrphanEducationRecord>>({
    school_name: '',
    grade_class: '',
    academic_year: '',
    semester: '1',
    status: 'active',
    notes: '',
  });

  const { data: recordsData, isLoading } = useQuery({
    queryKey: ['educationRecords', orphanId],
    queryFn: () => orphansApi.getEducationRecords(orphanId),
  });

  const records = Array.isArray(recordsData) ? recordsData : (recordsData?.data || []);

  const createMutation = useMutation({
    mutationFn: (data: Partial<OrphanEducationRecord>) => orphansApi.createEducationRecord(orphanId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationRecords', orphanId] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<OrphanEducationRecord>) =>
      orphansApi.updateEducationRecord(editingRecord!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationRecords', orphanId] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => orphansApi.deleteEducationRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationRecords', orphanId] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingRecord(null);
    setFormData({
      school_name: '',
      grade_class: '',
      academic_year: '',
      semester: '1',
      status: 'active',
      notes: '',
    });
  };

  const handleEdit = (record: OrphanEducationRecord) => {
    setEditingRecord(record);
    setFormData({
      school_name: record.school_name,
      grade_class: record.grade_class,
      academic_year: record.academic_year,
      semester: record.semester,
      status: record.status,
      notes: record.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.school_name || !formData.grade_class || !formData.academic_year) return;
    if (editingRecord) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus data pendidikan ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      dropped: 'bg-red-100 text-red-800',
    };
    const labels = { active: 'Aktif', completed: 'Selesai', dropped: 'Berhenti' };
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Tracking Pendidikan</h2>
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
        <div className="p-8 text-center text-gray-500">Memuat data pendidikan...</div>
      ) : records.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Belum ada data pendidikan</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {records.map((record: OrphanEducationRecord) => (
            <div key={record.id} className="p-6 hover:bg-gray-50 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{record.school_name}</h3>
                    {getStatusBadge(record.status)}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span><span className="font-medium">Kelas:</span> {record.grade_class}</span>
                    <span><span className="font-medium">Tahun Ajaran:</span> {record.academic_year}</span>
                    <span><span className="font-medium">Semester:</span> {record.semester}</span>
                  </div>
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
                {editingRecord ? 'Edit' : 'Tambah'} Data Pendidikan
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah *</label>
                <input
                  type="text"
                  value={formData.school_name}
                  onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama sekolah"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas *</label>
                  <input
                    type="text"
                    value={formData.grade_class}
                    onChange={(e) => setFormData({ ...formData, grade_class: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Kelas 1A / Semester 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran *</label>
                  <input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2025/2026"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as '1' | '2' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Ganjil (1)</option>
                    <option value="2">Genap (2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'dropped' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                    <option value="dropped">Berhenti</option>
                  </select>
                </div>
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

export default EducationTrackingSection;

