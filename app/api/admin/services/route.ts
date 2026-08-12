import { NextResponse } from 'next/server';
import { getServicesCMS, addServiceCMS, updateServiceCMS, deleteServiceCMS, ServiceCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreServices = await fetchFirestoreCollection<ServiceCMS>('services');
    if (firestoreServices && firestoreServices.length > 0) {
      return NextResponse.json({ success: true, services: firestoreServices });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, services: getServicesCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSrv = addServiceCMS(body);
    
    // Save directly to Firestore
    try {
      await saveFirestoreDoc('services', newSrv.id, newSrv);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

    return NextResponse.json({ success: true, service: newSrv });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Service ID required' }, { status: 400 });

    const updated = updateServiceCMS(id, updates);
    if (!updated) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });

    // Update directly in Firestore
    try {
      await saveFirestoreDoc('services', id, updated);
    } catch (dbErr) {
      console.warn('Firestore update notice:', dbErr);
    }

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

    const deleted = deleteServiceCMS(id);
    
    // Delete directly in Firestore
    try {
      await deleteFirestoreDocument('services', id);
    } catch (dbErr) {
      console.warn('Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
