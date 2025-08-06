import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import * as uuid from "uuid";

// GET semua gallery
export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
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
    const file = formData.get("file") as File;
    const description = formData.get("description")?.toString() || "";

    if (!file) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${uuid.v4()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", "gallery", fileName);
    await writeFile(filePath, buffer);

    const gallery = await prisma.gallery.create({
      data: {
        imagePath: `/uploads/gallery/${fileName}`,
        description,
        createdBy: Number(decoded.userId),
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}