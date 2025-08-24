"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/app/components/admin-dashboard/DashboardHeader";
import Sidebar from "@/app/components/admin-dashboard/Sidebar";
import StatsGrid from "@/app/components/admin-dashboard/StatsGrid";
import DynamicForm, { FormConfig } from "@/app/components/admin-dashboard/DynamicForm";

type AuthUser = {
  email: string;
  roles: string[];
};

type Office = {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: string;
};

export default function CreateContactPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user data
    fetch("/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setAuthUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });

    // Fetch offices data
    fetch("/api/office", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch offices");
        const data = await res.json();
        setOffices(data.filter((office: Office) => office.status === 'active'));
      })
      .catch((error) => {
        console.error("Error fetching offices:", error);
        setError("Gagal memuat data kantor");
      })
      .finally(() => {
        setIsLoadingOffices(false);
      });
  }, [router]);

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError("");
    setTimeout(() => router.push("/dashboard/contact"), 1500);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess("");
  };

  const formConfig: FormConfig = {
    title: "Buat Kontak Baru",
    description: "Tambahkan kontak baru ke dashboard admin",
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
        value: "",
      },
      {
        name: "position",
        label: "Posisi",
        type: "text",
        placeholder: "Masukkan posisi",
        required: true,
        value: "",
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        placeholder: "Masukkan email",
        required: false,
        value: "",
      },
      {
        name: "whatsapp",
        label: "WhatsApp",
        type: "text",
        placeholder: "Masukkan nomor WhatsApp",
        required: false,
        value: "",
      },
    ],
    submitUrl: "/api/contact",
    submitMethod: "POST",
    redirectUrl: "/dashboard/contact",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64">
          <DashboardHeader onLogout={handleLogout} />
          <main className="text-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <StatsGrid />
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