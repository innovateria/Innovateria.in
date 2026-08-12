import { NextResponse } from 'next/server';
import { getFAQsCMS, addFAQCMS, updateFAQCMS, deleteFAQCMS, FAQItemCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreFaqs = await fetchFirestoreCollection<FAQItemCMS>('faqs');
    if (firestoreFaqs && firestoreFaqs.length > 0) {
      return NextResponse.json({ success: true, faqs: firestoreFaqs });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, faqs: getFAQsCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFaq = addFAQCMS(body);

    // Save to Firestore
    try {
      await saveFirestoreDoc('faqs', newFaq.id, newFaq);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

    return NextResponse.json({ success: true, faq: newFaq });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add FAQ' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });

    const updated = updateFAQCMS(id, updates);
    if (!updated) return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });

    // Update in Firestore
    try {
      await saveFirestoreDoc('faqs', id, updated);
    } catch (dbErr) {
      console.warn('Firestore update notice:', dbErr);
    }

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

    const deleted = deleteFAQCMS(id);

    // Delete in Firestore
    try {
      await deleteFirestoreDocument('faqs', id);
    } catch (dbErr) {
      console.warn('Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
