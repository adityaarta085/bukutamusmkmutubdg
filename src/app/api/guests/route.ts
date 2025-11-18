import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadToVercelBlob } from '@/lib/vercel-blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const fullName = formData.get('fullName') as string;
    const visitDate = formData.get('visitDate') as string;
    const isAutoDate = formData.get('isAutoDate') === 'true';
    const institution = formData.get('institution') as string;
    const purpose = formData.get('purpose') as string;
    const message = formData.get('message') as string;
    const photo = formData.get('photo') as File;
    const signatureData = formData.get('signatureData') as string;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { message: 'Nama lengkap wajib diisi!' },
        { status: 400 }
      );
    }

    let photoPath: string | null = null;
    let signaturePath: string | null = null;
    
    // Handle photo upload
    if (photo) {
      try {
        const timestamp = Date.now();
        const filename = `guest_${timestamp}_${photo.name}`;
        photoPath = await uploadToVercelBlob(photo, filename, photo.type);
      } catch (error) {
        console.error('Error uploading photo:', error);
        // Continue without photo if upload fails
      }
    }

    // Handle signature upload
    if (signatureData) {
      try {
        const base64Data = signatureData.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        const timestamp = Date.now();
        const signatureFilename = `signature_${timestamp}.png`;
        signaturePath = await uploadToVercelBlob(buffer, signatureFilename, 'image/png');
      } catch (error) {
        console.error('Error uploading signature:', error);
        // Continue without signature if upload fails
      }
    }

    // Save to database
    const guest = await db.guest.create({
      data: {
        fullName: fullName.trim(),
        visitDate: new Date(visitDate),
        isAutoDate: isAutoDate,
        institution: institution?.trim() || null,
        purpose: purpose?.trim() || null,
        message: message?.trim() || null,
        photoPath: photoPath,
        signaturePath: signaturePath,
      },
    });

    return NextResponse.json(
      { 
        message: 'Data berhasil disimpan!',
        guest: {
          id: guest.id,
          fullName: guest.fullName,
          visitDate: guest.visitDate,
          hasSignature: !!signaturePath,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error saving guest data:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menyimpan data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const guests = await db.guest.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}