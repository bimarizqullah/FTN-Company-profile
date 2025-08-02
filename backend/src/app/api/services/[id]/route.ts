import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import path from "path";
import { writeFile, unlink, mkdir } from "fs/promises";
import crypto from "crypto";

// GET detail service by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const services = await prisma.service.findUnique({
      where: { id: Number(params.id) },
    });
    if (!services) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update services
// Endpoint ini digunakan untuk memperbarui data services yang sudah ada, termasuk mengganti gambar.
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
      // 🔹 Handle JSON
      const body = await req.json();
      updateData = {
        name: body.name || undefined,
        description: body.description || undefined,
      };
    } 
    else if (contentType.includes("multipart/form-data")) {
      // 🔹 Handle FormData
      const formData = await req.formData();
      const imageFile = formData.get("image") as File | null;
      updateData.name = formData.get("name")?.toString() || undefined;
      updateData.description = formData.get("description")?.toString() || undefined;

      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${crypto.randomUUID()}${path.extname(imageFile.name)}`;
        const filePath = path.join(process.cwd(), "public", "uploads", "services", fileName);
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, buffer);
        updateData.imagePath = `/uploads/services/${fileName}`;
      }
    } 
    else {
      return NextResponse.json({ message: "Unsupported Content-Type" }, { status: 400 });
    }

    const updatedServices = await prisma.service.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return NextResponse.json(updatedServices);
  } catch (error) {
    console.error("PUT Services Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE Services
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const Services = await prisma.service.findUnique({
      where: { id: Number(params.id) },
      select: { imagePath: true },
    });
    if (!Services) return NextResponse.json({ message: "Not found" }, { status: 404 });

    await prisma.service.delete({ where: { id: Number(params.id) } });

    // Delete file
    if (Services.imagePath) {
      const fullPath = path.join(process.cwd(), "public", Services.imagePath);
      try {
        await unlink(fullPath);
      } catch (err) {
        console.warn("Failed to delete file:", err);
      }
    }

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}