import Link from 'next/link';
import ServiceIcon from '@/components/ServiceIcon';
import ContactForm from '@/components/ContactForm';
import { getServicesCMS } from '@/lib/crm-store';
import { ChevronRight, CheckCircle2, Wrench, Sparkles, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AllServicesPage() {
  const services = getServicesCMS();

  return (
    <div className="space-y-16 pb-16 pt-6">
      {/* ======= HERO HEADER ======= */}
      <section className="text-center max-w-4xl mx-auto space-y-4 px-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-flex items-center space-x-1.5">
          <Sparkles size={14} />
          <span>Full Service Digital Catalog</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Comprehensive Software & <span className="text-gradient-brand">Digital Services</span>
        </h1>
        <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          From mobile apps and multi-vendor marketplaces to enterprise software and search engine dominance — explore our full suite of technology solutions.
        </p>
      </section>

      {/* ======= ALL SERVICES GRID ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                    <ServiceIcon iconName={srv.iconName} title={srv.title} size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
                    {srv.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">{srv.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed mt-2 line-clamp-3">{srv.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-2 pt-3 border-t border-white/10">
                  {(srv.features || []).slice(0, 4).map((feat, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start space-x-2">
                      <CheckCircle2 size={14} className="text-brand-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <Link
                  href={`/${srv.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-400 group-hover:text-white transition-colors"
                >
                  <span>Explore Details</span>
                  <ChevronRight size={14} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-1 bg-white/5 hover:bg-brand-500/20 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 transition-all"
                >
                  <span>Get Quote</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======= CONTACT CTA ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ContactForm />
      </section>
    </div>
  );
}
