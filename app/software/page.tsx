import ServiceDetailView from '@/components/ServiceDetailView';
import { getServicesCMS } from '@/lib/crm-store';

export const metadata = {
  title: 'Enterprise Software & SaaS Engineering | Innovateria',
  description: 'Custom Enterprise ERPs, CRM platforms, POS billing software, and high-throughput microservice backends built with Next.js, Laravel, and Cloud infrastructure.',
  alternates: { canonical: 'https://innovateria.in/software' },
};

export default function SoftwarePage() {
  const services = getServicesCMS();
  const service = services.find(s => s.slug === 'software') || services[1];

  return <ServiceDetailView service={service} />;
}
