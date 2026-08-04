import { NextResponse } from 'next/server';
import { getCRMStats } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, stats: getCRMStats() });
}
