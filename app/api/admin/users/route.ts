import { NextResponse } from 'next/server';
import { AdminUserCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc } from '@/lib/firestore-db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('crm_admin_token');

    if (!token || !token.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const firestoreUsers = await fetchFirestoreCollection<AdminUserCMS>('users');
    return NextResponse.json({
      success: true,
      users: firestoreUsers
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('crm_admin_token');

    if (!token || !token.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { emailOrId, role } = body;

    if (!emailOrId || !role || (role !== 'admin' && role !== 'user')) {
      return NextResponse.json({ success: false, error: 'Invalid user ID/email or role' }, { status: 400 });
    }

    await saveFirestoreDoc('users', emailOrId, { role });

    return NextResponse.json({
      success: true,
      message: `User ${emailOrId} role updated to ${role}`
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update user role' }, { status: 500 });
  }
}
