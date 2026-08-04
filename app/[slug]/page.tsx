import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import ServiceDetailView from '@/components/ServiceDetailView';
import { getServiceBySlugCMS, getServicesCMS } from '@/lib/crm-store';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlugCMS(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Innovateria',
      description: 'The requested service solution could not be found.',
    };
  }

  const title = `${service.title} | Innovateria`;
  const desc = service.description || `Professional ${service.title} solutions engineered by Innovateria for business growth.`;
  const canonicalUrl = `https://innovateria.in/${slug}`;
  const image = service.image || '/assets/img/services/soft.png';
  const imageUrl = image.startsWith('http') ? image : `https://innovateria.in${image}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: desc,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [imageUrl],
    },
  };
}

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.category,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Innovateria',
      url: 'https://innovateria.in',
      logo: 'https://innovateria.in/assets/img/logo.png',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };

  return (
    <>
      <Script
        id={`service-schema-${service.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceDetailView service={service} />
    </>
  );
}
