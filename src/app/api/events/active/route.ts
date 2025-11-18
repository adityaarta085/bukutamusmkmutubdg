import { NextResponse } from 'next/server';
import { db } from '@/lib/admin-db';

export async function GET() {
  try {
    const events = await db.event.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching active events:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil data events' },
      { status: 500 }
    );
  }
}