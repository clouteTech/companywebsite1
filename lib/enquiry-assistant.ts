// Content for the WhatsApp enquiry assistant (components/enquiry-assistant.tsx): the questions asked for each
// service, each service's look, and the WhatsApp message built from the answers. Nothing here leaves the browser
// until the visitor opens WhatsApp themselves.
//
// The questions are written for business customers, not IT staff: plain English, three per service, no technical
// terms, so an enquiry takes a minute or two.
import { CodeXml, Headset, Megaphone, Network, ServerCog, ShieldCheck, Cloudy, UserPlus, type LucideIcon } from "lucide-react";

import { company, serviceLinks } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import copy from "@/content/chatbot.json";

export type AssistantServiceId = "network" | "software" | "support" | "managed" | "cyber" | "cloud" | "marketing" | "recruitment";

export interface ChoiceQuestion {
  id: string;
  /** Asked in the chat. */
  prompt: string;
  /** Short label for the summary and the WhatsApp message. */
  label: string;
  options: string[];
}

export interface AssistantService {
  id: AssistantServiceId;
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
  /** Accent pair; the assistant's buttons, progress bar and selections follow these. */
  accent: string;
  accent2: string;
  /** Cybersecurity uses a dark panel. */
  dark?: boolean;
  questions: ChoiceQuestion[];
}

// Name and link come from the site navigation so they never drift from the service pages.
function nav(href: string) {
  const link = serviceLinks.find((item) => item.href === href);
  if (!link) throw new Error(`No service page at ${href}`);
  return { label: link.label, href };
}

