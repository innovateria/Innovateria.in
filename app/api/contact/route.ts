import { NextResponse } from 'next/server';
import { Lead } from '@/lib/crm-store';
import { saveFirestoreDoc } from '@/lib/firestore-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields (Name, Email, Phone, Subject, Message) are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (phone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit phone number.' },
        { status: 400 }
      );
    }

    const leadId = `lead-${Date.now()}`;
    const newLead: Lead = {
      id: leadId,
      name,
      email,
      phone,
      subject,
      message,
      status: 'new',
      source: 'Website Contact Form',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveFirestoreDoc('leads', leadId, newLead);

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you shortly!',
      leadId
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
