import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get all table names from Prisma schema
    const tables = [
      { name: "User", description: "User accounts and profiles" },
      { name: "Role", description: "User roles and permissions" },
      { name: "Permission", description: "System permissions" },
      { name: "UserRole", description: "User role assignments" },
      { name: "RolePermission", description: "Role permission assignments" },
      { name: "Slider", description: "Homepage sliders" },
      { name: "Gallery", description: "Image gallery" },
      { name: "Service", description: "Company services" },
      { name: "Project", description: "Company projects" },
      { name: "Management", description: "Management team" },
      { name: "Language", description: "Language settings" },
      { name: "Office", description: "Office locations" },
      { name: "Contact", description: "Contact information" },
      { name: "Message", description: "Contact form messages" },
      { name: "Backup", description: "Backup records" },
      { name: "CacheLog", description: "Cache clearing logs" },
      { name: "RestoreLog", description: "Backup restore logs" },
    ];

    return NextResponse.json({
      tables,
      total: tables.length,
    });

  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { message: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}

