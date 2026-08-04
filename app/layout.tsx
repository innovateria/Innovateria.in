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
  '@type': 'Organization',
  name: 'Innovateria',
  url: 'https://innovateria.in',
  logo: 'https://innovateria.in/assets/img/logo.png',
  sameAs: [
    'https://github.com/VnjVibhash',
    'https://www.linkedin.com/in/Vivekajee',
    'https://facebook.com/Vivekajee',
    'https://twitter.com/Vnjvibhash',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-77629-74716',
      contactType: 'customer service',
      email: 'innovateria.in@gmail.com',
      areaServed: 'IN',
      availableLanguage: ['English'],
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Innovateria',
  url: 'https://innovateria.in',
  description: 'Innovateria provides app development, custom software, web development, logo design, SEO, and digital marketing services.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://innovateria.in/search?q={search_term_string}',
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
        <Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
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
