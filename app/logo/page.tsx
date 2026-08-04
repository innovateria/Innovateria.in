import ServiceDetailView from '@/components/ServiceDetailView';
import { getServicesCMS } from '@/lib/crm-store';

export const metadata = {
  title: 'Logo & Brand Identity Engineering | Innovateria',
  description: 'Stunning vector logos, custom brand identity systems, social media kit assets, corporate brochures, and modern UI/UX design tokens.',
  alternates: { canonical: 'https://innovateria.in/logo' },
};

export default function LogoPage() {
  const services = getServicesCMS();
  const service = services.find(s => s.slug === 'logo') || services[4];

  return <ServiceDetailView service={service} />;
}
