import { NextResponse } from 'next/server';
import { getPortfolioCMS, addPortfolioCMS, updatePortfolioCMS, deletePortfolioCMS } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, portfolio: getPortfolioCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = addPortfolioCMS(body);
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create portfolio item' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Portfolio ID required' }, { status: 400 });

    const updated = updatePortfolioCMS(id, updates);
    if (!updated) return NextResponse.json({ success: false, error: 'Portfolio item not found' }, { status: 404 });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update portfolio item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Portfolio ID required' }, { status: 400 });

    const deleted = deletePortfolioCMS(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete portfolio item' }, { status: 500 });
  }
}
