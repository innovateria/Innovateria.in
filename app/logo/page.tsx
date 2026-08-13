import ServiceDetailView from '@/components/ServiceDetailView';
import { getFirestoreServices } from '@/lib/firestore-db';

export const metadata = {
  title: 'Logo & Brand Identity Engineering | Innovateria',
  description: 'Stunning vector logos, custom brand identity systems, social media kit assets, corporate brochures, and modern UI/UX design tokens.',
  alternates: { canonical: 'https://innovateria.in/logo' },
};

export default async function LogoPage() {
  const services = await getFirestoreServices();
  const service = services.find(s => s.slug === 'logo') || services[4];

  return <ServiceDetailView service={service} />;
}
