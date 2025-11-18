import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin-db';

export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil data events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, isActive } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { message: 'Judul event wajib diisi!' },
        { status: 400 }
      );
    }

    const event = await db.event.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      message: 'Event berhasil dibuat!',
      event
    });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat membuat event' },
      { status: 500 }
    );
  }
}