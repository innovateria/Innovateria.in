import { NextResponse } from 'next/server';
import { getTeamCMS, addTeamMemberCMS, updateTeamMemberCMS, deleteTeamMemberCMS } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, team: getTeamCMS() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMember = addTeamMemberCMS(body);
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
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete member' }, { status: 500 });
  }
}
