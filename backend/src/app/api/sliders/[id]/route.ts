import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import path from "path";
import { writeFile, unlink, mkdir } from "fs/promises"; // Import writeFile, unlink, dan mkdir
import crypto from 'crypto'; // Import crypto untuk UUID
import { status_enum } from "@prisma/client";

// --- Ambil Slider berdasarkan ID ---
// Endpoint ini digunakan untuk mengambil detail satu slider berdasarkan ID-nya.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // 🔒 Verifikasi Token (Autentikasi)
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token); // Asumsi verifyToken mengembalikan objek decoded atau string error
        if (!decoded || typeof decoded === "string") {
            return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
        }

        // Optional: Pemeriksaan Otorisasi (misalnya, hanya admin atau pemilik konten yang bisa melihat detail)
        // if (!decoded.roles.includes('admin') && !decoded.roles.includes('superadmin')) {
        //   return NextResponse.json({ message: "Forbidden: Insufficient permissions" }, { status: 403 });
        // }

        // 🔎 Cari slider di database berdasarkan ID
        const slider = await prisma.slider.findUnique({
            where: { id: Number(params.id) }, // Pastikan ID dikonversi ke Number jika di database adalah integer
        });

        // 🚫 Tangani jika slider tidak ditemukan
        if (!slider) {
            return NextResponse.json({ message: "Slider not found" }, { status: 404 });
        }

        // ✅ Kembalikan data slider jika berhasil ditemukan
        return NextResponse.json(slider, { status: 200 });
    } catch (error) {
        console.error("GET Slider by ID Error:", error); // Logging error yang lebih spesifik
        return NextResponse.json({ message: "Internal Server Error while fetching slider" }, { status: 500 });
    }
}

// --- Perbarui Slider berdasarkan ID ---
// Endpoint ini digunakan untuk memperbarui data slider yang sudah ada, termasuk mengganti gambar.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const statusString = formData.get("status")?.toString() || null;
    const title = formData.get("title")?.toString() || "";
    const subtitle = formData.get("subtitle")?.toString() || "";
    const tagline = formData.get("tagline")?.toString() || "";

    let imagePath: string | undefined;

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${crypto.randomUUID()}${path.extname(imageFile.name)}`;
      const filePath = path.join(process.cwd(), "public", "uploads", "sliders", fileName);

      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, buffer);

      imagePath = `/uploads/sliders/${fileName}`;
    }

    // 🚦 Cek batas slider aktif saat update
    if (statusString === "active") {
      const activeCount = await prisma.slider.count({
        where: {
          status: "active",
          NOT: { id: Number(params.id) }, // Kecualikan slider yang sedang diupdate
        },
      });
      if (activeCount >= 5) {
        return NextResponse.json({ message: "Maksimal 5 slider aktif diperbolehkan" }, { status: 400 });
      }
    }

    const updateData: any = { title, subtitle, tagline };
    if (imagePath) updateData.imagePath = imagePath;
    if (statusString) updateData.status = statusString as status_enum;

    const updatedSlider = await prisma.slider.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return NextResponse.json(updatedSlider, { status: 200 });
  } catch (error) {
    console.error("PUT Slider Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// --- Hapus Slider berdasarkan ID ---
// Endpoint ini digunakan untuk menghapus data slider dan file gambarnya dari server.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // 🔒 Proteksi Autentikasi dan Otorisasi (Penting untuk endpoint delete)
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === "string") {
            return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
        }
        // Optional: Periksa role/permission (misalnya, hanya superadmin yang boleh menghapus)
        // if (!decoded.roles.includes('superadmin')) {
        //   return NextResponse.json({ message: "Forbidden: Insufficient permissions to delete" }, { status: 403 });
        // }

        // 🔎 Dapatkan path gambar yang akan dihapus dari database sebelum menghapus record slider
        const sliderToDelete = await prisma.slider.findUnique({
            where: { id: Number(params.id) },
            select: { imagePath: true }, // Hanya ambil imagePath yang dibutuhkan
        });

        if (!sliderToDelete) {
            return NextResponse.json({ message: "Slider not found" }, { status: 404 });
        }

        // 🗑️ Hapus record slider dari database
        await prisma.slider.delete({
            where: { id: Number(params.id) },
        });

        // 🗑️ Hapus file gambar dari direktori public/uploads/sliders
        if (sliderToDelete.imagePath) {
            const fullImagePath = path.join(process.cwd(), "public", sliderToDelete.imagePath);
            try {
                await unlink(fullImagePath); // Hapus file secara fisik
                console.log(`[DELETE] Deleted image file: ${fullImagePath}`);
            } catch (unlinkError) {
                console.warn(`[DELETE] Could not delete image file ${fullImagePath}:`, unlinkError);
                // Logging peringatan jika gagal menghapus file, tapi proses tidak dihentikan
            }
        }

        // ✅ Kembalikan respons sukses
        return NextResponse.json({ message: "Slider deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE Slider Error:", error);
        return NextResponse.json({ message: "Internal Server Error deleting slider" }, { status: 500 });
    }
}