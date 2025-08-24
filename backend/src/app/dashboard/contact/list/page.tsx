"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

type Contact = {
  id: number;
  officeId: number;
  name: string;
  position: string;
  email: string;
  whatsapp: string;
  office: { name: string };
};

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch("/api/contact", {
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
        throw new Error("Gagal memuat kontak");
      }
      const data = await res.json();
      setContacts(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat kontak");
      console.error("Fetch contacts error:", err);
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data kontak akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/contact/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchContacts();

        Swal.fire({
          title: "Berhasil!",
          text: "Kontak berhasil dihapus.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: any) {
        Swal.fire({
          title: "Gagal!",
          text: err.response?.data?.message || "Gagal menghapus kontak",
          icon: "error",
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Contact Management</h1>
                <p className="text-sm text-gray-500">Kelola Kontak</p>
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
                onClick={() => router.push("/dashboard/contact/create")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Tambah Kontak
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
                  Office
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-black bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">{contact.office.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">{contact.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">{contact.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">{contact.whatsapp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/contact/edit/${contact.id}`)}
                        className="px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
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

        {contacts.length === 0 && !error && (
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
            <p className="text-sm text-gray-500">Mulai dengan menambahkan kontak baru</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">© 2025 Admin Dashboard. Hak cipta dilindungi.</p>
      </div>
    </>
  );
}