"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CreateSlider() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("active");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Pilih file slider!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("status", status);

    const res = await fetch("/api/sliders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (res.ok) {
      toast.success("Slider berhasil ditambahkan!");
      router.push("/dashboard/sliders");
    } else {
      toast.error("Gagal menambah slider");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Slider</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Simpan
        </button>
      </form>
    </div>
  );
}
