'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  ShieldAlert, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Home,
  ChevronDown
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';

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
    setStatusMessage('Authenticating with Google...');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setStatusMessage(`Verifying permissions for ${user.email}...`);

      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleUser: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        })
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        setStatus('success');
        setStatusMessage(`Welcome, ${data.admin?.displayName || user.displayName || 'Admin'}! Access granted.`);
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
      } else {
        // Not authorized (non-admin role)
        setStatus('denied');
        setStatusMessage(
          data.error || `Access Denied: ${user.email} is registered but not assigned the Admin role. Redirecting to Home page...`
        );
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setStatus('idle');
        setStatusMessage('');
      } else {
        setStatus('error');
        setStatusMessage(err.message || 'Google sign-in failed. Please try again.');
      }
    }
  };

  // Passcode Form Fallback (for emergency offline/PIN access)
  const handlePasscodeLogin = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('Verifying Security PIN...');

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
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/30 text-brand-500 text-xs font-semibold uppercase tracking-wider">
            <Lock size={14} />
            <span>Innovateria Secure CRM Portal</span>
          </div>

          <div className="flex justify-center pt-2">
            <img src="/assets/img/logo_white.png" alt="Innovateria" className="logo-dark-theme h-10 w-auto object-contain" />
            <img src="/assets/img/logo_black.png" alt="Innovateria" className="logo-light-theme h-10 w-auto object-contain" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Authentication</h1>
          <p className="text-xs text-gray-400">Authenticate with your authorized Gmail account to manage agency solutions.</p>
        </div>

        {/* Login Container Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          
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
              <div className="pt-2 flex items-center justify-between text-[11px] text-amber-400 font-medium">
                <span>Redirecting to Home page...</span>
                <Home size={14} />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Primary Action: Google (Gmail) Sign-In Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={status === 'loading' || status === 'success'}
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin text-brand-500" />
                  <span className="text-gray-800">{statusMessage || 'Connecting to Google...'}</span>
                </>
              ) : (
                <>
                  {/* Google Multicolor SVG Icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>Sign in with Google (Gmail)</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center">
              Only authorized Google accounts with the <span className="text-brand-400 font-semibold">admin</span> role can access the portal.
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-[11px] text-gray-500 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Passcode Accordion Trigger */}
          <div>
            <button
              type="button"
              onClick={() => setShowPasscodeForm(!showPasscodeForm)}
              className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
            >
              <div className="flex items-center space-x-2">
                <KeyRound size={14} className="text-brand-500" />
                <span>Emergency PIN / Passcode Login</span>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showPasscodeForm ? 'rotate-180' : ''}`} />
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
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0F17]/90 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <span>Verify PIN</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
