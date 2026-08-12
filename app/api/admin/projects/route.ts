import { NextResponse } from 'next/server';
import { getProjects, addProject, updateProject, deleteProject, ProjectCRM } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc, deleteFirestoreDocument } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreProjects = await fetchFirestoreCollection<ProjectCRM>('projects');
    if (firestoreProjects && firestoreProjects.length > 0) {
      return NextResponse.json({ success: true, projects: firestoreProjects });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, projects: getProjects() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProj = addProject(body);

    // Save directly to Firestore
    try {
      await saveFirestoreDoc('projects', newProj.id, newProj);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

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

    // Update directly in Firestore
    try {
      await saveFirestoreDoc('projects', id, updated);
    } catch (dbErr) {
      console.warn('Firestore update notice:', dbErr);
    }

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

    // Delete directly in Firestore
    try {
      await deleteFirestoreDocument('projects', id);
    } catch (dbErr) {
      console.warn('Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
