import React from 'react';
import Link from 'next/link';
import ServiceIcon from '@/components/ServiceIcon';
import ContactForm from '@/components/ContactForm';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Code2, 
  HelpCircle, 
  Layers, 
  Terminal, 
  Cpu, 
  FileText 
} from 'lucide-react';
import { ServiceCMS } from '@/lib/crm-store';

interface ServiceDetailViewProps {
  service: ServiceCMS;
}

export default function ServiceDetailView({ service }: ServiceDetailViewProps) {
  // Enhanced detailed content from JSON or fallback defaults
  const detailedOverview = (service.longDescription && service.longDescription.length > 0)
    ? service.longDescription
    : [
        `Our ${service.title} is engineered to deliver industry-leading speed, enterprise security, and cloud scalability tailored for modern businesses and ambitious startups.`,
        `We utilize state-of-the-art software frameworks, bank-grade encryption, and optimized architectures to ensure your digital asset drives measurable business revenue and customer retention.`,
        `Whether you require a custom end-to-end build, seamless third-party API integration, or legacy system modernization, our team provides full-lifecycle support from initial blueprint to cloud deployment.`
      ];

  const methodologySteps = (service.methodology && service.methodology.length > 0)
    ? service.methodology
    : [
        { title: '1. Strategy & Discovery', desc: 'Analyzing your business goals, user personas, technical requirements, and market competitors to create a clear project blueprint.' },
        { title: '2. UI/UX & Architecture', desc: 'Crafting responsive glassmorphic wireframes, interactive Figma prototypes, and scalable database schema.' },
        { title: '3. Core Development', desc: 'Writing clean, modular code with automated CI/CD pipelines, unit testing, and robust REST APIs.' },
        { title: '4. QA & Security Audit', desc: 'Rigorous end-to-end testing, performance benchmarking, speed optimization, and vulnerability audits.' },
        { title: '5. Launch & Support', desc: 'Smooth deployment to cloud servers or app stores with 24/7 technical monitoring and maintenance.' }
      ];

  const serviceFaqs = (service.faqs && service.faqs.length > 0)
    ? service.faqs
    : [
        { q: `What is the estimated delivery timeline for ${service.title}?`, a: `Timelines depend on scope and features. Standard builds range from 2 to 6 weeks, while enterprise platforms may take 8 to 12 weeks with milestone deliverables.` },
        { q: `Do I get 100% full ownership of the source code?`, a: `Yes! Upon project completion, you receive complete IP rights, repository access, database credentials, and full documentation.` },
        { q: `How does Innovateria ensure post-launch maintenance?`, a: `We provide 30 to 90 days of complimentary post-launch support including bug fixes, server maintenance, performance updates, and technical assistance.` }
      ];

  return (
    <div className="space-y-16 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ======= HERO HEADER ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-flex items-center space-x-2">
            <Sparkles size={14} />
            <span>{service.category}</span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {service.title}
          </h1>

          <p className="text-base text-gray-300 leading-relaxed max-w-2xl">
            {service.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(service.features || []).map((feat, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs text-gray-200">
                <CheckCircle2 size={16} className="text-brand-500 shrink-0 mt-0.5" />
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 hover:scale-105 transition-all"
            >
              <span>Get Instant Consultation</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center space-x-2 glass-card hover:bg-white/10 text-white px-6 py-4 rounded-full font-bold text-xs uppercase tracking-wider border border-white/15 transition-all"
            >
              <span>Browse All Services</span>
            </Link>
          </div>
        </div>

        {/* Visual Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="glass-card rounded-[2rem] p-8 border border-white/15 space-y-6 shadow-2xl relative overflow-hidden w-full max-w-md">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <ServiceIcon iconName={service.iconName} title={service.title} size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{service.title}</h4>
                  <span className="text-[10px] text-brand-400 font-semibold uppercase">{service.category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Engineering Frameworks</span>
                <p className="text-xs font-semibold text-white">Next.js • Flutter • Node.js • Cloud DBs</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Deployment & Security</span>
                <p className="text-xs font-semibold text-white">HTTPS SSL • Role Access • Bank Encryption</p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck size={14} />
                <span>100% Production Ready Guarantee</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======= DEEP ABOUT THIS SERVICE ======= */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
            Deep Service Overview
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            About <span className="text-gradient-brand">{service.title}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {detailedOverview.map((paragraph, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs">
                0{idx + 1}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======= DEVELOPMENT METHODOLOGY ======= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
            Proven Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-white">How We Build & Execute</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {methodologySteps.map((step, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <h3 className="text-sm font-bold text-brand-400">{step.title}</h3>
              <p className="text-[11px] text-gray-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======= FREQUENTLY ASKED QUESTIONS ======= */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-flex items-center space-x-1.5">
            <HelpCircle size={14} />
            <span>Common Queries</span>
          </span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {serviceFaqs.map((faq, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <span className="text-brand-500">Q.</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======= CONTACT FORM CTA ======= */}
      <section className="pt-4">
        <ContactForm />
      </section>
    </div>
  );
}
