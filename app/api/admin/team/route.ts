import { NextResponse } from 'next/server';
import { TeamMemberCMS } from '@/lib/crm-store';
import { getFirestoreTeam, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const team = await getFirestoreTeam();
    return NextResponse.json({ success: true, team });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `team-${Date.now()}`;
    const newMember: TeamMemberCMS = {
      ...body,
      id,
      skills: Array.isArray(body.skills) ? body.skills : []
    };

    await saveFirestoreDoc('team', id, newMember);
    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add team member' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Member ID required' }, { status: 400 });

    const updated = await saveFirestoreDoc('team', id, updates);
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

    const deleted = await deleteFirestoreDocument('team', id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete member' }, { status: 500 });
  }
}
