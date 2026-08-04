import ServiceDetailView from '@/components/ServiceDetailView';
import { getServicesCMS } from '@/lib/crm-store';

export const metadata = {
  title: 'SEO & Technical Search Dominance | Innovateria',
  description: 'Data-driven technical SEO, Schema markup, high-intent keyword ranking, local Google Business Profile optimization, and organic traffic strategies.',
  alternates: { canonical: 'https://innovateria.in/seo-services' },
};

export default function SeoServicesPage() {
  const services = getServicesCMS();
  const service = services.find(s => s.slug === 'seo-services') || services[3];

  return <ServiceDetailView service={service} />;
}
