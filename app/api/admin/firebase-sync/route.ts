import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/crm-store';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('crm_admin_token');

    if (!token || !token.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      cmsData: crmStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to read CMS data' }, { status: 500 });
  }
}
