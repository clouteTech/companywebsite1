// The chat assistant's enquiry flow: the questions in order, answer validation (reusing the contact form's rules
// from lib/contact.ts) and the WhatsApp / email hand-off messages.
import { checkEmail, checkFullName, checkMessage, checkPhone, serviceOptions } from "@/lib/contact";
import { matchTopic } from "@/lib/chatbot/respond";
import type { EnquiryKey } from "@/lib/chatbot/translations";
import { company, serviceLinks } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

export const enquiryFields = ["name", "company", "service", "help", "email", "phone"] as const;
export type EnquiryField = (typeof enquiryFields)[number];
export type EnquiryDraft = Record<EnquiryField, string>;

export const emptyDraft: EnquiryDraft = { name: "", company: "", service: "", help: "", email: "", phone: "" };

/** The services offered in the enquiry flow, named as on the website menu. */
export const enquiryServices = serviceLinks.map((service) => service.label);

// Knowledge-base topic for each service, so a typed answer such as "cloud" or "சைபர்" picks the right one.
const serviceTopics: Record<string, string> = {
  networking: "/networking-and-infrastructure",
  software: "/software-development-services",
  support: "/it-support-and-helpdesk",
  managed: "/managed-it-services",
  cyber: "/cybersecurity-services",
  cloud: "/cloud-services",
  marketing: "/digital-marketing-services",
  recruitment: "/recruitment",
};

export const fieldLabel: Record<EnquiryField, EnquiryKey> = {
  name: "labelName",
  company: "labelCompany",
  service: "labelService",
  help: "labelHelp",
  email: "labelEmail",
  phone: "labelPhone",
};

export const fieldQuestion: Record<EnquiryField, EnquiryKey> = {
  name: "name",
  company: "company",
  service: "service",
  help: "help",
  email: "email",
  phone: "phone",
};

/** Matches a typed service answer to one of the services. */
export function matchService(answer: string) {
  const exact = enquiryServices.find((service) => service.toLowerCase() === answer.trim().toLowerCase());
  if (exact) return exact;
  const topic = matchTopic(answer);
  const href = topic ? serviceTopics[topic.id] : undefined;
  return serviceLinks.find((service) => service.href === href)?.label ?? null;
}

/**
 * Cleans and checks one answer. Returns the cleaned value, or the key of the (translated) error message.
 */
export function validateAnswer(field: EnquiryField, raw: string): { value: string } | { error: EnquiryKey } {
  const trimmed = raw.trim();
  switch (field) {
    case "name": {
      const value = trimmed.replace(/\s+/g, " ");
      return checkFullName(value) ? { error: "errName" } : { value };
    }
    case "company": {
      const value = trimmed.replace(/\s+/g, " ");
      return value.length > 100 ? { error: "errCompany" } : { value };
    }
    case "service": {
      const value = matchService(trimmed);
      return value ? { value } : { error: "errService" };
    }
    case "help":
      return checkMessage(trimmed) ? { error: "errHelp" } : { value: trimmed };
    case "email": {
      const value = trimmed.toLowerCase();
      return checkEmail(value) ? { error: "errEmail" } : { value };
    }
    case "phone":
      return checkPhone(trimmed) ? { error: "errPhone" } : { value: trimmed };
  }
}

/** The enquiry as typed into WhatsApp (labels in English, since the team reads it). */
export function enquiryText(draft: EnquiryDraft) {
  return [
    `Hi ${company.name},`,
    "",
    `I'd like to enquire about *${draft.service}*.`,
    "",
    `• Name: ${draft.name}`,
    ...(draft.company ? [`• Company: ${draft.company}`] : []),
    `• Email: ${draft.email}`,
    `• WhatsApp: ${draft.phone}`,
    "",
    "*What I need*",
    draft.help,
    "",
    "Sent from the website chat assistant.",
  ].join("\n");
}

export function enquiryWhatsAppUrl(draft: EnquiryDraft) {
  return whatsappUrl(enquiryText(draft));
}

/** The enquiry in the shape the contact API expects (the same endpoint the contact form posts to). */
export function enquiryPayload(draft: EnquiryDraft) {
  const service = serviceOptions.find((option) => option === draft.service) ?? "Other";
  const message = draft.company ? `Company: ${draft.company}

${draft.help}` : draft.help;
  return { fullName: draft.name, phone: draft.phone, email: draft.email, service, message };
}

export function nextField(field: EnquiryField): EnquiryField | null {
  const index = enquiryFields.indexOf(field);
  return enquiryFields[index + 1] ?? null;
}
