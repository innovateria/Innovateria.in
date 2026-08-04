import { getTeamCMS } from '@/lib/crm-store';
import { Github, Twitter, Linkedin, Globe, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Team | Innovateria',
  description: 'Meet the engineering and leadership team behind Innovateria software solutions.',
};

export default function TeamPage() {
  const teamMembers = getTeamCMS();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Team Image */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-15 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url(/assets/img/backgrounds/team-bg.jpg)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/70 via-transparent to-[#0B0F17] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20">
          Leadership & Engineering
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Meet The <span className="text-gradient-brand">Innovateria Team</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          High-performance software engineers, architects, and designers helping businesses unlock digital scale.
        </p>
      </div>

      {/* Dynamic Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {teamMembers.map((member) => (
          <div key={member.id} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 text-center space-y-4 relative overflow-hidden group">
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-brand-500/40 p-1 bg-[#131A29] shrink-0">
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-extrabold text-xl">
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white group-hover:text-brand-500 transition-colors">{member.name}</h3>
              <p className="text-xs text-brand-400 font-bold">{member.role}</p>
              <p className="text-[11px] text-gray-400 flex items-center justify-center space-x-1 pt-0.5">
                <MapPin size={11} />
                <span>{member.location}</span>
              </p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed px-2">
              {member.bio}
            </p>

            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {member.skills.map((skill, i) => (
                <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-gray-300">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex justify-center items-center space-x-4 pt-4 border-t border-white/10 text-gray-400">
              {member.website && (
                <a href={member.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                  <Globe size={16} />
                </a>
              )}
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                  <Github size={16} />
                </a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                  <Linkedin size={16} />
                </a>
              )}
              {member.twitter && (
                <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                  <Twitter size={16} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      </div>
    </div>
  );
}
