'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Search, ArrowRight, MessageSquare } from 'lucide-react';
import { FAQItemCMS } from '@/lib/crm-store';

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQItemCMS[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/admin/faqs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setFaqs(data.faqs);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          How Can We <span className="text-gradient-brand">Help You?</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          Clear answers about Innovateria&apos;s software development, pricing, server deployment, and technical support.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions about pricing, timeline, mobile apps..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[color:var(--card-bg)] border border-[color:var(--border-color)] text-white text-sm placeholder-gray-400 focus:outline-none focus:border-brand-500 transition-colors shadow-lg"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm glass-card rounded-2xl border border-white/10">
            No matching questions found.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={faq.id || idx}
                className="glass-card rounded-2xl border border-[color:var(--border-color)] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex justify-between items-center space-x-4 hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight pt-1">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-brand-500 text-white' : ''
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[color:var(--border-color)] text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#0B0F17]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      <div className="glass-card rounded-3xl p-8 border border-[color:var(--border-color)] text-center space-y-4 max-w-2xl mx-auto">
        <MessageSquare size={32} className="mx-auto text-brand-500" />
        <h3 className="text-xl font-bold text-white">Still Have Questions?</h3>
        <p className="text-xs text-gray-300">
          Our engineering team is ready to discuss your specific requirements.
        </p>
        <Link 
          href="/contact" 
          className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-6 py-3 rounded-full text-xs font-semibold shadow-lg hover:shadow-brand-500/30 transition-all"
        >
          <span>Inquire Direct Contact</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}
