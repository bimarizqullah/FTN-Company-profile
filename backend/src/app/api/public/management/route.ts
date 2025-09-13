import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get only active management for public frontend
    const management = await prisma.management.findMany({
      where: { status: 'active' },
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        position: true,
        imagePath: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(management);
  } catch (error) {
    console.error('Public Management GET error:', error);
    return NextResponse.json({ 
      success: false,
      message: "Gagal mengambil data management",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


