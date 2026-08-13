import { Metadata } from 'next';
import { getFirestoreTechStack } from '@/lib/firestore-db';
import TechStackClient from './TechStackClient';

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
  const techItems = await getFirestoreTechStack();
  return <TechStackClient initialTechStack={techItems} />;
}
