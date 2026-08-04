'use client';

import { useState, useEffect } from 'react';
import { Wrench, Plus, Edit3, Trash2, X, Save, CheckCircle2, Upload, Loader2 } from 'lucide-react';
import { ServiceCMS } from '@/lib/crm-store';
import ServiceIcon from '@/components/ServiceIcon';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCMS | null>(null);
  const [editFeaturesText, setEditFeaturesText] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: 'Mobile Solutions',
    slug: 'mobile',
    iconName: 'Smartphone',
    description: '',
    image: '/assets/img/android.png',
    features: '',
    status: 'active' as ServiceCMS['status']
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]);
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
        if (isEdit && editingService) {
          setEditingService({ ...editingService, image: data.url });
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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        features: form.features.split('\n').map(f => f.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchServices();
        setShowAddModal(false);
        setForm({ title: '', category: 'Mobile Solutions', slug: 'mobile', iconName: 'Smartphone', description: '', image: '/assets/img/android.png', features: '', status: 'active' });
      }
    } catch (err) {
      console.error('Error creating service:', err);
    }
  };

  const startEditService = (srv: ServiceCMS) => {
    setEditingService(srv);
    setEditFeaturesText(Array.isArray(srv.features) ? srv.features.join('\n') : '');
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const payload = {
        ...editingService,
        features: editFeaturesText.split('\n').map(f => f.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchServices();
        setEditingService(null);
      }
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service entry?')) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Wrench size={24} className="text-brand-500" />
            <span>Services CMS Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage agency service offerings, uploaded images, and capabilities.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Scrollable Services Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(services || []).map((srv) => (
            <div key={srv.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">{srv.category}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    srv.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {srv.status}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center p-2 shrink-0 text-brand-400">
                    <ServiceIcon iconName={srv.iconName} title={srv.title} size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{srv.title}</h3>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{srv.description}</p>

                <ul className="space-y-1.5 pt-2 border-t border-white/10">
                  {(srv.features || []).map((feat, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-brand-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                <button onClick={() => startEditService(srv)} className="flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all cursor-pointer">
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button onClick={() => handleDeleteService(srv.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Service Offering</h3>
              <button onClick={() => setEditingService(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateService} className="space-y-3">
              {/* Image Upload & Preview */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Service Icon / Banner Image</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0 flex items-center justify-center p-1">
                    <img src={editingService.image || '/assets/img/android.png'} alt="Preview" className="max-h-10 w-auto object-contain" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
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
                      value={editingService.image || ''}
                      onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                      placeholder="/assets/img/android.png"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Category</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs font-medium"
                  >
                    <option value="Mobile Solutions">Mobile Solutions</option>
                    <option value="Software Architecture">Software Architecture</option>
                    <option value="Web Engineering">Web Engineering</option>
                    <option value="Growth & SEO">Growth & SEO</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="E-Commerce Solutions">E-Commerce Solutions</option>
                    <option value="On-Demand Apps">On-Demand Apps</option>
                    <option value="Website Maintenance">Website Maintenance</option>
                    <option value="Growth & Performance">Growth & Performance</option>
                    {editingService.category && !['Mobile Solutions', 'Software Architecture', 'Web Engineering', 'Growth & SEO', 'Brand Identity', 'E-Commerce Solutions', 'On-Demand Apps', 'Website Maintenance', 'Growth & Performance'].includes(editingService.category) && (
                      <option value={editingService.category}>{editingService.category}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Status</label>
                  <select
                    value={editingService.status || 'active'}
                    onChange={(e) => setEditingService({ ...editingService, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Features (One feature per line)</label>
                <textarea
                  rows={4}
                  value={editFeaturesText}
                  onChange={(e) => setEditFeaturesText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingService(null)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">
                  <Save size={14} />
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Service</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddService} className="space-y-3">
              {/* Image Upload & Preview */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Service Icon / Image</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0 flex items-center justify-center p-1">
                    <img src={form.image} alt="Preview" className="max-h-10 w-auto object-contain" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
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
                <label className="block text-xs text-gray-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Artificial Intelligence Solutions"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="AI & Cloud"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="ai-cloud"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed description..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Features (One feature per line)</label>
                <textarea
                  rows={3}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">
                  <span>Create Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
