import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectById, getProjects, getOpenSourceProjectsCMS } from '@/lib/crm-store';
import ContactForm from '@/components/ContactForm';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  User, 
  Sparkles,
  Layers,
  Code2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const projects = getProjects();
  const openSource = getOpenSourceProjectsCMS();
  
  const pParams = projects.map((p) => ({ id: p.id }));
  const osParams = openSource.map((os) => ({ id: os.id }));
  
  return [...pParams, ...osParams];
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const project = getProjectById(id);
  const openSourceItem = !project ? getOpenSourceProjectsCMS().find(os => os.id === id) : null;

  if (!project && !openSourceItem) {
    notFound();
  }

  const isOS = !project && Boolean(openSourceItem);
  const title = project?.title || openSourceItem?.title || 'Project Details';
  const category = project?.category || openSourceItem?.category || 'Software Engineering';
  const desc = project?.desc || openSourceItem?.description || '';
  const image = project?.image || '/assets/img/services/soft.png';
  const techStack = project?.techStack || openSourceItem?.tags || [];
  const github = project?.github || openSourceItem?.githubUrl;
  const liveDemo = openSourceItem?.liveDemoUrl;
  const clientName = project?.clientName || 'Innovateria Open Source';
  const budget = project?.budget || 'Community Edition';
  const status = project?.status || 'completed';
  const progress = project?.progress ?? 100;
  const bullets = project?.bullets || [
    'Clean modular architecture with scalable database schemas',
    'Automated CI/CD deployment pipelines & unit testing',
    'Responsive glassmorphic UI/UX tailored for cross-platform devices',
    'Bank-grade RESTful API encryption and authentication tokens'
  ];

  const otherProjects = getProjects().filter(p => p.id !== id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      
      {/* Back Button */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center space-x-2 text-xs font-bold text-brand-400 hover:text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 px-4 py-2 rounded-full transition-all"
        >
          <ArrowLeft size={14} />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Main Project Hero & Case Study Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Information & Overview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 border border-brand-500/20 px-3.5 py-1 rounded-full flex items-center space-x-1.5">
              <Sparkles size={13} />
              <span>{category}</span>
            </span>

            <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full border ${
              status === 'completed' 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : status === 'beta_testing'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }`}>
              {status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {desc}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                <User size={13} className="text-brand-500" />
                <span>Client / Owner</span>
              </div>
              <span className="text-sm font-bold text-white block truncate">{clientName}</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                <DollarSign size={13} className="text-emerald-400" />
                <span>Investment Tier</span>
              </div>
              <span className="text-sm font-bold text-emerald-400 block truncate">{budget}</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                <Clock size={13} className="text-brand-500" />
                <span>Completion Status</span>
              </div>
              <span className="text-sm font-bold text-white block">{progress}% Delivered</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-400">Development Milestone Roadmap</span>
              <span className="text-brand-400">{progress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-brand transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-xs font-bold border border-white/20 transition-all shadow-lg"
              >
                <Github size={16} />
                <span>View GitHub Source Code</span>
                <ExternalLink size={12} />
              </a>
            )}

            {liveDemo && (
              <a
                href={liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-6 py-3 rounded-full text-xs font-bold shadow-lg hover:shadow-brand-500/30 transition-all"
              >
                <span>Launch Live Application</span>
                <ExternalLink size={14} />
              </a>
            )}

            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 hover:text-white px-6 py-3 rounded-full text-xs font-bold border border-brand-500/30 transition-all"
            >
              <span>Build Similar Solution</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Preview Card & Tech Stack */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-4 sm:p-6 border border-white/10 space-y-6">
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#131A29] border border-white/10">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  {category}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck size={14} />
                  <span>Production Ready</span>
                </span>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                <Code2 size={14} className="text-brand-500" />
                <span>Technologies & Frameworks</span>
              </h4>

              <div className="flex flex-wrap gap-2">
                {techStack.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-gray-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Detailed Architectural Breakdown & Key Deliverables */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Layers size={22} className="text-brand-500" />
            <span>Key Project Deliverables & Architecture</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Detailed overview of system components, features, and security safeguards implemented for this build.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bullets.map((bullet, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl border border-white/5 flex items-start space-x-3">
              <CheckCircle2 size={18} className="text-brand-500 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-gray-200 leading-relaxed">{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Related Projects Showcase */}
      {otherProjects.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-end border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                Explore More Solutions
              </span>
              <h3 className="text-2xl font-bold text-white mt-2">Other Featured Agency Projects</h3>
            </div>
            <Link href="/projects" className="text-xs font-bold text-brand-400 hover:text-white transition-colors">
              View All Projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="glass-card glass-card-hover rounded-3xl p-5 border border-white/10 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                    {p.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-gray-300 line-clamp-2">{p.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/10 text-xs font-bold text-brand-400 flex items-center justify-between">
                  <span>View Case Study</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: Contact Form */}
      <section className="pt-6">
        <ContactForm />
      </section>

    </div>
  );
}
