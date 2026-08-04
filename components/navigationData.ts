import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Code2,
  FolderKanban,
  Globe2,
  HelpCircle,
  Info,
  Palette,
  Search,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

export type NavLinkItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type DropdownGroup = {
  key: string;
  label: string;
  links: NavLinkItem[];
  activePaths: string[];
  widthClass: string;
};

export const dropdownGroups: DropdownGroup[] = [
  {
    key: 'who',
    label: 'Who We Are?',
    activePaths: ['/about', '/team', '/projects', '/portfolio', '/feature', '/faq'],
    widthClass: 'w-56',
    links: [
      { href: '/about', label: 'About Us', icon: Info },
      { href: '/team', label: 'Our Team', icon: Users },
      { href: '/projects', label: 'Our Projects', icon: FolderKanban },
      { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
      { href: '/feature', label: 'Features', icon: Sparkles },
      { href: '/faq', label: 'FAQs', icon: HelpCircle },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    activePaths: ['/mobile', '/software', '/web', '/logo'],
    widthClass: 'w-60',
    links: [
      { href: '/mobile', label: 'App Development', icon: Smartphone },
      { href: '/software', label: 'Software Development', icon: Code2 },
      { href: '/web', label: 'Web Development', icon: Globe2 },
      { href: '/logo', label: 'Logo Designing', icon: Palette },
    ],
  },
  {
    key: 'marketing',
    label: 'Our Marketing',
    activePaths: ['/seo-services', '/digital-marketing'],
    widthClass: 'w-56',
    links: [
      { href: '/seo-services', label: 'SEO Services', icon: Search },
      { href: '/digital-marketing', label: 'Digital Marketing', icon: TrendingUp },
    ],
  },
];
