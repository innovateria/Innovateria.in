'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MessageCircle, Twitter, Facebook, Instagram, Linkedin, Globe, Shield, FileText, HelpCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer style={{ backgroundColor: 'var(--footer-bg)' }} className="border-t border-[color:var(--border-color)] text-gray-400 pt-16 pb-8 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          
          {/* Column 1: Info & Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img 
                src="/assets/img/logo.png" 
                alt="Innovateria Logo" 
                className="h-10 w-auto object-contain" 
              />
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Always Innovation is the key to stay Relevant. Innovateria builds modern software, mobile applications, web systems, and growth strategies for ambitious businesses worldwide.
            </p>
            <div className="space-y-2 text-xs text-gray-300 pt-2">
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-brand-500 shrink-0" />
                <span>+91 77629 74716</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle size={14} className="text-green-500 shrink-0" />
                <span>+91 77629 74716 (WhatsApp)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-brand-500 shrink-0" />
                <span>innovateria.in@gmail.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://twitter.com/Vnjvibhash" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-8 sm:h-8 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-brand-500 hover:border-brand-500 transition-colors" aria-label="Twitter">
                <Twitter size={14} />
              </a>
              <a href="https://facebook.com/Vivekajee" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-8 sm:h-8 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-brand-500 hover:border-brand-500 transition-colors" aria-label="Facebook">
                <Facebook size={14} />
              </a>
              <a href="https://instagram.com/Vivekajee" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-8 sm:h-8 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-brand-500 hover:border-brand-500 transition-colors" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="https://linkedin.com/in/Vivekajee" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-8 sm:h-8 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-brand-500 hover:border-brand-500 transition-colors" aria-label="LinkedIn">
                <Linkedin size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 border-l-2 border-brand-500 pl-3">
              Useful Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/feature" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>Features</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>Portfolio</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 border-l-2 border-brand-500 pl-3">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/mobile" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>App Development</span>
                </Link>
              </li>
              <li>
                <Link href="/software" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>Software Development</span>
                </Link>
              </li>
              <li>
                <Link href="/web" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>Web Development</span>
                </Link>
              </li>
              <li>
                <Link href="/logo" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>Logo Designing</span>
                </Link>
              </li>
              <li>
                <Link href="/digital-marketing" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <ArrowRight size={12} className="text-brand-500" />
                  <span>Digital Marketing</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 border-l-2 border-brand-500 pl-3">
              Policies & Help
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/disclaimer" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <Shield size={12} className="text-brand-500" />
                  <span>Disclaimer</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <HelpCircle size={12} className="text-brand-500" />
                  <span>FAQs</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <FileText size={12} className="text-brand-500" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-500 transition-colors flex items-center space-x-2">
                  <FileText size={12} className="text-brand-500" />
                  <span>Refund Policy</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>Copyright © 2020 - Present <strong className="text-white font-medium">Innovateria</strong>. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Designed & Developed by <a href="https://vivekajee.in" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline font-medium">Vivek Kumar (Vivekajee)</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
