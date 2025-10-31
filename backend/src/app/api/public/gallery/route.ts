import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get only active gallery for public frontend (include images array)
    const gallery = await (prisma as any).gallery.findMany({
      where: { status: 'active' },
      orderBy: { id: "desc" },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Public Gallery GET error:', error);
    return NextResponse.json({ 
      success: false,
      message: "Gagal mengambil data gallery",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


