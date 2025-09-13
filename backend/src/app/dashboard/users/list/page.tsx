'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getInitials } from '@/lib/utils';
import Swal from 'sweetalert2';
import { ROLES } from '@/constants/roles';
import ImageWithFallback from '@/app/components/admin-dashboard/ImageWithFallback';

type Role = {
  id: number;
  role: string;
};

type User = {
  id: number;
  imagePath?: string;
  name: string;
  email: string;
  roles: { role: Role }[];
  status: 'active' | 'inactive';
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          setError('Akses ditolak: Hanya superadmin yang dapat mengakses');
          router.push('/dashboard');
          return;
        }
        throw new Error('Gagal memuat pengguna');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pengguna');
      console.error('Fetch users error:', err);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data pengguna akan dihapus secara permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchUsers();

        Swal.fire({
          title: 'Berhasil!',
          text: 'Pengguna berhasil dihapus.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: any) {
        Swal.fire({
          title: 'Gagal!',
          text: err.response?.data?.message || 'Gagal menghapus pengguna',
          icon: 'error',
        });
      }
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Users Management</h1>
                <p className="text-sm text-gray-500">Kelola Pengguna</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={() => router.push('/dashboard/users/create')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Tambah Users
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={`${u.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">
                    <div className="flex items-center">
                      <ImageWithFallback
                        src={u.imagePath}
                        alt={u.name}
                        fallbackText={getInitials(u.name)}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900 truncate">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/4 truncate">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 w-1/6">
                    <div className="inline-flex gap-1 flex-wrap">
                      {u.roles.map((r) => (
                        <span
                          key={r.role.id}
                          className="px-2 py-0.5 text-xs font-medium text-cyan-700 bg-cyan-50 rounded-full truncate"
                        >
                          {r.role.role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 w-1/6">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        u.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {u.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/users/edit/${u.id}`)}
                        className="px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !error && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Belum ada data</h3>
            <p className="text-sm text-gray-500">Mulai dengan menambahkan pengguna baru</p>
          </div>
        )}
      </div>

    </>
  );
}