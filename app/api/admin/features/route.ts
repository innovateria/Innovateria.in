import { NextResponse } from 'next/server';
import { FeatureCMS } from '@/lib/crm-store';
import { getFirestoreFeatures, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const features = await getFirestoreFeatures();
    return NextResponse.json({ success: true, features });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `feat-${Date.now()}`;
    const newFeat: FeatureCMS = {
      ...body,
      id,
      bullets: Array.isArray(body.bullets) ? body.bullets : []
    };

    await saveFirestoreDoc('features', id, newFeat);
    return NextResponse.json({ success: true, feature: newFeat });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create feature' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Feature ID required' }, { status: 400 });

    const updated = await saveFirestoreDoc('features', id, updates);
    return NextResponse.json({ success: true, feature: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Feature ID required' }, { status: 400 });

    const deleted = await deleteFirestoreDocument('features', id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete feature' }, { status: 500 });
  }
}
