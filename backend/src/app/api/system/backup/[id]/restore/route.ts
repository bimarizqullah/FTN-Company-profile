import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const backupId = parseInt(params.id);
    if (isNaN(backupId)) {
      return NextResponse.json({ message: "Invalid backup ID" }, { status: 400 });
    }

    // Get backup record
    const backup = await prisma.backup.findUnique({
      where: { id: backupId },
    });

    if (!backup) {
      return NextResponse.json({ message: "Backup not found" }, { status: 404 });
    }

    // Check if backup file exists
    const backupPath = path.join(process.cwd(), "backups", backup.filename);
    if (!fs.existsSync(backupPath)) {
      return NextResponse.json({ message: "Backup file not found" }, { status: 404 });
    }

    // Create restore log
    const restoreLog = await prisma.restoreLog.create({
      data: {
        backupId,
        status: "in_progress",
        restoredBy: decoded.id,
        description: `Restoring backup: ${backup.filename}`,
      },
    });

    try {
      // Parse DATABASE_URL to get connection details
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error("DATABASE_URL is not configured");
      }

      // Parse MySQL connection string: mysql://user:password@host:port/database
      const url = new URL(databaseUrl);
      const dbUser = url.username;
      const dbPassword = url.password;
      const dbHost = url.hostname;
      const dbPort = url.port || '3306';
      const dbName = url.pathname.substring(1); // Remove leading slash

      // Execute restore command (MySQL)
      const restoreCommand = `mysql -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} ${dbName} < "${backupPath}"`;
      console.log("Restore command:", restoreCommand.replace(dbPassword, "***"));
      await execAsync(restoreCommand);

      // Update restore log
      await prisma.restoreLog.update({
        where: { id: restoreLog.id },
        data: {
          status: "completed",
          completedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: "Backup restored successfully",
        restoreLog: {
          id: restoreLog.id,
          backupId,
          status: "completed",
          restoredAt: new Date(),
        },
      });

    } catch (restoreError) {
      // Update restore log with error
      await prisma.restoreLog.update({
        where: { id: restoreLog.id },
        data: {
          status: "failed",
          errorMessage: restoreError instanceof Error ? restoreError.message : "Unknown error",
          completedAt: new Date(),
        },
      });

      throw restoreError;
    }

  } catch (error) {
    console.error("Backup restore error:", error);
    return NextResponse.json(
      { message: "Failed to restore backup" },
      { status: 500 }
    );
  }
}