export const assistantServices: AssistantService[] = [
  {
    id: "network",
    ...nav("/networking-and-infrastructure"),
    description: copy.enquiryAssistant.assistantServices.i0_description,
    icon: Network,
    accent: "#1e5fdb",
    accent2: "#0891b2",
    questions: [
      {
        id: "need",
        prompt: copy.enquiryAssistant.assistantServices.i0_questions_i0_prompt,
        label: copy.enquiryAssistant.assistantServices.i0_questions_i0_label,
        options: [
          "New Network Setup",
          "Improve Existing Network",
          "Wi-Fi Setup",
          "Office Network Problem",
          "Complete Office Infrastructure",
          "Other",
        ],
      },
      {
        id: "site",
        prompt: copy.enquiryAssistant.assistantServices.i0_questions_i1_prompt,
        label: copy.enquiryAssistant.assistantServices.i0_questions_i1_label,
        options: ["New Office", "Existing Office", "Multiple Office Locations"],
      },
      {
        id: "timeline",
        prompt: copy.enquiryAssistant.assistantServices.i0_questions_i2_prompt,
        label: copy.enquiryAssistant.assistantServices.i0_questions_i2_label,
        options: ["Immediately", "Within a Week", "Within a Month", "Just Exploring"],
      },
    ],
  },
  {
    id: "software",
    ...nav("/software-development-services"),
    description: copy.enquiryAssistant.assistantServices.i1_description,
    icon: CodeXml,
    accent: "#7c3aed",
    accent2: "#4f46e5",
    questions: [
      {
        id: "need",
        prompt: copy.enquiryAssistant.assistantServices.i1_questions_i0_prompt,
        label: copy.enquiryAssistant.assistantServices.i1_questions_i0_label,
        options: [
          "Business Website",
          "E-commerce Website",
          "Mobile Application",
          "Business Management Software",
          "Customer Management System",
          "Custom Application",
          "Other",
        ],
      },
      {
        id: "project",
        prompt: copy.enquiryAssistant.assistantServices.i1_questions_i1_prompt,
        label: copy.enquiryAssistant.assistantServices.i1_questions_i1_label,
        options: ["New Project", "Existing Project Improvement", copy.enquiryAssistant.assistantServices.i1_questions_i1_options_i2, "Maintenance or Support"],
      },
      {
        id: "timeline",
        prompt: copy.enquiryAssistant.assistantServices.i1_questions_i2_prompt,
        label: copy.enquiryAssistant.assistantServices.i1_questions_i2_label,
        options: ["Immediately", "Within 1 Month", "Within 3 Months", "Not Decided"],
      },
    ],
  },
  {
    id: "support",
    ...nav("/it-support-and-helpdesk"),
    description: copy.enquiryAssistant.assistantServices.i2_description,
    icon: Headset,
    accent: "#059669",
    accent2: "#0d9488",
    questions: [
      {
        id: "need",
        prompt: copy.enquiryAssistant.assistantServices.i2_questions_i0_prompt,
        label: copy.enquiryAssistant.assistantServices.i2_questions_i0_label,
        options: [
          copy.enquiryAssistant.assistantServices.i2_questions_i0_options_i0,
          "Software Problem",
          copy.enquiryAssistant.assistantServices.i2_questions_i0_options_i2,
          "Email Problem",
          "Printer Problem",
          "General IT Support",
        ],
      },
      {
        id: "mode",
        prompt: copy.enquiryAssistant.assistantServices.i2_questions_i1_prompt,
        label: copy.enquiryAssistant.assistantServices.i2_questions_i1_label,
        options: ["Remote Support", "On-site Support", "Either is Fine"],
      },
      {
        id: "urgency",
        prompt: copy.enquiryAssistant.assistantServices.i2_questions_i2_prompt,
        label: copy.enquiryAssistant.assistantServices.i2_questions_i2_label,
        options: ["Very Urgent", "Within 24 Hours", "Not Urgent"],
      },
    ],
  },
  {
    id: "managed",
    ...nav("/managed-it-services"),
    description: copy.enquiryAssistant.assistantServices.i3_description,
    icon: ServerCog,
    accent: "#1e3a8a",
    accent2: "#2563eb",
    questions: [
      {
        id: "need",
        prompt: copy.enquiryAssistant.assistantServices.i3_questions_i0_prompt,
        label: copy.enquiryAssistant.assistantServices.i3_questions_i0_label,
        options: [
          "Complete Office IT",
          "Computers and Laptops",
          "Network and Internet",
          "Servers and Systems",
          "Data Backup",
          "Regular IT Maintenance",
        ],
      },
      {
        id: "support",
        prompt: copy.enquiryAssistant.assistantServices.i3_questions_i1_prompt,
        label: copy.enquiryAssistant.assistantServices.i3_questions_i1_label,
        options: ["Daily IT Support", "Monthly IT Maintenance", "Complete IT Management", copy.enquiryAssistant.assistantServices.i3_questions_i1_options_i3],
      },
      {
        id: "employees",
        prompt: copy.enquiryAssistant.assistantServices.i3_questions_i2_prompt,
        label: copy.enquiryAssistant.assistantServices.i3_questions_i2_label,
        options: ["1–20", "21–50", "51–100", "More than 100"],
      },
    ],
  },
  {
    id: "cyber",
    ...nav("/cybersecurity-services"),
    description: copy.enquiryAssistant.assistantServices.i4_description,
    icon: ShieldCheck,
    accent: "#e11d48",
    accent2: "#7c3aed",
    dark: true,
    questions: [
      {
        id: "need",
        prompt: copy.enquiryAssistant.assistantServices.i4_questions_i0_prompt,
        label: copy.enquiryAssistant.assistantServices.i4_questions_i0_label,
        options: ["Company Website", "Office Network", "Computers and Laptops", "Company Data", "Complete Business Security"],
      },
      {
        id: "requirement",
        prompt: copy.enquiryAssistant.assistantServices.i4_questions_i1_prompt,
        label: copy.enquiryAssistant.assistantServices.i4_questions_i1_label,
        options: [
          "Check Security Problems",
          copy.enquiryAssistant.assistantServices.i4_questions_i1_options_i1,
          "Improve Existing Security",
          "Security Consultation",
        ],
      },
      {
        id: "timeline",
        prompt: copy.enquiryAssistant.assistantServices.i4_questions_i2_prompt,
        label: copy.enquiryAssistant.assistantServices.i4_questions_i2_label,
        options: ["Immediately", "Within a Week", "Within a Month", "Just Exploring"],
      },
    ],
  },
  {
    id: "cloud",
    ...nav("/cloud-services"),
    description: copy.enquiryAssistant.assistantServices.i5_description,
    icon: Cloudy,
    accent: "#0284c7",
    accent2: "#7c3aed",
    questions: [
      {
        id: "need",
        prompt: copy.enquiryAssistant.assistantServices.i5_questions_i0_prompt,
        label: copy.enquiryAssistant.assistantServices.i5_questions_i0_label,
        options: [
          copy.enquiryAssistant.assistantServices.i5_questions_i0_options_i0,
          copy.enquiryAssistant.assistantServices.i5_questions_i0_options_i1,
          copy.enquiryAssistant.assistantServices.i5_questions_i0_options_i2,
          copy.enquiryAssistant.assistantServices.i5_questions_i0_options_i3,
          copy.enquiryAssistant.assistantServices.i5_questions_i0_options_i4,
          "Reduce Cloud Expenses",
          "Need Expert Guidance",
        ],
      },
      {
        id: "goal",
        prompt: copy.enquiryAssistant.assistantServices.i5_questions_i1_prompt,
        label: copy.enquiryAssistant.assistantServices.i5_questions_i1_label,
        options: [
          "Improve Business Performance",
          "Reduce Maintenance Costs",
          copy.enquiryAssistant.assistantServices.i5_questions_i1_options_i2,
          "Improve Data Security",
          "Expand Business Operations",
          "Not Sure",
        ],
      },
      {
        id: "start",
        prompt: copy.enquiryAssistant.assistantServices.i5_questions_i2_prompt,
        label: copy.enquiryAssistant.assistantServices.i5_questions_i2_label,
        options: ["Immediately", "Within 1 Month", "Within 3 Months", "Just Exploring"],
      },
    ],
  },
  {
    id: "marketing",
    ...nav("/digital-marketing-services"),
    description: copy.enquiryAssistant.assistantServices.i6_description,
    icon: Megaphone,
    accent: "#c026d3",
    accent2: "#f97316",
    questions: [
      {
        id: "need",
        prompt: copy.enquiryAssistant.assistantServices.i6_questions_i0_prompt,
        label: copy.enquiryAssistant.assistantServices.i6_questions_i0_label,
        options: [
          copy.enquiryAssistant.assistantServices.i6_questions_i0_options_i0,
          "Social Media Marketing",
          copy.enquiryAssistant.assistantServices.i6_questions_i0_options_i2,
          copy.enquiryAssistant.assistantServices.i6_questions_i0_options_i3,
          copy.enquiryAssistant.assistantServices.i6_questions_i0_options_i4,
          "Email Marketing",
          "Need Expert Guidance",
        ],
      },
      {
        id: "goal",
        prompt: copy.enquiryAssistant.assistantServices.i6_questions_i1_prompt,
        label: copy.enquiryAssistant.assistantServices.i6_questions_i1_label,
        options: [
          "Get More Enquiries",
          "Increase Sales",
          "Build Brand Awareness",
          copy.enquiryAssistant.assistantServices.i6_questions_i1_options_i3,
          copy.enquiryAssistant.assistantServices.i6_questions_i1_options_i4,
          "Not Sure",
        ],
      },
      {
        id: "start",
        prompt: copy.enquiryAssistant.assistantServices.i6_questions_i2_prompt,
        label: copy.enquiryAssistant.assistantServices.i6_questions_i2_label,
        options: ["Immediately", "Within 1 Month", "Within 3 Months", "Just Exploring"],
      },
    ],
  },
  {
    id: "recruitment",
    ...nav("/recruitment"),
    description: copy.enquiryAssistant.recruitmentService.description,
    icon: UserPlus,
    accent: "#0f766e",
    accent2: "#2563eb",
    questions: [
      {
        id: "need",
        prompt: copy.enquiryAssistant.recruitmentService.needPrompt,
        label: copy.enquiryAssistant.recruitmentService.needLabel,
        options: copy.enquiryAssistant.recruitmentService.needOptions,
      },
      {
        id: "roles",
        prompt: copy.enquiryAssistant.recruitmentService.rolesPrompt,
        label: copy.enquiryAssistant.recruitmentService.rolesLabel,
        options: copy.enquiryAssistant.recruitmentService.rolesOptions,
      },
      {
        id: "start",
        prompt: copy.enquiryAssistant.recruitmentService.startPrompt,
        label: copy.enquiryAssistant.recruitmentService.startLabel,
        options: ["Immediately", "Within 1 Month", "Within 3 Months", "Just Exploring"],
      },
    ],
  },
];

