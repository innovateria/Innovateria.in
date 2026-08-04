'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, KeyRound, ShieldAlert, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('innovateria.in@gmail.com');
  const [passcode, setPasscode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passcode })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Invalid admin passcode or email.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Authentication error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/30 text-brand-500 text-xs font-semibold uppercase tracking-wider">
            <Lock size={14} />
            <span>Innovateria Secure CRM Portal</span>
          </div>

          <div className="flex justify-center pt-2">
            <img src="/assets/img/logo.png" alt="Innovateria" className="h-10 w-auto object-contain" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Authentication</h1>
          <p className="text-xs text-gray-400">Enter your credentials to access the agency CRM dashboard.</p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          
          {status === 'error' && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-400 text-xs">
              <ShieldAlert size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="innovateria.in@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B0F17]/90 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Passcode / Security PIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. 123456)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B0F17]/90 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-brand text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all disabled:opacity-50"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <>
                  <span>Sign In To CRM</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="pt-4 border-t border-white/10 text-center space-y-1">
            <p className="text-[11px] text-gray-400">Default Admin Passcode: <code className="bg-white/10 px-2 py-0.5 rounded text-brand-400 font-mono">123456</code></p>
          </div>
        </div>

      </div>
    </div>
  );
}
