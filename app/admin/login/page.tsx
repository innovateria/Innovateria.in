'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  syncUserToFirestore 
} from '@/lib/firebase';
import { 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  KeyRound, 
  ArrowRight,
  ChevronDown,
  Mail,
  Home,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'denied' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [showPasscodeForm, setShowPasscodeForm] = useState(false);
  const [email, setEmail] = useState('innovateria.in@gmail.com');
  const [passcode, setPasscode] = useState('');

  // Handle Google / Gmail Authentication
  const handleGoogleSignIn = async () => {
    setStatus('loading');
    setStatusMessage('Connecting to Google...');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setStatusMessage(`Syncing ${user.email} with Cloud Firestore...`);

      // 1. Create or update user document in Firestore 'users' collection
      const syncResult = await syncUserToFirestore(user);
      const firestoreUser = syncResult?.user;
      const userRole = firestoreUser?.role || (
        user.email === 'innovateria.in@gmail.com' || user.email === 'vivekajee@gmail.com' ? 'admin' : 'user'
      );

      setStatusMessage(`Verifying permissions for ${user.email}...`);

      // 2. Authenticate session with backend
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleUser: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: userRole
          }
        })
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        setStatus('success');
        setStatusMessage(`Welcome, ${firestoreUser?.displayName || user.displayName || 'Admin'}! Access granted.`);
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
      } else {
        // Not authorized (non-admin role)
        setStatus('denied');
        setStatusMessage(
          data.error || `Access Denied: ${user.email} is registered in the Firestore Users collection with role '${userRole}'. An Administrator must assign you the 'admin' role before you can access the CRM. Redirecting to Home page...`
        );
        setTimeout(() => {
          router.push('/');
        }, 3500);
      }
    } catch (err: any) {
      console.warn('Google Sign-in status note:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setStatus('idle');
        setStatusMessage('');
      } else if (
        err?.message?.includes('Database is closing') ||
        err?.message?.includes('closing/hidden') ||
        err?.name === 'InvalidStateError'
      ) {
        // Handled silently
        setStatus('idle');
      } else {
        setStatus('error');
        setStatusMessage(err.message || 'Google Authentication failed. Please try again.');
      }
    }
  };

  // Handle Fallback Passcode Login
  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('Verifying credentials...');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passcode })
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        setStatus('success');
        setStatusMessage('Authentication successful! Loading dashboard...');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Invalid passcode or email.');
      }
    } catch (err) {
      setStatus('error');
      setStatusMessage('Authentication error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] flex items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden bg-grid-pattern selection:bg-brand-500/30">
      
      {/* Dynamic Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-brand-500/15 via-blue-600/10 to-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000"></div>
      <div className="absolute bottom-10 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10 my-auto">
        
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-card border border-brand-500/30 text-brand-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider shadow-lg shadow-brand-500/10">
            <Lock size={13} className="text-brand-500" />
            <span>Innovateria Secure CRM Portal</span>
          </div>

          <div className="flex justify-center pt-1">
            <img src="/assets/img/logo_white.png" alt="Innovateria" className="logo-dark-theme h-9 sm:h-11 w-auto object-contain drop-shadow-md" />
            <img src="/assets/img/logo_black.png" alt="Innovateria" className="logo-light-theme h-9 sm:h-11 w-auto object-contain drop-shadow-md" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Admin Authentication</h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            Sign in with your Google account to manage agency solutions, clients, and leads.
          </p>
        </div>

        {/* Login Container Card */}
        <div className="glass-card rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl shadow-black/60 backdrop-blur-2xl space-y-6">
          
          {/* Status Banners */}
          {status === 'error' && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-400 text-xs animate-shake">
              <ShieldAlert size={18} className="shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === 'denied' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs text-amber-300">
              <div className="flex items-center space-x-2 font-semibold text-amber-400">
                <ShieldAlert size={18} className="shrink-0" />
                <span>Admin Authorization Required</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{statusMessage}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-amber-400 font-medium border-t border-amber-500/20">
                <span>Redirecting to Home page...</span>
                <Home size={14} />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Primary Action: Responsive Glowing Themed Google Sign-In Button */}
          <div className="space-y-4">
            <div className="relative group">
              {/* Outer Ambient Glow Gradient */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 via-blue-500 to-indigo-500 rounded-2xl blur-md opacity-40 group-hover:opacity-90 group-hover:blur-lg transition duration-500"></div>

              {/* Main Button Body */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={status === 'loading' || status === 'success'}
                className="relative w-full flex items-center justify-between sm:justify-center space-x-3 sm:space-x-4 bg-gradient-to-r from-[#0C111D] via-[#151D2F] to-[#0C111D] hover:from-[#111927] hover:via-[#1B253B] hover:to-[#111927] text-white font-semibold py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl border border-white/15 hover:border-brand-500/70 transition-all duration-300 shadow-xl hover:shadow-brand-500/25 active:scale-[0.99] disabled:opacity-50 cursor-pointer overflow-hidden"
              >
                {/* Shimmer Light Streak on Hover */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none"></div>

                {status === 'loading' ? (
                  <div className="flex items-center justify-center space-x-3 py-0.5">
                    <Loader2 size={19} className="animate-spin text-brand-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-200 truncate">
                      {statusMessage || 'Connecting to Google...'}
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Google Official Logo in Clean Capsule Badge */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-white shadow-md shrink-0 flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>

                    {/* Button Text */}
                    <div className="flex flex-col text-left sm:text-center flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors">
                        Continue with Google
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal hidden xs:inline">
                        Fast & secure Gmail authorization
                      </span>
                    </div>

                    {/* Right Arrow / Badge Indicator */}
                    <div className="shrink-0 text-gray-400 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </>
                )}
              </button>
            </div>

            {/* Feature Security Tags */}
            <div className="flex items-center justify-center space-x-3 text-[10px] sm:text-[11px] text-gray-400 pt-1">
              <span className="flex items-center space-x-1">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>OAuth 2.0 Verified</span>
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center space-x-1">
                <Sparkles size={13} className="text-brand-400" />
                <span>Firestore Cloud Role RBAC</span>
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-[10px] sm:text-[11px] text-gray-500 uppercase tracking-widest font-mono">or fallback</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Passcode Accordion Trigger */}
          <div>
            <button
              type="button"
              onClick={() => setShowPasscodeForm(!showPasscodeForm)}
              className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors p-2.5 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10"
            >
              <div className="flex items-center space-x-2">
                <KeyRound size={14} className="text-brand-500" />
                <span>Emergency PIN / Passcode Login</span>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showPasscodeForm ? 'rotate-180 text-brand-500' : ''}`} />
            </button>

            {/* Collapsible Passcode Form */}
            {showPasscodeForm && (
              <form onSubmit={handlePasscodeLogin} className="space-y-4 pt-3 mt-2 border-t border-white/5">
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">Admin Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={14} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="innovateria.in@gmail.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0F17]/90 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">Passcode / PIN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={14} />
                    </div>
                    <input
                      type="password"
                      required
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter 6-digit PIN"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0F17]/90 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span>Verify PIN</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Return Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Home size={13} />
            <span>Return to Public Website</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
