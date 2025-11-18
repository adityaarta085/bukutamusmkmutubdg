import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin-db';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username dan password wajib diisi!' },
        { status: 400 }
      );
    }

    // Find admin in database
    const admin = await db.admin.findUnique({
      where: {
        username: username
      }
    });

    if (!admin) {
      return NextResponse.json(
        { message: 'Username atau password salah!' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Username atau password salah!' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = sign(
      { 
        id: admin.id, 
        username: admin.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response with token
    const response = NextResponse.json({
      message: 'Login berhasil!',
      admin: {
        id: admin.id,
        username: admin.username
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}