import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#FF4E2E',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://innovateria.in'),
  title: {
    default: 'Innovateria | App Development, Software, Web & SEO Agency India',
    template: '%s | Innovateria',
  },
  description: 'Innovateria is a premier technology & digital growth agency in India specializing in Android & iOS app development, enterprise custom software, Next.js web applications, logo design, SEO, and digital marketing.',
  keywords: [
    'Innovateria',
    'Innovateria.in',
    'Vivekajee',
    'Vnj Vibhash',
    'Android App Development Company India',
    'Custom Software Development Agency',
    'Next.js Web Development Services',
    'SEO Services India',
    'Digital Marketing Agency Patna Bihar',
    'Logo Design & UI/UX Agency',
    'Software Solutions India',
    'Full Stack Web Developers India',
    'Mobile App Engineering',
    'Enterprise Cloud Solutions',
  ],
  authors: [
    { name: 'Innovateria Engineering Team', url: 'https://innovateria.in' },
    { name: 'Vivekajee (Vnj Vibhash)', url: 'https://github.com/Vnjvibhash' }
  ],
  creator: 'Innovateria',
  publisher: 'Innovateria Digital Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'technology',
  alternates: {
    canonical: 'https://innovateria.in',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Innovateria — Digital Agency for Apps, Custom Software & SEO Growth',
    description: 'Empowering businesses worldwide with scalable Android apps, enterprise software systems, modern Next.js websites, and high-impact SEO.',
    url: 'https://innovateria.in',
    siteName: 'Innovateria',
    images: [
      {
        url: 'https://innovateria.in/assets/img/logo.png',
        width: 1200,
        height: 630,
        alt: 'Innovateria Digital Agency Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innovateria — App Development, Software & SEO Solutions',
    description: 'Custom mobile app engineering, web development, enterprise software, and organic SEO growth strategies.',
    creator: '@Vnjvibhash',
    images: ['https://innovateria.in/assets/img/logo.png'],
  },
};
