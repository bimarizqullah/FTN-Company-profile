import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
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

    const { backupType, tables, includeData, includeSchema, description } = await req.json();

    // Validate backup type
    const validBackupTypes = ["full", "partial", "selective"];
    if (!validBackupTypes.includes(backupType)) {
      return NextResponse.json({ message: "Invalid backup type" }, { status: 400 });
    }

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFilename = `backup_${backupType}_${timestamp}.sql`;
    const backupPath = path.join(process.cwd(), "backups", backupFilename);

    // Ensure backups directory exists
    const backupsDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    let backupCommand = "";

    // Parse DATABASE_URL to get connection details
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ message: "DATABASE_URL is not configured" }, { status: 500 });
    }

    // Parse MySQL connection string: mysql://user:password@host:port/database
    const url = new URL(databaseUrl);
    const dbUser = url.username;
    const dbPassword = url.password;
    const dbHost = url.hostname;
    const dbPort = url.port || '3306';
    const dbName = url.pathname.substring(1); // Remove leading slash

    console.log('Database connection details:', {
      host: dbHost,
      port: dbPort,
      user: dbUser,
      database: dbName,
      password: dbPassword ? '***SET***' : 'NOT SET'
    });

    // Build backup command based on type (MySQL)
    let baseCommand = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword}`;
    
    // Add options based on user preferences
    if (includeSchema && !includeData) {
      baseCommand += " --no-data";
    } else if (!includeSchema && includeData) {
      baseCommand += " --no-create-info";
    }

    // Add additional options for better compatibility
    baseCommand += " --single-transaction --routines --triggers";

    switch (backupType) {
      case "full":
        backupCommand = `${baseCommand} ${dbName} > "${backupPath}"`;
        break;
      
      case "partial":
        const partialTables = tables && tables.length > 0 ? tables.join(" ") : "User Role Permission";
        backupCommand = `${baseCommand} ${dbName} ${partialTables} > "${backupPath}"`;
        break;
      
      case "selective":
        if (!tables || tables.length === 0) {
          return NextResponse.json({ message: "Tables must be specified for selective backup" }, { status: 400 });
        }
        const selectiveTables = tables.join(" ");
        backupCommand = `${baseCommand} ${dbName} ${selectiveTables} > "${backupPath}"`;
        break;
    }

    console.log("Backup command:", backupCommand.replace(dbPassword, "***"));

    // Execute backup command with better error handling
    try {
      const { stdout, stderr } = await execAsync(backupCommand);
      
      if (stderr && !stderr.includes("Warning")) {
        console.error("Backup stderr:", stderr);
        throw new Error(`Backup command failed: ${stderr}`);
      }
      
      console.log("Backup stdout:", stdout);
    } catch (error) {
      console.error("Backup execution error:", error);
      
      // Save failed backup record
      await prisma.backup.create({
        data: {
          filename: backupFilename,
          backupType,
          tables: tables || [],
          includeData: includeData !== false,
          includeSchema: includeSchema !== false,
          description: description || "",
          fileSize: 0,
          status: "failed",
          createdBy: decoded.id,
        },
      });
      
      throw error;
    }

    // Get file size
    const stats = fs.statSync(backupPath);
    const fileSize = stats.size;

    // Save backup record to database
    const backupRecord = await prisma.backup.create({
      data: {
        filename: backupFilename,
        backupType,
        tables: tables || [],
        includeData: includeData !== false,
        includeSchema: includeSchema !== false,
        description: description || "",
        fileSize,
        status: "completed",
        createdBy: decoded.id,
      },
    });

    return NextResponse.json({
      message: "Backup created successfully",
      backup: {
        id: backupRecord.id,
        filename: backupFilename,
        backupType,
        fileSize,
        createdAt: backupRecord.createdAt,
      },
    });

  } catch (error) {
    console.error("Backup creation error:", error);
    return NextResponse.json(
      { message: "Failed to create backup" },
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
    const backupType = searchParams.get("backupType");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (backupType) {
      where.backupType = backupType;
    }

    const [backups, total] = await Promise.all([
      prisma.backup.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          createdByUser: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.backup.count({ where }),
    ]);

    return NextResponse.json({
      backups,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching backups:", error);
    return NextResponse.json(
      { message: "Failed to fetch backups" },
      { status: 500 }
    );
  }
}
