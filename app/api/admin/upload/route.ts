import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save directory
    const uploadsDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Clean file extension and sanitize name
    const ext = path.extname(file.name) || '.png';
    const cleanFileName = `project-${Date.now()}${ext.toLowerCase()}`;
    const filePath = path.join(uploadsDir, cleanFileName);

    // Write file to public/assets/uploads
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/assets/uploads/${cleanFileName}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Error uploading file:', err);
    return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
  }
}
