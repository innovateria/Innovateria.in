'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Star, GitFork, ChevronRight, ChevronLeft, Github, ExternalLink, Code2 } from 'lucide-react';
import { OpenSourceProjectCMS } from '@/lib/crm-store';

interface OpenSourceProjectsCarouselProps {
  projects: OpenSourceProjectCMS[];
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showExploreLink?: boolean;
  exploreLinkHref?: string;
  exploreLinkLabel?: string;
}

export default function OpenSourceProjectsCarousel({
  projects,
  title = 'Featured Open Source Projects',
  subtitle = 'Public open source applications, libraries, and frameworks built & maintained by our engineering team.',
  showHeader = true,
  showExploreLink = true,
  exploreLinkHref = '/portfolio',
  exploreLinkLabel = 'Explore All Repos →'
}: OpenSourceProjectsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container || projects.length === 0) return;

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
  }, [isHovered, projects.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center text-gray-400 border border-white/10">
        No open source projects available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-flex items-center space-x-1.5">
              <Code2 size={14} />
              <span>Open Source Contributions</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleScroll('left')}
                className="p-2 rounded-xl glass-card border border-white/10 text-gray-300 hover:text-white hover:bg-brand-500/20 transition-all"
                aria-label="Previous open source project"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-2 rounded-xl glass-card border border-white/10 text-gray-300 hover:text-white hover:bg-brand-500/20 transition-all"
                aria-label="Next open source project"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {showExploreLink && (
              <Link
                href={exploreLinkHref}
                className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-lg hover:shadow-brand-500/30 transition-all"
              >
                <Github size={14} />
                <span>{exploreLinkLabel}</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex space-x-6 overflow-x-auto scroll-smooth py-2 px-1 select-none no-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((p) => (
          <div
            key={p.id}
            className="w-[290px] sm:w-[350px] shrink-0 glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4 group transition-all duration-300 hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-500/10"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
                  ⚡ {p.category}
                </span>

                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-white">{p.stars || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <GitFork size={12} />
                    <span className="font-semibold text-white">{p.forks || 0}</span>
                  </span>
                </div>
              </div>

              <Link href={`/projects/${p.id}`}>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                  {p.title}
                </h3>
              </Link>

              <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 min-h-[54px]">
                {p.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {(p.tags || []).map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                {p.githubUrl ? (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-400 hover:text-white transition-colors"
                  >
                    <Github size={14} />
                    <span>View Repo</span>
                  </a>
                ) : (
                  <span />
                )}

                {p.liveDemoUrl ? (
                  <a
                    href={p.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-300 hover:text-white transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <Link
                    href={`/projects/${p.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    <span>Details</span>
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
