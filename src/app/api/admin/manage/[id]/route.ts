import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin-db';
import bcrypt from 'bcryptjs';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { username, password, currentPassword } = await request.json();
    const params = await context.params;
    
    if (!username) {
      return NextResponse.json(
        { message: 'Username wajib diisi!' },
        { status: 400 }
      );
    }

    // Get current admin
    const currentAdmin = await db.admin.findUnique({
      where: { id: params.id }
    });

    if (!currentAdmin) {
      return NextResponse.json(
        { message: 'Admin tidak ditemukan!' },
        { status: 404 }
      );
    }

    // Check if new username already exists (excluding current admin)
    if (username !== currentAdmin.username) {
      const existingAdmin = await db.admin.findUnique({
        where: { username }
      });

      if (existingAdmin) {
        return NextResponse.json(
          { message: 'Username sudah digunakan!' },
          { status: 400 }
        );
      }
    }

    let updateData: any = {
      username,
    };

    // If password is provided, verify current password and update
    if (password) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Password lama wajib diisi untuk mengubah password!' },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(currentPassword, currentAdmin.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json(
          { message: 'Password lama salah!' },
          { status: 400 }
        );
      }

      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await db.admin.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      message: 'Admin berhasil diperbarui!',
      admin: updatedAdmin
    });

  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui admin' },
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
    
    // Check if this is the last admin
    const adminCount = await db.admin.count();
    if (adminCount <= 1) {
      return NextResponse.json(
        { message: 'Tidak dapat menghapus admin terakhir!' },
        { status: 400 }
      );
    }

    await db.admin.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: 'Admin berhasil dihapus!'
    });

  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menghapus admin' },
      { status: 500 }
    );
  }
}