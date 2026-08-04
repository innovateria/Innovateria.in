import Link from 'next/link';
import { getProjects } from '@/lib/crm-store';
import { Github, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Engineering Projects & Case Studies | Innovateria',
  description: 'Explore featured client agency projects engineered by Innovateria.',
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Our Engineering Portfolio
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Client Agency <span className="text-gradient-brand">Projects</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          Explore production mobile applications, custom software backends, and enterprise platforms engineered by Innovateria.
        </p>
      </div>

      {/* SECTION 1: Client Agency Projects */}
      <div className="space-y-8">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Client Agency Projects</h2>
          <p className="text-xs text-gray-400 mt-1">Production applications engineered for clients across Android, iOS, Web, and SaaS.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group"
            >
              <div>
                {/* Project Cover Image */}
                <div className="relative w-full h-60 sm:h-64 bg-[#0B0F17] overflow-hidden border-b border-white/10">
                  <img 
                    src={project.image || '/assets/img/services/soft.png'} 
                    alt={project.title}
                    className="w-full h-full object-cover object-center min-w-full min-h-full group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-black/40"></div>

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider bg-black/80 backdrop-blur-md border border-brand-500/30 px-3 py-1 rounded-xl">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border backdrop-blur-md ${
                      project.status === 'completed' 
                        ? 'bg-emerald-500/80 text-emerald-200 border-emerald-500/40' 
                        : project.status === 'beta_testing'
                        ? 'bg-amber-500/80 text-amber-200 border-amber-500/40'
                        : 'bg-blue-500/80 text-blue-200 border-blue-500/40'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-4">
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-500 transition-colors">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {project.desc}
                  </p>

                  {project.bullets && project.bullets.length > 0 && (
                    <ul className="space-y-2 pt-2 border-t border-white/10">
                      {project.bullets.map((b, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start space-x-2">
                          <CheckCircle2 size={14} className="text-brand-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                  {project.techStack.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  {project.github ? (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-500 hover:text-white transition-colors"
                    >
                      <Github size={14} />
                      <span>View GitHub Repo</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500 italic">Enterprise Private Repo</span>
                  )}

                  <Link 
                    href={`/projects/${project.id}`}
                    className="text-[11px] font-bold text-brand-400 hover:text-white transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Have a Custom Project in Mind?</h2>
        <p className="text-xs sm:text-sm text-gray-300">
          Our engineering team can build your mobile app, custom software platform, or modern web application.
        </p>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-gradient-brand text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-brand-500/30 transition-all"
          >
            <span>Discuss Your Project</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}
