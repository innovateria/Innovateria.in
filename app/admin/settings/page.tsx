'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Save, 
  CheckCircle2, 
  User, 
  Users, 
  ShieldAlert, 
  UserPlus, 
  RefreshCw,
  Mail,
  Calendar
} from 'lucide-react';
import FirebaseSyncButton from '@/components/FirebaseSyncButton';

interface AdminUserItem {
  id: string;
  uid?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt: string;
}

export default function AdminSettingsPage() {
  const [passcode, setPasscode] = useState('123456');
  const [agencyName, setAgencyName] = useState('Innovateria Software Solutions');
  const [adminEmail, setAdminEmail] = useState('innovateria.in@gmail.com');
  const [savedMsg, setSavedMsg] = useState('');
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingUserEmail, setUpdatingUserEmail] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('CRM settings and security passcode updated successfully!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const handleRoleToggle = async (user: AdminUserItem) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUpdatingUserEmail(user.email);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrId: user.id || user.email,
          role: newRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        }
        setSavedMsg(`Role for ${user.email} updated to '${newRole}'.`);
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error updating role:', err);
    } finally {
      setUpdatingUserEmail(null);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      
      {/* Fixed Header */}
      <div className="shrink-0 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Settings size={24} className="text-brand-500" />
            <span>CRM Security & Access Settings</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage authorized Google (Gmail) administrator roles, security passcode, and agency credentials.
          </p>
        </div>

        {savedMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs w-full">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{savedMsg}</span>
          </div>
        )}
      </div>

      {/* Scrollable Settings Section */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2 space-y-6">

        {/* Section 0: Firebase Firestore Cloud Database Sync */}
        <FirebaseSyncButton variant="card" />

        {/* Section 1: Google (Gmail) User & Role Management */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck size={18} className="text-brand-500" />
                <span>Google (Gmail) User Role Management</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Users authenticate with Gmail. Only users with the <span className="text-brand-400 font-semibold">admin</span> role can access this portal; non-admins are redirected to the Home page.
              </p>
            </div>
            <button
              onClick={fetchUsers}
              disabled={loadingUsers}
              className="p-2 rounded-xl glass-card border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh User List"
            >
              <RefreshCw size={15} className={loadingUsers ? 'animate-spin text-brand-500' : ''} />
            </button>
          </div>

          <div className="space-y-3">
            {users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isUpdating = updatingUserEmail === u.email;

                  return (
                    <div
                      key={u.id || u.email}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                        isAdmin 
                          ? 'bg-brand-500/5 border-brand-500/30' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt={u.displayName || u.email}
                            className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-500 font-bold text-xs shrink-0">
                            {u.displayName ? u.displayName.slice(0, 2).toUpperCase() : 'GM'}
                          </div>
                        )}
                        <div className="overflow-hidden flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white truncate">{u.displayName || 'Google User'}</h4>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              isAdmin 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-300 truncate flex items-center space-x-1 mt-0.5">
                            <Mail size={11} className="text-brand-500 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 flex items-center space-x-1">
                            <Calendar size={10} />
                            <span>Last login: {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Recent'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          {isAdmin ? 'Granted Full CRM Access' : 'Restricted (Redirects to Home)'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(u)}
                          disabled={isUpdating || u.email === 'innovateria.in@gmail.com'}
                          className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-40 ${
                            isAdmin 
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30' 
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isUpdating 
                            ? 'Updating...' 
                            : isAdmin 
                            ? 'Demote to User' 
                            : 'Promote to Admin'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-400 glass-card rounded-2xl">
                No registered Google users found yet. Once a user signs in via Google, they will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Section 2: General Profile & Emergency Passcode */}
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
                  <label className="block text-xs font-medium text-gray-300 mb-1">Primary Agency Email</label>
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
                  <span>Emergency Security PIN</span>
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Emergency PIN</label>
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs font-mono"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Used as fallback PIN when Google OAuth popup is unavailable.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Save size={16} />
                <span>Save Settings</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
