import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import ServiceIcon from '@/components/ServiceIcon';
import FeaturedProjectsCarousel from '@/components/FeaturedProjectsCarousel';
import { 
  getHeroStatsCMS, 
  getTechStackCMS, 
  getServicesCMS,
  getCompanyValuesCMS,
  getProjects
} from '@/lib/crm-store';
import { 
  Smartphone, 
  Code2, 
  Globe2, 
  Palette, 
  Search, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Award, 
  FolderCheck, 
  Clock, 
  ChevronRight,
  Sparkles,
  Github,
  Star,
  GitFork,
  ExternalLink
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const services = getServicesCMS();
  const metrics = getHeroStatsCMS();
  const techStack = getTechStackCMS();
  const allProjects = getProjects();
  const featuredProjects = allProjects.filter(p => p.featured !== false);
  const values = getCompanyValuesCMS();

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 pb-12 sm:pb-16">
      
      {/* ======= HERO SECTION ======= */}
      <section className="relative pb-4 sm:pb-8 overflow-hidden bg-grid-pattern">
        <div 
          className="absolute inset-0 bg-top bg-no-repeat bg-cover opacity-20 pointer-events-none mix-blend-screen"
          style={{ backgroundImage: 'url(/assets/img/backgrounds/hero-bg.png)' }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,78,46,0.16),transparent_45%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Hero Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/30 text-brand-500 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} className="animate-pulse" />
                <span>Next-Gen Digital Product Agency</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Empowering Businesses With <span className="text-gradient-brand">Innovateria</span> Solutions
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Always Innovation is the key to stay relevant. We engineer high-performance mobile apps, enterprise software, modern web platforms, and organic growth marketing systems.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-brand text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>Start Your Project</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/projects"
                  className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all text-center"
                >
                  Explore Projects Showcase
                </Link>
              </div>

              {/* Dynamic Metrics Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                {metrics.map((m, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">{m.value}</span>
                    <span className="text-[11px] font-semibold text-gray-400 block mt-0.5">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Hero Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="glass-card rounded-[2rem] p-6 sm:p-8 border border-white/15 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-500 font-bold">
                        <Code2 size={22} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Full-Stack Solutions</h4>
                        <span className="text-[10px] text-brand-400 font-semibold uppercase">Mobile • Web • Software</span>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>

                  <div className="space-y-3">
                    <div className="glass-card p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                      <span className="text-gray-300">Mobile Apps (Android & iOS)</span>
                      <span className="text-brand-500 font-bold">Flutter & Kotlin</span>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                      <span className="text-gray-300">Web Platforms & Portals</span>
                      <span className="text-brand-500 font-bold">Next.js & React</span>
                    </div>
                    <div className="glass-card p-3.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                      <span className="text-gray-300">Enterprise Cloud Backends</span>
                      <span className="text-brand-500 font-bold">Laravel & PostgreSQL</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/services" className="block text-center text-xs font-semibold text-brand-400 hover:text-white transition-colors">
                      View All Dynamic Services →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======= DYNAMIC SERVICES GRID ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 -mt-6 sm:-mt-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
            Core Agency Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Specialized Software <span className="text-gradient-brand">Services</span>
          </h2>
          <p className="text-sm text-gray-300">
            Tailored engineering services designed to help startups and enterprises build, launch, and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((s) => (
            <div key={s.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <ServiceIcon iconName={s.iconName} title={s.title} size={24} />
                </div>
                <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">{s.category}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-500 transition-colors">{s.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <Link href={`/${s.slug}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-400 group-hover:text-white transition-colors">
                  <span>Explore Service</span>
                  <ChevronRight size={14} />
                </Link>

                <Link href="/contact" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Get Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/services"
            className="inline-flex items-center space-x-2 text-xs font-bold text-brand-400 hover:text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 px-6 py-3 rounded-full transition-all shadow-lg"
          >
            <span>Explore All 19 Services →</span>
          </Link>
        </div>
      </section>

      {/* ======= DYNAMIC TECH STACK ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
            Technology Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Technologies We Excel In</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4">
          {techStack.map((t, idx) => (
            <div key={idx} className="glass-card glass-card-hover p-4 rounded-2xl border border-white/10 text-center space-y-2.5 group flex flex-col items-center justify-center">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src={t.image} alt={t.name} className="max-h-10 max-w-10 w-auto object-contain drop-shadow-lg" style={{ background: 'transparent' }} />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-brand-500 transition-colors block">{t.name}</span>
              <span className="text-[10px] text-gray-400 block">{t.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ======= DYNAMIC FEATURED PROJECTS SHOWCASE CAROUSEL ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedProjectsCarousel projects={featuredProjects} />
      </section>

      {/* ======= CONTACT FORM SECTION ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ContactForm />
      </section>

    </div>
  );
}
