import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    const guest = await db.guest.findUnique({
      where: {
        id: params.id
      }
    });

    if (!guest) {
      return NextResponse.json(
        { message: 'Data tamu tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Error fetching guest:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    
    const guest = await db.guest.update({
      where: {
        id: params.id
      },
      data: {
        fullName: body.fullName,
        visitDate: new Date(body.visitDate),
        institution: body.institution,
        purpose: body.purpose,
        message: body.message,
      }
    });

    return NextResponse.json({
      message: 'Data berhasil diperbarui!',
      guest
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui data' },
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
    
    await db.guest.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      message: 'Data berhasil dihapus!'
    });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menghapus data' },
      { status: 500 }
    );
  }
}