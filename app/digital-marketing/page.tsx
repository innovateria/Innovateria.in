import ServiceDetailView from '@/components/ServiceDetailView';
import { getServicesCMS } from '@/lib/crm-store';

export const metadata = {
  title: 'Strategic Performance Digital Marketing | Innovateria',
  description: 'High-ROI Pay-Per-Click (PPC) ad campaigns, Meta & LinkedIn social media marketing, WhatsApp automation, and automated conversion pipelines.',
  alternates: { canonical: 'https://innovateria.in/digital-marketing' },
};

export default function DigitalMarketingPage() {
  const services = getServicesCMS();
  const service = services.find(s => s.slug === 'digital-marketing') || services[5];

  return <ServiceDetailView service={service} />;
}
