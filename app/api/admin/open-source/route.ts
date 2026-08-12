import { NextResponse } from 'next/server';
import { 
  getOpenSourceProjectsCMS, 
  addOpenSourceProjectCMS, 
  updateOpenSourceProjectCMS, 
  deleteOpenSourceProjectCMS,
  OpenSourceProjectCMS 
} from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreItems = await fetchFirestoreCollection<OpenSourceProjectCMS>('openSourceProjects');
    if (firestoreItems && firestoreItems.length > 0) {
      return NextResponse.json({ success: true, openSourceProjects: firestoreItems });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, openSourceProjects: getOpenSourceProjectsCMS() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = addOpenSourceProjectCMS({
      title: body.title || 'New Open Source Project',
      category: body.category || 'Mobile App',
      description: body.description || '',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []),
      githubUrl: body.githubUrl || 'https://github.com/Vnjvibhash',
      liveDemoUrl: body.liveDemoUrl || '',
      stars: Number(body.stars) || 0,
      forks: Number(body.forks) || 0,
      featured: Boolean(body.featured)
    });

    // Save to Firestore
    try {
      await saveFirestoreDoc('openSourceProjects', newItem.id, newItem);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to create open source project' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: 'Item ID required' }, { status: 400 });
    }
    const updated = updateOpenSourceProjectCMS(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    // Update in Firestore
    try {
      await saveFirestoreDoc('openSourceProjects', body.id, updated);
    } catch (dbErr) {
      console.warn('Firestore update notice:', dbErr);
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to update open source project' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Item ID required' }, { status: 400 });
    }
    const deleted = deleteOpenSourceProjectCMS(id);

    // Delete in Firestore
    try {
      await deleteFirestoreDocument('openSourceProjects', id);
    } catch (dbErr) {
      console.warn('Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to delete open source project' }, { status: 500 });
  }
}
