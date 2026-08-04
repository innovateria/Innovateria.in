import { NextResponse } from 'next/server';
import { getLeads, addLead, updateLead, deleteLead } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, leads: getLeads() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLead = addLead(body);
    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });
    
    const updated = updateLead(id, updates);
    if (!updated) return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });

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

    const deleted = deleteLead(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
  }
}
