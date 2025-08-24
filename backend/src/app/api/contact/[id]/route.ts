import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

// GET detail contact by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: Number(params.id) },
      include: { office: true },
    });
    if (!contact) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(contact);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update contact
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

    const { officeId, name, position, email, whatsapp } = await req.json();
    const updatedContact = await prisma.contact.update({
      where: { id: Number(params.id) },
      data: { officeId: parseInt(officeId), name, position, email, whatsapp },
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("PUT Contact Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE contact
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: Number(params.id) },
    });
    if (!contact) return NextResponse.json({ message: "Not found" }, { status: 404 });

    await prisma.contact.delete({ where: { id: Number(params.id) } });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}