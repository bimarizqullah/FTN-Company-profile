import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

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

    // Get system information
    const systemInfo = await getSystemInformation();

    return NextResponse.json({
      systemInfo,
    });

  } catch (error) {
    console.error("Error fetching system info:", error);
    return NextResponse.json(
      { message: "Failed to fetch system information" },
      { status: 500 }
    );
  }
}

async function getSystemInformation() {
  try {
    // Get database statistics
    const [
      totalUsers,
      totalMessages,
      totalBackups,
      lastBackup,
      totalCacheLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.message.count(),
      prisma.backup.count(),
      prisma.backup.findFirst({
        orderBy: { createdAt: "desc" },
        select: { createdAt: true, filename: true },
      }),
      prisma.cacheLog.count(),
    ]);

    // Get storage information
    const storageInfo = await getStorageInfo();

    // Get server uptime
    const uptime = await getServerUptime();

    // Get database version
    const dbVersion = await getDatabaseVersion();

    return {
      application: {
        version: "1.0.0",
        name: "Fiber Teknologi Nusantara",
        environment: process.env.NODE_ENV || "development",
      },
      database: {
        version: dbVersion,
        totalUsers,
        totalMessages,
        totalBackups,
        lastBackup: lastBackup ? {
          filename: lastBackup.filename,
          createdAt: lastBackup.createdAt,
        } : null,
      },
      system: {
        uptime,
        totalCacheLogs,
        storage: storageInfo,
      },
    };

  } catch (error) {
    console.error("Error getting system information:", error);
    return {
      application: {
        version: "1.0.0",
        name: "Fiber Teknologi Nusantara",
        environment: process.env.NODE_ENV || "development",
      },
      database: {
        version: "MySQL (Unknown)",
        totalUsers: 0,
        totalMessages: 0,
        totalBackups: 0,
        lastBackup: null,
      },
      system: {
        uptime: "Unknown",
        totalCacheLogs: 0,
        storage: {
          used: "0 GB",
          available: "0 GB",
          total: "0 GB",
        },
      },
    };
  }
}

async function getStorageInfo() {
  try {
    // Get disk usage information
    const { stdout } = await execAsync("df -h /");
    const lines = stdout.trim().split("\n");
    const dataLine = lines[1];
    const parts = dataLine.split(/\s+/);
    
    return {
      used: parts[2],
      available: parts[3],
      total: parts[1],
    };
  } catch (error) {
    console.error("Error getting storage info:", error);
    return {
      used: "Unknown",
      available: "Unknown",
      total: "Unknown",
    };
  }
}

async function getServerUptime() {
  try {
    const { stdout } = await execAsync("uptime -p");
    return stdout.trim();
  } catch (error) {
    try {
      const { stdout } = await execAsync("uptime");
      return stdout.trim();
    } catch (error2) {
      return "Unknown";
    }
  }
}

async function getDatabaseVersion() {
  try {
    const result = await prisma.$queryRaw`SELECT VERSION() as version`;
    return result[0]?.version || "MySQL (Unknown)";
  } catch (error) {
    return "MySQL (Unknown)";
  }
}

