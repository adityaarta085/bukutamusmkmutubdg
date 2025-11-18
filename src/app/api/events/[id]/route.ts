import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin-db';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { title, description, isActive } = await request.json();
    const params = await context.params;
    
    if (!title || !title.trim()) {
      return NextResponse.json(
        { message: 'Judul event wajib diisi!' },
        { status: 400 }
      );
    }

    const event = await db.event.update({
      where: {
        id: params.id
      },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json({
      message: 'Event berhasil diperbarui!',
      event
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    await db.event.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      message: 'Event berhasil dihapus!'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menghapus event' },
      { status: 500 }
    );
  }
}