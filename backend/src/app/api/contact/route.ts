import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

// GET semua contact
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: { office: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST tambah contact
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

    const { officeId, name, position, email, whatsapp } = await req.json();

    const contact = await prisma.contact.create({
      data: { officeId: parseInt(officeId), name, position, email, whatsapp, createdBy: Number(decoded.userId) },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}