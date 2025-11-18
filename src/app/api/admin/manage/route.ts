import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin-db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const admins = await db.admin.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil data admin' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username dan password wajib diisi!' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingAdmin = await db.admin.findUnique({
      where: { username }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Username sudah digunakan!' },
        { status: 400 }
      );
    }

    // Check maximum admin limit (2)
    const adminCount = await db.admin.count();
    if (adminCount >= 2) {
      return NextResponse.json(
        { message: 'Maksimal jumlah admin adalah 2!' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await db.admin.create({
      data: {
        username,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      message: 'Admin berhasil dibuat!',
      admin
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat membuat admin' },
      { status: 500 }
    );
  }
}