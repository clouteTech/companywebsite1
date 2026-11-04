"use client";

import {
  Check,
  CircleAlert,
  LoaderCircle,
  Mail,
  Phone,
  RotateCcw,
  Send,
  User,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { SocialIcon } from "@/components/social-icon";
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
import copy from "@/content/contact.json";

type Status = "idle" | "sending" | "success" | "error";

function readForm(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form)) as Record<string, string>;
}

const fieldOrder: EnquiryField[] = ["fullName", "phone", "email", "service", "message"];

// Validates with the same rules as the server (lib/contact.ts), then posts JSON to /api/contact.
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [serverError, setServerError] = useState("");
  // The enquiry just sent, kept for the success panel and its WhatsApp follow-up link.
  const [sent, setSent] = useState<Enquiry | null>(null);
  // Guards against a double click or Enter press firing a second request before React re-renders.
  const inFlight = useRef(false);
  // When the visitor started filling the form; the server drops posts made implausibly fast (spam protection).
  const startedAt = useRef(0);
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "idle") startedAt.current = Date.now();
    if (status === "success") successHeading.current?.focus();
  }, [status]);

  const fieldProps = (id: EnquiryField) => ({
    id,
    name: id,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });

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
        setValidated(false);
        setStatus("success");
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

  if (status === "success" && sent) {
    return (
      <div role="status" className="form-success flex flex-col items-center px-2 py-8 text-center sm:py-12">
        <span className="relative grid size-20 place-items-center">
          <span aria-hidden="true" className="ring-pulse absolute inset-0 rounded-full bg-accent/30" />
          <span
            aria-hidden="true"
            className="ring-pulse absolute inset-0 rounded-full bg-accent/20 [animation-delay:1.4s]"
          />
          <span className="relative grid size-20 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-brand),var(--color-accent))] text-white shadow-[0_20px_50px_-15px_rgb(23_195_230/0.7)]">
            <Check className="size-8" strokeWidth={2.25} aria-hidden="true" />
          </span>
        </span>
        <h4 ref={successHeading} tabIndex={-1} className="text-subheading mt-8 outline-none">{copy.contactForm.ContactForm.text01_thank_you_your_enquiry}</h4>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-muted">{copy.contactForm.ContactForm.text02_we_ve_received_your}<strong className="font-semibold text-ink">{sent.service}</strong>{copy.contactForm.ContactForm.text03_and_emailed_you_a}</p>
        {/* Optional follow-up: opens WhatsApp with the enquiry typed in; the visitor still presses Send. */}
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={whatsappUrl(enquiryWhatsAppMessage(sent))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <SocialIcon network="whatsapp" className="size-5" />{copy.contactForm.ContactForm.text04_continue_on_whatsapp}<span className="sr-only">{copy.contactForm.ContactForm.text05_opens_in_a_new}</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setServerError("");
              setStatus("idle");
            }}
            className="btn btn-outline"
          >
            <RotateCcw className="size-4" aria-hidden="true" />{copy.contactForm.ContactForm.text06_send_another_message}</button>
        </div>
        <p className="mt-3 text-xs text-muted">{copy.contactForm.ContactForm.text07_whatsapp_opens_with_your}</p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onChange={(event) => {
        if (!validated) return;
        const result = validateEnquiry(readForm(event.currentTarget));
        setErrors(result.ok ? {} : result.errors);
      }}
      aria-busy={sending}
      className="grid gap-5 sm:grid-cols-2"
    >
      {/* Honeypot: hidden from people and assistive tech; bots that fill every field get filtered out. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">{copy.contactForm.ContactForm.text08_website}</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="fullName" icon={User} label={copy.contactForm.ContactForm.label09_full_name} error={errors.fullName}>
        <input
          type="text"
          {...fieldProps("fullName")}
          placeholder={copy.contactForm.ContactForm.placeholder10_your_full_name}
          autoComplete="name"
          maxLength={limits.fullName.max}
          required
          className="form-field"
        />
      </Field>
      <Field id="phone" icon={Phone} label={copy.contactForm.ContactForm.label11_phone_number} error={errors.phone}>
        <input
          type="tel"
          {...fieldProps("phone")}
          placeholder={copy.contactForm.ContactForm.placeholder12_91_00000_00000}
          autoComplete="tel"
          inputMode="tel"
          maxLength={20}
          required
          className="form-field"
        />
      </Field>
      <Field id="email" icon={Mail} wide label={copy.contactForm.ContactForm.label13_email_address} error={errors.email}>
        <input
          type="email"
          {...fieldProps("email")}
          placeholder={copy.contactForm.ContactForm.placeholder14_you_company_com}
          autoComplete="email"
          maxLength={limits.email.max}
          required
          className="form-field"
        />
      </Field>
      {/* Service choice as selectable chips. */}
      <fieldset
        className="sm:col-span-2"
        aria-invalid={errors.service ? true : undefined}
        aria-describedby={errors.service ? "service-error" : undefined}
      >
        <legend className="mb-2 block text-sm font-medium text-ink">{copy.contactForm.ContactForm.text15_service_needed}</legend>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((option, i) => (
            <label key={option} className="service-chip">
              <input type="radio" name="service" value={option} defaultChecked={i === 0} className="sr-only" />
              {option}
            </label>
          ))}
        </div>
        <FieldError id="service" message={errors.service} />
      </fieldset>
      <Field id="message" label={copy.contactForm.ContactForm.label16_message} error={errors.message} wide>
        <textarea
          {...fieldProps("message")}
          rows={5}
          placeholder={copy.contactForm.ContactForm.placeholder17_tell_us_about_your}
          maxLength={limits.message.max}
          required
          className="form-field min-h-36 resize-y"
        />
      </Field>

      <div className="sm:col-span-2">
        <button type="submit" disabled={sending} className="btn btn-primary min-h-12 w-full text-[0.9375rem]">
          {sending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="send-icon size-4" aria-hidden="true" />
          )}
          {sending ? "Sending..." : "Send Message"}
        </button>
      </div>

      <div aria-live="polite" className="sm:col-span-2 empty:hidden">
        {status === "error" ? (
          <p
            role="alert"
            className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-[0.9375rem] text-red-900 ring-1 ring-red-200"
          >
            <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>
              {serverError || (
                <>{copy.contactForm.ContactForm.text18_something_went_wrong_sending}{" "}
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
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700">
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

interface FieldProps {
  id: string;
  label: string;
  /** Optional icon drawn inside the input. */
  icon?: LucideIcon;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}

function Field({ id, label, icon: Icon, error, wide = false, children }: FieldProps) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {Icon ? (
        <div className="field-with-icon">
          <Icon aria-hidden="true" className="field-icon" strokeWidth={1.75} />
          {children}
        </div>
      ) : (
        children
      )}
      <FieldError id={id} message={error} />
    </div>
  );
}
