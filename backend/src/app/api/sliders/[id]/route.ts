// API: app/api/sliders/[id]/route.ts

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
    // Validasi Content-Type
    const contentType = req.headers.get('content-type');
    let title: string | undefined;
    let subtitle: string | undefined;
    let tagline: string | undefined;
    let status: status_enum | undefined;
    let file: File | null = null;

    // Handle both JSON and multipart/form-data
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      title = formData.get('title')?.toString();
      subtitle = formData.get('subtitle')?.toString();
      tagline = formData.get('tagline')?.toString();
      status = formData.get('status')?.toString() as status_enum;
      file = formData.get('file') as File | null;

      // Validate required fields for full update (when file or text fields are provided)
      if ((file || title || subtitle || tagline) && (!title || !subtitle || !tagline)) {
        return NextResponse.json(
          { message: 'Judul, SubJudul, dan Tagline wajib diisi jika salah satu diantaranya disediakan' },
          { status: 400 }
        );
      }
    } else if (contentType?.includes('application/json')) {
      const body = await req.json();
      status = body.status as status_enum;
      // Only allow status updates for JSON requests
      if (!status) {
        return NextResponse.json(
          { message: 'Status wajib disediakan untuk pembaruan JSON' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: 'Content-Type harus multipart/form-data atau application/json' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { message: 'Status tidak valid. Gunakan "active" atau "inactive"' },
        { status: 400 }
      );
    }

    let imagePath: string | undefined = undefined;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'sliders');
      await mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      imagePath = `/uploads/sliders/${filename}`;
    }

    // Build the update data dynamically
    const updateData: any = {};
    if (title) updateData.title = title;
    if (subtitle) updateData.subtitle = subtitle;
    if (tagline) updateData.tagline = tagline;
    if (status) updateData.status = status;
    if (imagePath) updateData.imagePath = imagePath;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'Tidak ada data yang disediakan untuk pembaruan' },
        { status: 400 }
      );
    }

    const updated = await prisma.slider.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { message: 'Gagal update data', details: error },
      { status: 500 }
    );
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
        const deleted = await prisma.slider.delete({
            where: { id: Number(params.id) },
        });
        console.log(`[DELETE] Slider with ID ${params.id} deleted from database`);

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