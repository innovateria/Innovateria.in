import Link from 'next/link';
import { getFeaturesCMS } from '@/lib/crm-store';
import { 
  Zap, 
  ShieldCheck, 
  Settings2, 
  Code2, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Smartphone,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Features & Capabilities | Innovateria',
  description: 'Discover key features, security, technology stack, and customizable software capabilities by Innovateria.',
};

export default function FeaturePage() {
  const dynamicFeatures = getFeaturesCMS();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Platform Capabilities & Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Engineered For <span className="text-gradient-brand">Performance & Scale</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          Discover why enterprises and businesses choose Innovateria for custom mobile applications, web engineering, and software architectures.
        </p>
      </div>

      {/* Dynamic Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dynamicFeatures.map((feat) => (
          <div key={feat.id} className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <Zap size={24} />
              </div>

              <div>
                <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block mb-1">
                  {feat.category}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-500 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-brand-400 font-semibold mt-0.5">{feat.tagline}</p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                {feat.desc}
              </p>

              <ul className="space-y-2 pt-3 border-t border-white/10">
                {feat.bullets.map((bullet, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-brand-500 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link href="/contact" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-500 hover:text-white transition-colors">
                <span>Inquire About Capability</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
