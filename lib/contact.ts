// Contact form rules shared by the form (components/contact-form.tsx) and the API route (app/api/contact/route.ts),
// so the browser and the server always agree on what a valid enquiry is.

export const serviceOptions = [
  "Networking & Infrastructure",
  "Software Development",
  "IT Support & Helpdesk",
  "Managed IT Services",
  "Cybersecurity Services",
  "Cloud Services",
  "Digital Marketing",
  "Recruitment",
  "Other",
] as const;

export type Service = (typeof serviceOptions)[number];

export interface Enquiry {
  fullName: string;
  phone: string;
  email: string;
  service: Service;
  message: string;
}

export type EnquiryField = keyof Enquiry;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const limits = {
  fullName: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
} as const;

// Pragmatic check: one @, no spaces, and a dot in the domain followed by at least two characters.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// After removing spaces, dashes, dots and brackets: an optional + and 7–15 digits (E.164 allows up to 15).
const phonePattern = /^\+?\d{7,15}$/;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

// Field checks, also used one at a time by the WhatsApp enquiry assistant. Each returns an error message or undefined.
export function checkFullName(fullName: string) {
  if (!fullName) return "Please enter your full name.";
  if (fullName.length < limits.fullName.min) return "Your name looks too short.";
  if (fullName.length > limits.fullName.max) return `Please keep your name under ${limits.fullName.max} characters.`;
}

export function checkPhone(phone: string) {
  if (!phone) return "Please enter your phone number.";
  if (!phonePattern.test(phone.replace(/[\s\-.()]/g, ""))) return "Please enter a valid phone number, e.g. +91 99521 10515.";
}

export function checkEmail(email: string) {
  if (!email) return "Please enter your email address.";
  if (email.length > limits.email.max || !emailPattern.test(email)) return "Please enter a valid email address.";
}

export function checkMessage(message: string) {
  if (!message) return "Please tell us about your requirement.";
  if (message.length < limits.message.min)
    return `Please add a little more detail (at least ${limits.message.min} characters).`;
  if (message.length > limits.message.max) return `Please keep your message under ${limits.message.max} characters.`;
}

export function validateEnquiry(input: Record<string, unknown>):
  | { ok: true; data: Enquiry }
  | { ok: false; errors: EnquiryErrors } {
  const fullName = text(input.fullName).replace(/\s+/g, " ");
  const phone = text(input.phone);
  const email = text(input.email).toLowerCase();
  const service = text(input.service);
  const message = text(input.message);
  const checks: EnquiryErrors = {
    fullName: checkFullName(fullName),
    phone: checkPhone(phone),
    email: checkEmail(email),
    service: serviceOptions.includes(service as Service) ? undefined : "Please choose a service.",
    message: checkMessage(message),
  };
  const errors = Object.fromEntries(Object.entries(checks).filter(([, error]) => error)) as EnquiryErrors;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { fullName, phone, email, service: service as Service, message } };
}

/** Shape of every JSON response from /api/contact. */
export type ContactResponse = { ok: true } | { ok: false; error: string; errors?: EnquiryErrors };
