import { NextResponse } from 'next/server';
import { getSettingsCMS, updateSettingsCMS, AgencySettingsCMS } from '@/lib/crm-store';
import { fetchFirestoreDoc, saveFirestoreDoc } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreSettings = await fetchFirestoreDoc<AgencySettingsCMS>('settings', 'agency_settings');
    if (firestoreSettings) {
      return NextResponse.json({ success: true, settings: firestoreSettings });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, settings: getSettingsCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = updateSettingsCMS(body);

    // Save to Firestore
    try {
      await saveFirestoreDoc('settings', 'agency_settings', updated);
    } catch (dbErr) {
      console.warn('Firestore settings write notice:', dbErr);
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
