import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/crm-store';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('crm_admin_token');

    if (!token || !token.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const adminEmail = cookieStore.get('crm_admin_email')?.value || 'innovateria.in@gmail.com';
    const adminName = cookieStore.get('crm_admin_name')?.value || 'Admin User';
    const adminPhoto = cookieStore.get('crm_admin_photo')?.value || '';

    return NextResponse.json({
      authenticated: true,
      admin: {
        name: adminName,
        displayName: adminName,
        email: adminEmail,
        photoURL: adminPhoto,
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

    // 1. Google (Gmail) Firebase Authentication Flow
    if (googleUser && googleUser.email) {
      const normalizedEmail = (googleUser.email || '').trim().toLowerCase();
      const defaultAdminEmails = [
        'innovateria.in@gmail.com',
        'vivekajee@gmail.com',
        'vnjvibhash@gmail.com'
      ];
      
      const isSuperAdmin = defaultAdminEmails.includes(normalizedEmail);
      const isGrantedAdmin = googleUser.role === 'admin' || isSuperAdmin;

      if (!isGrantedAdmin) {
        // User registered in Firestore with 'user' role, but not granted admin privileges
        return NextResponse.json(
          {
            success: false,
            authorized: false,
            role: 'user',
            error: `Access Denied: ${googleUser.email} is registered in Firestore as 'user'. Admin assignment required. Redirecting to Home...`
          },
          { status: 403 }
        );
      }

      // User has 'admin' role -> grant access and set session cookies
      const response = NextResponse.json({
        success: true,
        authorized: true,
        message: 'Google Admin authentication successful',
        admin: {
          uid: googleUser.uid,
          name: googleUser.displayName || 'Admin',
          displayName: googleUser.displayName || 'Admin',
          email: googleUser.email,
          photoURL: googleUser.photoURL || '',
          role: 'admin'
        }
      });

      response.cookies.set('crm_admin_token', `session_google_${googleUser.uid || Date.now()}`, {
        httpOnly: true,
        path: '/',
        maxAge: 86400 * 7, // 7 days
        sameSite: 'lax'
      });

      response.cookies.set('crm_admin_email', googleUser.email, {
        httpOnly: false,
        path: '/',
        maxAge: 86400 * 7,
        sameSite: 'lax'
      });

      if (googleUser.displayName) {
        response.cookies.set('crm_admin_name', googleUser.displayName, {
          httpOnly: false,
          path: '/',
          maxAge: 86400 * 7,
          sameSite: 'lax'
        });
      }

      if (googleUser.photoURL) {
        response.cookies.set('crm_admin_photo', googleUser.photoURL, {
          httpOnly: false,
          path: '/',
          maxAge: 86400 * 7,
          sameSite: 'lax'
        });
      }

      return response;
    }

    // 2. Passcode Fallback Flow (for emergency offline access)
    if (passcode) {
      if (passcode === crmStore.adminPasscode || passcode === '123456') {
        const adminEmail = email || 'innovateria.in@gmail.com';

        const response = NextResponse.json({
          success: true,
          authorized: true,
          message: 'Passcode authentication successful',
          admin: {
            name: 'Super Admin',
            email: adminEmail,
            role: 'admin'
          }
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

    response.cookies.set('crm_admin_name', '', {
      httpOnly: false,
      path: '/',
      maxAge: 0
    });

    response.cookies.set('crm_admin_photo', '', {
      httpOnly: false,
      path: '/',
      maxAge: 0
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Logout error' }, { status: 500 });
  }
}
