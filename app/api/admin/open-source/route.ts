import { NextResponse } from 'next/server';
import { 
  getOpenSourceProjectsCMS, 
  addOpenSourceProjectCMS, 
  updateOpenSourceProjectCMS, 
  deleteOpenSourceProjectCMS 
} from '@/lib/crm-store';

export async function GET() {
  try {
    const items = getOpenSourceProjectsCMS();
    return NextResponse.json({ success: true, openSourceProjects: items });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to fetch open source projects' }, { status: 500 });
  }
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
    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to delete open source project' }, { status: 500 });
  }
}
