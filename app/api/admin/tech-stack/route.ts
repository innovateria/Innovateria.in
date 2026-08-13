import { NextResponse } from 'next/server';
import { TechStackCMS } from '@/lib/crm-store';
import { getFirestoreTechStack, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const techStack = await getFirestoreTechStack();
    return NextResponse.json({ success: true, techStack });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, message: 'Name and Category are required' }, { status: 400 });
    }

    const id = body.id || `tech-${Date.now()}`;
    const newTech: TechStackCMS = {
      id,
      name: body.name,
      category: body.category,
      image: body.image || '/assets/img/teckstack/react.svg',
      description: body.description || '',
      status: body.status || 'active'
    };

    await saveFirestoreDoc('techStack', id, newTech);
    return NextResponse.json({ success: true, tech: newTech });
  } catch (err) {
    console.error('Error creating tech stack item:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const updated = await saveFirestoreDoc('techStack', id, updates);
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

    const deleted = await deleteFirestoreDocument('techStack', id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error('Error deleting tech stack item:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
