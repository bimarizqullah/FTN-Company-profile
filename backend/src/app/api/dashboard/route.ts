// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const authCheck = await authMiddleware(req);
  if (authCheck) return authCheck;

  const user: any = (req as any).user;

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: true },
  });

  // Misal: Hitung total user dan total project
  const totalUsers = await prisma.user.count();
  const totalProjects = await prisma.project.count();

  return NextResponse.json({
    message: 'Dashboard data',
    user: currentUser,
    stats: {
      totalUsers,
      totalProjects,
    },
  });
}
