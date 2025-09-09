import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { permissionMiddleware } from "@/middlewares/permissionMiddleware";
import { PERMISSIONS } from "@/constants/permissions";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import * as uuid from "uuid";
import { status_enum } from "@prisma/client";

export async function GET(req: NextRequest) {
  // Check authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  // Check permissions
  const permissionResponse = await permissionMiddleware(req, [PERMISSIONS.SLIDER_LIST]);
  if (permissionResponse) return permissionResponse;

  try {
    const sliders = await prisma.slider.findMany({
      orderBy: { id: "asc" },
      include: { user: true },
    });

    return NextResponse.json({ success: true, data: sliders });
  } catch (error) {
    console.error('Sliders GET error:', error);
    return NextResponse.json({ 
      success: false,
      message: "Gagal mengambil data slider",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  // Check authentication
  const authResponse = await authMiddleware(req);
  if (authResponse) return authResponse;

  // Check permissions
  const permissionResponse = await permissionMiddleware(req, [PERMISSIONS.SLIDER_CREATE]);
  if (permissionResponse) return permissionResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const status = (formData.get("status")?.toString() || "active") as status_enum;
    const title = formData.get("title")?.toString() || "";
    const subtitle = formData.get("subtitle")?.toString() || "";
    const tagline = formData.get("tagline")?.toString() || "";

    if (!file) {
      return NextResponse.json({ 
        success: false,
        message: "File gambar wajib diupload" 
      }, { status: 400 });
    }

    if (!title.trim()) {
      return NextResponse.json({ 
        success: false,
        message: "Judul slider wajib diisi" 
      }, { status: 400 });
    }

    // 🚦 Cek jumlah slider aktif
    if (status === "active") {
      const activeCount = await prisma.slider.count({ where: { status: "active" } });
      if (activeCount >= 5) {
        return NextResponse.json({ 
          success: false,
          message: "Maksimal 5 slider aktif diperbolehkan" 
        }, { status: 400 });
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${uuid.v4()}-${file.name}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "sliders");
    const filePath = path.join(uploadsDir, fileName);

    // Create directory if not exists
    const { mkdir } = require('fs/promises');
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filePath, buffer);

    // Get user ID from headers (set by authMiddleware)
    const userId = req.headers.get('x-user-id');

    const slider = await prisma.slider.create({
      data: {
        imagePath: `/uploads/sliders/${fileName}`,
        status,
        title,
        subtitle,
        tagline,
        createdBy: Number(userId),
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: slider,
      message: "Slider berhasil dibuat"
    }, { status: 201 });
  } catch (error) {
    console.error('Slider create error:', error);
    return NextResponse.json({ 
      success: false,
      message: "Gagal membuat slider",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}