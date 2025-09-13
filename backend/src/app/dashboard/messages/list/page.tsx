"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SweetAlerts } from "@/lib/sweetAlert";
import { useUnreadMessages } from "@/app/hooks/useUnreadMessages";
import { useMessageRefresh } from "@/app/hooks/useMessageRefresh";

type Message = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

type MessageStats = {
  totalMessages: number;
  unreadMessages: number;
  readMessages: number;
  todayMessages: number;
  thisWeekMessages: number;
  thisMonthMessages: number;
};

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const router = useRouter();
  
  // Hook untuk refresh unread count di sidebar
  const { refreshCount } = useUnreadMessages();

  // Hook untuk refresh messages list ketika ada pesan baru
  const refreshMessages = useCallback(() => {
    fetchMessages();
    fetchStats();
  }, []);

  useMessageRefresh({
    onRefresh: refreshMessages,
    enabled: currentPage === 1 && !searchTerm && filterRead === "all"
  });

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [currentPage, searchTerm, filterRead]);

  async function fetchMessages() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (filterRead !== "all") {
        params.append("isRead", filterRead);
      }

      const res = await fetch(`/api/messages?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError("Akses ditolak: Hanya admin yang dapat mengakses");
          router.push("/dashboard");
          return;
        }
        
        // Get error message from response
        let errorMessage = "Gagal memuat messages";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = res.statusText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setMessages(data.messages);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      const errorMessage = err.message || "Gagal memuat messages";
      setError(errorMessage);
      SweetAlerts.error.simple(
        "Gagal Memuat Data",
        `Terjadi kesalahan saat memuat data messages: ${errorMessage}`
      );
      console.error("Fetch messages error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/messages/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  }

  async function handleMarkAsRead(messageId: number, isRead: boolean) {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/messages/${messageId}`,
        { isRead },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead } : msg
        )
      );

      // Update stats
      if (stats) {
        setStats((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            unreadMessages: isRead
              ? prev.unreadMessages - 1
              : prev.unreadMessages + 1,
            readMessages: isRead
              ? prev.readMessages + 1
              : prev.readMessages - 1,
          };
        });
      }

      SweetAlerts.toast.success(
        `Message ${isRead ? "ditandai sebagai dibaca" : "ditandai sebagai belum dibaca"}`
      );
      
      // Refresh unread count di sidebar
      refreshCount();
    } catch (err: any) {
      SweetAlerts.error.withDetails(
        "Gagal Update Status",
        "Terjadi kesalahan saat mengupdate status message.",
        err.response?.data?.message || "Unknown error"
      );
    }
  }

  async function handleDelete(id: number) {
    const message = messages.find((m) => m.id === id);
    const messageSubject = message?.subject || "message ini";

    const result = await SweetAlerts.confirm.delete(messageSubject);

    if (result.isConfirmed) {
      SweetAlerts.loading.show("Menghapus Message...", "Sedang menghapus data message");

      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchMessages();
        await fetchStats();

        SweetAlerts.toast.success(`Message "${messageSubject}" berhasil dihapus`);
        
        // Refresh unread count di sidebar
        refreshCount();
      } catch (err: any) {
        SweetAlerts.error.withDetails(
          "Gagal Menghapus Message",
          "Terjadi kesalahan saat menghapus message.",
          err.response?.data?.message || "Unknown error"
        );
      }
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function truncateText(text: string, maxLength: number = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  return (
    <>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Messages Management</h1>
                <p className="text-sm text-gray-500">Kelola Pesan dari Website</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={() => router.push("/dashboard/contact")}
                className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Kelola Kontak
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="text-black flex-1">
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, subjek, atau pesan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full sm:w-auto text-black">
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="false">Belum Dibaca</option>
                <option value="true">Sudah Dibaca</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-600">Memuat messages...</div>
          </div>
        ) : (
          <>
            <div className="w-full overflow-hidden">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Pengirim
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-1/4">
                      Subjek
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-1/4">
                      Pesan
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell w-1/6">
                      Tanggal
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 w-1/6">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            message.isRead
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {message.isRead ? "Dibaca" : "Belum Dibaca"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 w-1/4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 break-words">{message.name}</div>
                          <div className="text-sm text-gray-500 break-words">{message.email}</div>
                          {message.phone && (
                            <div className="text-sm text-gray-500 break-words">{message.phone}</div>
                          )}
                          {/* Show subject on mobile */}
                          <div className="text-sm text-gray-700 sm:hidden mt-1">
                            <strong>Subjek:</strong> {message.subject}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden sm:table-cell w-1/4">
                        <div className="text-sm text-gray-900 break-words">{message.subject}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden md:table-cell w-1/4">
                        <div className="text-sm text-gray-900 max-w-xs break-words">
                          {truncateText(message.message, 50)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden lg:table-cell w-1/6">
                        <div className="text-sm text-gray-900">{formatDate(message.createdAt)}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm font-medium w-1/6">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => setSelectedMessage(message)}
                            className="px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors text-xs"
                          >
                            Lihat
                          </button>
                          <button
                            onClick={() => handleMarkAsRead(message.id, !message.isRead)}
                            className={`px-3 py-1 rounded transition-colors text-xs ${
                              message.isRead
                                ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
                                : "text-green-600 bg-green-50 hover:bg-green-100"
                            }`}
                          >
                            {message.isRead ? "Belum Dibaca" : "Dibaca"}
                          </button>
                          <button
                            onClick={() => handleDelete(message.id)}
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

            {messages.length === 0 && !error && (
              <div className="px-6 py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Belum ada data</h3>
                <p className="text-sm text-gray-500">Belum ada pesan yang diterima dari website</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detail Message</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengirim</label>
                <p className="text-sm text-gray-900">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900 break-all">{selectedMessage.email}</p>
              </div>
              {selectedMessage.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <p className="text-sm text-gray-900">{selectedMessage.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kirim</label>
                <p className="text-sm text-gray-900">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedMessage.isRead
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedMessage.isRead ? "Sudah Dibaca" : "Belum Dibaca"}
                </span>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleMarkAsRead(selectedMessage.id, !selectedMessage.isRead);
                  setSelectedMessage(null);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedMessage.isRead
                    ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
                    : "text-green-600 bg-green-50 hover:bg-green-100"
                }`}
              >
                {selectedMessage.isRead ? "Tandai Belum Dibaca" : "Tandai Dibaca"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
