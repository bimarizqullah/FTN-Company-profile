import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Hitung total pengguna saat ini
    const totalUsers = await prisma.user.count();

    // Tentukan tanggal untuk bulan sebelumnya
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Hitung total pengguna yang dibuat sebelum bulan ini
    const totalUsersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          lt: firstDayOfCurrentMonth,
        },
      },
    });

    // Hitung perubahan persentase
    let change = '0%';
    let changeType: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (totalUsersLastMonth > 0) {
      const percentageChange = ((totalUsers - totalUsersLastMonth) / totalUsersLastMonth) * 100;
      change = `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}% from last month`;
      changeType = percentageChange > 0 ? 'positive' : percentageChange < 0 ? 'negative' : 'neutral';
    } else if (totalUsers > 0) {
      change = '+100% from last month';
      changeType = 'positive';
    }

    // Format total pengguna dengan pemisah ribuan
    const formattedTotalUsers = totalUsers.toLocaleString('en-US');

    // Respons sesuai dengan format widget
    const response = {
      title: 'Total Users',
      value: formattedTotalUsers,
      change,
      changeType,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error mengambil statistik pengguna:', error);
    return NextResponse.json({ message: 'Gagal mengambil statistik pengguna' }, { status: 500 });
  }
}