import { NextResponse } from 'next/server';
import { Client } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc } from '@/lib/firestore-db';

export async function GET() {
  try {
    const clients = await fetchFirestoreCollection<Client>('clients');
    return NextResponse.json({ success: true, clients });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `client-${Date.now()}`;
    const newClient: Client = {
      ...body,
      id,
      createdAt: body.createdAt || new Date().toISOString()
    };

    await saveFirestoreDoc('clients', id, newClient);
    return NextResponse.json({ success: true, client: newClient });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create client' }, { status: 500 });
  }
}
