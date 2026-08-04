'use client';

import { usePathname } from 'next/navigation';
import { Github, Facebook, MessageCircle, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function SocialBar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/VnjVibhash',
      bgClass: 'bg-[#24292e] border-[#343a40] text-white',
      glowClass: 'hover:shadow-[0_0_20px_rgba(36,41,46,0.8)]',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/Vivekajee',
      bgClass: 'bg-[#1877F2] border-[#3b93ff] text-white',
      glowClass: 'hover:shadow-[0_0_20px_rgba(24,119,242,0.8)]',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/917762974716',
      bgClass: 'bg-[#25D366] border-[#38e87b] text-white',
      glowClass: 'hover:shadow-[0_0_20px_rgba(37,211,102,0.8)]',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/Vnjvibhash',
      bgClass: 'bg-[#1DA1F2] border-[#3ab2ff] text-white',
      glowClass: 'hover:shadow-[0_0_20px_rgba(29,161,242,0.8)]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/in/Vivekajee',
      bgClass: 'bg-[#0A66C2] border-[#1d7bdc] text-white',
      glowClass: 'hover:shadow-[0_0_20px_rgba(10,102,194,0.8)]',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/Vivekajee',
      bgClass: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] border-[#fd1d1d] text-white',
      glowClass: 'hover:shadow-[0_0_20px_rgba(253,29,29,0.8)]',
    },
  ];

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-start space-y-2 pointer-events-auto">
      {socialLinks.map((item) => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center h-11 w-11 hover:w-36 ${item.bgClass} border border-l-0 rounded-r-2xl transition-all duration-300 ease-out ${item.glowClass} shadow-xl overflow-hidden shrink-0`}
            title={item.name}
          >
            <div className="w-11 h-11 flex items-center justify-center shrink-0 text-white">
              <IconComponent size={19} className="transition-transform duration-300 group-hover:scale-110 drop-shadow" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-extrabold text-white whitespace-nowrap pr-3 tracking-wide">
              {item.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}
