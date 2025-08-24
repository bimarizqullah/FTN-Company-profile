import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import * as uuid from "uuid";
import { status_enum } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Auth optional (kalau dashboard saja)
    const sliders = await prisma.slider.findMany({
      orderBy: { id: "asc" },
      where: { status: "active" },
    });

    return NextResponse.json(sliders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: No token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const status = (formData.get("status")?.toString() || "active") as status_enum;
    const title = formData.get("title")?.toString() || "";
    const subtitle = formData.get("subtitle")?.toString() || "";
    const tagline = formData.get("tagline")?.toString() || "";

    if (!file) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    // 🚦 Cek jumlah slider aktif
    if (status === "active") {
      const activeCount = await prisma.slider.count({ where: { status: "active" } });
      if (activeCount >= 5) {
        return NextResponse.json({ message: "Maksimal 5 slider aktif diperbolehkan" }, { status: 400 });
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${uuid.v4()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", "sliders", fileName);

    await writeFile(filePath, buffer);

    const slider = await prisma.slider.create({
      data: {
        imagePath: `/uploads/sliders/${fileName}`,
        status,
        title,
        subtitle,
        tagline,
        createdBy: Number(decoded.userId),
      },
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}