import { NextResponse } from 'next/server';
import { getServicesCMS, getProjects, getSettingsCMS } from '@/lib/crm-store';

export async function GET() {
  try {
    const services = getServicesCMS();
    const allProjects = getProjects();
    const selectedHeaderProjects = allProjects.filter(p => p.showInHeader === true);
    const finalProjects = selectedHeaderProjects.length > 0 ? selectedHeaderProjects : allProjects;
    const settings = getSettingsCMS();

    return NextResponse.json({
      success: true,
      phone: settings.phone || '+91-7762974716',
      email: settings.adminEmail || 'innovateria.in@gmail.com',
      agencyName: settings.agencyName || 'Innovateria',
      portfolioUrl: settings.socials?.github || 'https://vivekajee.in',
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
      portfolioUrl: 'https://vivekajee.in',
      services: [],
      projects: []
    });
  }
}
