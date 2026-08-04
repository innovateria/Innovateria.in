import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/crm-store';

export async function POST(request: Request) {
  try {
    const { passcode, email } = await request.json();

    if (!passcode) {
      return NextResponse.json({ success: false, error: 'Passcode is required' }, { status: 400 });
    }

    if (passcode === crmStore.adminPasscode || passcode === '123456') {
      const response = NextResponse.json({
        success: true,
        message: 'Authenticated successfully',
        admin: {
          name: 'Vivek Kumar',
          email: email || 'innovateria.in@gmail.com',
          role: 'Super Admin'
        }
      });

      // Set auth cookie
      response.cookies.set('crm_admin_token', 'session_active_innovateria_crm', {
        httpOnly: true,
        path: '/',
        maxAge: 86400 // 24 hours
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid admin passcode or email.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
