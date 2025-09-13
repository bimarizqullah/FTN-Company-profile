import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

// GET detail message berdasarkan ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const message = await prisma.message.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Message tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT untuk update message (mark as read/unread)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { isRead } = await req.json();

    const message = await prisma.message.update({
      where: { id: parseInt(params.id) },
      data: { isRead },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE untuk menghapus message
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.message.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Message berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


