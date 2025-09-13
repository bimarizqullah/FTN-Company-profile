import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

// GET statistik messages
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

    // Get statistics
    const [
      totalMessages,
      unreadMessages,
      todayMessages,
      thisWeekMessages,
      thisMonthMessages,
    ] = await Promise.all([
      prisma.message.count(),
      prisma.message.count({ where: { isRead: false } }),
      prisma.message.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.message.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.message.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalMessages,
      unreadMessages,
      readMessages: totalMessages - unreadMessages,
      todayMessages,
      thisWeekMessages,
      thisMonthMessages,
    });
  } catch (error) {
    console.error("Error fetching message stats:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


