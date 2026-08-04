'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Star, ChevronRight, ChevronLeft, Github, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { ProjectCRM } from '@/lib/crm-store';

interface FeaturedProjectsCarouselProps {
  projects: ProjectCRM[];
}

export default function FeaturedProjectsCarousel({ projects }: FeaturedProjectsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animId: number;

    const autoScroll = () => {
      if (!isHovered && container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 2) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 0.7;
        }
      }
      animId = requestAnimationFrame(autoScroll);
    };

    animId = requestAnimationFrame(autoScroll);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isHovered]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header Bar with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border-color)] pb-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-flex items-center space-x-1.5 shadow-sm shadow-amber-500/10">
            <Star size={12} className="fill-amber-500 dark:fill-amber-400" />
            <span>Proven Deliverables</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Featured Case <span className="text-gradient-brand">Studies</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-xl backdrop-blur-md bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:text-white hover:bg-brand-500 hover:border-brand-500/40 transition-all duration-300 shadow-sm"
              aria-label="Previous project"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-xl backdrop-blur-md bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:text-white hover:bg-brand-500 hover:border-brand-500/40 transition-all duration-300 shadow-sm"
              aria-label="Next project"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 text-xs font-bold text-brand-500 dark:text-brand-300 hover:text-white bg-[var(--surface)] hover:bg-brand-500 px-4 py-2.5 rounded-xl border border-[var(--border-color)] hover:border-brand-500 transition-all duration-300 shadow-sm"
          >
            <span>Explore All Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex space-x-6 overflow-x-auto scroll-smooth py-3 px-1 select-none no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((p) => (
          <div
            key={p.id}
            className="w-[310px] sm:w-[370px] shrink-0 backdrop-blur-xl bg-[var(--card-bg)] rounded-3xl overflow-hidden border border-[var(--border-color)] flex flex-col justify-between group transition-all duration-300 hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-1.5"
          >
            <div>
              {/* Image Header */}
              <div className="relative w-full h-48 sm:h-52 bg-[var(--card-inner-bg)] overflow-hidden border-b border-[var(--border-color)]">
                <img
                  src={p.image || '/assets/img/services/soft.png'}
                  alt={p.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-black/30 pointer-events-none"></div>

                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="text-[10px] font-bold text-brand-500 dark:text-brand-300 uppercase tracking-wider bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--border-color)] px-3 py-1 rounded-xl shadow-md">
                    {p.category}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-300 uppercase tracking-wider bg-amber-500/15 backdrop-blur-md border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
                    <Sparkles size={10} className="text-amber-500 dark:text-amber-400 animate-pulse" />
                    <span>Case Study</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3.5">
                {p.clientName && (
                  <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-brand-500 dark:text-brand-400 tracking-wide uppercase">
                    <Layers size={12} className="text-brand-500 dark:text-brand-400" />
                    <span>{p.clientName}</span>
                  </div>
                )}

                <Link href={`/projects/${p.id}`}>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-300 line-clamp-1">
                    {p.title}
                  </h3>
                </Link>

                {p.desc && (
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                    {p.desc}
                  </p>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(p.techStack || []).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium font-mono bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)] group-hover:border-brand-500/30 px-2.5 py-1 rounded-full transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 pt-3.5 border-t border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-primary)]/40">
              {p.github ? (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface)] hover:bg-brand-500/10 px-3 py-1.5 rounded-xl border border-[var(--border-color)] transition-all duration-300"
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
              ) : (
                <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping inline-block mr-1" />
                  Live Production
                </span>
              )}

              <Link
                href={`/projects/${p.id}`}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-500 hover:text-white dark:text-brand-300 dark:hover:text-white bg-brand-500/10 hover:bg-brand-500 px-3.5 py-1.5 rounded-xl border border-brand-500/30 transition-all duration-300 shadow-sm"
              >
                <span>View Details</span>
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
