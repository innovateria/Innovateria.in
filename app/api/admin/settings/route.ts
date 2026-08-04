import { NextResponse } from 'next/server';
import { getSettingsCMS, updateSettingsCMS } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, settings: getSettingsCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = updateSettingsCMS(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
