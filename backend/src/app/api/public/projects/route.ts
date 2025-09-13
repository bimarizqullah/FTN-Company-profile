import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get all projects for public frontend
    const projects = await prisma.project.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        imagePath: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Public Projects GET error:', error);
    return NextResponse.json({ 
      success: false,
      message: "Gagal mengambil data projects",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
