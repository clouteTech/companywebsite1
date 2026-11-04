// Enquiries confirmed in the chat assistant, kept in this browser's localStorage. This is browser-local only: it is
// not a shared database, nothing reaches the company from here, and each browser/device has its own separate list.
// The dashboard at /enquiries reads the same storage.
import type { Lang } from "@/lib/chatbot/knowledge";
import type { EnquiryDraft } from "@/lib/chatbot/enquiry";

export const enquiryStatuses = ["New", "Contacted", "In Progress", "Completed"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export interface LocalEnquiry extends EnquiryDraft {
  id: string;
  createdAt: string;
  status: EnquiryStatus;
  language: Lang;
}

const KEY = "cloute-chat-enquiries-v1";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

/** Raw stored JSON (a stable string for useSyncExternalStore), or null when storage is empty or blocked. */
export function readRaw() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseEnquiries(raw: string | null): LocalEnquiry[] {
  if (!raw) return [];
  try {
    const list: unknown = JSON.parse(raw);
    return Array.isArray(list) ? (list as LocalEnquiry[]) : [];
  } catch {
    return [];
  }
}

function write(list: LocalEnquiry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    notify();
    return true;
  } catch {
    return false;
  }
}

/** Saves a confirmed enquiry. Returns false when the browser blocks storage (private mode, disabled site data). */
export function saveEnquiry(draft: EnquiryDraft, language: Lang): LocalEnquiry | null {
  const enquiry: LocalEnquiry = {
    ...draft,
    // randomUUID only exists on HTTPS and localhost; plain-HTTP LAN testing gets a timestamp-based id.
    id: crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    status: "New",
    language,
  };
  return write([enquiry, ...parseEnquiries(readRaw())]) ? enquiry : null;
}

export function updateStatus(id: string, status: EnquiryStatus) {
  return write(parseEnquiries(readRaw()).map((item) => (item.id === id ? { ...item, status } : item)));
}

export function deleteEnquiry(id: string) {
  return write(parseEnquiries(readRaw()).filter((item) => item.id !== id));
}

/** For useSyncExternalStore: re-reads on changes from this tab and from other tabs. */
export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
