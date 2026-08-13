import { NextResponse } from 'next/server';
import { ServiceCMS } from '@/lib/crm-store';
import { getFirestoreServices, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const services = await getFirestoreServices();
    return NextResponse.json({ success: true, services });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `srv-${Date.now()}`;
    const newSrv: ServiceCMS = {
      ...body,
      id,
      status: body.status || 'active',
      features: Array.isArray(body.features) ? body.features : []
    };

    await saveFirestoreDoc('services', id, newSrv);
    return NextResponse.json({ success: true, service: newSrv });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Service ID required' }, { status: 400 });

    const updated = await saveFirestoreDoc('services', id, updates);
    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Service ID required' }, { status: 400 });

    const deleted = await deleteFirestoreDocument('services', id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
