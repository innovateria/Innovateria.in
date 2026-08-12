import { NextResponse } from 'next/server';
import { getServicesCMS, getProjects, getSettingsCMS, ServiceCMS, ProjectCRM, AgencySettingsCMS } from '@/lib/crm-store';
import { fetchFirestoreCollection, fetchFirestoreDoc } from '@/lib/firestore-db';

export async function GET() {
  try {
    let services: ServiceCMS[] = [];
    let allProjects: ProjectCRM[] = [];
    let settings: AgencySettingsCMS | null = null;

    try {
      const [fsServices, fsProjects, fsSettings] = await Promise.all([
        fetchFirestoreCollection<ServiceCMS>('services'),
        fetchFirestoreCollection<ProjectCRM>('projects'),
        fetchFirestoreDoc<AgencySettingsCMS>('settings', 'agency_settings')
      ]);

      if (fsServices.length > 0) services = fsServices;
      if (fsProjects.length > 0) allProjects = fsProjects;
      if (fsSettings) settings = fsSettings;
    } catch (e) {}

    if (services.length === 0) services = getServicesCMS();
    if (allProjects.length === 0) allProjects = getProjects();
    if (!settings) settings = getSettingsCMS();

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
