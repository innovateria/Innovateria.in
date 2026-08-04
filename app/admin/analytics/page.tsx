'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Smartphone, Code2, Globe2, Search, Zap, CheckCircle2 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const servicesBreakdown = [
    { title: 'Mobile App Development', icon: Smartphone, share: '38%', count: '14 Projects', color: 'from-amber-500/20 to-orange-500/10' },
    { title: 'Software Engineering', icon: Code2, share: '30%', count: '10 Projects', color: 'from-purple-500/20 to-pink-500/10' },
    { title: 'Web Development', icon: Globe2, share: '20%', count: '8 Projects', color: 'from-brand-500/20 to-red-500/10' },
    { title: 'SEO & Growth Marketing', icon: Search, share: '12%', count: '5 Accounts', color: 'from-emerald-500/20 to-teal-500/10' }
  ];

  return (
    <div className="flex flex-col h-full space-y-6 w-full min-h-0 overflow-hidden">
      
      {/* Fixed Section: Header & Analytics KPI Bar */}
      <div className="shrink-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <BarChart3 size={24} className="text-brand-500" />
            <span>Agency Performance & Growth Analytics</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time metrics on inquiry conversion, service revenue distribution, and operational scale.
          </p>
        </div>

        {/* Analytics KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Lead Conversion Efficiency</span>
            <h3 className="text-3xl font-extrabold text-white">{stats?.conversionRate || 0}%</h3>
            <p className="text-xs text-emerald-400 flex items-center space-x-1">
              <TrendingUp size={12} />
              <span>High qualified lead acquisition</span>
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Pipeline Volume</span>
            <h3 className="text-3xl font-extrabold text-brand-400">{stats?.projectedRevenue || '₹12,40,000'}</h3>
            <p className="text-xs text-gray-400">Total active client budgets</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projects Completed</span>
            <h3 className="text-3xl font-extrabold text-white">{stats?.totalProjects || 0} Delivered</h3>
            <p className="text-xs text-blue-400">100% on-time milestone delivery</p>
          </div>
        </div>
      </div>

      {/* Scrollable Section: Services Revenue Distribution Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">

      {/* Services Revenue Distribution Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Service Category Revenue Share</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesBreakdown.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${s.color} rounded-full blur-xl pointer-events-none`}></div>
                
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                    <Icon size={20} />
                  </div>
                  <span className="text-xl font-extrabold text-white">{s.share}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{s.title}</h4>
                  <p className="text-xs text-brand-400 font-semibold mt-0.5">{s.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>

    </div>
  );
}
