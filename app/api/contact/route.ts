import { NextResponse } from 'next/server';
import { addLead } from '@/lib/crm-store';
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

    // Save lead into CRM Lead Store
    const savedLead = addLead({
      name,
      email,
      phone,
      subject,
      message,
      source: 'Website Contact Form'
    });

    // Save directly into Firestore 'leads' collection
    try {
      await saveFirestoreDoc('leads', savedLead.id, savedLead);
    } catch (dbErr) {
      console.warn('Firestore lead save notice:', dbErr);
    }

    console.log('[Innovateria Contact Submission Saved to Firestore]', savedLead);

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you shortly!',
      leadId: savedLead.id
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
