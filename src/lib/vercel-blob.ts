import { put, del } from '@vercel/blob';

export async function uploadToVercelBlob(
  file: File | Buffer,
  filename: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  try {
    const blob = await put(filename, file, {
      access: 'public',
      contentType,
    });
    return blob.url;
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw error;
  }
}

export async function deleteFromVercelBlob(url: string): Promise<void> {
  try {
    // Extract filename from URL
    const filename = url.split('/').pop();
    if (filename) {
      await del(filename);
    }
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    throw error;
  }
}