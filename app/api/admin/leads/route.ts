import { NextResponse } from 'next/server';
import { Lead } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const leads = await fetchFirestoreCollection<Lead>('leads');
    return NextResponse.json({ success: true, leads });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `lead-${Date.now()}`;
    const newLead: Lead = {
      ...body,
      id,
      status: body.status || 'new',
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveFirestoreDoc('leads', id, newLead);
    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });

    const updated = await saveFirestoreDoc('leads', id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });

    const deleted = await deleteFirestoreDocument('leads', id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
  }
}
