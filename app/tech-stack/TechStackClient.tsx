'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Search, 
  X, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import { TechStackCMS } from '@/lib/crm-store';

interface TechStackClientProps {
  initialTechStack: TechStackCMS[];
}

export default function TechStackClient({ initialTechStack }: TechStackClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTech, setSelectedTech] = useState<TechStackCMS | null>(null);

  // Categorize technologies into high-level business clusters
  const categories = useMemo(() => {
    const rawCategories = Array.from(new Set(initialTechStack.map(t => t.category).filter(Boolean)));
    return ['All', ...rawCategories];
  }, [initialTechStack]);

  // Filtered tech stack items
  const filteredTech = useMemo(() => {
    return initialTechStack.filter(t => {
      const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [initialTechStack, selectedCategory, searchQuery]);

  // Grouping statistics
  const stats = useMemo(() => {
    const mobileCount = initialTechStack.filter(t => /mobile|ios|android|flutter|dart|kotlin/i.test(t.category + ' ' + t.name)).length;
    const webCount = initialTechStack.filter(t => /frontend|web|react|next|vue|angular|html|css|tailwind/i.test(t.category + ' ' + t.name)).length;
    const backendCount = initialTechStack.filter(t => /backend|node|express|django|python|laravel|java|c\+\+/i.test(t.category + ' ' + t.name)).length;
    const dbCount = initialTechStack.filter(t => /database|sql|firebase|mongo|postgre/i.test(t.category + ' ' + t.name)).length;

    return {
      total: initialTechStack.length,
      mobile: mobileCount,
      web: webCount,
      backend: backendCount,
      database: dbCount
    };
  }, [initialTechStack]);

  return (
    <div className="min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] transition-colors duration-300 selection:bg-brand-500/30">
      
      {/* ======= HERO SECTION ======= */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-grid-pattern border-b border-[color:var(--border-color)]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] sm:w-[700px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-brand-500/20 via-blue-600/15 to-indigo-600/20 rounded-full blur-[140px] pointer-events-none opacity-70 dark:opacity-100"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
          

          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Cpu size={14} className="text-brand-500" />
              <span>Full-Stack Engineering Stack</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[color:var(--text-primary)] tracking-tight leading-tight">
              Our Technology Stack & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-blue-500 to-indigo-500 dark:from-brand-400 dark:via-blue-400 dark:to-indigo-300">
                Modern Digital Architecture
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[color:var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
              We leverage an ecosystem of {stats.total}+ battle-tested frameworks, cloud infrastructure, and modern languages to engineer blazingly fast mobile applications, scalable SaaS platforms, and enterprise software.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4">
            <div className="glass-card p-4 rounded-2xl border border-[color:var(--border-color)] text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[color:var(--text-primary)] font-mono">{stats.total}+</span>
              <span className="text-xs text-[color:var(--text-muted)] block font-medium">Production Technologies</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-[color:var(--border-color)] text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-500 dark:text-brand-400 font-mono">100%</span>
              <span className="text-xs text-[color:var(--text-muted)] block font-medium">Cloud Native & Scalable</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-[color:var(--border-color)] text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-500 dark:text-blue-400 font-mono">60fps</span>
              <span className="text-xs text-[color:var(--text-muted)] block font-medium">Fluid Mobile Performance</span>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-[color:var(--border-color)] text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 font-mono">99.9%</span>
              <span className="text-xs text-[color:var(--text-muted)] block font-medium">Uptime Reliability</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======= INTERACTIVE FILTER & TECHNOLOGY CATALOG ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Search & Category Filter Bar */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl border border-[color:var(--border-color)] shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technology by name or capability..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[color:var(--card-inner-bg)] border border-[color:var(--border-color)] text-[color:var(--text-primary)] text-xs sm:text-sm placeholder-[color:var(--text-muted)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Results Count Badge */}
            <div className="flex items-center space-x-2 text-xs text-[color:var(--text-muted)] w-full md:w-auto justify-end">
              <span>Showing</span>
              <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-500 dark:text-brand-400 font-mono font-bold border border-brand-500/30">
                {filteredTech.length} of {initialTechStack.length}
              </span>
              <span>technologies</span>
            </div>
          </div>

          {/* Category Filter Pills (Scrollable) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 border-t border-[color:var(--border-color)] scrollbar-none">
            {categories.map((cat) => {
              const count = cat === 'All' 
                ? initialTechStack.length 
                : initialTechStack.filter(t => t.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                    selectedCategory === cat
                      ? 'bg-gradient-brand text-white shadow-lg shadow-brand-500/20 scale-[1.02]'
                      : 'bg-[color:var(--card-inner-bg)] hover:bg-[color:var(--surface)] text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] border border-[color:var(--border-color)]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-[color:var(--card-bg)] text-[color:var(--text-muted)]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tech Stack Grid */}
        {filteredTech.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {filteredTech.map((tech) => (
              <div
                key={tech.id}
                onClick={() => setSelectedTech(tech)}
                className="glass-card glass-card-hover rounded-3xl p-5 sm:p-6 border border-[color:var(--border-color)] bg-[color:var(--card-bg)] flex flex-col justify-between space-y-4 group cursor-pointer relative overflow-hidden transition-all duration-300"
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/15 transition-all"></div>

                <div className="space-y-3.5 relative z-10">
                  
                  {/* Top Category Badge & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wider bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20 truncate max-w-[150px]">
                      {tech.category}
                    </span>
                    <span className="flex items-center space-x-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                      <span>Active</span>
                    </span>
                  </div>

                  {/* Logo & Name Header */}
                  <div className="flex items-center space-x-3.5 pt-1">
                    <div className="w-12 h-12 rounded-2xl bg-[color:var(--card-inner-bg)] border border-[color:var(--border-color)] flex items-center justify-center p-2.5 shrink-0 group-hover:scale-110 group-hover:border-brand-500/50 transition-all duration-300 shadow-md">
                      <img 
                        src={tech.image || '/assets/img/teckstack/react.svg'} 
                        alt={tech.name} 
                        className="max-h-8 max-w-8 w-auto object-contain drop-shadow" 
                        onError={(e: any) => {
                          e.target.src = '/assets/img/teckstack/react.svg';
                        }}
                      />
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <h3 className="text-base font-bold text-[color:var(--text-primary)] group-hover:text-brand-500 dark:group-hover:text-brand-300 transition-colors truncate">
                        {tech.name}
                      </h3>
                      <p className="text-[11px] text-[color:var(--text-muted)] truncate font-mono">
                        {tech.category}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed line-clamp-3 pt-1 border-t border-[color:var(--border-color)]">
                    {tech.description || `Enterprise-grade ${tech.name} implementation engineered for performance, security, and scalability.`}
                  </p>
                </div>

                {/* Footer Interactive Trigger */}
                <div className="pt-3 border-t border-[color:var(--border-color)] flex items-center justify-between text-[11px] text-brand-500 dark:text-brand-400 group-hover:text-brand-600 dark:group-hover:text-brand-300 font-semibold transition-colors">
                  <span>View Technology Details</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-[color:var(--border-color)]">
            <Cpu size={40} className="mx-auto text-brand-500 opacity-60" />
            <h3 className="text-lg font-bold text-[color:var(--text-primary)]">No Technologies Found</h3>
            <p className="text-xs text-[color:var(--text-muted)] max-w-md mx-auto">
              No matching technologies for &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;. Try clearing your search query.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-5 py-2 rounded-xl bg-[color:var(--card-inner-bg)] hover:bg-[color:var(--surface)] text-[color:var(--text-primary)] text-xs font-semibold border border-[color:var(--border-color)] transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* ======= TECHNOLOGY DETAILS MODAL ======= */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[color:var(--border-color)] pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[color:var(--card-inner-bg)] border border-[color:var(--border-color)] flex items-center justify-center p-3 shrink-0 shadow-lg">
                  <img 
                    src={selectedTech.image || '/assets/img/teckstack/react.svg'} 
                    alt={selectedTech.name} 
                    className="max-h-9 max-w-9 w-auto object-contain" 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-[color:var(--text-primary)]">{selectedTech.name}</h3>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Production Ready
                    </span>
                  </div>
                  <p className="text-xs text-brand-500 dark:text-brand-400 font-semibold">{selectedTech.category}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTech(null)} 
                className="p-2 rounded-xl text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--surface)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* In-Depth Capability Details */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[color:var(--text-muted)] uppercase tracking-wider">How We Leverage {selectedTech.name}</span>
                <p className="text-[color:var(--text-secondary)] leading-relaxed bg-[color:var(--card-inner-bg)] p-3.5 rounded-2xl border border-[color:var(--border-color)]">
                  {selectedTech.description || `Innovateria integrates ${selectedTech.name} to deliver ultra-fast, robust, and maintainable software architecture with high scalability.`}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[color:var(--text-muted)] uppercase tracking-wider">Key Architectural Advantages</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[color:var(--text-secondary)]">
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-[color:var(--card-inner-bg)] border border-[color:var(--border-color)]">
                    <CheckCircle2 size={14} className="text-brand-500 dark:text-brand-400 shrink-0" />
                    <span>High Throughput & Speed</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-[color:var(--card-inner-bg)] border border-[color:var(--border-color)]">
                    <CheckCircle2 size={14} className="text-brand-500 dark:text-brand-400 shrink-0" />
                    <span>Enterprise Security Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-[color:var(--card-inner-bg)] border border-[color:var(--border-color)]">
                    <CheckCircle2 size={14} className="text-brand-500 dark:text-brand-400 shrink-0" />
                    <span>Seamless Cloud Integration</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-[color:var(--card-inner-bg)] border border-[color:var(--border-color)]">
                    <CheckCircle2 size={14} className="text-brand-500 dark:text-brand-400 shrink-0" />
                    <span>Continuous CI/CD Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-[color:var(--border-color)]">
              <button 
                onClick={() => setSelectedTech(null)} 
                className="flex-1 py-2.5 rounded-xl glass-card text-xs font-semibold text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-all cursor-pointer text-center border border-[color:var(--border-color)]"
              >
                Close
              </button>
              <Link 
                href="/contact"
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-all text-center"
              >
                <span>Build With {selectedTech.name}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======= BOTTOM PROJECT CTA BANNER ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-brand-500/30 text-center space-y-6 relative overflow-hidden bg-gradient-to-r from-brand-500/10 via-blue-600/10 to-indigo-600/10 shadow-2xl">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest bg-brand-500/20 px-3.5 py-1.5 rounded-full border border-brand-500/30">
              Ready to Engineer Your Vision?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[color:var(--text-primary)] tracking-tight">
              Let&apos;s Build Your Next Scalable Digital Product
            </h2>
            <p className="text-xs sm:text-sm text-[color:var(--text-secondary)] leading-relaxed">
              Whether you need native mobile apps, an AI-powered SaaS portal, or a high-traffic microservices backend, our team uses the exact right tools for the job.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-brand text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-xl shadow-brand-500/30 hover:scale-[1.02] transition-all"
            >
              <span>Schedule Free Technical Consultation</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 glass-card hover:bg-[color:var(--surface)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-[color:var(--border-color)] transition-colors"
            >
              <span>Explore Our Live Portfolio</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
