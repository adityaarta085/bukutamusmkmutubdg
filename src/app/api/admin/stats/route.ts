import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin-db';

export async function GET(request: NextRequest) {
  try {
    const totalGuests = await db.guest.count();

    const guestsByDate = await db.guest.findMany({
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by date
    const groupedByDate = guestsByDate.reduce((acc: any, guest) => {
      const date = guest.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format
    const dateStats = Object.entries(groupedByDate).map(([date, count]) => ({
      date,
      count: count as number
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Get recent guests (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentGuests = await db.guest.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // Get today's guests
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayGuests = await db.guest.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });

    return NextResponse.json({
      totalGuests,
      todayGuests,
      recentGuests,
      dateStats
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil statistik' },
      { status: 500 }
    );
  }
}