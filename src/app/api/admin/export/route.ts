import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin-db';

export async function GET(request: NextRequest) {
  try {
    const guests = await db.guest.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Create CSV content
    const headers = [
      'ID',
      'Nama Lengkap',
      'Instansi',
      'Maksud dan Tujuan',
      'Kesan dan Pesan',
      'Tanggal Kunjungan',
      'Tanggal Dibuat'
    ];

    const csvRows = guests.map(guest => [
      guest.id,
      `"${guest.fullName}"`,
      `"${guest.institution || ''}"`,
      `"${guest.purpose || ''}"`,
      `"${guest.message || ''}"`,
      guest.visitDate.toISOString().split('T')[0] + ' ' + guest.visitDate.toTimeString().split(' ')[0],
      guest.createdAt.toISOString().split('T')[0] + ' ' + guest.createdAt.toTimeString().split(' ')[0]
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create response
    const response = new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="guests_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

    return response;

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat export data' },
      { status: 500 }
    );
  }
}