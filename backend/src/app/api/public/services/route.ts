import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get all services for public frontend
    const services = await prisma.service.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        imagePath: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Public Services GET error:', error);
    return NextResponse.json({ 
      success: false,
      message: "Gagal mengambil data services",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


