'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Inbox, 
  FolderKanban, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus,
  Wrench,
  UserCheck,
  Grid,
  Zap,
  HelpCircle,
  Cpu,
  Bell,
  Mail,
  ArrowRight
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [unreadLeadsCount, setUnreadLeadsCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.stats?.newLeads !== undefined) {
          setUnreadLeadsCount(data.stats.newLeads);
        }
      }

      const leadsRes = await fetch('/api/admin/leads');
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (Array.isArray(leadsData.leads)) {
          const newLeadsOnly = leadsData.leads.filter((l: any) => l.status === 'new');
          setRecentLeads(newLeadsOnly.slice(0, 5));
        }
      }
    } catch (err) {
      console.error('Error updating notifications:', err);
    }
  };

  // Check auth session & setup real-time notification polling / listener
  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const checkSession = async () => {
      try {
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
          return;
        }

        await fetchNotifications();
      } catch {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    checkSession();

    // Setup 3-second real-time polling
    const intervalId = setInterval(fetchNotifications, 3000);

    // Setup event listeners for instant local updates
    const handleUpdate = () => fetchNotifications();
    window.addEventListener('crm_leads_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('crm_leads_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [pathname, router]);

  // If on login page, render full screen without sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#0B0F17] text-gray-100">{children}</div>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen bg-[#0B0F17] flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/leads', label: 'Lead Inbox', icon: Inbox, badge: unreadLeadsCount > 0 ? unreadLeadsCount : null },
    { href: '/admin/projects', label: 'Projects & Featured', icon: FolderKanban },
    { href: '/admin/services', label: 'Services CMS', icon: Wrench },
    { href: '/admin/team', label: 'Team Members CMS', icon: UserCheck },
    { href: '/admin/portfolio', label: 'Portfolio CMS', icon: Grid },
    { href: '/admin/tech-stack', label: 'Technologies CMS', icon: Cpu },
    { href: '/admin/faqs', label: 'FAQs CMS', icon: HelpCircle },
    { href: '/admin/clients', label: 'Client Directory', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'CMS Settings', icon: Settings },
  ];

  const handleLogout = () => {
    document.cookie = 'crm_admin_token=; Max-Age=0; path=/';
    router.push('/admin/login');
  };

  return (
    <div className="h-screen max-h-screen w-full max-w-full overflow-hidden bg-[#0B0F17] text-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden shrink-0 glass-card border-b border-white/10 p-4 flex justify-between items-center z-40 bg-[#0B0F17]/90 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <img src="/assets/img/logo.png" alt="Innovateria" className="h-8 w-auto" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">CRM Admin</span>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/admin/leads"
            className="relative p-2 rounded-lg glass-card border border-white/10 text-gray-300 hover:text-white flex items-center justify-center"
            title="Lead Notifications"
          >
            <Bell size={18} />
            {unreadLeadsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
                {unreadLeadsCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white glass-card"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation (Fixed 100vh height, inner scrollable if small screen) */}
      <aside 
        className={`fixed md:relative top-0 left-0 z-50 h-full w-64 shrink-0 bg-[#0E1422] border-r border-white/10 flex flex-col justify-between p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/assets/img/logo.png" alt="Innovateria" className="h-9 w-auto object-contain" />
            </Link>
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 rounded-full">
              CRM v1.0
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-brand text-white font-semibold shadow-lg shadow-brand-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="glass-card p-3 rounded-xl flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-500 font-bold text-xs">
              VK
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">Vivek Kumar</h4>
              <p className="text-[10px] text-gray-400 truncate">innovateria.in@gmail.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 glass-card hover:bg-red-500/20 text-red-400 hover:text-red-300 py-2.5 rounded-xl text-xs font-medium transition-colors border border-red-500/20"
          >
            <LogOut size={16} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Fixed Height Container with Internal Scrollbar) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0B0F17]">
        
        {/* Top Header */}
        <header className="hidden md:flex shrink-0 h-16 items-center justify-between px-8 bg-[#0E1422]/70 backdrop-blur-md border-b border-white/10 z-30">
          <div className="flex items-center space-x-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {pathname === '/admin' ? 'Agency Executive Dashboard' : navItems.find(i => pathname.startsWith(i.href))?.label || 'CRM Portal'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative p-2.5 rounded-xl glass-card border transition-all flex items-center justify-center ${
                  notifOpen 
                    ? 'border-brand-500/60 bg-brand-500/20 text-white shadow-lg shadow-brand-500/20' 
                    : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title="Lead Notifications"
                aria-label="Lead Notifications"
              >
                <Bell size={18} />
                {unreadLeadsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white animate-pulse">
                    {unreadLeadsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notifOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0E1422] border border-white/15 shadow-2xl z-50 p-4 space-y-3 backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <Bell size={16} className="text-brand-400" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
                      </div>
                      {unreadLeadsCount > 0 ? (
                        <span className="bg-brand-500/20 border border-brand-500/40 text-brand-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {unreadLeadsCount} New Lead{unreadLeadsCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">No new leads</span>
                      )}
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {recentLeads.length > 0 ? (
                        recentLeads.map((lead) => (
                          <Link
                            key={lead.id}
                            href="/admin/leads"
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start space-x-3 p-2.5 rounded-xl bg-white/5 hover:bg-brand-500/15 border border-white/5 hover:border-brand-500/30 transition-all group"
                          >
                            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors shrink-0">
                              <Mail size={14} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-white truncate">{lead.name}</h4>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  lead.status === 'new' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {lead.status?.toUpperCase() || 'NEW'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-300 truncate mt-0.5">{lead.subject || lead.message || 'New contact inquiry'}</p>
                              <p className="text-[9px] text-gray-400 mt-1">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}</p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="py-6 text-center text-xs text-gray-400">
                          No new lead notifications.
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <Link
                        href="/admin/leads"
                        onClick={() => setNotifOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5 shadow-md shadow-brand-500/20"
                      >
                        <span>Manage All Leads in Inbox</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/"
              target="_blank"
              className="glass-card hover:bg-white/10 text-gray-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-medium border border-white/10 transition-colors"
            >
              View Public Website
            </Link>
          </div>
        </header>

        {/* Page Body - Fixed Container with Internal List Scrolling */}
        <main className="flex-1 min-h-0 w-full max-w-full overflow-hidden p-4 sm:p-6 lg:p-8 flex flex-col">
          {children}
        </main>
      </div>

    </div>
  );
}
