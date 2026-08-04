'use client';

import { useState, useEffect } from 'react';
import { Cpu, Plus, Edit3, Trash2, X, Upload, Loader2, Save } from 'lucide-react';
import { TechStackCMS } from '@/lib/crm-store';

export default function AdminTechStackPage() {
  const [techList, setTechList] = useState<TechStackCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTech, setEditingTech] = useState<TechStackCMS | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Mobile Framework',
    image: '/assets/img/android.png',
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
      if (data.success && Array.isArray(data.techStack)) {
        setTechList(data.techStack);
      } else {
        setTechList([]);
      }
    } catch (err) {
      console.error('Error fetching tech stack:', err);
      setTechList([]);
    } finally {
      setLoading(false);
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
        setForm({ name: '', category: 'Mobile Framework', image: '/assets/img/android.png', description: '', status: 'active' });
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
    if (!confirm('Are you sure you want to delete this Technology entry?')) return;
    try {
      const res = await fetch(`/api/admin/tech-stack?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTechStack();
    } catch (err) {
      console.error('Error deleting tech item:', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Cpu size={24} className="text-brand-500" />
            <span>Technologies CMS Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage tech stack icons, uploaded logos, and technology categories.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          <span>Add Technology</span>
        </button>
      </div>

      {/* Scrollable Tech Stack Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(techList || []).map((tech) => (
            <div key={tech.id} className="glass-card glass-card-hover rounded-3xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                    {tech.category}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    tech.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {tech.status}
                  </span>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                    <img src={tech.image || '/assets/img/soft.png'} alt={tech.name} className="max-h-8 w-auto object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{tech.name}</h3>
                    <p className="text-[11px] text-gray-400">{tech.category}</p>
                  </div>
                </div>

                {tech.description && (
                  <p className="text-xs text-gray-300 leading-relaxed pt-1 border-t border-white/10">
                    {tech.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-3 border-t border-white/10 w-full">
                <button onClick={() => setEditingTech(tech)} className="flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all cursor-pointer">
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button onClick={() => handleDeleteTech(tech.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Edit Modal */}
      {editingTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Technology</h3>
              <button onClick={() => setEditingTech(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {/* Image Upload & Preview */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Tech Icon / Logo</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0 flex items-center justify-center p-1">
                    <img src={editingTech.image || '/assets/img/soft.png'} alt="Preview" className="max-h-8 w-auto object-contain" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
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
                      value={editingTech.image}
                      onChange={(e) => setEditingTech({ ...editingTech, image: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Technology Name</label>
                <input
                  type="text"
                  value={editingTech.name}
                  onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingTech.category}
                  onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingTech.description || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
              <button onClick={() => setEditingTech(null)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
              <button onClick={handleUpdateTech} className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">Save Tech</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add Technology Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTech} className="space-y-3">
              {/* Image Upload & Preview */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Tech Icon / Logo</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0 flex items-center justify-center p-1">
                    <img src={form.image} alt="Preview" className="max-h-8 w-auto object-contain" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
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
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="/assets/img/android.png"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Technology Name *</label>
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
                <label className="block text-xs text-gray-300 mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Mobile App / Web Framework / Database"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of technology..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">Save Technology</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
