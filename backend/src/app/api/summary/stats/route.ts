import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // === Total Users ===
    const totalUsers = await prisma.user.count();
    const usersLastMonth = await prisma.user.count({
      where: { createdAt: { lt: firstDayOfCurrentMonth } },
    });
    const userChange = getChange(totalUsers, usersLastMonth);

    // === Total Projects ===
    const totalProjects = await prisma.project.count();
    const projectsLastMonth = await prisma.project.count({
      where: { createdAt: { lt: firstDayOfCurrentMonth } },
    });
    const projectChange = getChange(totalProjects, projectsLastMonth);

    // === Total Services ===
    const totalServices = await prisma.service.count();
    const servicesLastMonth = await prisma.service.count({
      where: { createdAt: { lt: firstDayOfCurrentMonth } },
    });
    const serviceChange = getChange(totalServices, servicesLastMonth);

    // === Total Galleries ===
    const totalGalleries = await prisma.gallery.count();
    const galleriesLastMonth = await prisma.gallery.count({
      where: { createdAt: { lt: firstDayOfCurrentMonth } },
    });
    const galleryChange = getChange(totalGalleries, galleriesLastMonth);

    const summary = [
      {
        title: 'Total Users',
        value: totalUsers.toLocaleString('en-US'),
        change: userChange.change,
        changeType: userChange.changeType,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>',
      },
      {
        title: 'Total Projects',
        value: totalProjects.toLocaleString('en-US'),
        change: projectChange.change,
        changeType: projectChange.changeType,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.105 0-2 .895-2 2v6h4v-6c0-1.105-.895-2-2-2z" /></svg>',
      },
      {
        title: 'Total Services',
        value: totalServices.toLocaleString('en-US'),
        change: serviceChange.change,
        changeType: serviceChange.changeType,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>',
      },
      {
        title: 'Total Galleries',
        value: totalGalleries.toLocaleString('en-US'),
        change: galleryChange.change,
        changeType: galleryChange.changeType,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        icon: '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4 4 4M20 8l-4 4-4-4" /></svg>',
      },
    ];

    return NextResponse.json({ success: true, data: summary }, { status: 200 });
  } catch (error) {
    console.error('[SUMMARY_STATS_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Failed to get summary stats' }, { status: 500 });
  }
}

// Helper untuk menghitung perubahan persentase
function getChange(current: number, previous: number) {
  if (previous === 0 && current > 0) {
    return { change: '+100% from last month', changeType: 'positive' as const };
  }
  if (previous === 0 && current === 0) {
    return { change: '0%', changeType: 'neutral' as const };
  }
  const percent = ((current - previous) / previous) * 100;
  return {
    change: `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}% from last month`,
    changeType:
      percent > 0 ? 'positive' : percent < 0 ? 'negative' : 'neutral',
  };
}
