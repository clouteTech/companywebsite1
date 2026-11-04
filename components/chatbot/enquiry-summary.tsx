"use client";

import { Check, Info, Pencil, X } from "lucide-react";

import type { Lang } from "@/lib/chatbot/knowledge";
import { enquiryFields, fieldLabel, type EnquiryDraft, type EnquiryField } from "@/lib/chatbot/enquiry";
import { te } from "@/lib/chatbot/translations";

interface EnquirySummaryProps {
  draft: EnquiryDraft;
  lang: Lang;
  /** Only the latest summary can be edited or confirmed. */
  interactive: boolean;
  onEdit: (field: EnquiryField) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EnquirySummary({ draft, lang, interactive, onEdit, onConfirm, onCancel }: EnquirySummaryProps) {
  return (
    <div className="cb-summary">
      <p className="font-semibold">{te("summaryTitle", lang)}</p>
      <dl className="mt-2.5 grid gap-1">
        {enquiryFields.map((field) => (
          <div key={field} className="cb-summary-row">
            <div className="min-w-0 flex-1">
              <dt className="cb-summary-label">{te(fieldLabel[field], lang)}</dt>
              <dd className="text-sm break-words whitespace-pre-line">
                {draft[field] || <span className="opacity-60">{te("notProvided", lang)}</span>}
              </dd>
            </div>
            {interactive ? (
              <button type="button" onClick={() => onEdit(field)} className="cb-summary-edit">
                <Pencil className="size-3" aria-hidden="true" />
                {te("edit", lang)}
                <span className="sr-only"> {te(fieldLabel[field], lang)}</span>
              </button>
            ) : null}
          </div>
        ))}
      </dl>
      {interactive ? (
        <>
          <p className="cb-summary-note">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {te("summaryNote", lang)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={onConfirm} className="cb-confirm">
              <Check className="size-4" aria-hidden="true" />
              {te("confirm", lang)}
            </button>
            <button type="button" onClick={onCancel} className="cb-chip">
              <X className="size-3.5" aria-hidden="true" />
              {te("cancel", lang)}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
