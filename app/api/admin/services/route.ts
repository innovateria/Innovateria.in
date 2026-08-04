import { NextResponse } from 'next/server';
import { getServicesCMS, addServiceCMS, updateServiceCMS, deleteServiceCMS } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, services: getServicesCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSrv = addServiceCMS(body);
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
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
