'use client';

import { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit3, Trash2, X, Github, Linkedin, Twitter, Globe, MapPin, Save, Upload, Loader2 } from 'lucide-react';
import { TeamMemberCMS } from '@/lib/crm-store';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMemberCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberCMS | null>(null);
  const [editSkillsText, setEditSkillsText] = useState('');

  const [form, setForm] = useState({
    name: '',
    role: '',
    company: 'Innovateria',
    location: 'Bangalore, IN',
    bio: '',
    image: '/assets/img/team/vivekajee.png',
    skills: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: ''
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.success && Array.isArray(data.team)) {
        setTeam(data.team);
      } else {
        setTeam([]);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
      setTeam([]);
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
        if (isEdit && editingMember) {
          setEditingMember({ ...editingMember, image: data.url });
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

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchTeam();
        setShowAddModal(false);
        setForm({ name: '', role: '', company: 'Innovateria', location: 'Bangalore, IN', bio: '', image: '/assets/img/team/vivekajee.png', skills: '', github: '', linkedin: '', twitter: '', website: '' });
      }
    } catch (err) {
      console.error('Error creating team member:', err);
    }
  };

  const startEditMember = (member: TeamMemberCMS) => {
    setEditingMember(member);
    setEditSkillsText(Array.isArray(member.skills) ? member.skills.join(', ') : '');
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      const payload = {
        ...editingMember,
        skills: editSkillsText.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/admin/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchTeam();
        setEditingMember(null);
      }
    } catch (err) {
      console.error('Error updating team member:', err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member profile?')) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTeam();
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <UserCheck size={24} className="text-brand-500" />
            <span>Team Members CMS</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage team profiles, designations, uploaded photos, and skills.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Scrollable Team Member Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(team || []).map((member) => (
            <div key={member.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-brand-500/40 p-1 bg-[#131A29]">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-extrabold text-lg">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-xs text-brand-400 font-semibold mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-gray-400 flex items-center justify-center space-x-1 mt-1">
                    <MapPin size={11} />
                    <span>{member.location}</span>
                  </p>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed text-center">
                  {member.bio}
                </p>

                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  {(member.skills || []).map((skill, i) => (
                    <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
                <div className="flex items-center space-x-2 text-gray-400">
                  {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-white p-1.5 rounded-lg bg-white/5 border border-white/10 transition-all" title="GitHub Profile"><Github size={13} /></a>}
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white p-1.5 rounded-lg bg-white/5 border border-white/10 transition-all" title="LinkedIn Profile"><Linkedin size={13} /></a>}
                  {member.website && <a href={member.website} target="_blank" rel="noopener noreferrer" className="hover:text-white p-1.5 rounded-lg bg-white/5 border border-white/10 transition-all" title="Personal Website"><Globe size={13} /></a>}
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => startEditMember(member)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all cursor-pointer">
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => handleDeleteMember(member.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer">
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Edit Team Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Team Member Profile</h3>
              <button onClick={() => setEditingMember(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateMember} className="space-y-3">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Profile Photo</label>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0">
                    <img src={editingMember.image || '/assets/img/team/vivekajee.png'} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
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
                      value={editingMember.image}
                      onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                      placeholder="/assets/img/team/vivekajee.png"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingMember.location}
                    onChange={(e) => setEditingMember({ ...editingMember, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Bio Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editSkillsText}
                  onChange={(e) => setEditSkillsText(e.target.value)}
                  placeholder="Flutter, Next.js, React, Node.js"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={editingMember.github || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, github: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={editingMember.linkedin || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingMember(null)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">
                  <Save size={14} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add Team Member</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-3">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs text-gray-300 mb-1">Profile Photo</label>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0B0F17] border border-white/10 shrink-0">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all">
                      {uploading ? <Loader2 size={14} className="animate-spin text-brand-400" /> : <Upload size={14} />}
                      <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
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
                      placeholder="/assets/img/team/vivekajee.png"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Mobile App Lead"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Bangalore, IN"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Bio Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Brief biography..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="Flutter, Next.js, React, Node.js"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">
                  <span>Save Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
