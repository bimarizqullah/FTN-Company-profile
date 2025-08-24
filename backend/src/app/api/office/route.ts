import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }
    if (!prisma.office) {
      throw new Error("Office model is not available in Prisma client");
    }
    const offices = await prisma.office.findMany({
      include: { contacts: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(offices);
  } catch (error) {
    console.error("Error fetching offices:", error);
    return NextResponse.json(
      { message: `Server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

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

    const { name, address, phone, email } = await req.json();
    const office = await prisma.office.create({
      data: { name, address, phone, email, createdBy: Number(decoded.userId) },
    });
    return NextResponse.json(office, { status: 201 });
  } catch (error) {
    console.error("Error creating office:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}