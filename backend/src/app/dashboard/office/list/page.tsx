"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SweetAlerts } from "@/lib/sweetAlert";

type Office = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  contacts: any[];
};

export default function OfficeList() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchOffices();
  }, []);

  async function fetchOffices() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch("/api/office", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          setError("Akses ditolak: Hanya superadmin yang dapat mengakses");
          router.push("/dashboard");
          return;
        }
        throw new Error("Gagal memuat kantor");
      }
      const data = await res.json();
      setOffices(data);
      } catch (err: any) {
        const errorMessage = err.message || "Gagal memuat kantor";
        setError(errorMessage);
        SweetAlerts.error.simple(
          "Gagal Memuat Data",
          "Terjadi kesalahan saat memuat data kantor. Silakan coba lagi."
        );
        console.error("Fetch offices error:", err);
      }
  }

  async function handleDelete(id: number) {
    const office = offices.find(o => o.id === id);
    const officeName = office?.name || "kantor ini";
    
    const result = await SweetAlerts.confirm.delete(officeName);

    if (result.isConfirmed) {
      // Show loading
      SweetAlerts.loading.show("Menghapus Kantor...", "Sedang menghapus data kantor");
      
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/office/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchOffices();

        // Show success
        SweetAlerts.toast.success(`Kantor "${officeName}" berhasil dihapus`);
      } catch (err: any) {
        SweetAlerts.error.withDetails(
          "Gagal Menghapus Kantor",
          "Terjadi kesalahan saat menghapus kantor.",
          err.response?.data?.message || "Unknown error"
        );
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
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Office Management</h1>
                <p className="text-sm text-gray-500">Kelola Kantor</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={() => router.push("/dashboard/office/create")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Tambah Kantor
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-black bg-white divide-y divide-gray-200">
              {offices.map((office) => (
                <tr key={office.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap w-1/4">{office.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/4">{office.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">{office.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">{office.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/office/edit/${office.id}`)}
                        className="px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(office.id)}
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

        {offices.length === 0 && !error && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Belum ada data</h3>
            <p className="text-sm text-gray-500">Mulai dengan menambahkan kantor baru</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">© 2025 Admin Dashboard. Hak cipta dilindungi.</p>
      </div>
    </>
  );
}