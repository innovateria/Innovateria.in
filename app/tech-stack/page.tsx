import { Metadata } from 'next';
import TechStackClient from './TechStackClient';
import { getTechStackCMS, DEFAULT_TECH_STACK, TechStackCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection } from '@/lib/firestore-db';

export const metadata: Metadata = {
  title: 'Technology Stack & Engineering Ecosystem',
  description: 'Explore Innovateria\'s complete 43+ technology ecosystem across Mobile Apps (Flutter, Kotlin, iOS), Web Engineering (Next.js, React), Backend APIs, Cloud Databases, and DevOps.',
  keywords: [
    'Technology Stack',
    'Flutter Development',
    'Next.js 14 Web Development',
    'Kotlin Android Development',
    'Node.js Microservices',
    'Firebase Cloud Solutions',
    'Full Stack Engineering',
    'Innovateria Tech Stack'
  ]
};

export default async function TechStackPage() {
  let techItems: TechStackCMS[] = [];

  try {
    const firestoreItems = await fetchFirestoreCollection<TechStackCMS>('techStack');
    if (firestoreItems && firestoreItems.length > 0) {
      techItems = firestoreItems;
    }
  } catch (err) {
    console.warn('Firestore tech stack read note:', err);
  }

  if (techItems.length === 0) {
    techItems = getTechStackCMS();
  }
  if (techItems.length === 0) {
    techItems = DEFAULT_TECH_STACK;
  }

  return <TechStackClient initialTechStack={techItems} />;
}
