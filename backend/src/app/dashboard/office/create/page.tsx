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

export default function CreateOfficePage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

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
  }, [router]);

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError("");
    setTimeout(() => router.push("/dashboard/office"), 1500);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess("");
  };

  const formConfig: FormConfig = {
    title: "Buat Kantor Baru",
    description: "Tambahkan kantor baru ke dashboard admin",
    fields: [
      {
        name: "name",
        label: "Nama Kantor",
        type: "text",
        placeholder: "Masukkan nama kantor",
        required: true,
        value: "",
      },
      {
        name: "address",
        label: "Alamat",
        type: "text",
        placeholder: "Masukkan alamat",
        required: true,
        value: "",
      },
      {
        name: "phone",
        label: "Nomor Telepon",
        type: "text",
        placeholder: "Masukkan nomor telepon",
        required: true,
        value: "",
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        placeholder: "Masukkan email",
        required: true,
        value: "",
      },
    ],
    submitUrl: "/api/office",
    submitMethod: "POST",
    redirectUrl: "/dashboard/office",
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