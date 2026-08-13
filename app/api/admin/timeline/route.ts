import { NextResponse } from 'next/server';
import { TimelineCMS } from '@/lib/crm-store';
import { getFirestoreTimeline, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const timeline = await getFirestoreTimeline();
    return NextResponse.json({ success: true, timeline });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.period) {
      return NextResponse.json({ success: false, message: 'Title and Period required' }, { status: 400 });
    }

    const id = body.id || `time-${Date.now()}`;
    const newMilestone: TimelineCMS = {
      id,
      period: body.period,
      title: body.title,
      company: body.company || '',
      institution: body.institution || '',
      location: body.location || 'India',
      type: body.type || 'experience',
      iconName: body.iconName || 'Briefcase',
      details: Array.isArray(body.details) ? body.details : []
    };

    await saveFirestoreDoc('timeline', id, newMilestone);
    return NextResponse.json({ success: true, milestone: newMilestone });
  } catch (err) {
    console.error('Error creating timeline milestone:', err);
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

    const updated = await saveFirestoreDoc('timeline', id, updates);
    return NextResponse.json({ success: true, milestone: updated });
  } catch (err) {
    console.error('Error updating timeline milestone:', err);
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

    const deleted = await deleteFirestoreDocument('timeline', id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error('Error deleting timeline milestone:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
