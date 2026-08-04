'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit3, Trash2, X, ChevronDown } from 'lucide-react';
import { FAQItemCMS } from '@/lib/crm-store';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItemCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItemCMS | null>(null);

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'General' as FAQItemCMS['category']
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      if (data.success) setFaqs(data.faqs);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        fetchFaqs();
        setShowAddModal(false);
        setForm({ question: '', answer: '', category: 'General' });
      }
    } catch (err) {
      console.error('Error creating FAQ:', err);
    }
  };

  const handleUpdateFaq = async () => {
    if (!editingFaq) return;
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq)
      });
      if (res.ok) {
        fetchFaqs();
        setEditingFaq(null);
      }
    } catch (err) {
      console.error('Error updating FAQ:', err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ entry?')) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchFaqs();
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 w-full min-h-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <HelpCircle size={24} className="text-brand-500" />
            <span>FAQs CMS Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Add, edit, delete, and categorize questions & answers on the public FAQ page.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          <span>Add FAQ Entry</span>
        </button>
      </div>

      {/* Scrollable FAQ List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-12 pr-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4 w-full">
          {faqs.map((faq) => (
            <div key={faq.id} className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                    {faq.category}
                  </span>
                  <h3 className="text-base font-bold text-white pt-1">{faq.question}</h3>
                </div>

                <div className="flex space-x-2 shrink-0">
                  <button onClick={() => setEditingFaq(faq)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 transition-all">
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => handleDeleteFaq(faq.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all">
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed pt-2 border-t border-white/10">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Edit FAQ Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit FAQ</h3>
              <button onClick={() => setEditingFaq(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Question</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Answer</label>
                <textarea
                  rows={3}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
              <button onClick={() => setEditingFaq(null)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
              <button onClick={handleUpdateFaq} className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">Save FAQ</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add FAQ Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 glass-card transition-all cursor-pointer border border-white/10" title="Close popup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddFaq} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                >
                  <option value="General">General</option>
                  <option value="Services">Services</option>
                  <option value="Pricing">Pricing</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. What mobile app frameworks do you use?"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Answer *</label>
                <textarea
                  required
                  rows={3}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Detailed answer..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-white text-xs resize-none"
                ></textarea>
              </div>
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all cursor-pointer">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
