import ServiceDetailView from '@/components/ServiceDetailView';
import { getFirestoreServices } from '@/lib/firestore-db';

export const metadata = {
  title: 'Enterprise Software & SaaS Engineering | Innovateria',
  description: 'Custom Enterprise ERPs, CRM platforms, POS billing software, and high-throughput microservice backends built with Next.js, Laravel, and Cloud infrastructure.',
  alternates: { canonical: 'https://innovateria.in/software' },
};

export default async function SoftwarePage() {
  const services = await getFirestoreServices();
  const service = services.find(s => s.slug === 'software') || services[1];

  return <ServiceDetailView service={service} />;
}
