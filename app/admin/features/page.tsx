'use client';

import { useState, useEffect } from 'react';
import { Zap, Plus, Edit3, Trash2, X, CheckCircle2 } from 'lucide-react';
import { FeatureCMS } from '@/lib/crm-store';

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<FeatureCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureCMS | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Mobile Engineering',
    tagline: '',
    desc: '',
    bullets: '',
    iconName: 'Zap'
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/features');
      const data = await res.json();
      if (data.success) setFeatures(data.features);
    } catch (err) {
      console.error('Error fetching features:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        bullets: form.bullets.split('\n').map(b => b.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchFeatures();
        setShowAddModal(false);
        setForm({ title: '', category: 'Mobile Engineering', tagline: '', desc: '', bullets: '', iconName: 'Zap' });
      }
    } catch (err) {
      console.error('Error creating feature:', err);
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature highlight?')) return;
    try {
      const res = await fetch(`/api/admin/features?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchFeatures();
    } catch (err) {
      console.error('Error deleting feature:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Zap size={24} className="text-brand-500" />
            <span>Platform Features CMS</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage core agency capabilities, technical feature cards, and highlights.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          <span>Add Feature Highlight</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat) => (
            <div key={feat.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-500 tracking-wider block">{feat.category}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{feat.title}</h3>
                  <p className="text-xs text-brand-400 font-semibold">{feat.tagline}</p>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{feat.desc}</p>

                <ul className="space-y-1.5 pt-2 border-t border-white/10">
                  {feat.bullets.map((bullet, i) => (
                    <li key={i} className="text-[11px] text-gray-400 flex items-start space-x-2">
                      <CheckCircle2 size={12} className="text-brand-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                <button onClick={() => handleDeleteFeature(feat.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add Feature Highlight</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-white glass-card">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddFeature} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Cross-Platform Mobile Excellence"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Mobile Engineering"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="iOS & Android Single Codebase"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Detailed feature description..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Bullets (One per line)</label>
                <textarea
                  rows={3}
                  value={form.bullets}
                  onChange={(e) => setForm({ ...form, bullets: e.target.value })}
                  placeholder="Bullet 1&#10;Bullet 2&#10;Bullet 3"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl glass-card text-xs text-gray-300">Cancel</button>
                <button type="submit" className="bg-gradient-brand text-white px-5 py-2 rounded-xl text-xs font-semibold">Save Feature</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
