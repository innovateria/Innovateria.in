import { NextResponse } from 'next/server';
import { getCRMStats, Lead, ProjectCRM, Client } from '@/lib/crm-store';
import { fetchFirestoreCollection } from '@/lib/firestore-db';

export async function GET() {
  try {
    const [leads, projects, clients] = await Promise.all([
      fetchFirestoreCollection<Lead>('leads'),
      fetchFirestoreCollection<ProjectCRM>('projects'),
      fetchFirestoreCollection<Client>('clients')
    ]);

    if (leads.length > 0 || projects.length > 0 || clients.length > 0) {
      const totalLeads = leads.length;
      const newLeads = leads.filter(l => l.status === 'new').length;
      const wonLeads = leads.filter(l => l.status === 'won').length;
      const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
      const activeProjects = projects.filter(p => p.status === 'in_development' || p.status === 'beta_testing').length;

      return NextResponse.json({
        success: true,
        stats: {
          totalLeads,
          newLeads,
          wonLeads,
          conversionRate,
          activeProjects,
          totalClients: clients.length,
          totalProjects: projects.length,
          projectedRevenue: '₹12,40,000'
        }
      });
    }
  } catch (err) {}

  return NextResponse.json({ success: true, stats: getCRMStats() });
}
