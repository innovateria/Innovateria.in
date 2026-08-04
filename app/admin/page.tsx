'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Inbox, 
  FolderKanban, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronRight,
  Plus,
  Zap,
  Sparkles,
  BarChart2,
  ListFilter,
  PieChart,
  Activity
} from 'lucide-react';
import { Lead, ProjectCRM } from '@/lib/crm-store';

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<ProjectCRM[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // View modes (Defaulted to Graph Mode)
  const [leadViewMode, setLeadViewMode] = useState<'graph' | 'list'>('graph');
  const [projectViewMode, setProjectViewMode] = useState<'graph' | 'list'>('graph');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsRes, projectsRes, statsRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/stats')
      ]);

      const leadsData = await leadsRes.json();
      const projectsData = await projectsRes.json();
      const statsData = await statsRes.json();

      if (leadsData.success) setLeads(leadsData.leads);
      if (projectsData.success) setProjects(projectsData.projects);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error('Error fetching CRM dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <span className="bg-brand-500/20 text-brand-400 border border-brand-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">New Lead</span>;
      case 'contacted':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">Contacted</span>;
      case 'proposal_sent':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">Proposal Sent</span>;
      case 'won':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">Won Project</span>;
      case 'lost':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">Lost</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 border border-gray-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  // Lead status breakdown metrics
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const contactedLeadsCount = leads.filter(l => l.status === 'contacted').length;
  const proposalLeadsCount = leads.filter(l => l.status === 'proposal_sent').length;
  const wonLeadsCount = leads.filter(l => l.status === 'won').length;
  const lostLeadsCount = leads.filter(l => l.status === 'lost').length;
  const totalLeads = leads.length || 1;

  // Filter out completed (100% delivered) projects for dashboard active tracker
  const activeProjectsOnly = projects.filter(p => p.progress < 100 && (p.status as string) !== 'completed');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6 w-full min-h-0 overflow-hidden">
      
      {/* Fixed Section: KPI Cards */}
      <div className="shrink-0 space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Leads */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:border-brand-500/30 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Inquiries</span>
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
                <Inbox size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-white">{stats?.totalLeads || 0}</h3>
              <p className="text-xs text-brand-400 mt-1 flex items-center space-x-1">
                <span>{stats?.newLeads || 0} new unread leads</span>
              </p>
            </div>
          </div>

          {/* Card 2: Active Projects */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:border-brand-500/30 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Projects</span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <FolderKanban size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-white">{stats?.activeProjects || 0}</h3>
              <p className="text-xs text-blue-400 mt-1">In Development & Beta</p>
            </div>
          </div>

          {/* Card 3: Conversion Rate */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:border-brand-500/30 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion Rate</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-white">{stats?.conversionRate || 0}%</h3>
              <p className="text-xs text-emerald-400 mt-1">Lead to Client Success</p>
            </div>
          </div>

          {/* Card 4: Revenue Projections */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:border-brand-500/30 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projected Revenue</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Zap size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-white">{stats?.projectedRevenue || '₹0'}</h3>
              <p className="text-xs text-purple-400 mt-1">Active Pipeline Volume</p>
            </div>
          </div>

        </div>
      </div>

      {/* Scrollable Section: Main Analytics Graphs Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8">
        
        {/* Left 7 Columns: Recent Contact Inquiries (Graph & List Toggle) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Inbox size={20} className="text-brand-500" />
              <span>Recent Contact Inquiries</span>
            </h2>
            
            {/* View Mode Toggle Button */}
            <div className="p-1 rounded-xl bg-[#0B0F17] border border-white/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLeadViewMode('graph')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                  leadViewMode === 'graph'
                    ? 'bg-gradient-brand text-white shadow-md font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BarChart2 size={13} />
                <span>Graph View</span>
              </button>
              <button
                type="button"
                onClick={() => setLeadViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                  leadViewMode === 'list'
                    ? 'bg-gradient-brand text-white shadow-md font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ListFilter size={13} />
                <span>List View</span>
              </button>
            </div>
          </div>

          {/* Graph View Component */}
          {leadViewMode === 'graph' ? (
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
              
              {/* Header & Sub-headline */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 block">Lead Acquisition Trend</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{totalLeads} Total Inquiries Captured</h3>
                </div>
                <Link href="/admin/leads" className="text-xs font-semibold text-brand-400 hover:underline inline-flex items-center space-x-1">
                  <span>Manage Inbox</span>
                  <ChevronRight size={13} />
                </Link>
              </div>

              {/* Glowing SVG Area Line Graph */}
              <div className="relative h-48 w-full bg-[#0E1422]/60 rounded-2xl p-4 border border-white/5 flex flex-col justify-between overflow-hidden">
                
                {/* SVG Curves */}
                <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="leadAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="leadLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                  {/* Filled Area Under Curve */}
                  <path
                    d="M 0,130 Q 100,100 200,85 T 400,35 L 500,20 L 500,150 L 0,150 Z"
                    fill="url(#leadAreaGradient)"
                  />

                  {/* Smooth Gradient Line */}
                  <path
                    d="M 0,130 Q 100,100 200,85 T 400,35 L 500,20"
                    fill="none"
                    stroke="url(#leadLineGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Glowing Data Nodes */}
                  <circle cx="20" cy="125" r="4.5" fill="#8B5CF6" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="130" cy="98" r="4.5" fill="#C084FC" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="250" cy="72" r="4.5" fill="#EC4899" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="370" cy="40" r="4.5" fill="#F43F5E" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="480" cy="22" r="5.5" fill="#3B82F6" stroke="#ffffff" strokeWidth="2" className="animate-ping" />
                  <circle cx="480" cy="22" r="5.5" fill="#3B82F6" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* X-Axis Timeline Labels */}
                <div className="mt-auto flex justify-between text-[11px] font-semibold text-gray-400 relative z-10 pt-3 border-t border-white/10">
                  <span>Apr 2026 (2)</span>
                  <span>May 2026 (5)</span>
                  <span>Jun 2026 (8)</span>
                  <span>Jul 2026 (14)</span>
                  <span className="text-brand-400 font-bold">Aug 2026 ({totalLeads})</span>
                </div>
              </div>

              {/* Status Breakdown Proportional Bar Graph */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <PieChart size={14} className="text-brand-400" />
                    <span>Inquiry Workflow Distribution</span>
                  </span>
                  <span className="text-[11px] text-gray-400">Status Categorization</span>
                </div>

                {/* Multi-color Segmented Bar Graph */}
                <div className="h-3.5 w-full rounded-full bg-white/10 overflow-hidden flex p-0.5 gap-0.5 border border-white/10">
                  <div style={{ width: `${(newLeadsCount / totalLeads) * 100}%` }} className="h-full bg-blue-500 rounded-l-full shadow-sm" title={`New: ${newLeadsCount}`} />
                  <div style={{ width: `${(contactedLeadsCount / totalLeads) * 100}%` }} className="h-full bg-purple-500 shadow-sm" title={`Contacted: ${contactedLeadsCount}`} />
                  <div style={{ width: `${(proposalLeadsCount / totalLeads) * 100}%` }} className="h-full bg-amber-500 shadow-sm" title={`Proposal Sent: ${proposalLeadsCount}`} />
                  <div style={{ width: `${(wonLeadsCount / totalLeads) * 100}%` }} className="h-full bg-emerald-500 shadow-sm" title={`Won: ${wonLeadsCount}`} />
                  <div style={{ width: `${(lostLeadsCount / totalLeads) * 100}%` }} className="h-full bg-rose-500 rounded-r-full shadow-sm" title={`Lost: ${lostLeadsCount}`} />
                </div>

                {/* Status Legend Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
                  <div className="glass-card p-2 rounded-xl border border-white/5 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-gray-300">New ({newLeadsCount})</span>
                  </div>
                  <div className="glass-card p-2 rounded-xl border border-white/5 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                    <span className="text-gray-300">Contacted ({contactedLeadsCount})</span>
                  </div>
                  <div className="glass-card p-2 rounded-xl border border-white/5 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-gray-300">Proposal ({proposalLeadsCount})</span>
                  </div>
                  <div className="glass-card p-2 rounded-xl border border-white/5 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-gray-300">Won ({wonLeadsCount})</span>
                  </div>
                  <div className="glass-card p-2 rounded-xl border border-white/5 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-gray-300">Lost ({lostLeadsCount})</span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* List View Component */
            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="glass-card rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">{lead.name}</h4>
                        {getStatusBadge(lead.status)}
                      </div>
                      <p className="text-xs text-brand-400 font-medium mt-0.5">{lead.subject}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    &ldquo;{lead.message}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <div className="flex items-center space-x-4">
                      <a href={`tel:${lead.phone}`} className="flex items-center space-x-1 text-gray-400 hover:text-brand-500">
                        <Phone size={12} />
                        <span>{lead.phone}</span>
                      </a>
                      <a href={`mailto:${lead.email}`} className="flex items-center space-x-1 text-gray-400 hover:text-brand-500">
                        <Mail size={12} />
                        <span>{lead.email}</span>
                      </a>
                    </div>

                    <a 
                      href={`https://wa.me/91${lead.phone}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20Innovateria!`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-green-400 hover:text-green-300 text-[11px] font-semibold"
                    >
                      <MessageCircle size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Columns: Active Projects Tracker (Graph & List Toggle) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <FolderKanban size={20} className="text-brand-500" />
              <span>Active Projects Tracker</span>
            </h2>
            
            {/* View Mode Toggle Button */}
            <div className="p-1 rounded-xl bg-[#0B0F17] border border-white/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setProjectViewMode('graph')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                  projectViewMode === 'graph'
                    ? 'bg-gradient-brand text-white shadow-md font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Activity size={13} />
                <span>Graph View</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
                  projectViewMode === 'list'
                    ? 'bg-gradient-brand text-white shadow-md font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ListFilter size={13} />
                <span>List View</span>
              </button>
            </div>
          </div>

          {/* Graph View Component */}
          {projectViewMode === 'graph' ? (
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6">
              
              {/* Header & Link */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 block">Milestone Completion Velocity</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{activeProjectsOnly.length} Active Projects</h3>
                </div>
                <Link href="/admin/projects" className="text-xs font-semibold text-brand-400 hover:underline inline-flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight size={13} />
                </Link>
              </div>

              {/* Horizontal Bar Chart Graph for Active Projects */}
              <div className="space-y-4">
                {activeProjectsOnly.map((proj) => {
                  const isComplete = proj.progress === 100;
                  const barColor = isComplete 
                    ? 'from-emerald-500 to-teal-400' 
                    : proj.progress >= 80 
                    ? 'from-blue-500 to-brand-500' 
                    : 'from-amber-500 to-orange-400';

                  return (
                    <div key={proj.id} className="space-y-1.5 glass-card p-3 rounded-2xl border border-white/5 hover:border-white/15 transition-all">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <span className="font-bold text-white truncate max-w-[170px]">{proj.title}</span>
                          <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded-full shrink-0 font-medium">{proj.category}</span>
                        </div>
                        <span className="font-bold text-brand-300 shrink-0">{proj.progress}%</span>
                      </div>

                      {/* Dynamic Gradient Bar */}
                      <div className="h-3 w-full rounded-full bg-[#0B0F17] p-0.5 border border-white/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${barColor} shadow-md transition-all duration-700`}
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1">
                        <span>Budget: <strong className="text-white">{proj.budget}</strong></span>
                        <span>Due: <strong className="text-white">{proj.deadline}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Category Allocation Stats */}
              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-300">
                <span className="font-semibold">Development Health</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  <span>100% Milestone Reliability</span>
                </span>
              </div>

            </div>
          ) : (
            /* List View Component */
            <div className="space-y-4">
              {activeProjectsOnly.map((proj) => (
                <div key={proj.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider block">{proj.category}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{proj.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                      {proj.budget}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-brand-400 font-semibold">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-full max-h-2 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-brand transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-gray-400">
                    <span>Client: <strong className="text-white">{proj.clientName}</strong></span>
                    <span>Deadline: <strong className="text-white">{proj.deadline}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        </div>
      </div>

    </div>
  );
}
