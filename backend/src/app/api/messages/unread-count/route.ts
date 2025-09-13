import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

// GET jumlah pesan yang belum dibaca
export async function GET(req: NextRequest) {
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

    // Hitung pesan yang belum dibaca
    const unreadCount = await prisma.message.count({
      where: { isRead: false },
    });

    return NextResponse.json({
      unreadCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


