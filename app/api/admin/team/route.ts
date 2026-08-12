import { NextResponse } from 'next/server';
import { getTeamCMS, addTeamMemberCMS, updateTeamMemberCMS, deleteTeamMemberCMS, TeamMemberCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreTeam = await fetchFirestoreCollection<TeamMemberCMS>('team');
    if (firestoreTeam && firestoreTeam.length > 0) {
      return NextResponse.json({ success: true, team: firestoreTeam });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, team: getTeamCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMember = addTeamMemberCMS(body);

    // Save to Firestore
    try {
      await saveFirestoreDoc('team', newMember.id, newMember);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add team member' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Member ID required' }, { status: 400 });

    const updated = updateTeamMemberCMS(id, updates);
    if (!updated) return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });

    // Update in Firestore
    try {
      await saveFirestoreDoc('team', id, updated);
    } catch (dbErr) {
      console.warn('Firestore update notice:', dbErr);
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Member ID required' }, { status: 400 });

    const deleted = deleteTeamMemberCMS(id);

    // Delete in Firestore
    try {
      await deleteFirestoreDocument('team', id);
    } catch (dbErr) {
      console.warn('Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete member' }, { status: 500 });
  }
}
