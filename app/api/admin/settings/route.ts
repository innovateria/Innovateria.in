import { NextResponse } from 'next/server';
import { getFirestoreSettings, saveFirestoreDoc } from '@/lib/firestore-db';

export async function GET() {
  try {
    const settings = await getFirestoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveFirestoreDoc('settings', 'agency', body);
    await saveFirestoreDoc('settings', 'agency_settings', body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
