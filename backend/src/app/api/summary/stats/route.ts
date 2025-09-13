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

    // === Total Messages ===
    const totalMessages = await prisma.message.count();
    const messagesLastMonth = await prisma.message.count({
      where: { createdAt: { lt: firstDayOfCurrentMonth } },
    });
    const messageChange = getChange(totalMessages, messagesLastMonth);

    const summary = [
      {
        title: 'Total Users',
        value: totalUsers.toLocaleString('en-US'),
        change: userChange.change,
        changeType: userChange.changeType,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        iconType: 'users',
      },
      {
        title: 'Total Projects',
        value: totalProjects.toLocaleString('en-US'),
        change: projectChange.change,
        changeType: projectChange.changeType,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        iconType: 'folder',
      },
      {
        title: 'Total Services',
        value: totalServices.toLocaleString('en-US'),
        change: serviceChange.change,
        changeType: serviceChange.changeType,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        iconType: 'wrench-screwdriver',
      },
      {
        title: 'Total Galleries',
        value: totalGalleries.toLocaleString('en-US'),
        change: galleryChange.change,
        changeType: galleryChange.changeType,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        iconType: 'photo',
      },
      {
        title: 'Total Messages',
        value: totalMessages.toLocaleString('en-US'),
        change: messageChange.change,
        changeType: messageChange.changeType,
        bgColor: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        iconType: 'chat-bubble-left-right',
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
