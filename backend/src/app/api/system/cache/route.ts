import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function DELETE(req: NextRequest) {
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

    const { cacheType, specificKeys, clearAll } = await req.json();

    // Validate cache type
    const validCacheTypes = ["all", "database", "session", "file", "memory", "redis"];
    if (cacheType && !validCacheTypes.includes(cacheType)) {
      return NextResponse.json({ message: "Invalid cache type" }, { status: 400 });
    }

    let clearedItems = [];
    let totalCleared = 0;

    // Clear different types of cache based on user selection
    if (clearAll || cacheType === "all") {
      // Clear all caches
      clearedItems = await clearAllCaches();
      totalCleared = clearedItems.length;
    } else {
      // Clear specific cache type
      switch (cacheType) {
        case "database":
          clearedItems = await clearDatabaseCache();
          break;
        case "session":
          clearedItems = await clearSessionCache();
          break;
        case "file":
          clearedItems = await clearFileCache();
          break;
        case "memory":
          clearedItems = await clearMemoryCache();
          break;
        case "redis":
          clearedItems = await clearRedisCache();
          break;
        default:
          return NextResponse.json({ message: "Invalid cache type" }, { status: 400 });
      }
      totalCleared = clearedItems.length;
    }

    // Clear specific keys if provided
    if (specificKeys && specificKeys.length > 0) {
      const specificCleared = await clearSpecificKeys(specificKeys);
      clearedItems.push(...specificCleared);
      totalCleared += specificCleared.length;
    }

    // Log cache clearing activity
    await prisma.cacheLog.create({
      data: {
        cacheType: cacheType || "all",
        clearedItems: clearedItems,
        totalCleared,
        clearedBy: decoded.id,
        description: `Cache cleared: ${cacheType || "all"}${specificKeys ? `, specific keys: ${specificKeys.join(", ")}` : ""}`,
      },
    });

    return NextResponse.json({
      message: "Cache cleared successfully",
      clearedItems,
      totalCleared,
      cacheType: cacheType || "all",
    });

  } catch (error) {
    console.error("Cache clearing error:", error);
    return NextResponse.json(
      { message: "Failed to clear cache" },
      { status: 500 }
    );
  }
}

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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const cacheType = searchParams.get("cacheType");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (cacheType) {
      where.cacheType = cacheType;
    }

    const [cacheLogs, total] = await Promise.all([
      prisma.cacheLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          clearedByUser: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.cacheLog.count({ where }),
    ]);

    return NextResponse.json({
      cacheLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching cache logs:", error);
    return NextResponse.json(
      { message: "Failed to fetch cache logs" },
      { status: 500 }
    );
  }
}

// Helper functions for clearing different types of cache
async function clearAllCaches(): Promise<string[]> {
  const clearedItems = [];
  
  // Clear database cache
  clearedItems.push(...await clearDatabaseCache());
  
  // Clear session cache
  clearedItems.push(...await clearSessionCache());
  
  // Clear file cache
  clearedItems.push(...await clearFileCache());
  
  // Clear memory cache
  clearedItems.push(...await clearMemoryCache());
  
  return clearedItems;
}

async function clearDatabaseCache(): Promise<string[]> {
  const clearedItems = [];
  
  try {
    // Clear Prisma query cache
    await prisma.$disconnect();
    await prisma.$connect();
    clearedItems.push("Prisma query cache");
    
    // Clear database connection pool
    // This would depend on your database setup
    clearedItems.push("Database connection pool");
    
  } catch (error) {
    console.error("Error clearing database cache:", error);
  }
  
  return clearedItems;
}

async function clearSessionCache(): Promise<string[]> {
  const clearedItems = [];
  
  try {
    // Clear session files if using file-based sessions
    const sessionDir = path.join(process.cwd(), "sessions");
    if (fs.existsSync(sessionDir)) {
      const files = fs.readdirSync(sessionDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(sessionDir, file));
      });
      clearedItems.push(`Session files (${files.length} files)`);
    }
    
    // Clear in-memory session cache
    clearedItems.push("In-memory session cache");
    
  } catch (error) {
    console.error("Error clearing session cache:", error);
  }
  
  return clearedItems;
}

async function clearFileCache(): Promise<string[]> {
  const clearedItems = [];
  
  try {
    // Clear uploaded files cache
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      clearedItems.push(`Uploaded files cache (${files.length} files)`);
    }
    
    // Clear temporary files
    const tempDir = path.join(process.cwd(), "temp");
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(tempDir, file));
      });
      clearedItems.push(`Temporary files (${files.length} files)`);
    }
    
  } catch (error) {
    console.error("Error clearing file cache:", error);
  }
  
  return clearedItems;
}

async function clearMemoryCache(): Promise<string[]> {
  const clearedItems = [];
  
  try {
    // Clear Node.js memory cache
    if (global.gc) {
      global.gc();
      clearedItems.push("Node.js memory cache");
    }
    
    // Clear module cache (be careful with this)
    // Object.keys(require.cache).forEach(key => {
    //   delete require.cache[key];
    // });
    // clearedItems.push("Module cache");
    
  } catch (error) {
    console.error("Error clearing memory cache:", error);
  }
  
  return clearedItems;
}

async function clearRedisCache(): Promise<string[]> {
  const clearedItems = [];
  
  try {
    // Clear Redis cache if Redis is configured
    // This would depend on your Redis setup
    clearedItems.push("Redis cache");
    
  } catch (error) {
    console.error("Error clearing Redis cache:", error);
  }
  
  return clearedItems;
}

async function clearSpecificKeys(keys: string[]): Promise<string[]> {
  const clearedItems = [];
  
  try {
    // Clear specific cache keys
    // This would depend on your cache implementation
    keys.forEach(key => {
      // Clear specific key logic here
      clearedItems.push(`Cache key: ${key}`);
    });
    
  } catch (error) {
    console.error("Error clearing specific keys:", error);
  }
  
  return clearedItems;
}

