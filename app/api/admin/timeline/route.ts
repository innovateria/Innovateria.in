import { NextResponse } from 'next/server';
import { getTimelineCMS, addTimelineCMS, updateTimelineCMS, deleteTimelineCMS, TimelineCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreTimeline = await fetchFirestoreCollection<TimelineCMS>('timeline');
    if (firestoreTimeline && firestoreTimeline.length > 0) {
      return NextResponse.json({ success: true, timeline: firestoreTimeline });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, timeline: getTimelineCMS() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.period) {
      return NextResponse.json({ success: false, message: 'Title and Period required' }, { status: 400 });
    }

    const newMilestone = addTimelineCMS({
      period: body.period,
      title: body.title,
      company: body.company || '',
      institution: body.institution || '',
      location: body.location || 'India',
      type: body.type || 'experience',
      iconName: body.iconName || 'Briefcase',
      details: Array.isArray(body.details) ? body.details : []
    });

    // Save to Firestore
    try {
      await saveFirestoreDoc('timeline', newMilestone.id, newMilestone);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

    return NextResponse.json({ success: true, milestone: newMilestone });
  } catch (err) {
    console.error('Error creating timeline milestone:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const updated = updateTimelineCMS(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Milestone not found' }, { status: 404 });
    }

    // Update in Firestore
    try {
      await saveFirestoreDoc('timeline', body.id, updated);
    } catch (dbErr) {
      console.warn('Firestore update notice:', dbErr);
    }

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

    const deleted = deleteTimelineCMS(id);

    // Delete in Firestore
    try {
      await deleteFirestoreDocument('timeline', id);
    } catch (dbErr) {
      console.warn('Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error('Error deleting timeline milestone:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
