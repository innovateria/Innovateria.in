import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialBar from '@/components/SocialBar';
import BackToTop from '@/components/BackToTop';
import { metadata, viewport } from './metadata';

export { metadata, viewport };

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Innovateria',
  alternateName: 'Innovateria Digital Agency',
  url: 'https://innovateria.in',
  logo: 'https://innovateria.in/assets/img/logo.png',
  image: 'https://innovateria.in/assets/img/logo.png',
  description: 'Innovateria is a full-service technology and digital marketing agency offering Android app development, custom software engineering, Next.js web applications, logo design, SEO, and digital growth services.',
  telephone: '+91-77629-74716',
  email: 'innovateria.in@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Patna',
    addressRegion: 'Bihar',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.5941,
    longitude: 85.1376,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
  ],
  sameAs: [
    'https://github.com/VnjVibhash',
    'https://www.linkedin.com/in/Vivekajee',
    'https://facebook.com/Vivekajee',
    'https://twitter.com/Vnjvibhash',
  ],
  priceRange: '$$',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Software & Digital Marketing Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Android & Mobile App Development',
          description: 'Native and cross-platform mobile application development with scalable backend architectures.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Enterprise Software Engineering',
          description: 'Tailored SaaS, CRM, MLM, and cloud software development.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description: 'Modern, ultra-fast Next.js, React, and glassmorphic website engineering.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Search Engine Optimization (SEO)',
          description: 'Data-driven technical SEO, schema markup, and organic Google ranking dominance.',
        },
      },
    ],
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-77629-74716',
      contactType: 'customer service',
      email: 'innovateria.in@gmail.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Innovateria',
  url: 'https://innovateria.in',
  description: 'Innovateria provides app development, custom software, web development, logo design, SEO, and digital marketing services.',
  publisher: {
    '@type': 'Organization',
    name: 'Innovateria',
    logo: 'https://innovateria.in/assets/img/logo.png',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://innovateria.in/projects?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const themeInitScript = `
  (function() {
    try {
      const stored = localStorage.getItem('innovateria-theme');
      const theme = stored === 'dark' || stored === 'light'
        ? stored
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
    } catch (e) {}
  })();
`;

import MainContentShell from '@/components/MainContentShell';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className="w-full max-w-full overflow-x-hidden">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans antialiased m-0 p-0">
        <Script id="professional-service-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <Script id="website-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <Header />
        <SocialBar />
        <MainContentShell>
          {children}
        </MainContentShell>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