export function getAssistantService(id: AssistantServiceId) {
  return assistantServices.find((service) => service.id === id)!;
}

/** The questions asked of everyone after the service-specific ones. */
export const detailFields = [
  { id: "name", prompt: copy.enquiryAssistant.detailFields.i0_prompt, label: copy.enquiryAssistant.detailFields.i0_label, type: "text", autoComplete: "name", required: true },
  { id: "company", prompt: copy.enquiryAssistant.detailFields.i1_prompt, label: copy.enquiryAssistant.detailFields.i1_label, type: "text", autoComplete: "organization", required: false },
  { id: "email", prompt: copy.enquiryAssistant.detailFields.i2_prompt, label: copy.enquiryAssistant.detailFields.i2_label, type: "email", autoComplete: "email", required: true },
  { id: "phone", prompt: copy.enquiryAssistant.detailFields.i3_prompt, label: copy.enquiryAssistant.detailFields.i3_label, type: "tel", autoComplete: "tel", required: true },
  { id: "requirement", prompt: copy.enquiryAssistant.detailFields.i4_prompt, label: copy.enquiryAssistant.detailFields.i4_label, type: "textarea", autoComplete: "off", required: true },
] as const;

export type DetailField = (typeof detailFields)[number]["id"];
export type Details = Record<DetailField, string>;
export type Answers = Record<string, string>;

/** The enquiry as typed into WhatsApp. *text* is bold in WhatsApp. */
export function assistantWhatsAppMessage(service: AssistantService, answers: Answers, details: Details) {
  const lines = [
    `Hi ${company.name},`,
    "",
    `I'd like to enquire about *${service.label}*.`,
    "",
    "*My answers*",
    ...service.questions.map((question) => `• ${question.label}: ${answers[question.id] ?? ""}`),
    "",
    "*My details*",
    `• Name: ${details.name}`,
    ...(details.company ? [`• Company: ${details.company}`] : []),
    `• Email: ${details.email}`,
    `• Contact number: ${details.phone}`,
    "",
    "*What I need*",
    details.requirement,
    "",
    copy.enquiryAssistant.assistantWhatsAppMessage.item01_sent_from_the_cloute,
  ];
  return lines.join("\n");
}

export function assistantWhatsAppUrl(service: AssistantService, answers: Answers, details: Details) {
  return whatsappUrl(assistantWhatsAppMessage(service, answers, details));
}
