import { NextResponse } from 'next/server';
import { getClients, addClient, Client } from '@/lib/crm-store';
import { fetchFirestoreCollection, saveFirestoreDoc } from '@/lib/firestore-db';

export async function GET() {
  try {
    const firestoreClients = await fetchFirestoreCollection<Client>('clients');
    if (firestoreClients && firestoreClients.length > 0) {
      return NextResponse.json({ success: true, clients: firestoreClients });
    }
  } catch (err) {}
  return NextResponse.json({ success: true, clients: getClients() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newClient = addClient(body);

    // Save to Firestore
    try {
      await saveFirestoreDoc('clients', newClient.id, newClient);
    } catch (dbErr) {
      console.warn('Firestore write notice:', dbErr);
    }

    return NextResponse.json({ success: true, client: newClient });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create client' }, { status: 500 });
  }
}
