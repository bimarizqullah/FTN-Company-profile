"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardHeader from "@/app/components/admin-dashboard/DashboardHeader";
import Sidebar from "@/app/components/admin-dashboard/Sidebar";
import StatsGrid from "@/app/components/admin-dashboard/StatsGrid";
import DynamicForm, { FormConfig } from "@/app/components/admin-dashboard/DynamicForm";

type Contact = {
  id: number;
  officeId: number;
  name: string;
  position: string;
  email: string;
  whatsapp: string;
};

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

export default function EditContactPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOffices, setIsLoadingOffices] = useState(true);
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

    // Fetch contact data jika id tersedia
    if (id) {
      fetchContact();
      fetchOffices();
    }
  }, [id, router]);

  async function fetchOffices() {
    try {
      setIsLoadingOffices(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch("/api/office", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Gagal memuat data kantor");
      }

      const officesData = await res.json();
      setOffices(officesData);
    } catch (err) {
      console.error("Error fetching offices:", err);
      // Tidak set error karena ini tidak critical untuk form
    } finally {
      setIsLoadingOffices(false);
    }
  }

  async function fetchContact() {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch(`/api/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memuat kontak");
      }

      // Jika API mengembalikan data langsung (tanpa wrapper success/data)
      const contactData = await res.json();
      
      // Cek apakah response memiliki struktur ApiResponse atau langsung Contact
      if (contactData.success !== undefined) {
        // Jika menggunakan wrapper ApiResponse
        if (contactData.success && contactData.data) {
          setContact(contactData.data);
        } else {
          throw new Error(contactData.message || "Gagal memuat kontak");
        }
      } else {
        // Jika API mengembalikan data contact langsung
        setContact(contactData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat kontak");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError("");
    setTimeout(() => router.push("/dashboard/contact"), 1500);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess("");
  };

  // Jangan render form jika contact atau offices belum dimuat
  if (isLoading || !contact || isLoadingOffices) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">
          {isLoading ? "Memuat data kontak..." : 
           isLoadingOffices ? "Memuat data kantor..." : 
           "Data kontak tidak ditemukan"}
        </div>
      </div>
    );
  }

  // Buat options untuk dropdown office
  const officeOptions = offices.map(office => ({
    value: office.id.toString(),
    label: `${office.name} - ${office.address}`
  }));

  const formConfig: FormConfig = {
    title: "Edit Kontak",
    description: "Perbarui data kontak di dashboard admin",
    fields: [
      { 
        name: "officeId",
        label: "Kantor",
        type: "select",
        placeholder: isLoadingOffices ? "Memuat kantor..." : "Pilih kantor",
        required: true,
        value: "",
        options: isLoadingOffices 
          ? [] 
          : offices.map(office => ({
              value: office.id.toString(),
              display: `${office.name} - ${office.address}`,
            })),
        valueField: "id",
      },
      {
        name: "name",
        label: "Nama",
        type: "text",
        placeholder: "Masukkan nama",
        required: true,
        value: contact.name,
      },
      {
        name: "position",
        label: "Posisi",
        type: "text",
        placeholder: "Masukkan posisi",
        required: true,
        value: contact.position,
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        placeholder: "Masukkan email",
        required: true,
        value: contact.email,
      },
      {
        name: "whatsapp",
        label: "WhatsApp",
        type: "text",
        placeholder: "Masukkan nomor WhatsApp",
        required: true,
        value: contact.whatsapp,
      },
    ],
    submitUrl: `/api/contact/${id}`,
    submitMethod: "PUT",
    redirectUrl: "/dashboard/contact",
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