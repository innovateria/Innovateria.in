import ServiceDetailView from '@/components/ServiceDetailView';
import { getServicesCMS } from '@/lib/crm-store';

export const metadata = {
  title: 'Web Application & Full-Stack Development | Innovateria',
  description: 'Ultra-fast responsive web applications, B2B/B2C E-Commerce portals, multi-vendor marketplaces, and Headless CMS architectures built with Next.js 14, React, and Node.js.',
  alternates: { canonical: 'https://innovateria.in/web' },
};

export default function WebPage() {
  const services = getServicesCMS();
  const service = services.find(s => s.slug === 'web') || services[2];

  return <ServiceDetailView service={service} />;
}
