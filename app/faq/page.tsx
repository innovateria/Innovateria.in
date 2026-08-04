import type { Metadata } from 'next';
import Script from 'next/script';
import { getFAQsCMS } from '@/lib/crm-store';
import FaqClientView from '@/components/FaqClientView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Innovateria',
  description: 'Find clear answers about Innovateria’s app development, custom software engineering, Next.js web applications, pricing model, project timelines, and technical support.',
  alternates: { canonical: 'https://innovateria.in/faq' },
  openGraph: {
    title: 'Frequently Asked Questions (FAQ) | Innovateria',
    description: 'Get details on custom app & software timelines, deployment, security, and digital marketing services.',
    url: 'https://innovateria.in/faq',
    siteName: 'Innovateria',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions | Innovateria',
    description: 'Answers about software development, mobile apps, pricing, and server deployment.',
  },
};

export default function FaqPage() {
  const faqs = getFAQsCMS();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClientView initialFaqs={faqs} />
    </>
  );
}
