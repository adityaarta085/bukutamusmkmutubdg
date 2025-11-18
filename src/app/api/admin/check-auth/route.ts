import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { db } from '@/lib/admin-db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Tidak ada token' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { id: string; username: string };

    // Check if admin still exists
    const admin = await db.admin.findUnique({
      where: {
        id: decoded.id
      }
    });

    if (!admin) {
      return NextResponse.json(
        { message: 'Admin tidak ditemukan' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Authenticated',
      admin: {
        id: admin.id,
        username: admin.username
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Token tidak valid' },
      { status: 401 }
    );
  }
}