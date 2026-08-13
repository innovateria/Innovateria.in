import { NextResponse } from 'next/server';
import { PortfolioItemCMS } from '@/lib/crm-store';
import { getFirestorePortfolio, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const portfolio = await getFirestorePortfolio();
    return NextResponse.json({ success: true, portfolio });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `port-${Date.now()}`;
    const newItem: PortfolioItemCMS = {
      ...body,
      id
    };

    await saveFirestoreDoc('portfolio', id, newItem);
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create portfolio item' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Portfolio ID required' }, { status: 400 });

    const updated = await saveFirestoreDoc('portfolio', id, updates);
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

    const deleted = await deleteFirestoreDocument('portfolio', id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete portfolio item' }, { status: 500 });
  }
}
