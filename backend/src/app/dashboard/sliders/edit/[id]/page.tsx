"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EditSliderPage() {
  const { id } = useParams();
  const [slider, setSlider] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Ambil data slider berdasarkan id
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch(`/api/sliders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data slider");
        const data = await res.json();
        setSlider(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat slider");
      }
    };

    if (id) fetchSlider();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      if (image) formData.append("image", image);
      formData.append("status", status);

      const res = await fetch(`/api/sliders/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal update slider");

      toast.success("Slider berhasil diupdate");
      router.push("/dashboard/sliders");
    } catch (err) {
      console.error(err);
      toast.error("Gagal update slider");
    } finally {
      setLoading(false);
    }
  };

  if (!slider) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Slider</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Gambar Saat Ini</label>
        <img
          src={slider.imagePath}
          alt="slider"
          className="w-64 h-auto mb-4 rounded border"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Updating..." : "Update Slider"}
      </button>
    </div>
  );
}