"use client";

import {
  ArrowRight,
  Check,
  CircleAlert,
  Clock,
  Cloud,
  CodeXml,
  Headset,
  Laptop,
  LoaderCircle,
  Mail,
  Megaphone,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";

import {
  limits,
  serviceOptions,
  validateEnquiry,
  type ContactResponse,
  type Enquiry,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/contact";
import { company } from "@/lib/site";
import { enquiryWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";

import { SocialIcon } from "./social-icon";
import cms from "@/content/contact.json";

/*
 * Timed enquiry popup (opened by lead-popup.tsx). A native modal <dialog> that zooms in over a blurred page:
 * a brand panel on the left, a short form on the right. It posts to /api/contact exactly like the contact
 * form (same validation, honeypot and fill-time check), so Resend sends the company email and the visitor's
 * confirmation. Styles in globals.css (.lead-*).
 */

type Status = "idle" | "sending" | "success" | "error";

const fieldOrder: EnquiryField[] = ["fullName", "phone", "email", "service", "message"];
const CLOSE_MS = 280;

const perks: { icon: LucideIcon; text: string }[] = [
  { icon: Clock, text: cms.leadDialog.perks.i0_text },
  { icon: Headset, text: cms.leadDialog.perks.i1_text },
  { icon: ShieldCheck, text: cms.leadDialog.perks.i2_text },
];

const floaters: LucideIcon[] = [Laptop, Cloud, ShieldCheck, CodeXml, Megaphone];

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export function LeadDialog({ onClose, onSubmitted }: { onClose: (sent: boolean) => void; onSubmitted: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState<Enquiry | null>(null);
  const inFlight = useRef(false);
  const startedAt = useRef(0);
  const ids = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    startedAt.current = Date.now();
    dialog.showModal();
    // The page behind must not scroll while the popup is open.
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  function close() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      dialogRef.current?.close();
      onClose(status === "success");
    }, CLOSE_MS);
  }

  const fieldProps = (id: EnquiryField) => ({
    id: `${ids}-${id}`,
    name: id,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${ids}-${id}-error` : undefined,
  });

  function readForm(form: HTMLFormElement) {
    return Object.fromEntries(new FormData(form)) as Record<string, string>;
  }

  function focusFirstError(form: HTMLFormElement, fieldErrors: EnquiryErrors) {
    const first = fieldOrder.find((field) => fieldErrors[field]);
    if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const values = readForm(form);
    const result = validateEnquiry(values);
    setValidated(true);
    setServerError("");
    if (!result.ok) {
      setErrors(result.errors);
      focusFirstError(form, result.errors);
      return;
    }
    setErrors({});

    inFlight.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...result.data, website: values.website ?? "", startedAt: startedAt.current }),
      });
      const data = (await response.json().catch(() => null)) as ContactResponse | null;
      if (response.ok && data?.ok) {
        setSent(result.data);
        setStatus("success");
        onSubmitted();
        return;
      }
      if (data && !data.ok) {
        setServerError(data.error);
        if (data.errors) {
          setErrors(data.errors);
          focusFirstError(form, data.errors);
        }
      }
      setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  const sending = status === "sending";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${ids}-title`}
      className="lead"
      data-closing={closing || undefined}
      onCancel={(event) => {
        // Escape: run the zoom-out instead of closing instantly.
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        // A click on the backdrop (the dialog element itself, outside the card) closes it.
        if (event.target === event.currentTarget) close();
      }}
    >
      <span aria-hidden="true" className="lead-border" />
      <div className="lead-card">
        <button type="button" onClick={close} className="lead-close" aria-label={cms.leadDialog.LeadDialog.arialabel01_close}>
          <X className="size-5" aria-hidden="true" />
        </button>

        {/* Brand panel */}
        <aside className="lead-aside on-dark">
          <span aria-hidden="true" className="lead-orb lead-orb-a" />
          <span aria-hidden="true" className="lead-orb lead-orb-b" />
          <span aria-hidden="true" className="lead-grid" />
          {/* Service icons floating in glass bubbles behind the copy. */}
          <span aria-hidden="true" className="lead-floaters">
            {floaters.map((Icon, i) => (
              <span key={i} className="lead-floater" style={v({ "--i": i })}>
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
            ))}
          </span>
          <p className="lead-badge">
            <Sparkles className="size-3.5" aria-hidden="true" />{cms.leadDialog.LeadDialog.text02_talk_to_our_experts}</p>
          <h2 id={`${ids}-title`} className="lead-title">{cms.leadDialog.LeadDialog.text03_let_s_build_something}<span className="lead-title-accent">{cms.leadDialog.LeadDialog.text04_great}</span>{cms.leadDialog.LeadDialog.text05_together}</h2>
          <p className="lead-lead">{cms.leadDialog.LeadDialog.text06_tell_us_what_your}</p>
          <ul className="lead-perks">
            {perks.map((perk, i) => (
              <li key={perk.text} style={v({ "--i": i })}>
                <span className="lead-perk-icon">
                  <perk.icon className="size-4" aria-hidden="true" />
                </span>
                {perk.text}
              </li>
            ))}
          </ul>
          <a href={company.phoneHref} className="lead-call">
            <span className="lead-call-icon">
              <Phone className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="lead-call-label">{cms.leadDialog.LeadDialog.text07_prefer_to_talk}</span>
              <span className="lead-call-number">{company.phoneTopbar}</span>
            </span>
          </a>
        </aside>

        {/* Form or success */}
        <div className="lead-main">
          {status === "success" && sent ? (
            <div role="status" className="lead-success">
              <span className="lead-success-badge">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} aria-hidden="true" className="lead-spark" style={v({ "--i": i })} />
                ))}
                <span aria-hidden="true" className="lead-success-ring" />
                <Check className="relative size-9" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <h3 className="lead-success-title">{cms.leadDialog.LeadDialog.text08_thank_you}{sent.fullName.split(" ")[0]}!</h3>
              <p className="lead-success-text">{cms.leadDialog.LeadDialog.text09_your_enquiry_for}<strong>{sent.service}</strong>{cms.leadDialog.LeadDialog.text10_has_been_sent_we}</p>
              <div className="lead-success-actions">
                <a
                  href={whatsappUrl(enquiryWhatsAppMessage(sent))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <SocialIcon network="whatsapp" className="size-5" />{cms.leadDialog.LeadDialog.text11_continue_on_whatsapp}</a>
                <button type="button" onClick={close} className="btn btn-outline">{cms.leadDialog.LeadDialog.text12_close}</button>
              </div>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              onChange={(event) => {
                if (!validated) return;
                const result = validateEnquiry(readForm(event.currentTarget));
                setErrors(result.ok ? {} : result.errors);
              }}
              aria-busy={sending}
              className="lead-form"
            >
              <p className="lead-form-kicker">{cms.leadDialog.LeadDialog.text13_get_in_touch}</p>
              <p className="lead-form-title">{cms.leadDialog.LeadDialog.text14_request_a_callback}</p>

              {/* Honeypot: hidden from people and assistive tech; bots that fill every field get filtered out. */}
              <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                <label htmlFor={`${ids}-website`}>{cms.leadDialog.LeadDialog.text15_website}</label>
                <input type="text" id={`${ids}-website`} name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="lead-fields">
                <LeadField id={`${ids}-fullName`} label={cms.leadDialog.LeadDialog.label16_full_name} icon={User} error={errors.fullName} step={0}>
                  <input
                    type="text"
                    {...fieldProps("fullName")}
                    placeholder=" "
                    autoComplete="name"
                    maxLength={limits.fullName.max}
                    required
                    className="lead-input"
                  />
                </LeadField>
                <LeadField id={`${ids}-phone`} label={cms.leadDialog.LeadDialog.label17_phone_number} icon={Phone} error={errors.phone} step={1}>
                  <input
                    type="tel"
                    {...fieldProps("phone")}
                    placeholder=" "
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={20}
                    required
                    className="lead-input"
                  />
                </LeadField>
                <LeadField id={`${ids}-email`} label={cms.leadDialog.LeadDialog.label18_email_address} icon={Mail} error={errors.email} step={2} wide>
                  <input
                    type="email"
                    {...fieldProps("email")}
                    placeholder=" "
                    autoComplete="email"
                    maxLength={limits.email.max}
                    required
                    className="lead-input"
                  />
                </LeadField>

                <fieldset
                  className="lead-step lead-wide"
                  style={v({ "--i": 3 })}
                  aria-invalid={errors.service ? true : undefined}
                  aria-describedby={errors.service ? `${ids}-service-error` : undefined}
                >
                  <legend className="lead-legend">{cms.leadDialog.LeadDialog.text19_i_m_interested_in}</legend>
                  <div className="lead-chips">
                    {serviceOptions.map((option, i) => (
                      <label key={option} className="lead-chip">
                        <input
                          type="radio"
                          name="service"
                          value={option}
                          defaultChecked={i === 0}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <LeadError id={`${ids}-service`} message={errors.service} />
                </fieldset>

                <LeadField id={`${ids}-message`} label={cms.leadDialog.LeadDialog.label20_how_can_we_help} error={errors.message} step={4} wide>
                  <textarea
                    {...fieldProps("message")}
                    placeholder=" "
                    rows={3}
                    maxLength={limits.message.max}
                    required
                    className="lead-input lead-textarea"
                  />
                </LeadField>
              </div>

              <button type="submit" disabled={sending} className="lead-submit lead-step" style={v({ "--i": 5 })}>
                <span aria-hidden="true" className="lead-submit-shine" />
                {sending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
                {sending ? "Sending..." : "Send My Enquiry"}
                {sending ? null : <ArrowRight className="lead-submit-arrow size-4" aria-hidden="true" />}
              </button>

              <div aria-live="polite" className="empty:hidden">
                {status === "error" ? (
                  <p role="alert" className="lead-alert">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>
                      {serverError || (
                        <>{cms.leadDialog.LeadDialog.text21_something_went_wrong_please}{" "}
                          <a href={company.phoneHref} className="font-medium underline underline-offset-2">
                            {company.phone}
                          </a>
                          .
                        </>
                      )}
                    </span>
                  </p>
                ) : null}
              </div>
              <p className="lead-note">{cms.leadDialog.LeadDialog.text22_we_ll_only_use}</p>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

function LeadError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="lead-error">
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

/** Input with a floating label that rises when the field is focused or filled. */
function LeadField({
  id,
  label,
  icon: Icon,
  error,
  step,
  wide = false,
  children,
}: {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  step: number;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`lead-step ${wide ? "lead-wide" : ""}`} style={v({ "--i": step })}>
      <div className={`lead-float ${Icon ? "lead-float-icon" : ""}`}>
        {children}
        <label htmlFor={id} className="lead-label">
          {label}
        </label>
        {Icon ? <Icon aria-hidden="true" className="lead-icon" strokeWidth={1.75} /> : null}
        <span aria-hidden="true" className="lead-focus-line" />
      </div>
      <LeadError id={id} message={error} />
    </div>
  );
}
