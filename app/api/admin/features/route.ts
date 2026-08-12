import { NextResponse } from 'next/server';
import { getFeaturesCMS, addFeatureCMS, updateFeatureCMS, deleteFeatureCMS, FeatureCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreFeatures = await fetchFirestoreCollection<FeatureCMS>('features');
    if (firestoreFeatures && firestoreFeatures.length > 0) {
      return NextResponse.json({ success: true, features: firestoreFeatures });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, features: getFeaturesCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFeat = addFeatureCMS(body);

    // Save to Firestore
    try {
      await saveFirestoreDoc('features', newFeat.id, newFeat);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

    return NextResponse.json({ success: true, feature: newFeat });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create feature' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Feature ID required' }, { status: 400 });

    const updated = updateFeatureCMS(id, updates);
    if (!updated) return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });

    // Update in Firestore
    try {
      await saveFirestoreDoc('features', id, updated);
    } catch (dbErr) {
      console.warn('Firestore update notice:', dbErr);
    }

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

    const deleted = deleteFeatureCMS(id);

    // Delete in Firestore
    try {
      await deleteFirestoreDocument('features', id);
    } catch (dbErr) {
      console.warn('Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete feature' }, { status: 500 });
  }
}
