import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client: Twilio.Twilio | null = null;

function getClient(): Twilio.Twilio | null {
  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio credentials not configured. SMS notifications disabled.');
    return null;
  }
  if (!client) {
    client = Twilio(accountSid, authToken);
  }
  return client;
}

function formatPhone(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.startsWith('+')) return phone;
  return null;
}

export async function sendSMS(to: string, body: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const twilioClient = getClient();
  if (!twilioClient) {
    return { success: false, error: 'Twilio not configured' };
  }

  const formattedPhone = formatPhone(to);
  if (!formattedPhone) {
    return { success: false, error: 'Invalid phone number format' };
  }

  try {
    const message = await twilioClient.messages.create({
      body,
      from: fromNumber,
      to: formattedPhone,
    });
    console.log(`SMS sent to ${formattedPhone}: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error('Failed to send SMS:', error?.message || error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

export async function sendPrescriptionReadySMS(patientPhone: string, patientName: string, medication: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const firstName = patientName.split(' ')[0];
  const body = `Hi ${firstName}, your ${medication} prescription from WellnessMeds is ready. Log in to your patient portal to view details. Questions? Reply to this message or call us.`;
  return sendSMS(patientPhone, body);
}

export async function sendAppointmentScheduledSMS(patientPhone: string, patientName: string, doctorName: string, scheduledAt: Date, videoLink?: string | null): Promise<{ success: boolean; sid?: string; error?: string }> {
  const firstName = patientName.split(' ')[0];
  const dateStr = scheduledAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = scheduledAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  let body = `Hi ${firstName}, your telehealth appointment with ${doctorName} is confirmed for ${dateStr} at ${timeStr}.`;
  if (videoLink) {
    body += ` Join here: ${videoLink}`;
  }
  body += ` - WellnessMeds`;
  return sendSMS(patientPhone, body);
}

export async function sendAppointmentReminderSMS(patientPhone: string, patientName: string, doctorName: string, scheduledAt: Date, videoLink?: string | null): Promise<{ success: boolean; sid?: string; error?: string }> {
  const firstName = patientName.split(' ')[0];
  const timeStr = scheduledAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  let body = `Reminder: ${firstName}, your telehealth appointment with ${doctorName} is today at ${timeStr}.`;
  if (videoLink) {
    body += ` Join here: ${videoLink}`;
  }
  body += ` - WellnessMeds`;
  return sendSMS(patientPhone, body);
}

export async function sendCustomSMS(to: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  return sendSMS(to, message);
}

export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && fromNumber);
}
