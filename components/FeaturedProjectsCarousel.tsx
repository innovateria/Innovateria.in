'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Star, ChevronRight, ChevronLeft, Github, ArrowRight } from 'lucide-react';
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
          container.scrollLeft += 0.8;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 inline-flex items-center space-x-1.5">
            <Star size={12} className="fill-amber-400" />
            <span>Proven Deliverables</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Case <span className="text-gradient-brand">Studies</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-xl glass-card border border-white/10 text-gray-300 hover:text-white hover:bg-brand-500/20 transition-all"
              aria-label="Previous project"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-xl glass-card border border-white/10 text-gray-300 hover:text-white hover:bg-brand-500/20 transition-all"
              aria-label="Next project"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400 hover:text-white bg-white/5 hover:bg-brand-500/20 px-4 py-2 rounded-xl border border-white/10 transition-all"
          >
            <span>Explore All 12 Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex space-x-6 overflow-x-auto scroll-smooth py-2 px-1 select-none no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((p) => (
          <div
            key={p.id}
            className="w-[300px] sm:w-[360px] shrink-0 glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group transition-all duration-300 hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-500/10"
          >
            <div>
              {/* Image Header */}
              <div className="relative w-full h-48 bg-[#0B0F17] overflow-hidden border-b border-white/10">
                <img
                  src={p.image || '/assets/img/services/soft.png'}
                  alt={p.title}
                  className="w-full h-full object-cover object-center min-w-full min-h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-black/40"></div>

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider bg-black/80 backdrop-blur-md border border-brand-500/30 px-3 py-1 rounded-xl">
                    {p.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider bg-amber-500/20 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded-full flex items-center space-x-1">
                    <Star size={10} className="fill-amber-300" />
                    <span>Featured</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <Link href={`/projects/${p.id}`}>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors truncate">
                    {p.title}
                  </h3>
                </Link>

                {p.desc && (
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                    {p.desc}
                  </p>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(p.techStack || []).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-2 py-0.5 rounded-lg transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 pt-3 border-t border-white/10 flex justify-between items-center bg-white/5">
              {p.github ? (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-400 hover:text-white transition-colors"
                >
                  <Github size={14} />
                  <span>GitHub Repo</span>
                </a>
              ) : (
                <span />
              )}

              <Link
                href={`/projects/${p.id}`}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                <span>View Details</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
