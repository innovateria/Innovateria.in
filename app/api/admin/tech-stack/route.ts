import { NextResponse } from 'next/server';
import { getTechStackCMS, addTechStackCMS, updateTechStackCMS, deleteTechStackCMS } from '@/lib/crm-store';

export async function GET() {
  try {
    const techStack = getTechStackCMS();
    return NextResponse.json({ success: true, techStack });
  } catch (err) {
    console.error('Error fetching tech stack:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, message: 'Name and Category are required' }, { status: 400 });
    }

    const newTech = addTechStackCMS({
      name: body.name,
      category: body.category,
      image: body.image || '/assets/img/soft.png',
      description: body.description || '',
      status: body.status || 'active'
    });

    return NextResponse.json({ success: true, tech: newTech });
  } catch (err) {
    console.error('Error creating tech stack item:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const updated = updateTechStackCMS(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Tech item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, tech: updated });
  } catch (err) {
    console.error('Error updating tech stack item:', err);
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

    const deleted = deleteTechStackCMS(id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error('Error deleting tech stack item:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
