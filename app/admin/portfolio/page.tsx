'use client';

import { useState, useEffect } from 'react';
import { 
  Grid, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Save,
  Award,
  Layers,
  Github,
  Star,
  GitFork,
  Code2
} from 'lucide-react';
import { TimelineCMS, OpenSourceProjectCMS } from '@/lib/crm-store';

export default function AdminPortfolioPage() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'showcase'>('timeline');

  // Timeline State
  const [timeline, setTimeline] = useState<TimelineCMS[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [showAddTimelineModal, setShowAddTimelineModal] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineCMS | null>(null);
  const [editDetailsText, setEditDetailsText] = useState('');

  const [timelineForm, setTimelineForm] = useState({
    period: '2024 - Present',
    title: '',
    company: '',
    institution: '',
    location: 'Bangalore, IN',
    type: 'experience' as TimelineCMS['type'],
    iconName: 'Briefcase',
    details: ''
  });

  // Open Source Showcase Projects State
  const [openSource, setOpenSource] = useState<OpenSourceProjectCMS[]>([]);
  const [openSourceLoading, setOpenSourceLoading] = useState(true);
  const [showAddOSModal, setShowAddOSModal] = useState(false);
  const [editingOS, setEditingOS] = useState<OpenSourceProjectCMS | null>(null);
  const [editOSTagsText, setEditOSTagsText] = useState('');

  const [osForm, setOSForm] = useState({
    title: '',
    category: 'Mobile App',
    description: '',
    tags: 'Flutter, Firebase, Dart',
    githubUrl: 'https://github.com/Vnjvibhash',
    liveDemoUrl: 'https://vivekajee.in/',
    stars: 10,
    forks: 5,
    featured: true
  });

  useEffect(() => {
    fetchTimeline();
    fetchOpenSource();
  }, []);

  const fetchTimeline = async () => {
    try {
      setTimelineLoading(true);
      const res = await fetch('/api/admin/timeline');
      const data = await res.json();
      if (data.success && Array.isArray(data.timeline)) {
        setTimeline(data.timeline);
      } else {
        setTimeline([]);
      }
    } catch (err) {
      console.error('Error fetching timeline:', err);
    } finally {
      setTimelineLoading(false);
    }
  };

  const fetchOpenSource = async () => {
    try {
      setOpenSourceLoading(true);
      const res = await fetch('/api/admin/open-source');
      const data = await res.json();
      if (data.success && Array.isArray(data.openSourceProjects)) {
        setOpenSource(data.openSourceProjects);
      } else {
        setOpenSource([]);
      }
    } catch (err) {
      console.error('Error fetching open source projects:', err);
    } finally {
      setOpenSourceLoading(false);
    }
  };

  /* ================= TIMELINE HANDLERS ================= */
  const handleAddTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...timelineForm,
        details: timelineForm.details.split('\n').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchTimeline();
        setShowAddTimelineModal(false);
        setTimelineForm({
          period: '2024 - Present',
          title: '',
          company: '',
          institution: '',
          location: 'Bangalore, IN',
          type: 'experience',
          iconName: 'Briefcase',
          details: ''
        });
      }
    } catch (err) {
      console.error('Error creating timeline milestone:', err);
    }
  };

  const startEditTimeline = (item: TimelineCMS) => {
    setEditingTimeline(item);
    setEditDetailsText(Array.isArray(item.details) ? item.details.join('\n') : '');
  };

  const handleUpdateTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimeline) return;
    try {
      const payload = {
        ...editingTimeline,
        details: editDetailsText.split('\n').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/timeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchTimeline();
        setEditingTimeline(null);
      }
    } catch (err) {
      console.error('Error updating timeline:', err);
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career milestone?')) return;
    try {
      const res = await fetch(`/api/admin/timeline?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTimeline();
    } catch (err) {
      console.error('Error deleting timeline item:', err);
    }
  };

  /* ================= OPEN SOURCE HANDLERS ================= */
  const handleAddOpenSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...osForm,
        tags: osForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/open-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchOpenSource();
        setShowAddOSModal(false);
        setOSForm({
          title: '',
          category: 'Mobile App',
          description: '',
          tags: 'Flutter, Firebase, Dart',
          githubUrl: 'https://github.com/Vnjvibhash',
          liveDemoUrl: 'https://vivekajee.in/',
          stars: 10,
          forks: 5,
          featured: true
        });
      }
    } catch (err) {
      console.error('Error creating open source project:', err);
    }
  };

  const startEditOS = (item: OpenSourceProjectCMS) => {
    setEditingOS(item);
    setEditOSTagsText(Array.isArray(item.tags) ? item.tags.join(', ') : '');
  };

  const handleUpdateOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOS) return;
    try {
      const payload = {
        ...editingOS,
        tags: editOSTagsText.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/open-source', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchOpenSource();
        setEditingOS(null);
      }
    } catch (err) {
      console.error('Error updating open source project:', err);
    }
  };

  const handleDeleteOS = async (id: string) => {
    if (!confirm('Are you sure you want to delete this open source project?')) return;
    try {
      const res = await fetch(`/api/admin/open-source?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchOpenSource();
    } catch (err) {
      console.error('Error deleting open source project:', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      {/* Fixed Header & Tabs */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Grid size={24} className="text-brand-500" />
              <span>Portfolio & Open Source CMS</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Manage Career Milestones and Dedicated Open Source Projects Database.</p>
          </div>

          {activeTab === 'timeline' ? (
            <button
              onClick={() => setShowAddTimelineModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
            >
              <Plus size={16} />
              <span>Add Career Milestone</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddOSModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
            >
              <Plus size={16} />
              <span>Add Open Source Project</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 space-x-4">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
              activeTab === 'timeline'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <GraduationCap size={16} />
            <span>Education & Career Journey Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('showcase')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
              activeTab === 'showcase'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Code2 size={16} />
            <span>Open Source Projects Database</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">

      {/* TAB 1: TIMELINE */}
      {activeTab === 'timeline' && (
        <div>
          {timelineLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {(timeline || []).map((item) => (
                <div key={item.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-brand-400 flex items-center space-x-1">
                        <Calendar size={13} />
                        <span>{item.period}</span>
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        item.type === 'education' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-gray-300 font-medium">{item.company || item.institution}</p>
                      <p className="text-[11px] text-gray-400 flex items-center space-x-1 mt-0.5">
                        <MapPin size={11} />
                        <span>{item.location}</span>
                      </p>
                    </div>

                    <ul className="space-y-1.5 pt-2 border-t border-white/10">
                      {(item.details || []).map((detail, idx) => (
                        <li key={idx} className="text-xs text-gray-300 flex items-start space-x-2">
                          <span className="text-brand-500 shrink-0 mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                    <button onClick={() => startEditTimeline(item)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all">
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDeleteTimeline(item.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all">
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OPEN SOURCE PROJECTS */}
      {activeTab === 'showcase' && (
        <div>
          {openSourceLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {(openSource || []).map((item) => (
                <div key={item.id} className="glass-card glass-card-hover rounded-3xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>

                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span className="flex items-center space-x-1"><Star size={12} className="text-amber-400" /><span>{item.stars || 0}</span></span>
                        <span className="flex items-center space-x-1"><GitFork size={12} /><span>{item.forks || 0}</span></span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{item.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(item.tags || []).map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-400 hover:underline flex items-center space-x-1">
                      <Github size={13} />
                      <span>GitHub</span>
                    </a>

                    <div className="flex space-x-2">
                      <button onClick={() => startEditOS(item)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all">
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => handleDeleteOS(item.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all">
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>

      {/* Add Timeline Modal */}
      {showAddTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add Career Milestone</h3>
              <button onClick={() => setShowAddTimelineModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTimeline} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Time Period *</label>
                  <input type="text" required value={timelineForm.period} onChange={(e) => setTimelineForm({ ...timelineForm, period: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Milestone Type</label>
                  <select value={timelineForm.type} onChange={(e) => setTimelineForm({ ...timelineForm, type: e.target.value as any })} className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs">
                    <option value="experience">Experience</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Title / Degree *</label>
                <input type="text" required value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Company / Institution</label>
                  <input type="text" value={timelineForm.company} onChange={(e) => setTimelineForm({ ...timelineForm, company: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
                  <input type="text" value={timelineForm.location} onChange={(e) => setTimelineForm({ ...timelineForm, location: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Highlights (1 per line)</label>
                <textarea rows={3} value={timelineForm.details} onChange={(e) => setTimelineForm({ ...timelineForm, details: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"></textarea>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddTimelineModal(false)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer"><Save size={14} /><span>Save Milestone</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Timeline Modal */}
      {editingTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Career Milestone</h3>
              <button onClick={() => setEditingTimeline(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateTimeline} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Time Period</label>
                  <input type="text" value={editingTimeline.period} onChange={(e) => setEditingTimeline({ ...editingTimeline, period: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Type</label>
                  <select value={editingTimeline.type} onChange={(e) => setEditingTimeline({ ...editingTimeline, type: e.target.value as any })} className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs">
                    <option value="experience">Experience</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Title</label>
                <input type="text" value={editingTimeline.title} onChange={(e) => setEditingTimeline({ ...editingTimeline, title: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Highlights (1 per line)</label>
                <textarea rows={3} value={editDetailsText} onChange={(e) => setEditDetailsText(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"></textarea>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingTimeline(null)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer"><Save size={14} /><span>Update Milestone</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Open Source Project Modal */}
      {showAddOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add Open Source Project</h3>
              <button onClick={() => setShowAddOSModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-white glass-card"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddOpenSource} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project Title *</label>
                <input type="text" required value={osForm.title} onChange={(e) => setOSForm({ ...osForm, title: e.target.value })} placeholder="Shop-Orbit 🛍️" className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                  <input type="text" value={osForm.category} onChange={(e) => setOSForm({ ...osForm, category: e.target.value })} placeholder="Mobile App" className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Tech Tags (comma separated)</label>
                  <input type="text" value={osForm.tags} onChange={(e) => setOSForm({ ...osForm, tags: e.target.value })} placeholder="Flutter, Firebase, Dart" className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">GitHub Repo URL *</label>
                <input type="text" required value={osForm.githubUrl} onChange={(e) => setOSForm({ ...osForm, githubUrl: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                <textarea rows={2} value={osForm.description} onChange={(e) => setOSForm({ ...osForm, description: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2 border-t border-white/10">
                <button type="button" onClick={() => setShowAddOSModal(false)} className="px-4 py-2 rounded-xl glass-card text-xs text-gray-300">Cancel</button>
                <button type="submit" className="inline-flex items-center space-x-1.5 bg-gradient-brand text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg"><Save size={14} /><span>Save Open Source Project</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Open Source Project Modal */}
      {editingOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Open Source Project</h3>
              <button onClick={() => setEditingOS(null)} className="p-1 rounded-lg text-gray-400 hover:text-white glass-card"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateOS} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project Title</label>
                <input type="text" value={editingOS.title} onChange={(e) => setEditingOS({ ...editingOS, title: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Tech Tags (comma separated)</label>
                <input type="text" value={editOSTagsText} onChange={(e) => setEditOSTagsText(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">GitHub Repo URL</label>
                <input type="text" value={editingOS.githubUrl} onChange={(e) => setEditingOS({ ...editingOS, githubUrl: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                <textarea rows={2} value={editingOS.description || ''} onChange={(e) => setEditingOS({ ...editingOS, description: e.target.value })} className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2 border-t border-white/10">
                <button type="button" onClick={() => setEditingOS(null)} className="px-4 py-2 rounded-xl glass-card text-xs text-gray-300">Cancel</button>
                <button type="submit" className="inline-flex items-center space-x-1.5 bg-gradient-brand text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg"><Save size={14} /><span>Update Project</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
