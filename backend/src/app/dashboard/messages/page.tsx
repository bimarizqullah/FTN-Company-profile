"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/app/components/admin-dashboard/DashboardHeader";
import Sidebar from "@/app/components/admin-dashboard/Sidebar";
import MessageList from "./list/page";

type AuthUser = {
  email: string;
  roles: string[];
};

export default function MessagesPage() {
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
  }, []);

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
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex flex-col lg:flex-row w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64 w-full">
          <DashboardHeader onLogout={handleLogout} />
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <MessageList />
          </main>
        </div>
      </div>
    </div>
  );
}
