import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orphansApi } from '../api';
import type { Orphan } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

const OrphansList = () => {
  const navigate = useNavigate();
  const { data: orphansData, isLoading } = useQuery({
    queryKey: ['orphans'],
    queryFn: () => orphansApi.getAll().then(res => res),
  });
  const data = Array.isArray(orphansData) ? orphansData : (orphansData?.data || []);


  if (isLoading) return <div>Loading orphans...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Daftar Anak Asuh</h2>
        {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah
        </button> */}
      </div>
      <div className="grid gap-4">
        {data?.map((orphan: Orphan) => (
          <div key={orphan.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div
              className="cursor-pointer hover:bg-blue-50 rounded p-2 -m-2 transition-all"
              onClick={() => navigate(`/orphans/${orphan.id}`)}
            >
              <h3 className="font-semibold">{orphan.name}</h3>
              <p className="text-sm text-gray-600">Kode: {orphan.code}</p>
              <p>Gender: {orphan.gender} | Status: <span className={`px-2 py-1 rounded text-xs ${orphan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{orphan.status}</span></p>
            </div>
            {/* <div className="flex gap-2">
              <button
                onClick={() => navigate('/orphans')}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-1 px-3 rounded flex items-center gap-2 text-sm"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded flex items-center gap-2 text-sm">
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrphansList;

