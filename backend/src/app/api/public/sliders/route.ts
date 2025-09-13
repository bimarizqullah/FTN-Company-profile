import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get only active sliders for public frontend
    const sliders = await prisma.slider.findMany({
      where: { status: 'active' },
      orderBy: { id: "asc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        tagline: true,
        imagePath: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(sliders);
  } catch (error) {
    console.error('Public Sliders GET error:', error);
    return NextResponse.json({ 
      success: false,
      message: "Gagal mengambil data slider",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


