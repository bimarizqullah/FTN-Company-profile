// File: app/api/gallery/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import path from "path";
import { writeFile, unlink, mkdir } from "fs/promises";
import crypto from "crypto";

// GET detail gallery by ID (include images)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gallery = await (prisma as any).gallery.findUnique({
      where: { id: Number(params.id) },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    if (!gallery) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update gallery (description / add files)
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

    const contentType = req.headers.get("content-type") || "";
    let updateData: any = {};

    if (contentType.includes("application/json")) {
      const body = await req.json();
      updateData = {
        description: body.description || undefined,
      };

      // Update description only
      const updated = await (prisma as any).gallery.update({ where: { id: Number(params.id) }, data: updateData, include: { images: { orderBy: { sortOrder: 'asc' } } } });
      return NextResponse.json(updated);
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const files = formData.getAll("files") as File[];
      updateData.description = formData.get("description")?.toString() || undefined;

      // Update description if provided
      if (updateData.description) {
        await (prisma as any).gallery.update({ where: { id: Number(params.id) }, data: { description: updateData.description } });
      }

      // Handle uploaded files (add as GalleryImage entries)
      if (files && files.length) {
  // Count existing images to set sortOrder continuation
  const existingCount = await (prisma as any).galleryImage.count({ where: { galleryId: Number(params.id) } });

        const imagePromises = files.map(async (file, index) => {
          const mime = file.type || '';
          if (!(mime.startsWith('image/') || mime.startsWith('video/'))) {
            throw new Error(`File ${file.name} harus berupa gambar atau video`);
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '_')}`;
          const filePath = path.join(process.cwd(), "public", "uploads", "gallery", fileName);
          await mkdir(path.dirname(filePath), { recursive: true });
          await writeFile(filePath, buffer);

          return (prisma as any).galleryImage.create({ data: {
            imagePath: `/api/uploads/gallery/${fileName}`,
            galleryId: Number(params.id),
            sortOrder: existingCount + index,
          } });
        });

        await Promise.all(imagePromises);
      }

      const result = await (prisma as any).gallery.findUnique({ where: { id: Number(params.id) }, include: { images: { orderBy: { sortOrder: 'asc' } } } });
      return NextResponse.json(result);
    }

    return NextResponse.json({ message: "Unsupported Content-Type" }, { status: 400 });
  } catch (error) {
    console.error("PUT Gallery Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE gallery (and remove associated image files)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gallery = await (prisma as any).gallery.findUnique({
      where: { id: Number(params.id) },
      include: { images: true }
    });
    if (!gallery) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Delete gallery (GalleryImage rows will be removed by FK ON DELETE CASCADE)
    await (prisma as any).gallery.delete({ where: { id: Number(params.id) } });

    // Remove physical files for all images
    if (gallery.images && gallery.images.length) {
      for (const img of gallery.images) {
        if (img.imagePath) {
          const physicalPath = img.imagePath.replace('/api/uploads', '/uploads');
          const fullPath = path.join(process.cwd(), "public", physicalPath);
          try {
            await unlink(fullPath);
          } catch (err) {
            console.warn("Failed to delete image:", err);
          }
        }
      }
    }

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
