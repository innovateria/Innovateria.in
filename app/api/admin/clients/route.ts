import { NextResponse } from 'next/server';
import { getClients, addClient } from '@/lib/crm-store';

export async function GET() {
  return NextResponse.json({ success: true, clients: getClients() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newClient = addClient(body);
    return NextResponse.json({ success: true, client: newClient });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create client' }, { status: 500 });
  }
}
