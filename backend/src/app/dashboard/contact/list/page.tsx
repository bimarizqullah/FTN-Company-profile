"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SweetAlerts } from "@/lib/sweetAlert";

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
        const errorMessage = err.message || "Gagal memuat kontak";
        setError(errorMessage);
        SweetAlerts.error.simple(
          "Gagal Memuat Data",
          "Terjadi kesalahan saat memuat data kontak. Silakan coba lagi."
        );
        console.error("Fetch contacts error:", err);
      }
  }

  async function handleDelete(id: number) {
    const contact = contacts.find(c => c.id === id);
    const contactName = contact?.name || "kontak ini";
    
    const result = await SweetAlerts.confirm.delete(contactName);

    if (result.isConfirmed) {
      // Show loading
      SweetAlerts.loading.show("Menghapus Kontak...", "Sedang menghapus data kontak");
      
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/contact/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchContacts();

        // Show success
        SweetAlerts.toast.success(`Kontak "${contactName}" berhasil dihapus`);
      } catch (err: any) {
        SweetAlerts.error.withDetails(
          "Gagal Menghapus Kontak",
          "Terjadi kesalahan saat menghapus kontak.",
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
                onClick={() => router.push("/dashboard/messages")}
                className="px-4 py-2 text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Lihat Messages
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

        <div className="w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Office
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Position
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  WhatsApp
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-black bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contact.office.name}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      {/* Show position on mobile */}
                      <div className="text-sm text-gray-500 sm:hidden mt-1">
                        <strong>Posisi:</strong> {contact.position}
                      </div>
                      {/* Show email on mobile */}
                      <div className="text-sm text-gray-500 sm:hidden">
                        <strong>Email:</strong> {contact.email}
                      </div>
                      {/* Show WhatsApp on mobile */}
                      {contact.whatsapp && (
                        <div className="text-sm text-gray-500 sm:hidden">
                          <strong>WhatsApp:</strong> {contact.whatsapp}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">{contact.position}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-900">{contact.email}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-900">{contact.whatsapp}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/contact/edit/${contact.id}`)}
                        className="px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="px-3 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors text-xs"
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

    </>
  );
}