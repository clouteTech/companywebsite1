"use client";

import { CircleCheck, Clock, Inbox, Mail, Phone, Search, Sparkles, Trash2, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";

import { SocialIcon } from "@/components/social-icon";
import { enquiryServices } from "@/lib/chatbot/enquiry";
import {
  deleteEnquiry,
  enquiryStatuses,
  parseEnquiries,
  readRaw,
  subscribe,
  updateStatus,
  type EnquiryStatus,
  type LocalEnquiry,
} from "@/lib/chatbot/local-enquiries";
import { languageNames } from "@/lib/chatbot/translations";
import copy from "@/content/chatbot.json";

const statusStyle: Record<EnquiryStatus, string> = copy.enquiryDashboard.statusStyle;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

/**
 * Enquiries confirmed in the chat assistant on THIS browser (localStorage). Not a shared or secure admin system:
 * every browser has its own list and anyone using this browser can open the page.
 */
export function EnquiryDashboard() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const enquiries = useMemo(() => parseEnquiries(raw), [raw]);
  const [query, setQuery] = useState("");
  const [service, setService] = useState("all");
  const [status, setStatus] = useState<"all" | EnquiryStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return enquiries.filter(
      (item) =>
        (!term || item.name.toLowerCase().includes(term) || item.email.toLowerCase().includes(term)) &&
        (service === "all" || item.service === service) &&
        (status === "all" || item.status === status),
    );
  }, [enquiries, query, service, status]);

  const count = (value: EnquiryStatus) => enquiries.filter((item) => item.status === value).length;
  const selected = enquiries.find((item) => item.id === selectedId) ?? null;

  function open(id: string) {
    setSelectedId(id);
    dialogRef.current?.showModal();
  }

  const cards: { label: string; value: number; icon: LucideIcon; tone: string }[] = [
    { label: copy.enquiryDashboard.EnquiryDashboard.label01_total_enquiries, value: enquiries.length, icon: Inbox, tone: "#1e5fdb" },
    { label: copy.enquiryDashboard.EnquiryDashboard.label02_new_enquiries, value: count("New"), icon: Sparkles, tone: "#0891b2" },
    { label: copy.enquiryDashboard.EnquiryDashboard.label03_in_progress, value: count("In Progress"), icon: Clock, tone: "#7c3aed" },
    { label: copy.enquiryDashboard.EnquiryDashboard.label04_completed, value: count("Completed"), icon: CircleCheck, tone: "#059669" },
  ];

  return (
    <div>
      <p className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-[0.9375rem] text-amber-900 ring-1 ring-amber-200">
        <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">{copy.enquiryDashboard.EnquiryDashboard.text05_enquiries_are_stored_locally}</strong>{" "}{copy.enquiryDashboard.EnquiryDashboard.text06_this_page_only_lists}</span>
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {cards.map((card) => (
          <li key={card.label} className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl text-white"
              style={{ background: card.tone }}
            >
              <card.icon className="size-5" strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-display text-3xl font-semibold tabular-nums">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="field-with-icon">
          <span className="sr-only">{copy.enquiryDashboard.EnquiryDashboard.text07_search_by_name_or}</span>
          <Search aria-hidden="true" className="field-icon" strokeWidth={1.75} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.enquiryDashboard.EnquiryDashboard.placeholder08_search_by_name_or}
            className="form-field"
          />
        </label>
        <label>
          <span className="sr-only">{copy.enquiryDashboard.EnquiryDashboard.text09_filter_by_service}</span>
          <select value={service} onChange={(event) => setService(event.target.value)} className="form-field form-select">
            <option value="all">{copy.enquiryDashboard.EnquiryDashboard.text10_all_services}</option>
            {enquiryServices.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">{copy.enquiryDashboard.EnquiryDashboard.text11_filter_by_status}</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "all" | EnquiryStatus)}
            className="form-field form-select"
          >
            <option value="all">{copy.enquiryDashboard.EnquiryDashboard.text12_all_statuses}</option>
            {enquiryStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">{copy.enquiryDashboard.EnquiryDashboard.text13_showing}{filtered.length}{copy.enquiryDashboard.EnquiryDashboard.text14_of}{enquiries.length} {enquiries.length === 1 ? "enquiry" : "enquiries"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-paper p-10 text-center ring-1 ring-line">
          <Inbox className="mx-auto size-8 text-muted" strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-3 font-medium">{enquiries.length === 0 ? "No enquiries saved in this browser yet." : "No enquiries match these filters."}</p>
          {enquiries.length === 0 ? (
            <p className="mt-1 text-sm text-muted">{copy.enquiryDashboard.EnquiryDashboard.text15_enquiries_confirmed_in_the}</p>
          ) : null}
        </div>
      ) : (
        <ul className="mt-4 grid gap-3">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => open(item.id)}
                className="grid w-full gap-2 rounded-2xl bg-white p-5 text-left ring-1 ring-line transition-shadow hover:shadow-[0_14px_30px_-18px_rgb(11_30_57/0.45)] hover:ring-brand/40 sm:grid-cols-[1.2fr_1fr_1.2fr_auto] sm:items-center sm:gap-4"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{item.name}</span>
                  <span className="block truncate text-sm text-muted">{item.email}</span>
                </span>
                <span className="text-sm">{item.service}</span>
                <span className="text-sm text-muted">{formatDate(item.createdAt)}</span>
                <StatusBadge status={item.status} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setSelectedId(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        aria-labelledby="enquiry-details-title"
        className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-3xl p-0 backdrop:bg-midnight/50 backdrop:backdrop-blur-sm"
      >
        {selected ? <Details enquiry={selected} onClose={() => dialogRef.current?.close()} /> : null}
      </dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyle[status]}`}>
      {status}
    </span>
  );
}

function Details({ enquiry, onClose }: { enquiry: LocalEnquiry; onClose: () => void }) {
  const phoneDigits = enquiry.phone.replace(/[^\d]/g, "");
  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Company", enquiry.company || "Not provided"],
    ["Service", enquiry.service],
    ["Help needed", enquiry.help],
    ["Email", enquiry.email],
    ["WhatsApp", enquiry.phone],
    ["Received", formatDate(enquiry.createdAt)],
    ["Chat language", languageNames[enquiry.language]?.english ?? enquiry.language],
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="enquiry-details-title" className="text-subheading">
            {enquiry.name}
          </h2>
          <p className="mt-1 text-sm text-muted">{enquiry.service}</p>
        </div>
        <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-paper" aria-label={copy.enquiryDashboard.Details.arialabel01_close}>
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <dl className="mt-6 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-0.5 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-[0.9375rem] break-words whitespace-pre-line">{value}</dd>
          </div>
        ))}
      </dl>

      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-medium">{copy.enquiryDashboard.Details.text02_status}</span>
        <select
          value={enquiry.status}
          onChange={(event) => updateStatus(enquiry.id, event.target.value as EnquiryStatus)}
          className="form-field form-select"
        >
          {enquiryStatuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp min-h-10 px-4">
          <SocialIcon network="whatsapp" className="size-4" />{copy.enquiryDashboard.Details.text03_whatsapp}</a>
        <a href={`mailto:${enquiry.email}`} className="btn btn-outline min-h-10 px-4">
          <Mail className="size-4" aria-hidden="true" />{copy.enquiryDashboard.Details.text04_email}</a>
        <a href={`tel:${enquiry.phone.replace(/[^\d+]/g, "")}`} className="btn btn-outline min-h-10 px-4">
          <Phone className="size-4" aria-hidden="true" />{copy.enquiryDashboard.Details.text05_call}</a>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete the enquiry from ${enquiry.name}? This only removes it from this browser.`)) {
              deleteEnquiry(enquiry.id);
              onClose();
            }
          }}
          className="btn min-h-10 px-4 text-red-700 ring-1 ring-red-200 hover:bg-red-50"
        >
          <Trash2 className="size-4" aria-hidden="true" />{copy.enquiryDashboard.Details.text06_delete}</button>
      </div>
    </div>
  );
}
