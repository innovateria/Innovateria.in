import { NextResponse } from 'next/server';
import { getTechStackCMS, addTechStackCMS, updateTechStackCMS, deleteTechStackCMS, TechStackCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreTech = await fetchFirestoreCollection<TechStackCMS>('techStack');
    if (firestoreTech && firestoreTech.length > 0) {
      return NextResponse.json({ success: true, techStack: firestoreTech });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, techStack: getTechStackCMS() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, message: 'Name and Category are required' }, { status: 400 });
    }

    const newTech = addTechStackCMS({
      name: body.name,
      category: body.category,
      image: body.image || '/assets/img/soft.png',
      description: body.description || '',
      status: body.status || 'active'
    });

    // Save to Firestore
    try {
      await saveFirestoreDoc('techStack', newTech.id, newTech);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

    return NextResponse.json({ success: true, tech: newTech });
  } catch (err) {
    console.error('Error creating tech stack item:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const updated = updateTechStackCMS(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Tech item not found' }, { status: 404 });
    }

    // Update in Firestore
    try {
      await saveFirestoreDoc('techStack', body.id, updated);
    } catch (dbErr) {
      console.warn('Firestore update notice:', dbErr);
    }

    return NextResponse.json({ success: true, tech: updated });
  } catch (err) {
    console.error('Error updating tech stack item:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    }

    const deleted = deleteTechStackCMS(id);

    // Delete in Firestore
    try {
      await deleteFirestoreDocument('techStack', id);
    } catch (dbErr) {
      console.warn('Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error('Error deleting tech stack item:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
