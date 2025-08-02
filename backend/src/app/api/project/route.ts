// File: app/api/project/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { project_status_enum } from "@prisma/client";

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST new project
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
    const location = formData.get("location")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const statusInput = formData.get("status")?.toString() || "ongoing";

    // Validasi status sesuai enum
    const allowedStatuses: project_status_enum[] = ["ongoing", "pending", "terminated"];
    const status = allowedStatuses.includes(statusInput as project_status_enum)
      ? (statusInput as project_status_enum)
      : "ongoing"; // fallback

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", "projects", filename);
    await writeFile(filePath, buffer);

    const project = await prisma.project.create({
      data: {
        imagePath: `/uploads/projects/${filename}`,
        status,
        name,
        location,
        description,
        createdBy: Number(decoded.userId),
      },
    });

    return NextResponse.json({ message: "Project uploaded successfully", project });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
