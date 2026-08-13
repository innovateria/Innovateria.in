import { NextResponse } from 'next/server';
import { getFirestoreServices, getFirestoreProjects, getFirestoreSettings } from '@/lib/firestore-db';

export async function GET() {
  try {
    const [services, allProjects, settings] = await Promise.all([
      getFirestoreServices(),
      getFirestoreProjects(),
      getFirestoreSettings(),
    ]);

    const selectedHeaderProjects = allProjects.filter(p => p.showInHeader === true);
    const finalProjects = selectedHeaderProjects.length > 0 ? selectedHeaderProjects : allProjects;

    return NextResponse.json({
      success: true,
      phone: settings.phone || '+91-7762974716',
      email: settings.adminEmail || 'innovateria.in@gmail.com',
      agencyName: settings.agencyName || 'Innovateria',
      portfolioUrl: settings.portfolioUrl || 'https://vivekajee.com',
      services: services.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        category: s.category
      })),
      projects: finalProjects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        github: p.github
      }))
    });
  } catch (err) {
    console.error('Error in header-data route:', err);
    return NextResponse.json({
      success: true,
      phone: '+91-7762974716',
      email: 'innovateria.in@gmail.com',
      agencyName: 'Innovateria',
      portfolioUrl: 'https://vivekajee.com',
      services: [],
      projects: []
    });
  }
}
