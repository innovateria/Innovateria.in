import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#FF4E2E',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://innovateria.in'),
  title: {
    default: 'Innovateria | App Development, Software, Web & SEO Services',
    template: '%s | Innovateria',
  },
  description: 'Innovateria is a results-driven digital agency in India offering Android app development, custom software, web development, logo design, SEO, and digital marketing services.',
  keywords: [
    'Innovateria',
    'Vivekajee',
    'Vnj Vibhash',
    'Android App Development',
    'Custom Software Development',
    'Web Development Company',
    'SEO Services',
    'Digital Marketing Agency',
    'Logo Design',
    'Software Solutions India',
  ],
  authors: [{ name: 'Innovateria', url: 'https://github.com/Vnjvibhash/Innovateria' }],
  alternates: {
    canonical: 'https://innovateria.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Innovateria - Digital Agency for Apps, Software & Growth',
    description: 'Partner with Innovateria for scalable Android apps, custom software, modern web platforms, and SEO-driven digital growth.',
    url: 'https://innovateria.in',
    siteName: 'Innovateria',
    images: [
      {
        url: '/assets/img/logo.png',
        width: 1200,
        height: 630,
        alt: 'Innovateria Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innovateria - Digital Agency for Apps, Software & Growth',
    description: 'Custom app, software, web, and marketing solutions for modern businesses.',
    images: ['/assets/img/logo.png'],
  },
};
