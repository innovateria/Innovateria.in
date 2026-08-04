import { NextResponse } from 'next/server';
import { getFeaturesCMS, addFeatureCMS, updateFeatureCMS, deleteFeatureCMS } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, features: getFeaturesCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFeat = addFeatureCMS(body);
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
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete feature' }, { status: 500 });
  }
}
