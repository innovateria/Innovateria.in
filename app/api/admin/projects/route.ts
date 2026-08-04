import { NextResponse } from 'next/server';
import { getProjects, addProject, updateProject, deleteProject } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, projects: getProjects() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProj = addProject(body);
    return NextResponse.json({ success: true, project: newProj });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });

    const updated = updateProject(id, updates);
    if (!updated) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });

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

    const deleted = deleteProject(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
