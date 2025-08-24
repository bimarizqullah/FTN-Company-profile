"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardHeader from "@/app/components/admin-dashboard/DashboardHeader";
import Sidebar from "@/app/components/admin-dashboard/Sidebar";
import StatsGrid from "@/app/components/admin-dashboard/StatsGrid";
import DynamicForm, { FormConfig } from "@/app/components/admin-dashboard/DynamicForm";

type Office = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
};

type AuthUser = {
  email: string;
  roles: string[];
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export default function EditOfficePage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [office, setOffice] = useState<Office | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  
  // Pastikan id tersedia dari params
  const id = params?.id as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user authentication
    fetch("/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        const data = await res.json();
        setAuthUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });

    // Fetch office data jika id tersedia
    if (id) {
      fetchOffice();
    }
  }, [id, router]);

  async function fetchOffice() {
    try {
      setIsLoading(true);
      setError(""); // Reset error
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      console.log("Fetching office with ID:", id); // Debug log

      const res = await fetch(`/api/office/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", res.status); // Debug log

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData); // Debug log
        throw new Error(errorData.message || `HTTP Error: ${res.status}`);
      }

      const officeData = await res.json();
      console.log("Office data received:", officeData); // Debug log

      // Cek apakah response memiliki struktur ApiResponse atau langsung Office
      if (officeData.success !== undefined) {
        // Jika menggunakan wrapper ApiResponse
        if (officeData.success && officeData.data) {
          setOffice(officeData.data);
        } else {
          throw new Error(officeData.message || "Gagal memuat kantor");
        }
      } else {
        // Jika API mengembalikan data office langsung
        if (officeData.id) {
          setOffice(officeData);
        } else {
          throw new Error("Data kantor tidak valid");
        }
      }
    } catch (err) {
      console.error("Fetch office error:", err); // Debug log
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat kantor";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError("");
    setTimeout(() => router.push("/dashboard/office"), 1500);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess("");
  };

  // Tampilkan loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Memuat data kantor...</div>
      </div>
    );
  }

  // Tampilkan error jika office tidak berhasil dimuat
  if (error && !office) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>Error: {error}</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => fetchOffice()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => router.push("/dashboard/office")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Kembali ke Daftar Kantor
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Jangan render form jika office belum dimuat
  if (!office) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Data kantor tidak ditemukan</div>
      </div>
    );
  }

  const formConfig: FormConfig = {
    title: "Edit Kantor",
    description: "Perbarui data kantor di dashboard admin",
    fields: [
      {
        name: "name",
        label: "Nama Kantor",
        type: "text",
        placeholder: "Masukkan nama kantor",
        required: true,
        value: office.name,
      },
      {
        name: "address",
        label: "Alamat",
        type: "text",
        placeholder: "Masukkan alamat",
        required: true,
        value: office.address,
      },
      {
        name: "phone",
        label: "Nomor Telepon",
        type: "text",
        placeholder: "Masukkan nomor telepon",
        required: true,
        value: office.phone,
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        placeholder: "Masukkan email",
        required: true,
        value: office.email,
      },
    ],
    submitUrl: `/api/office/${id}`,
    submitMethod: "PUT",
    redirectUrl: "/dashboard/office",
  };

  if (!authUser && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Memuat...</div>
      </div>
    );
  }

  if (error && !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64">
          <DashboardHeader onLogout={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }} />
          <main className="text-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <StatsGrid />
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <DynamicForm
              config={formConfig}
              error={error}
              success={success}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </main>
        </div>
      </div>
    </div>
  );
}