import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import * as uuid from "uuid";

// GET semua gallery
export async function GET() {
  try {
    const galleries = await (prisma as any).gallery.findMany({
      orderBy: { id: "desc" },
      include: {
        images: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    });
    return NextResponse.json(galleries);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST tambah gallery
export async function POST(req: NextRequest) {
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
  const files = formData.getAll("files") as File[];
  const description = formData.get("description")?.toString() || "";

    if (!files.length) {
      return NextResponse.json({ message: "At least one file is required" }, { status: 400 });
    }

    if (files.length > 20) {
      return NextResponse.json({ message: "Maximum 20 files allowed per upload" }, { status: 400 });
    }

    // First create the gallery entry
    // Cast prisma to any here because generated types may still expect the old `imagePath` field.
    const gallery = await (prisma as any).gallery.create({
      data: {
        description,
        createdBy: Number(decoded.userId),
      }
    });

    // Process all files and create GalleryImage entries
    const imagePromises = files.map(async (file, index) => {
      // Validasi tipe file: izinkan image/* dan video/*
      const mime = file.type || '';
      if (!(mime.startsWith('image/') || mime.startsWith('video/'))) {
        throw new Error(`File ${file.name} harus berupa gambar atau video`);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${uuid.v4()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(process.cwd(), "public", "uploads", "gallery", fileName);
      await writeFile(filePath, buffer);

      return (prisma as any).galleryImage.create({
        data: {
          imagePath: `/api/uploads/gallery/${fileName}`,
          galleryId: gallery.id,
          sortOrder: index,
        }
      });
    });

    // Create all gallery images
    const galleryImages = await Promise.all(imagePromises);

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}