import { NextResponse } from 'next/server';
import { crmStore, syncFromDisk } from '@/lib/crm-store';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('crm_admin_token');

    if (!token || !token.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), 'data', 'cms-data.json');
    let cmsData: any = {};

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      cmsData = JSON.parse(raw);
    } else {
      syncFromDisk();
      cmsData = crmStore;
    }

    return NextResponse.json({
      success: true,
      cmsData
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to read CMS data' }, { status: 500 });
  }
}
