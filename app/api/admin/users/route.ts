import { NextResponse } from 'next/server';
import { getAdminUsersCMS, updateAdminUserRole, findOrRegisterAdminUser } from '@/lib/crm-store';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('crm_admin_token');

    if (!token || !token.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const users = getAdminUsersCMS();
    return NextResponse.json({
      success: true,
      users
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

    const updated = updateAdminUserRole(emailOrId, role);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to '${role}' successfully`,
      users: getAdminUsersCMS()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update user role' }, { status: 500 });
  }
}
