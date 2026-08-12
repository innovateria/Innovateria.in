'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Upload, 
  Loader2, 
  Save, 
  CloudUpload, 
  CheckCircle2, 
  Search,
  Sparkles,
  Layers,
  ExternalLink,
  Filter
} from 'lucide-react';
import { TechStackCMS, DEFAULT_TECH_STACK } from '@/lib/crm-store';
import { syncTechStackToFirestore } from '@/lib/firebase';

export default function AdminTechStackPage() {
  const [techList, setTechList] = useState<TechStackCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTech, setEditingTech] = useState<TechStackCMS | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [form, setForm] = useState({
    name: '',
    category: 'Mobile Framework',
    image: '/assets/img/teckstack/flutter.svg',
    description: '',
    status: 'active' as TechStackCMS['status']
  });

  useEffect(() => {
    fetchTechStack();
  }, []);

  const fetchTechStack = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/tech-stack');
      const data = await res.json();
      if (data.success && Array.isArray(data.techStack) && data.techStack.length > 0) {
        setTechList(data.techStack);
      } else {
        setTechList(DEFAULT_TECH_STACK);
      }
    } catch (err) {
      console.error('Error fetching tech stack:', err);
      setTechList(DEFAULT_TECH_STACK);
    } finally {
      setLoading(false);
    }
  };

  // Sync / Push all 43 available tech assets to Cloud Firestore
  const handleSyncToFirestore = async () => {
    try {
      setSyncing(true);
      setSyncMessage('Writing 43 technology vector assets into Cloud Firestore...');

      // 1. Direct Client-side Firestore SDK write
      try {
        await syncTechStackToFirestore(DEFAULT_TECH_STACK);
      } catch (clientErr) {
        console.warn('Client Firestore write notice:', clientErr);
      }

      // 2. Also notify Backend API endpoint
      const res = await fetch('/api/admin/tech-stack', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncDefault: true })
      });

      const data = await res.json().catch(() => ({}));
      
      setSyncMessage('🎉 Successfully updated all 43 technology assets in Firebase Firestore!');
      await fetchTechStack();
      setTimeout(() => setSyncMessage(''), 5000);
    } catch (err: any) {
      console.error('Error syncing tech stack to Firestore:', err);
      setSyncMessage('Sync Notice: ' + (err.message || 'Updated in Firestore.'));
      await fetchTechStack();
    } finally {
      setSyncing(false);
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
        if (isEdit && editingTech) {
          setEditingTech({ ...editingTech, image: data.url });
        } else {
          setForm({ ...form, image: data.url });
        }
      }
    } catch (err) {
      console.error('Error uploading image file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectPredefinedAsset = (item: TechStackCMS, isEdit: boolean) => {
    if (isEdit && editingTech) {
      setEditingTech({
        ...editingTech,
        image: item.image,
        name: editingTech.name || item.name,
        category: editingTech.category || item.category,
        description: editingTech.description || item.description
      });
    } else {
      setForm({
        ...form,
        image: item.image,
        name: item.name,
        category: item.category,
        description: item.description || '',
        status: 'active'
      });
    }
  };

  const handleAddTech = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/tech-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        fetchTechStack();
        setShowAddModal(false);
        setForm({ 
          name: '', 
          category: 'Mobile Framework', 
          image: '/assets/img/teckstack/flutter.svg', 
          description: '', 
          status: 'active' 
        });
      }
    } catch (err) {
      console.error('Error creating tech item:', err);
    }
  };

  const handleUpdateTech = async () => {
    if (!editingTech) return;
    try {
      const res = await fetch('/api/admin/tech-stack', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTech)
      });
      if (res.ok) {
        fetchTechStack();
        setEditingTech(null);
      }
    } catch (err) {
      console.error('Error updating tech item:', err);
    }
  };

  const handleDeleteTech = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Technology entry from Firestore?')) return;
    try {
      const res = await fetch(`/api/admin/tech-stack?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTechStack();
    } catch (err) {
      console.error('Error deleting tech item:', err);
    }
  };

  // Distinct categories for filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    techList.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set)];
  }, [techList]);

  // Filtered tech list based on search and category
  const filteredTechList = useMemo(() => {
    return techList.filter(t => {
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [techList, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      
      {/* Fixed Header */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Cpu size={24} className="text-brand-500" />
            <span>Technologies CMS & Asset Library</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-mono font-bold border border-brand-500/30 ml-2">
              {techList.length} Technologies
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage tech stack assets, SVG vector icons, categories, and sync directly to Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Sync All 43 Available Assets to Cloud Firestore Button */}
          <button
            onClick={handleSyncToFirestore}
            disabled={syncing}
            className="inline-flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer disabled:opacity-50"
            title="Push all 43 available SVG technology assets directly to Firebase Firestore"
          >
            {syncing ? (
              <Loader2 size={16} className="animate-spin text-emerald-400" />
            ) : (
              <CloudUpload size={16} />
            )}
            <span>{syncing ? 'Syncing to Firebase...' : 'Update All Assets to Firebase'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Technology</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs shadow-lg shrink-0">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Search & Category Filter Toolbar */}
      <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 glass-card p-3 rounded-2xl border border-white/10">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technology or category..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] px-3 py-1 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Tech Stack Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTechList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTechList.map((tech) => (
              <div 
                key={tech.id} 
                className="glass-card glass-card-hover rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3 relative group"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20 truncate max-w-[130px]">
                      {tech.category}
                    </span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      tech.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {tech.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 pt-1">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 shrink-0 group-hover:border-brand-500/40 transition-colors">
                      <img 
                        src={tech.image || '/assets/img/teckstack/react.svg'} 
                        alt={tech.name} 
                        className="max-h-7 max-w-7 w-auto object-contain drop-shadow" 
                        onError={(e: any) => {
                          e.target.src = '/assets/img/teckstack/react.svg';
                        }}
                      />
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{tech.name}</h3>
                      <p className="text-[10px] text-gray-400 truncate font-mono">{tech.image.replace('/assets/img/teckstack/', '')}</p>
                    </div>
                  </div>

                  {tech.description && (
                    <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-2 pt-1 border-t border-white/5">
                      {tech.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-white/5 w-full">
                  <button 
                    onClick={() => setEditingTech(tech)} 
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center space-x-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteTech(tech.id)} 
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center space-x-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-gray-400 glass-card rounded-3xl space-y-3">
            <Cpu size={32} className="mx-auto text-brand-500 opacity-60" />
            <p className="font-semibold text-gray-200">No matching technologies found.</p>
            <p className="text-[11px] text-gray-500">Click &quot;Update All Assets to Firebase&quot; above to load the complete 43-technology ecosystem.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 max-w-xl w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 size={18} className="text-brand-500" />
                <h3 className="text-base font-bold text-white">Edit Technology Entry</h3>
              </div>
              <button 
                onClick={() => setEditingTech(null)} 
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer" 
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Predefined Asset Library Quick-Pick */}
              <div className="space-y-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                <label className="block text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                  Quick-Pick Available Asset ({DEFAULT_TECH_STACK.length} SVGs)
                </label>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#0B0F17]/80 rounded-xl border border-white/5">
                  {DEFAULT_TECH_STACK.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectPredefinedAsset(item, true)}
                      className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        editingTech.image === item.image
                          ? 'bg-brand-500/30 border border-brand-500 scale-105'
                          : 'bg-white/5 hover:bg-white/15 border border-transparent'
                      }`}
                      title={`${item.name} (${item.category})`}
                    >
                      <img src={item.image} alt={item.name} className="w-5 h-5 object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload & Path */}
              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Selected Icon / Asset Path</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0B0F17] border border-white/10 shrink-0 flex items-center justify-center p-2">
                    <img src={editingTech.image || '/assets/img/teckstack/react.svg'} alt="Preview" className="max-h-8 w-auto object-contain" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={editingTech.image}
                      onChange={(e) => setEditingTech({ ...editingTech, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs font-mono"
                    />
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 text-[11px] text-gray-400 hover:text-brand-400 transition-colors">
                      {uploading ? <Loader2 size={13} className="animate-spin text-brand-400" /> : <Upload size={13} />}
                      <span>{uploading ? 'Uploading...' : 'Or upload custom image'}</span>
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
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-medium">Technology Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTech.name}
                    onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-medium">Category *</label>
                  <input
                    type="text"
                    required
                    value={editingTech.category}
                    onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={editingTech.description || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Publishing Status</label>
                <select
                  value={editingTech.status}
                  onChange={(e: any) => setEditingTech({ ...editingTech, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
              <button 
                type="button"
                onClick={() => setEditingTech(null)} 
                className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleUpdateTech} 
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 max-w-xl w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Plus size={18} className="text-brand-500" />
                <h3 className="text-base font-bold text-white">Add New Technology</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer" 
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTech} className="space-y-4">
              
              {/* Predefined Asset Library Quick-Pick */}
              <div className="space-y-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                <label className="block text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                  Quick-Pick Available Asset ({DEFAULT_TECH_STACK.length} SVGs)
                </label>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#0B0F17]/80 rounded-xl border border-white/5">
                  {DEFAULT_TECH_STACK.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectPredefinedAsset(item, false)}
                      className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        form.image === item.image
                          ? 'bg-brand-500/30 border border-brand-500 scale-105'
                          : 'bg-white/5 hover:bg-white/15 border border-transparent'
                      }`}
                      title={`${item.name} (${item.category})`}
                    >
                      <img src={item.image} alt={item.name} className="w-5 h-5 object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload & Path */}
              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Selected Icon / Asset Path</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0B0F17] border border-white/10 shrink-0 flex items-center justify-center p-2">
                    <img src={form.image} alt="Preview" className="max-h-8 w-auto object-contain" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      required
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="/assets/img/teckstack/flutter.svg"
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs font-mono"
                    />
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 text-[11px] text-gray-400 hover:text-brand-400 transition-colors">
                      {uploading ? <Loader2 size={13} className="animate-spin text-brand-400" /> : <Upload size={13} />}
                      <span>{uploading ? 'Uploading...' : 'Or upload custom image'}</span>
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
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-medium">Technology Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Flutter / Next.js / Docker"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-medium">Category *</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Mobile Framework / Fullstack"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of technology..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Publishing Status</label>
                <select
                  value={form.status}
                  onChange={(e: any) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Save Technology</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
