// WhatsApp Click-to-Chat links (https://wa.me). They only open a chat with the message typed in; the visitor still
// presses Send themselves. The number lives in lib/site.ts (company.whatsapp).
import type { Enquiry } from "@/lib/contact";
import { company } from "@/lib/site";

export const defaultWhatsAppMessage = `Hi ${company.name},

I visited your website and would like to know more about your services.

Please share more information.

Thank you.`;

// Long messages make unwieldy links; the full text has already been emailed, so WhatsApp gets a preview.
const MAX_MESSAGE_CHARS = 700;

export function whatsappUrl(message = defaultWhatsAppMessage) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Follow-up after a contact form enquiry. Only the name, service and message: no phone number or email address. */
export function enquiryWhatsAppMessage({ fullName, service, message }: Pick<Enquiry, "fullName" | "service" | "message">) {
  const body = message.length > MAX_MESSAGE_CHARS ? `${message.slice(0, MAX_MESSAGE_CHARS).trimEnd()}…` : message;
  return `Hi ${company.name},

I've just sent an enquiry through your website.

Name: ${fullName}
Service: ${service}
Message: ${body}

Thank you.`;
}
