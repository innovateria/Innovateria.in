'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ServiceIcon from '@/components/ServiceIcon';
import {
  Phone,
  Mail,
  ChevronDown,
  Menu,
  X,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Code2,
  Globe2,
  Palette,
  TrendingUp,
  HelpCircle,
  Users,
  Briefcase,
  FolderKanban,
  Zap,
  ChevronRight,
  Info
} from 'lucide-react';

interface DynamicServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
}

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const dropdownCloseTimerRef = useRef<number | null>(null);

  // Dynamic CMS Header Data State
  const [headerInfo, setHeaderInfo] = useState({
    phone: '+91-7762974716',
    email: 'innovateria.in@gmail.com',
    agencyName: 'Innovateria',
    portfolioUrl: 'https://vivekajee.in'
  });
  const [dynamicServices, setDynamicServices] = useState<DynamicServiceItem[]>([]);
  const [dynamicProjects, setDynamicProjects] = useState<{ id: string; title: string; category: string }[]>([]);

  useEffect(() => {
    fetchHeaderData();

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const savedTheme = window.localStorage.getItem('innovateria-theme') as 'dark' | 'light' | null;
    const preferredTheme = savedTheme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(preferredTheme);
    document.documentElement.setAttribute('data-theme', preferredTheme);
    document.documentElement.style.colorScheme = preferredTheme;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchHeaderData = async () => {
    try {
      const res = await fetch('/api/header-data');
      const data = await res.json();
      if (data.success) {
        setHeaderInfo({
          phone: data.phone || '+91-7762974716',
          email: data.email || 'innovateria.in@gmail.com',
          agencyName: data.agencyName || 'Innovateria',
          portfolioUrl: data.portfolioUrl || 'https://vivekajee.in'
        });
        if (Array.isArray(data.services) && data.services.length > 0) {
          setDynamicServices(data.services);
        }
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setDynamicProjects(data.projects);
        }
      }
    } catch (err) {
      console.error('Error loading dynamic header data:', err);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('innovateria-theme', theme);
  }, [theme]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const clearDropdownCloseTimer = () => {
    if (dropdownCloseTimerRef.current) {
      window.clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
  };

  const openDropdown = (name: string) => {
    clearDropdownCloseTimer();
    setHoveredDropdown(name);
  };

  const scheduleDropdownClose = () => {
    clearDropdownCloseTimer();
    dropdownCloseTimerRef.current = window.setTimeout(() => {
      setHoveredDropdown(null);
    }, 180);
  };

  useEffect(() => {
    return () => {
      clearDropdownCloseTimer();
    };
  }, []);

  const isActive = (path: string) => pathname === path;
  const isInDropdown = (paths: string[]) => paths.includes(pathname);

  // Group paths
  const whoPaths = ['/about', '/team', '/portfolio', '/feature', '/faq'];

  if (pathname?.startsWith('/admin')) return null;

  // Fallback services list if CMS loading
  const fallbackServices = [
    { title: 'App Development', slug: 'mobile', icon: Smartphone },
    { title: 'Software Engineering', slug: 'software', icon: Code2 },
    { title: 'Web Development', slug: 'web', icon: Globe2 },
    { title: 'Logo Designing', slug: 'logo', icon: Palette }
  ];

  const fallbackProjects = [
    { id: '1', title: 'Enterprise D2C E-Commerce App', category: 'App Development' },
    { id: '2', title: 'Microservices Backend & Cloud API', category: 'Software Engineering' },
    { id: '3', title: 'Full-Stack SaaS Control Portal', category: 'Web Development' },
    { id: '4', title: 'Native iOS & Android POS Solution', category: 'App Development' },
    { id: '5', title: 'High-Scale Analytics Dashboard', category: 'Software Engineering' }
  ];

  const isServicesActive = isActive('/services') || dynamicServices.some(s => isActive(`/${s.slug}`)) || fallbackServices.some(s => isActive(`/${s.slug}`));
  const isProjectsActive = isActive('/projects');

  return (
    <header
      style={{ backgroundColor: 'var(--header-bg)' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md border-b border-[color:var(--border-color)] shadow-2xl py-2' : 'backdrop-blur-sm border-b border-[color:var(--border-color)] py-3'
      }`}
    >
      {/* Dynamic Top Info Bar */}
      <div className={`hidden md:block transition-all duration-300 overflow-hidden ${
        isScrolled ? 'max-h-0 opacity-0 pb-0 mb-0 border-b-0 pointer-events-none' : 'max-h-12 opacity-100 pb-2 mb-2 border-b border-[color:var(--border-color)]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-gray-300">
          <div className="flex items-center space-x-6">
            <a href={`tel:${headerInfo.phone}`} className="flex items-center space-x-2 hover:text-brand-500 transition-colors">
              <Phone size={14} className="text-brand-500" />
              <span>{headerInfo.phone}</span>
            </a>
            <a href={`mailto:${headerInfo.email}`} className="flex items-center space-x-2 hover:text-brand-500 transition-colors">
              <Mail size={14} className="text-brand-500" />
              <span>{headerInfo.email}</span>
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-400">Innovation is key to stay Relevant</span>
            <a 
              href={headerInfo.portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 bg-gradient-brand text-white px-2.5 py-1 rounded text-xs font-medium transition-all hover:shadow-md hover:shadow-brand-500/20"
              title="Visit Personal 3D Portfolio"
            >
              <Globe size={12} />
              <span>3D Portfolio</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-28 sm:w-36 h-10 transition-transform group-hover:scale-105">
            <img
              src="/assets/img/logo.png"
              alt={`${headerInfo.agencyName} Logo`}
              className="h-10 w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
          <Link 
            href="/" 
            className={`transition-colors hover:text-brand-500 ${isActive('/') ? 'text-brand-500 font-semibold' : 'text-gray-200'}`}
          >
            Home
          </Link>

          {/* Who We Are Dropdown */}
          <div
            className="relative group/menu"
            onMouseEnter={() => openDropdown('who')}
            onMouseLeave={() => scheduleDropdownClose()}
          >
            <button className={`flex items-center space-x-1 py-2 transition-colors hover:text-brand-500 ${isInDropdown(whoPaths) ? 'text-brand-500 font-semibold' : 'text-[color:var(--text-secondary)]'}`}>
              <span>Who We Are?</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredDropdown === 'who' ? 'rotate-180' : ''}`} />
            </button>
            <div
              onMouseEnter={() => openDropdown('who')}
              onMouseLeave={() => scheduleDropdownClose()}
              className={`absolute left-0 top-full mt-2 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] p-2 transition-all duration-200 shadow-2xl shadow-[color:var(--shadow-color)] z-50 w-56 ${hoveredDropdown === 'who' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'}`}
            >
              <Link href="/about" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-brand-500/20 transition-colors">
                <Info size={16} className="text-brand-500 shrink-0" />
                <span>About Us</span>
              </Link>
              <Link href="/team" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-brand-500/20 transition-colors">
                <Users size={16} className="text-brand-500 shrink-0" />
                <span>Our Team</span>
              </Link>
              <Link href="/portfolio" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-brand-500/20 transition-colors">
                <Briefcase size={16} className="text-brand-500 shrink-0" />
                <span>Portfolio</span>
              </Link>
              <Link href="/feature" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-brand-500/20 transition-colors">
                <Zap size={16} className="text-brand-500 shrink-0" />
                <span>Features</span>
              </Link>
              <Link href="/faq" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-brand-500/20 transition-colors">
                <HelpCircle size={16} className="text-brand-500 shrink-0" />
                <span>FAQs</span>
              </Link>
            </div>
          </div>

          {/* DYNAMIC PROJECTS DROPDOWN */}
          <div
            className="relative group/menu"
            onMouseEnter={() => openDropdown('projects')}
            onMouseLeave={() => scheduleDropdownClose()}
          >
            <button className={`flex items-center space-x-1 py-2 transition-colors hover:text-brand-500 ${isProjectsActive ? 'text-brand-500 font-semibold' : 'text-[color:var(--text-secondary)]'}`}>
              <span>Projects</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredDropdown === 'projects' ? 'rotate-180' : ''}`} />
            </button>
            <div
              onMouseEnter={() => openDropdown('projects')}
              onMouseLeave={() => scheduleDropdownClose()}
              className={`absolute left-0 top-full mt-2 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] p-2 transition-all duration-200 shadow-2xl shadow-[color:var(--shadow-color)] z-50 w-72 ${hoveredDropdown === 'projects' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'}`}
            >
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-400 border-b border-white/10 mb-1">
                Latest Agency Projects
              </div>

              {(dynamicProjects.length > 0 ? dynamicProjects : fallbackProjects).slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-brand-500/20 transition-colors"
                >
                  <FolderKanban size={16} className="text-brand-500 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold block truncate">{p.title}</span>
                    <span className="text-[10px] text-gray-400 block">{p.category}</span>
                  </div>
                </Link>
              ))}

              <div className="pt-2 border-t border-white/10 mt-1">
                <Link
                  href="/projects"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-brand-400 hover:text-white hover:bg-brand-500/20 transition-all"
                >
                  <span>View All Projects ({dynamicProjects.length || 5})</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* DYNAMIC SERVICES DROPDOWN */}
          <div
            className="relative group/menu"
            onMouseEnter={() => openDropdown('services')}
            onMouseLeave={() => scheduleDropdownClose()}
          >
            <button className={`flex items-center space-x-1 py-2 transition-colors hover:text-brand-500 ${isServicesActive ? 'text-brand-500 font-semibold' : 'text-[color:var(--text-secondary)]'}`}>
              <span>Services</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>
            <div
              onMouseEnter={() => openDropdown('services')}
              onMouseLeave={() => scheduleDropdownClose()}
              className={`absolute left-0 top-full mt-2 rounded-xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] p-2 transition-all duration-200 shadow-2xl shadow-[color:var(--shadow-color)] z-50 w-64 ${hoveredDropdown === 'services' ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'}`}
            >
              {dynamicServices.length > 0 ? (
                dynamicServices.slice(0, 5).map((s) => (
                  <Link
                    key={s.id}
                    href={`/${s.slug}`}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-brand-500/20 transition-colors"
                  >
                    <ServiceIcon title={s.title} size={16} className="text-brand-500 shrink-0" />
                    <span className="truncate">{s.title}</span>
                  </Link>
                ))
              ) : (
                fallbackServices.slice(0, 5).map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.slug}
                      href={`/${s.slug}`}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-brand-500/20 transition-colors"
                    >
                      <Icon size={16} className="text-brand-500 shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </Link>
                  );
                })
              )}

              <div className="pt-2 border-t border-white/10 mt-1">
                <Link
                  href="/services"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-brand-400 hover:text-white hover:bg-brand-500/20 transition-all"
                >
                  <span>View All Services ({dynamicServices.length || 19})</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>



          <Link 
            href="/contact" 
            className={`transition-colors hover:text-brand-500 ${isActive('/contact') ? 'text-brand-500 font-semibold' : 'text-gray-200'}`}
          >
            Contact Us
          </Link>
        </nav>

        {/* CTA Button & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleTheme}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-gray-200 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link 
            href="/contact" 
            className="hidden sm:inline-flex items-center space-x-2 bg-gradient-brand text-white px-4 py-2 rounded-full text-xs font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5"
          >
            <span>Get Started</span>
          </Link>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-white p-2 rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card mt-3 border-t border-white/10 px-4 pt-4 pb-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2.5 text-sm font-medium ${isActive('/') ? 'text-brand-500 font-semibold' : 'text-gray-300'}`}
          >
            Home
          </Link>

          {/* Mobile Who We Are */}
          <div className="border-t border-white/5 pt-2">
            <button 
              onClick={() => toggleDropdown('who')}
              className={`flex justify-between items-center w-full py-2.5 text-sm font-medium ${isInDropdown(whoPaths) ? 'text-brand-500 font-semibold' : 'text-gray-300'}`}
            >
              <span>Who We Are?</span>
              <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === 'who' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'who' && (
              <div className="pl-4 space-y-2 py-1 text-xs text-gray-400 border-l border-white/10 ml-2">
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-brand-500">About Us</Link>
                <Link href="/team" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-brand-500">Our Team</Link>
                <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-brand-500">Portfolio</Link>
                <Link href="/feature" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-brand-500">Features</Link>
                <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-brand-500">FAQs</Link>
              </div>
            )}
          </div>

          {/* Dynamic Mobile Projects */}
          <div className="border-t border-white/5 pt-2">
            <button 
              onClick={() => toggleDropdown('projects')}
              className={`flex justify-between items-center w-full py-2.5 text-sm font-medium ${isProjectsActive ? 'text-brand-500 font-semibold' : 'text-gray-300'}`}
            >
              <span>Projects</span>
              <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === 'projects' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'projects' && (
              <div className="pl-4 space-y-2 py-1 text-xs text-gray-400 border-l border-white/10 ml-2">
                {(dynamicProjects.length > 0 ? dynamicProjects : fallbackProjects).slice(0, 5).map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-brand-500 truncate">
                    {p.title}
                  </Link>
                ))}
                <div className="pt-1.5 border-t border-white/10 mt-1">
                  <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-brand-400 font-bold hover:text-white">
                    View All Projects ({dynamicProjects.length || 5}) →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Mobile Services */}
          <div className="border-t border-white/5 pt-2">
            <button 
              onClick={() => toggleDropdown('services')}
              className={`flex justify-between items-center w-full py-2.5 text-sm font-medium ${isServicesActive ? 'text-brand-500 font-semibold' : 'text-gray-300'}`}
            >
              <span>Services</span>
              <ChevronDown size={16} className={`transform transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'services' && (
              <div className="pl-4 space-y-2 py-1 text-xs text-gray-400 border-l border-white/10 ml-2">
                {dynamicServices.length > 0 ? (
                  dynamicServices.slice(0, 5).map(s => (
                    <Link key={s.id} href={`/${s.slug}`} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-brand-500 truncate">
                      {s.title}
                    </Link>
                  ))
                ) : (
                  fallbackServices.slice(0, 5).map(s => (
                    <Link key={s.slug} href={`/${s.slug}`} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-brand-500 truncate">
                      {s.title}
                    </Link>
                  ))
                )}
                <div className="pt-1.5 border-t border-white/10 mt-1">
                  <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-brand-400 font-bold hover:text-white">
                    View All Services ({dynamicServices.length || 19}) →
                  </Link>
                </div>
              </div>
            )}
          </div>



          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2.5 text-sm font-medium border-t border-white/5 ${isActive('/contact') ? 'text-brand-500 font-semibold' : 'text-gray-300'}`}
          >
            Contact Us
          </Link>

          {/* Mobile Quick Contact & Action */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-brand text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg"
            >
              <span>Get Started</span>
            </Link>
            <div className="flex justify-around items-center text-xs text-gray-400 pt-1">
              <a href={`tel:${headerInfo.phone}`} className="flex items-center space-x-1.5 hover:text-brand-500">
                <Phone size={14} className="text-brand-500" />
                <span>Call Us</span>
              </a>
              <a href={`mailto:${headerInfo.email}`} className="flex items-center space-x-1.5 hover:text-brand-500">
                <Mail size={14} className="text-brand-500" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
