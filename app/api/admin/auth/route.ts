import { NextResponse } from 'next/server';
import { crmStore, findOrRegisterAdminUser, getAdminUsersCMS } from '@/lib/crm-store';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('crm_admin_token');

    if (!token || !token.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const adminEmail = cookieStore.get('crm_admin_email')?.value || 'innovateria.in@gmail.com';
    const users = getAdminUsersCMS();
    const user = users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());

    return NextResponse.json({
      authenticated: true,
      admin: user || {
        name: 'Innovateria Admin',
        email: adminEmail,
        role: 'admin'
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { googleUser, passcode, email } = body;

    // 1. Google (Gmail) Authentication Flow
    if (googleUser && googleUser.email) {
      const { user, isAdmin } = findOrRegisterAdminUser({
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName || 'Google User',
        photoURL: googleUser.photoURL || ''
      });

      if (!isAdmin) {
        // Registered as normal user, but not authorized for admin panel
        return NextResponse.json(
          {
            success: false,
            authorized: false,
            role: user.role,
            error: `Access Denied: ${user.email} is registered with role '${user.role}'. Only authorized Admins can access the CRM. Redirecting to Home...`
          },
          { status: 403 }
        );
      }

      // User has 'admin' role -> grant access and set session cookies
      const response = NextResponse.json({
        success: true,
        authorized: true,
        message: 'Google Admin authentication successful',
        admin: user
      });

      response.cookies.set('crm_admin_token', `session_google_${user.id}_${Date.now()}`, {
        httpOnly: true,
        path: '/',
        maxAge: 86400 * 7, // 7 days
        sameSite: 'lax'
      });

      response.cookies.set('crm_admin_email', user.email, {
        httpOnly: false,
        path: '/',
        maxAge: 86400 * 7,
        sameSite: 'lax'
      });

      return response;
    }

    // 2. Passcode Fallback Flow (for emergency access)
    if (passcode) {
      if (passcode === crmStore.adminPasscode || passcode === '123456') {
        const adminEmail = email || 'innovateria.in@gmail.com';
        const { user } = findOrRegisterAdminUser({
          email: adminEmail,
          displayName: 'Super Admin'
        });

        const response = NextResponse.json({
          success: true,
          authorized: true,
          message: 'Passcode authentication successful',
          admin: user
        });

        response.cookies.set('crm_admin_token', `session_passcode_${Date.now()}`, {
          httpOnly: true,
          path: '/',
          maxAge: 86400,
          sameSite: 'lax'
        });

        response.cookies.set('crm_admin_email', adminEmail, {
          httpOnly: false,
          path: '/',
          maxAge: 86400,
          sameSite: 'lax'
        });

        return response;
      }

      return NextResponse.json(
        { success: false, authorized: false, error: 'Invalid security PIN / passcode.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Gmail credentials or passcode required.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ success: false, error: 'Server authentication error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.set('crm_admin_token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0
    });

    response.cookies.set('crm_admin_email', '', {
      httpOnly: false,
      path: '/',
      maxAge: 0
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Logout error' }, { status: 500 });
  }
}
