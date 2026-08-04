import { notFound } from 'next/navigation';
import ServiceDetailView from '@/components/ServiceDetailView';
import { getServiceBySlugCMS, getServicesCMS } from '@/lib/crm-store';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const services = getServicesCMS();
  return services.map((s) => ({
    slug: s.slug,
  }));
}

export default async function DynamicServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlugCMS(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailView service={service} />;
}
