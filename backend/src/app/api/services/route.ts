import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import * as uuid from "uuid";
import Services from '../../../../../frontend/src/components/Home/Services/index';

// GET semua services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST tambah services
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
    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";


    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", "services", filename);
    await writeFile(filePath, buffer);

    const Services = await prisma.service.create({
      data: {
        imagePath: `/uploads/services/${filename}`,
        name,
        description,
        createdBy: Number(decoded.userId),
      },
    });

    return NextResponse.json({ message: "Services uploaded successfully", Services });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}