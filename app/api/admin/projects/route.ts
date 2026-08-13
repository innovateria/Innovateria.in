import { NextResponse } from 'next/server';
import { ProjectCRM } from '@/lib/crm-store';
import { getFirestoreProjects, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const projects = await getFirestoreProjects();
    return NextResponse.json({ success: true, projects });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `proj-${Date.now()}`;
    const newProj: ProjectCRM = {
      ...body,
      id,
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      status: body.status || 'in_development',
      progress: typeof body.progress === 'number' ? body.progress : 50
    };

    await saveFirestoreDoc('projects', id, newProj);
    return NextResponse.json({ success: true, project: newProj });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });

    const updated = await saveFirestoreDoc('projects', id, updates);
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });

    const deleted = await deleteFirestoreDocument('projects', id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
