import ServiceDetailView from '@/components/ServiceDetailView';
import { getServicesCMS } from '@/lib/crm-store';

export const metadata = {
  title: 'Mobile App Development Services (iOS & Android) | Innovateria',
  description: 'Innovateria builds high-performance Flutter, Android (Kotlin), and iOS mobile apps with secure payment gateways, real-time sync, and App Store ASO.',
  alternates: { canonical: 'https://innovateria.in/mobile' },
  openGraph: {
    title: 'Mobile App Development Services (iOS & Android) | Innovateria',
    description: 'Build high-performance mobile apps with Innovateria’s Android, iOS, and Flutter development services.',
    url: 'https://innovateria.in/mobile',
  },
};

export default function MobilePage() {
  const services = getServicesCMS();
  const service = services.find(s => s.slug === 'mobile') || services[0];

  return <ServiceDetailView service={service} />;
}
