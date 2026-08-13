import { NextResponse } from 'next/server';
import { FAQItemCMS } from '@/lib/crm-store';
import { getFirestoreFAQs, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const faqs = await getFirestoreFAQs();
    return NextResponse.json({ success: true, faqs });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `faq-${Date.now()}`;
    const newFaq: FAQItemCMS = {
      ...body,
      id,
      category: body.category || 'General'
    };

    await saveFirestoreDoc('faqs', id, newFaq);
    return NextResponse.json({ success: true, faq: newFaq });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add FAQ' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });

    const updated = await saveFirestoreDoc('faqs', id, updates);
    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });

    const deleted = await deleteFirestoreDocument('faqs', id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
