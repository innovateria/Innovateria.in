'use client';

import { useState } from 'react';
import { Settings, Lock, ShieldCheck, KeyRound, Save, CheckCircle2, User } from 'lucide-react';

export default function AdminSettingsPage() {
  const [passcode, setPasscode] = useState('123456');
  const [agencyName, setAgencyName] = useState('Innovateria Software Solutions');
  const [adminEmail, setAdminEmail] = useState('innovateria.in@gmail.com');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('CRM settings and security passcode updated successfully!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      
      {/* Fixed Header */}
      <div className="shrink-0 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Settings size={24} className="text-brand-500" />
            <span>CRM Security & Agency Settings</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure security passcode, agency profile, and CRM access credentials.
          </p>
        </div>

        {savedMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs w-full">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{savedMsg}</span>
          </div>
        )}
      </div>

      {/* Scrollable Settings Form Section */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">

      {/* Settings Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 w-full">
        
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                Agency Profile
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Agency Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Admin Email Address</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 flex items-center space-x-2">
                <Lock size={16} className="text-brand-500" />
                <span>Admin Portal Security Passcode</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">CRM Passcode / Security PIN</label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Passcode required to login at <code className="text-brand-400">/admin/login</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20"
            >
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
          </div>

        </form>

      </div>
      </div>

    </div>
  );
}
