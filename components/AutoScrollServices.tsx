'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import ServiceIcon from '@/components/ServiceIcon';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { ServiceCMS } from '@/lib/crm-store';

interface AutoScrollServicesProps {
  services: ServiceCMS[];
}

export default function AutoScrollServices({ services }: AutoScrollServicesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const autoScroll = () => {
      if (!isHovered && scrollContainer) {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 0.8;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Auto-scrolling horizontal carousel */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex space-x-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-2 select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {services.map((s) => (
          <div
            key={s.id}
            className="w-80 sm:w-96 shrink-0 glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4 group/card transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover/card:bg-brand-500 group-hover/card:text-white transition-all duration-300">
                  <ServiceIcon iconName={s.iconName} title={s.title} size={24} />
                </div>
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
                  {s.category}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover/card:text-brand-400 transition-colors line-clamp-1">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mt-2 line-clamp-3">
                  {s.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <Link
                href={`/${s.slug}`}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 group-hover/card:text-white transition-colors"
              >
                <span>Explore Service</span>
                <ChevronRight size={14} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white transition-colors"
              >
                <span>Get Quote</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All Redirect CTA */}
      <div className="text-center pt-2">
        <Link
          href="/services"
          className="inline-flex items-center space-x-2 text-xs font-bold text-brand-400 hover:text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 px-5 py-2.5 rounded-full transition-all shadow-lg"
        >
          <span>View All 19 Specialized Services →</span>
        </Link>
      </div>
    </div>
  );
}
