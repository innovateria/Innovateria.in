import React from 'react';
import { 
  Smartphone, 
  Code2, 
  Globe2, 
  Search, 
  Palette, 
  TrendingUp, 
  Zap, 
  Wrench, 
  ShieldCheck, 
  ShoppingBag, 
  Building, 
  Store, 
  Truck, 
  Apple,
  Cpu, 
  Layers, 
  LucideProps 
} from 'lucide-react';

interface ServiceIconProps extends LucideProps {
  iconName?: string;
  title?: string;
}

export default function ServiceIcon({ iconName, title, size = 24, className = '', ...props }: ServiceIconProps) {
  const name = (iconName || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (name === 'apple' || t.includes('ios')) {
    return <Apple size={size} className={className} {...props} />;
  }
  if (name === 'truck' || t.includes('pick') || t.includes('drop') || t.includes('delivery')) {
    return <Truck size={size} className={className} {...props} />;
  }
  if (name === 'shoppingbag' || t.includes('b2c') || t.includes('grocery') || t.includes('shop')) {
    return <ShoppingBag size={size} className={className} {...props} />;
  }
  if (name === 'building' || t.includes('b2b')) {
    return <Building size={size} className={className} {...props} />;
  }
  if (name === 'store' || t.includes('multi-vendor') || t.includes('marketplace')) {
    return <Store size={size} className={className} {...props} />;
  }
  if (name === 'shieldcheck' || t.includes('maintenance')) {
    return <ShieldCheck size={size} className={className} {...props} />;
  }
  if (name === 'wrench' || t.includes('modification')) {
    return <Wrench size={size} className={className} {...props} />;
  }
  if (name === 'zap' || t.includes('landing')) {
    return <Zap size={size} className={className} {...props} />;
  }
  if (name === 'smartphone' || t.includes('mobile') || t.includes('android') || t.includes('app')) {
    return <Smartphone size={size} className={className} {...props} />;
  }
  if (name === 'code2' || name === 'code' || t.includes('software') || t.includes('enterprise')) {
    return <Code2 size={size} className={className} {...props} />;
  }
  if (name === 'globe2' || name === 'globe' || t.includes('web') || t.includes('static') || t.includes('dynamic')) {
    return <Globe2 size={size} className={className} {...props} />;
  }
  if (name === 'search' || t.includes('seo') || t.includes('organic')) {
    return <Search size={size} className={className} {...props} />;
  }
  if (name === 'palette' || t.includes('logo') || t.includes('design')) {
    return <Palette size={size} className={className} {...props} />;
  }
  if (name === 'trendingup' || t.includes('marketing') || t.includes('digital')) {
    return <TrendingUp size={size} className={className} {...props} />;
  }
  if (name === 'cpu') {
    return <Cpu size={size} className={className} {...props} />;
  }

  return <Layers size={size} className={className} {...props} />;
}
