'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, Phone, Mail, Building, FolderKanban, DollarSign, X, Upload, Loader2, Edit3, Trash2, Save } from 'lucide-react';
import { Client } from '@/lib/crm-store';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectsCount: 1,
    totalSpent: '₹1,00,000',
    avatar: '/assets/img/team/vivekajee.png',
    status: 'active' as Client['status']
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      if (data.success && Array.isArray(data.clients)) {
        setClients(data.clients);
      } else {
        setClients([]);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setClients([]);
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
        if (isEdit && editingClient) {
          setEditingClient({ ...editingClient, avatar: data.url });
        } else {
          setNewClient({ ...newClient, avatar: data.url });
        }
      }
    } catch (err) {
      console.error('Error uploading image file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      if (res.ok) {
        fetchClients();
        setShowAddModal(false);
        setNewClient({
          name: '',
          company: '',
          email: '',
          phone: '',
          projectsCount: 1,
          totalSpent: '₹1,00,000',
          avatar: '/assets/img/team/vivekajee.png',
          status: 'active'
        });
      }
    } catch (err) {
      console.error('Error adding client:', err);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClient)
      });
      if (res.ok) {
        fetchClients();
        setEditingClient(null);
      }
    } catch (err) {
      console.error('Error updating client:', err);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client record?')) return;
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  const filteredClients = (clients || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      {/* Fixed Header & Search Bar */}
      <div className="shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Users size={24} className="text-brand-500" />
              <span>Client Directory CRM</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Manage active enterprise clients, uploaded avatars, contracts, and revenue totals.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
          >
            <Plus size={16} />
            <span>Add New Client</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients by name, company, or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs placeholder-gray-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Client Directory Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div key={client.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold shrink-0">
                    {client.avatar ? (
                      <img src={client.avatar} alt={client.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-lg">{client.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{client.name}</h3>
                    <p className="text-xs text-brand-400 font-medium flex items-center space-x-1">
                      <Building size={12} />
                      <span>{client.company}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-xs text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                  <div className="glass-card p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[10px] text-gray-400">Projects</span>
                    <span className="text-xs font-bold text-white">{client.projectsCount} Active</span>
                  </div>
                  <div className="glass-card p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[10px] text-gray-400">Total Contract</span>
                    <span className="text-xs font-bold text-emerald-400">{client.totalSpent}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-3 border-t border-white/10 w-full">
                <button onClick={() => setEditingClient(client)} className="flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all cursor-pointer">
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button onClick={() => handleDeleteClient(client.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Client Record</h3>
              <button onClick={() => setEditingClient(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateClient} className="space-y-3">
              {/* Image Upload & Preview */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Client Avatar / Logo</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0">
                    <img src={editingClient.avatar || '/assets/img/team/vivekajee.png'} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Avatar'}</span>
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
                      value={editingClient.avatar || ''}
                      onChange={(e) => setEditingClient({ ...editingClient, avatar: e.target.value })}
                      placeholder="/assets/img/team/vivekajee.png"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={editingClient.company}
                  onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={editingClient.phone}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Active Projects</label>
                  <input
                    type="number"
                    value={editingClient.projectsCount}
                    onChange={(e) => setEditingClient({ ...editingClient, projectsCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Total Contract Value</label>
                  <input
                    type="text"
                    value={editingClient.totalSpent}
                    onChange={(e) => setEditingClient({ ...editingClient, totalSpent: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingClient(null)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">
                  <Save size={14} />
                  <span>Save Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Client</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-3">
              {/* Image Upload & Preview */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Client Avatar / Logo</label>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0">
                    <img src={newClient.avatar} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Avatar'}</span>
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
                      value={newClient.avatar}
                      onChange={(e) => setNewClient({ ...newClient, avatar: e.target.value })}
                      placeholder="/assets/img/team/vivekajee.png"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. Ankit Gupta"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="TechCorp Innovations"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="ankit@techcorp.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+91-9876543210"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Active Projects</label>
                  <input
                    type="number"
                    value={newClient.projectsCount}
                    onChange={(e) => setNewClient({ ...newClient, projectsCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Total Contract Value</label>
                  <input
                    type="text"
                    value={newClient.totalSpent}
                    onChange={(e) => setNewClient({ ...newClient, totalSpent: e.target.value })}
                    placeholder="₹1,50,000"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">
                  <span>Save Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
