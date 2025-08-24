import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import path from "path";
import { writeFile, unlink, mkdir } from "fs/promises";
import crypto from "crypto";

// GET detail office by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await params sebelum menggunakan
    const office = await prisma.office.findUnique({
      where: { id: Number(id) },
      include: { contacts: true },
    });
    if (!office) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(office);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update office
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await params sebelum menggunakan
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, address, phone, email } = await req.json();
    const updatedOffice = await prisma.office.update({
      where: { id: Number(id) },
      data: { name, address, phone, email },
    });

    return NextResponse.json(updatedOffice);
  } catch (error) {
    console.error("PUT Office Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE office
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await params sebelum menggunakan
    
    const office = await prisma.office.findUnique({
      where: { id: Number(id) },
    });
    if (!office) return NextResponse.json({ message: "Not found" }, { status: 404 });

    await prisma.office.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}