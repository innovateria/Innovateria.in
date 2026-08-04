import Link from 'next/link';
import { getCompanyValuesCMS } from '@/lib/crm-store';
import { Target, Eye, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Innovateria | Digital Agency in India',
  description: 'Learn how Innovateria builds high-impact Android apps, enterprise software, modern websites, SEO strategies, and digital marketing solutions.',
  alternates: { canonical: 'https://innovateria.in/about' },
  openGraph: {
    title: 'About Innovateria | Digital Agency in India',
    description: 'Discover Innovateria’s mission, values, and expertise in app development, software engineering, web design, and growth marketing.',
    url: 'https://innovateria.in/about',
  },
};

export default function AboutPage() {
  const companyValues = getCompanyValuesCMS();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Map Background Layer */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url(/assets/img/backgrounds/map2.png)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/60 via-transparent to-[#0B0F17] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Who We Are
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          About <span className="text-gradient-brand">Innovateria</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          Always Innovation is the key to stay relevant. We build cutting-edge software, mobile applications, web platforms, and marketing solutions that drive business transformation.
        </p>
      </div>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6">
          <h2 className="text-2xl font-bold text-white">Engineered For Future Scale</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Innovateria was founded with a mission to deliver clean, scalable, and high-performance digital systems for startups, businesses, and enterprises. From mobile app engineering to cloud software architectures, we turn complex technical ideas into elegant digital solutions.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
              <span>Full-lifecycle software product engineering</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
              <span>Native Android, iOS, & Cross-platform apps</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
              <span>Modern Next.js, React & Cloud web architectures</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
              <span>Results-driven SEO & Digital Marketing growth</span>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <img 
              src="/assets/img/services/soft.png" 
              alt="Innovateria Software Architecture" 
              className="max-h-64 w-auto object-contain mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Core Values Dynamic Grid */}
      <div className="space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
            Our Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Agency Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyValues.map((val, idx) => (
            <div key={idx} className="glass-card glass-card-hover rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">{val.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card glass-card-hover rounded-2xl p-8 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Our Mission</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            To empower organizations with transformative software products, mobile applications, and digital marketing strategies that increase operating efficiency and drive market leadership.
          </p>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-8 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
            <Eye size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Our Vision</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            To be recognized globally as a premier technology agency that sets benchmark standards in software reliability, creativity, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Want to collaborate on a new project?</h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
          Contact our team today to discuss your software, app, or marketing requirements.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all"
          >
            <span>Get In Touch</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      </div>
    </div>
  );
}
