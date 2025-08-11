// File: app/api/project/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import path from "path";
import { writeFile, unlink, mkdir } from "fs/promises";
import crypto from "crypto";

// GET detail project by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id: Number(params.id) },
    });
    if (!gallery) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update project
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
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const imageFile = formData.get("file") as File | null;
      updateData.description = formData.get("description")?.toString() || undefined;

      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${crypto.randomUUID()}${path.extname(imageFile.name)}`;
        const filePath = path.join(process.cwd(), "public", "uploads", "gallery", fileName);
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, buffer);
        updateData.imagePath = `/uploads/gallery/${fileName}`;
      }
    } else {
      return NextResponse.json({ message: "Unsupported Content-Type" }, { status: 400 });
    }

    const updatedGallery = await prisma.gallery.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return NextResponse.json(updatedGallery);
  } catch (error) {
    console.error("PUT Project Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id: Number(params.id) },
      select: { imagePath: true },
    });
    if (!gallery) return NextResponse.json({ message: "Not found" }, { status: 404 });

    await prisma.gallery.delete({ where: { id: Number(params.id) } });

    if (gallery.imagePath) {
      const fullPath = path.join(process.cwd(), "public", gallery.imagePath);
      try {
        await unlink(fullPath);
      } catch (err) {
        console.warn("Failed to delete image:", err);
      }
    }

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
