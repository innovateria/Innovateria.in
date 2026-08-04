'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  User, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Github, 
  Upload,
  Image as ImageIcon,
  Loader2,
  Star,
  Pin,
  ChevronDown,
  Check,
  GitFork,
  ExternalLink
} from 'lucide-react';
import { ProjectCRM, OpenSourceProjectCMS } from '@/lib/crm-store';

export default function AdminProjectsPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'opensource'>('client');
  const [projects, setProjects] = useState<ProjectCRM[]>([]);
  const [openSourceProjects, setOpenSourceProjects] = useState<OpenSourceProjectCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [servicesList, setServicesList] = useState<{ id: string; title: string; category: string }[]>([]);

  // Open Source Project Modals & Form State
  const [showAddOSModal, setShowAddOSModal] = useState(false);
  const [editingOS, setEditingOS] = useState<OpenSourceProjectCMS | null>(null);
  const [editOSTagsText, setEditOSTagsText] = useState('');
  const [newOSForm, setNewOSForm] = useState({
    title: '',
    category: 'Web Infrastructure',
    description: '',
    tags: 'Next.js, TypeScript, React',
    githubUrl: 'https://github.com/Vnjvibhash',
    liveDemoUrl: 'https://innovateria.in',
    stars: 50,
    forks: 15,
    featured: true
  });

  // Custom Glassmorphic Filter Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // New Project Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProj, setNewProj] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    category: 'App Development',
    techStack: '',
    status: 'in_development' as ProjectCRM['status'],
    budget: '₹1,50,000',
    progress: 25,
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    image: '/assets/img/android.png',
    featured: true,
    github: '',
    desc: ''
  });

  // Active Edit Modal
  const [editingProj, setEditingProj] = useState<ProjectCRM | null>(null);
  const [editTechStackText, setEditTechStackText] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [pRes, sRes, osRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/services'),
        fetch('/api/admin/open-source')
      ]);
      const pData = await pRes.json();
      const sData = await sRes.json();
      const osData = await osRes.json();

      const loadedProjects: ProjectCRM[] = pData.success && Array.isArray(pData.projects) ? pData.projects : [];
      const loadedServices = sData.success && Array.isArray(sData.services) ? sData.services : [];
      const loadedOS: OpenSourceProjectCMS[] = osData.success && Array.isArray(osData.openSourceProjects) ? osData.openSourceProjects : [];

      setProjects(loadedProjects);
      setServicesList(loadedServices);
      setOpenSourceProjects(loadedOS);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
      setOpenSourceProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Open Source Handlers
  const handleToggleOSFeatured = async (os: OpenSourceProjectCMS) => {
    try {
      const res = await fetch('/api/admin/open-source', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: os.id, featured: !os.featured })
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error('Error toggling open source featured state:', err);
    }
  };

  const handleDeleteOS = async (id: string) => {
    if (!confirm('Are you sure you want to delete this open source repository?')) return;
    try {
      const res = await fetch(`/api/admin/open-source?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error('Error deleting open source repository:', err);
    }
  };

  const handleCreateOS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newOSForm,
        tags: newOSForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/open-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchProjects();
        setShowAddOSModal(false);
        setNewOSForm({
          title: '',
          category: 'Web Infrastructure',
          description: '',
          tags: 'Next.js, TypeScript, React',
          githubUrl: 'https://github.com/Vnjvibhash',
          liveDemoUrl: 'https://innovateria.in',
          stars: 50,
          forks: 15,
          featured: true
        });
      }
    } catch (err) {
      console.error('Error creating open source repo:', err);
    }
  };

  const startEditOS = (os: OpenSourceProjectCMS) => {
    setEditingOS(os);
    setEditOSTagsText(Array.isArray(os.tags) ? os.tags.join(', ') : '');
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
        fetchProjects();
        setEditingOS(null);
      }
    } catch (err) {
      console.error('Error updating open source repo:', err);
    }
  };

  const handleFileUpload = async (file: File, isEdit: boolean) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success && data.url) {
        if (isEdit && editingProj) {
          setEditingProj({ ...editingProj, image: data.url });
        } else {
          setNewProj({ ...newProj, image: data.url });
        }
      }
    } catch (err) {
      console.error('Error uploading image file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProj,
        techStack: newProj.techStack.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchProjects();
        setShowAddModal(false);
        setNewProj({
          title: '',
          clientName: '',
          clientEmail: '',
          category: 'App Development',
          techStack: '',
          status: 'in_development',
          budget: '₹1,50,000',
          progress: 25,
          startDate: new Date().toISOString().split('T')[0],
          deadline: '',
          image: '/assets/img/android.png',
          featured: true,
          github: '',
          desc: ''
        });
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const startEditProject = (proj: ProjectCRM) => {
    setEditingProj(proj);
    setEditTechStackText(Array.isArray(proj.techStack) ? proj.techStack.join(', ') : '');
  };

  const handleToggleFeatured = async (proj: ProjectCRM) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: proj.id, featured: !proj.featured })
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error('Error toggling project featured state:', err);
    }
  };

  const handleToggleHeader = async (proj: ProjectCRM) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: proj.id, showInHeader: !proj.showInHeader })
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error('Error toggling project header state:', err);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj) return;
    try {
      const payload = {
        ...editingProj,
        techStack: editTechStackText.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchProjects();
        setEditingProj(null);
      }
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project record?')) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
        if (editingProj && editingProj.id === id) setEditingProj(null);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const getStatusBadge = (status: ProjectCRM['status']) => {
    switch (status) {
      case 'discovery':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">Discovery</span>;
      case 'in_development':
        return <span className="bg-brand-500/20 text-brand-400 border border-brand-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">In Development</span>;
      case 'beta_testing':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">Beta Testing</span>;
      case 'completed':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">Completed</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 border border-gray-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  const filteredProjects = (projects || [])
    .filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        p.title.toLowerCase().includes(q) || 
        p.clientName.toLowerCase().includes(q) ||
        (p.desc && p.desc.toLowerCase().includes(q));
      
      const sel = selectedCategory.toLowerCase();
      const matchesCat = 
        selectedCategory === 'all' || 
        p.category === selectedCategory ||
        p.category.toLowerCase().includes(sel) ||
        sel.includes(p.category.toLowerCase()) ||
        p.title.toLowerCase().includes(sel);
      
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (a.showInHeader && !b.showInHeader) return -1;
      if (!a.showInHeader && b.showInHeader) return 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

  const filteredOS = (openSourceProjects || [])
    .filter(os => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        os.title.toLowerCase().includes(q) || 
        os.category.toLowerCase().includes(q) ||
        (os.description && os.description.toLowerCase().includes(q));
      
      const sel = selectedCategory.toLowerCase();
      const matchesCat = 
        selectedCategory === 'all' || 
        os.category === selectedCategory ||
        os.category.toLowerCase().includes(sel) ||
        os.title.toLowerCase().includes(sel);
      
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      
      {/* Fixed Header & Filter Controls */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <FolderKanban size={24} className="text-brand-500" />
              <span>Client Projects Management</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Manage client projects, track development progress, pin top projects, and feature them live.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
            >
              <Plus size={16} />
              <span>New Client Project</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-card p-4 rounded-2xl border border-white/10 w-full">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, client names, or descriptions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs placeholder-gray-400 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Custom Dynamic Services Filter Dropdown */}
          <div ref={filterRef} className="relative w-full sm:w-80 shrink-0">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs flex items-center justify-between focus:outline-none focus:border-brand-500 cursor-pointer transition-colors shadow-lg"
            >
              <span className="truncate text-left font-semibold">
                {selectedCategory === 'all'
                  ? `⚡ All Services (${servicesList.length})`
                  : `⚡ ${selectedCategory}`}
              </span>
              <ChevronDown
                size={15}
                className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                  isFilterOpen ? 'rotate-180 text-brand-400' : ''
                }`}
              />
            </button>

            {/* Floating Glassmorphic Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-full rounded-2xl border border-white/15 bg-[#0D1322]/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden space-y-1 p-2">
                
                {/* Internal Quick Search Input */}
                <div className="relative p-1">
                  <Search size={13} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    placeholder="Filter service title..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-[11px] placeholder-gray-400 focus:outline-none focus:border-brand-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {/* Option: All Services */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setIsFilterOpen(false);
                      setFilterSearch('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>⚡ All Services ({servicesList.length})</span>
                    {selectedCategory === 'all' && <Check size={14} className="text-brand-400" />}
                  </button>

                  {/* Filtered Services Options */}
                  {servicesList
                    .filter((s) => s.title.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((srv) => {
                      const isSelected = selectedCategory === srv.title;
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(srv.title);
                            setIsFilterOpen(false);
                            setFilterSearch('');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-2">⚡ {srv.title}</span>
                          {isSelected && <Check size={14} className="text-brand-400 shrink-0" />}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Project Cards Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredProjects.map((proj) => (
              <div 
                key={proj.id} 
                className={`glass-card glass-card-hover rounded-3xl p-6 border flex flex-col justify-between space-y-4 transition-all duration-300 ${
                  proj.showInHeader ? 'border-purple-500/40 bg-purple-500/5 shadow-xl shadow-purple-500/10' : 'border-white/10'
                }`}
              >
                <div className="space-y-3">
                  {/* Interactive Project Image Preview with Top-Left Pin Button */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#131A29] border border-white/10 group/img">
                    <img
                      src={proj.image || '/assets/img/android.png'}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

                    {/* Top-Left Category & Status Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10">
                      <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg">
                        {proj.category}
                      </span>
                      {getStatusBadge(proj.status)}
                    </div>

                    {/* Top-Right Corner Glowing Pin Icon Button */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <button
                        type="button"
                        onClick={() => handleToggleHeader(proj)}
                        className={`p-1.5 rounded-full transition-all duration-300 shadow-md flex items-center justify-center ${
                          proj.showInHeader
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-amber-300 border border-amber-400/80 shadow-purple-500/40 scale-105 rotate-45 ring-2 ring-purple-500/30'
                            : 'bg-black/60 backdrop-blur-md hover:bg-black/80 text-gray-400 hover:text-white border border-white/20 hover:scale-105'
                        }`}
                        title={proj.showInHeader ? 'Pinned (Shown in Header & Top)' : 'Click to Pin Project to Top & Header'}
                      >
                        <Pin size={12} className={proj.showInHeader ? 'fill-amber-300 text-amber-300' : ''} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-1">{proj.title}</h3>

                  {proj.desc && (
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{proj.desc}</p>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">Milestone Progress</span>
                      <span className="text-brand-400 font-semibold">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-brand transition-all duration-500" style={{ width: `${proj.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-white/10 text-xs text-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-gray-400"><User size={12} /><span>Client:</span></span>
                      <span className="font-semibold text-white">{proj.clientName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-gray-400"><DollarSign size={12} /><span>Budget:</span></span>
                      <span className="font-semibold text-emerald-400">{proj.budget}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-gray-400"><Calendar size={12} /><span>Deadline:</span></span>
                      <span className="font-semibold text-white">{proj.deadline}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(proj.techStack || []).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleToggleFeatured(proj)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 transition-all ${
                      proj.featured 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' 
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                    title="Toggle featured homepage showcase state"
                  >
                    <Star size={13} className={proj.featured ? 'fill-amber-300' : ''} />
                    <span>{proj.featured ? 'Featured' : 'Feature'}</span>
                  </button>

                  <button onClick={() => startEditProject(proj)} className="flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all cursor-pointer">
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                  
                  <button onClick={() => handleDeleteProject(proj.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer">
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      </div>

      {/* Edit Project Modal */}
      {editingProj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Client Project</h3>
              <button onClick={() => setEditingProj(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateProject} className="space-y-3">
              {/* Featured Showcase Toggle */}
              <div className="glass-card p-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-white">Feature on Public Homepage Showcase</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(editingProj.featured)}
                  onChange={(e) => setEditingProj({ ...editingProj, featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Project Image Upload & Preview */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project Header Image</label>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0">
                    <img src={editingProj.image || '/assets/img/android.png'} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], true);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={editingProj.image || ''}
                      onChange={(e) => setEditingProj({ ...editingProj, image: e.target.value })}
                      placeholder="/assets/img/android.png"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProj.title}
                  onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Associated Category / Service *</label>
                <select
                  value={editingProj.category}
                  onChange={(e) => setEditingProj({ ...editingProj, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs font-medium"
                >
                  <option value="Native Android App Development">Native Android App Development</option>
                  <option value="Mobile App Development (iOS & Android)">Mobile App Development (iOS & Android)</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Web Development">Web Development</option>
                  {servicesList.map(srv => (
                    <option key={srv.id} value={srv.title}>{srv.title}</option>
                  ))}
                  {editingProj.category && !['Native Android App Development', 'Mobile App Development (iOS & Android)', 'Software Engineering', 'Web Development', ...servicesList.map(s => s.title)].includes(editingProj.category) && (
                    <option value={editingProj.category}>{editingProj.category}</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProj.clientName}
                    onChange={(e) => setEditingProj({ ...editingProj, clientName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={editingProj.clientEmail}
                    onChange={(e) => setEditingProj({ ...editingProj, clientEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Project Status</label>
                  <select
                    value={editingProj.status || 'in_development'}
                    onChange={(e) => setEditingProj({ ...editingProj, status: e.target.value as ProjectCRM['status'] })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs font-medium"
                  >
                    <option value="discovery">Discovery Phase</option>
                    <option value="in_development">In Active Development</option>
                    <option value="beta_testing">Beta Testing</option>
                    <option value="completed">Completed & Delivered</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Budget</label>
                  <input
                    type="text"
                    value={editingProj.budget}
                    onChange={(e) => setEditingProj({ ...editingProj, budget: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-medium">Milestone Progress ({editingProj.progress}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingProj.progress}
                  onChange={(e) => setEditingProj({ ...editingProj, progress: parseInt(e.target.value) })}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={editTechStackText}
                  onChange={(e) => setEditTechStackText(e.target.value)}
                  placeholder="Flutter, Firebase, Dart"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">GitHub Repository Link</label>
                <input
                  type="text"
                  value={editingProj.github || ''}
                  onChange={(e) => setEditingProj({ ...editingProj, github: e.target.value })}
                  placeholder="https://github.com/Vnjvibhash/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProj.desc || ''}
                  onChange={(e) => setEditingProj({ ...editingProj, desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingProj(null)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">
                  Cancel
                </button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">
                  <Save size={14} />
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Create Client Project</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">

              {/* Project Image Upload & Preview */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project Header Image</label>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0">
                    <img src={newProj.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], false);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={newProj.image}
                      onChange={(e) => setNewProj({ ...newProj, image: e.target.value })}
                      placeholder="/assets/img/android.png"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  placeholder="e.g. Flutter Mobile E-Commerce App"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newProj.clientName}
                    onChange={(e) => setNewProj({ ...newProj, clientName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={newProj.clientEmail}
                    onChange={(e) => setNewProj({ ...newProj, clientEmail: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Associated Service</label>
                  <select
                    value={newProj.category}
                    onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  >
                    {servicesList.map(srv => (
                      <option key={srv.id} value={srv.title}>{srv.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Project Budget</label>
                  <input
                    type="text"
                    required
                    value={newProj.budget}
                    onChange={(e) => setNewProj({ ...newProj, budget: e.target.value })}
                    placeholder="₹2,00,000"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={newProj.techStack}
                  onChange={(e) => setNewProj({ ...newProj, techStack: e.target.value })}
                  placeholder="Flutter, Firebase, Dart, Payment Gateway"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target Deadline</label>
                <input
                  type="date"
                  required
                  value={newProj.deadline}
                  onChange={(e) => setNewProj({ ...newProj, deadline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">
                  Cancel
                </button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">
                  <span>Create Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
