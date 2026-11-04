"use client";

import { ArrowLeft, ArrowRight, Check, LockKeyhole, PartyPopper, Pencil, RotateCcw, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";

import { SocialIcon } from "@/components/social-icon";
import { checkEmail, checkFullName, checkMessage, checkPhone } from "@/lib/contact";
import {
  assistantServices,
  assistantWhatsAppUrl,
  detailFields,
  getAssistantService,
  type AssistantService,
  type AssistantServiceId,
  type Answers,
  type ChoiceQuestion,
  type DetailField,
  type Details,
} from "@/lib/enquiry-assistant";
import { company } from "@/lib/site";
import copy from "@/content/chatbot.json";

const TYPING_MS = 650;
const emptyDetails: Details = { name: "", company: "", email: "", phone: "", requirement: "" };

const welcome = `Welcome to ${company.name}! 👋`;
const welcomeText =
  "We're excited to help you. Please select the service you're interested in, and we'll guide you through a few questions to understand your requirements.";
const privacyNotice =
  "Your answers stay in this browser window. Nothing is sent or stored until you choose Continue on WhatsApp, and even then you review the message and press Send yourself.";

function cleanDetail(field: DetailField, value: string) {
  const trimmed = value.trim();
  if (field === "name" || field === "company") return trimmed.replace(/\s+/g, " ");
  if (field === "email") return trimmed.toLowerCase();
  return trimmed;
}

function checkDetail(field: DetailField, value: string) {
  switch (field) {
    case "name":
      return checkFullName(value);
    case "company":
      return value.length > 100 ? "Please keep the company name under 100 characters." : undefined;
    case "email":
      return checkEmail(value);
    case "phone":
      return checkPhone(value);
    case "requirement":
      return checkMessage(value);
  }
}

const themeStyle = (service: AssistantService | null) =>
  ({
    "--ea-accent": service?.accent ?? "#1e5fdb",
    "--ea-accent-2": service?.accent2 ?? "#17c3e6",
  }) as CSSProperties;

type Current =
  | { kind: "service" }
  | { kind: "choice"; question: ChoiceQuestion }
  | { kind: "detail"; field: (typeof detailFields)[number] }
  | { kind: "summary" };

/**
 * Step-by-step WhatsApp enquiry assistant, opened from the floating WhatsApp button. Steps: 0 picks a service,
 * then that service's questions, then the contact details, then a summary. Styles in globals.css (.ea-*).
 */
export function EnquiryAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLElement | null>(null);
  const typingTimer = useRef(0);
  const pathname = usePathname();
  const ids = useId();

  const [serviceId, setServiceId] = useState<AssistantServiceId | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  // Where the visitor was when they went back to change an earlier answer; answering it returns them there.
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const [handedOff, setHandedOff] = useState(false);

  const service = serviceId ? getAssistantService(serviceId) : null;
  const questions = service?.questions ?? [];
  const summaryStep = 1 + questions.length + detailFields.length;
  const totalSteps = summaryStep - 1;

  function describe(s: number): Current {
    if (s === 0 || !service) return { kind: "service" };
    if (s <= questions.length) return { kind: "choice", question: questions[s - 1] };
    if (s < summaryStep) return { kind: "detail", field: detailFields[s - 1 - questions.length] };
    return { kind: "summary" };
  }
  const current = describe(step);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Once the next question has "typed", bring it into view and move focus to its first control.
  useEffect(() => {
    if (!open || typing) return;
    const body = bodyRef.current;
    if (!body) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (current.kind === "summary" || current.kind === "service") body.scrollTo({ top: 0 });
    else body.scrollTo({ top: body.scrollHeight, behavior: reduced ? "auto" : "smooth" });
    if (step > 0) focusRef.current?.focus({ preventScroll: true });
  }, [open, step, typing, current.kind]);

  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  function goTo(next: number, animate: boolean, nextDetails = details) {
    const target = describe(next);
    setStep(next);
    setError("");
    setHandedOff(false);
    setDraft(target.kind === "detail" ? nextDetails[target.field.id] : "");
    window.clearTimeout(typingTimer.current);
    // Only questions "type"; the summary appears straight away.
    const typed = animate && target.kind !== "summary";
    setTyping(typed);
    if (typed) typingTimer.current = window.setTimeout(() => setTyping(false), TYPING_MS);
  }

  function advance(nextDetails = details) {
    if (resumeAt !== null && resumeAt > step + 1) {
      setResumeAt(null);
      goTo(resumeAt, false, nextDetails);
    } else {
      setResumeAt(null);
      goTo(step + 1, true, nextDetails);
    }
  }

  function selectService(id: AssistantServiceId) {
    if (id !== serviceId) {
      setServiceId(id);
      setAnswers({});
      setResumeAt(null);
      // Step numbers depend on the service, so jump straight to its first question.
      setStep(1);
      setError("");
      setHandedOff(false);
      setTyping(true);
      window.clearTimeout(typingTimer.current);
      typingTimer.current = window.setTimeout(() => setTyping(false), TYPING_MS);
      return;
    }
    advance();
  }

  function choose(question: ChoiceQuestion, option: string) {
    setError("");
    setAnswers({ ...answers, [question.id]: option });
    advance();
  }

  function continueChoice(question: ChoiceQuestion) {
    if (!answers[question.id]) {
      setError("Please choose an option.");
      return;
    }
    advance();
  }

  function submitDetail(event: FormEvent<HTMLFormElement>, field: DetailField) {
    event.preventDefault();
    const value = cleanDetail(field, draft);
    const problem = checkDetail(field, value);
    if (problem) {
      setError(problem);
      focusRef.current?.focus();
      return;
    }
    const nextDetails = { ...details, [field]: value };
    setDetails(nextDetails);
    advance(nextDetails);
  }

  function back() {
    setResumeAt(null);
    goTo(step - 1, false);
  }

  function edit(target: number) {
    setResumeAt(step);
    goTo(target, false);
  }

  function restart() {
    setServiceId(null);
    setAnswers({});
    setDetails(emptyDetails);
    setResumeAt(null);
    goTo(0, false, emptyDetails);
    bodyRef.current?.scrollTo({ top: 0 });
  }

  const answeredSteps = Math.min(step - 1, totalSteps);
  const progress = service ? Math.max(0, answeredSteps) / totalSteps : 0;
  const promptId = `${ids}-prompt`;

  // The chat so far: one question bubble and one answer bubble per completed step (click an answer to change it).
  const transcript: ReactNode[] = [];
  if (service && current.kind !== "summary") {
    transcript.push(
      <AnswerBubble key="service" onEdit={() => edit(0)}>
        {service.label}
      </AnswerBubble>,
    );
    for (let s = 1; s < step; s++) {
      const done = describe(s);
      if (done.kind === "choice") {
        transcript.push(<BotBubble key={`q${s}`}>{done.question.prompt}</BotBubble>);
        transcript.push(
          <AnswerBubble key={`a${s}`} onEdit={() => edit(s)}>
            {answers[done.question.id]}
          </AnswerBubble>,
        );
      } else if (done.kind === "detail") {
        transcript.push(<BotBubble key={`q${s}`}>{done.field.prompt}</BotBubble>);
        transcript.push(
          <AnswerBubble key={`a${s}`} onEdit={() => edit(s)}>
            {details[done.field.id] || <em className="opacity-75">{copy.enquiryAssistant.EnquiryAssistant.text01_skipped}</em>}
          </AnswerBubble>,
        );
      }
    }
  }

  const ServiceIcon = service?.icon;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${ids}-title`}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) onClose();
      }}
      data-service={service?.id}
      data-dark={service?.dark || undefined}
      className="ea"
      style={themeStyle(service)}
    >
      <div className="ea-panel">
        <header className="ea-header">
          <span aria-hidden="true" className="ea-avatar">
            <SocialIcon network="whatsapp" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={`${ids}-title`} className="ea-title">
              {company.name}
            </h2>
            <p className="ea-subtitle">{copy.enquiryAssistant.EnquiryAssistant.text02_whatsapp_enquiry_assistant}</p>
          </div>
          {service ? (
            <button type="button" onClick={restart} className="ea-icon-btn" aria-label={copy.enquiryAssistant.EnquiryAssistant.arialabel03_restart_enquiry} title={copy.enquiryAssistant.EnquiryAssistant.title04_restart}>
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          ) : null}
          <button type="button" onClick={onClose} className="ea-icon-btn" aria-label={copy.enquiryAssistant.EnquiryAssistant.arialabel05_close} title={copy.enquiryAssistant.EnquiryAssistant.title06_close}>
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {service && ServiceIcon ? (
          <div className="ea-band">
            <span aria-hidden="true" className="ea-band-icon">
              <ServiceIcon className="size-4" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{service.label}</span>
            <span className="ea-band-step">
              {current.kind === "summary" ? "Review" : `Step ${Math.min(step, totalSteps)} of ${totalSteps}`}
            </span>
            <span
              role="progressbar"
              aria-label={copy.enquiryAssistant.EnquiryAssistant.arialabel07_enquiry_progress}
              aria-valuemin={0}
              aria-valuemax={totalSteps}
              aria-valuenow={Math.max(0, answeredSteps)}
              className="ea-progress"
            >
              <span style={{ scale: `${current.kind === "summary" ? 1 : progress} 1` }} />
            </span>
          </div>
        ) : null}

        <div ref={bodyRef} className="ea-body">
          {current.kind === "summary" && service ? (
            <Summary
              service={service}
              answers={answers}
              details={details}
              handedOff={handedOff}
              onEdit={edit}
              onHandOff={() => setHandedOff(true)}
              onRestart={restart}
              firstDetailStep={1 + questions.length}
              focusRef={focusRef}
            />
          ) : (
            <div role="log" aria-live="polite" className="ea-chat">
              <BotBubble>
                <strong className="block font-semibold">{welcome}</strong>
                <span className="mt-1 block">{welcomeText}</span>
              </BotBubble>

              {current.kind === "service" ? (
                <div className="ea-services" role="group" aria-label={copy.enquiryAssistant.EnquiryAssistant.arialabel08_choose_a_service}>
                  {assistantServices.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      ref={i === 0 ? (node) => void (focusRef.current = node) : undefined}
                      onClick={() => selectService(item.id)}
                      aria-pressed={item.id === serviceId}
                      className="ea-service"
                      data-service={item.id}
                      style={{ ...themeStyle(item), "--i": i } as CSSProperties}
                    >
                      <span aria-hidden="true" className="ea-service-icon">
                        <item.icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="ea-service-name">
                          {item.label}
                          {item.href === pathname ? <span className="ea-service-here">{copy.enquiryAssistant.EnquiryAssistant.text09_this_page}</span> : null}
                        </span>
                        <span className="ea-service-text">{item.description}</span>
                      </span>
                      {item.id === serviceId ? (
                        <Check className="ea-service-arrow size-4" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="ea-service-arrow size-4" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}

              {transcript}

              {current.kind === "choice" || current.kind === "detail" ? (
                typing ? (
                  <TypingIndicator />
                ) : (
                  <>
                    <BotBubble id={promptId}>
                      {current.kind === "choice" ? current.question.prompt : current.field.prompt}
                    </BotBubble>
                    {current.kind === "choice" ? (
                      <div className="ea-options" role="group" aria-labelledby={promptId}>
                        {current.question.options.map((option, i) => {
                          const picked = answers[current.question.id] === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              ref={i === 0 ? (node) => void (focusRef.current = node) : undefined}
                              onClick={() => choose(current.question, option)}
                              aria-pressed={picked}
                              className="ea-option"
                              style={{ "--i": i } as CSSProperties}
                            >
                              <span aria-hidden="true" className="ea-tick">
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <form
                        id={`${ids}-detail`}
                        noValidate
                        onSubmit={(event) => submitDetail(event, current.field.id)}
                        className="ea-detail"
                      >
                        {current.field.type === "textarea" ? (
                          <textarea
                            ref={(node) => void (focusRef.current = node)}
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            aria-labelledby={promptId}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? `${ids}-error` : undefined}
                            rows={4}
                            maxLength={2000}
                            placeholder={copy.enquiryAssistant.EnquiryAssistant.placeholder10_e_g_we_are}
                            className="form-field min-h-28 resize-y"
                          />
                        ) : (
                          <input
                            ref={(node) => void (focusRef.current = node)}
                            type={current.field.type}
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            aria-labelledby={promptId}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? `${ids}-error` : undefined}
                            aria-required={current.field.required}
                            autoComplete={current.field.autoComplete}
                            inputMode={current.field.type === "tel" ? "tel" : undefined}
                            maxLength={current.field.type === "email" ? 254 : 100}
                            placeholder={
                              current.field.type === "email"
                                ? "you@company.com"
                                : current.field.type === "tel"
                                  ? "+91 00000 00000"
                                  : current.field.required
                                    ? "Type your answer"
                                    : "Company name (optional)"
                            }
                            className="form-field"
                          />
                        )}
                      </form>
                    )}
                    {error ? (
                      <p id={`${ids}-error`} role="alert" className="ea-error">
                        {error}
                      </p>
                    ) : null}
                  </>
                )
              ) : null}
            </div>
          )}
        </div>

        <footer className="ea-footer">
          {current.kind === "service" ? (
            <p className="ea-privacy">
              <LockKeyhole className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {privacyNotice}
            </p>
          ) : current.kind === "summary" ? null : (
            <div className="flex items-center gap-3">
              <button type="button" onClick={back} className="ea-back">
                <ArrowLeft className="size-4" aria-hidden="true" />{copy.enquiryAssistant.EnquiryAssistant.text11_back}</button>
              <div className="flex-1" />
              {current.kind === "detail" && !current.field.required ? (
                <button
                  type="button"
                  disabled={typing}
                  onClick={() => {
                    const nextDetails = { ...details, [current.field.id]: "" };
                    setDetails(nextDetails);
                    advance(nextDetails);
                  }}
                  className="ea-back"
                >{copy.enquiryAssistant.EnquiryAssistant.text12_skip}</button>
              ) : null}
              {current.kind === "detail" ? (
                <button type="submit" form={`${ids}-detail`} disabled={typing} className="ea-next">{copy.enquiryAssistant.EnquiryAssistant.text13_continue}<ArrowRight className="size-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={typing}
                  onClick={() => continueChoice(current.question)}
                  className="ea-next"
                >{copy.enquiryAssistant.EnquiryAssistant.text14_continue}<ArrowRight className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </footer>
      </div>
    </dialog>
  );
}

function BotBubble({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div className="ea-row">
      <span aria-hidden="true" className="ea-bot-dot" />
      <p id={id} className="ea-bubble ea-bubble-bot">
        {children}
      </p>
    </div>
  );
}

function AnswerBubble({ onEdit, children }: { onEdit: () => void; children: ReactNode }) {
  return (
    <div className="ea-row ea-row-user">
      <button type="button" onClick={onEdit} className="ea-bubble ea-bubble-user" title={copy.enquiryAssistant.AnswerBubble.title01_change_this_answer}>
        <span>{children}</span>
        <Pencil className="ea-edit size-3" aria-hidden="true" />
        <span className="sr-only">{copy.enquiryAssistant.AnswerBubble.text02_change_this_answer}</span>
      </button>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="ea-row">
      <span aria-hidden="true" className="ea-bot-dot" />
      <p className="ea-bubble ea-bubble-bot ea-typing">
        <span />
        <span />
        <span />
        <span className="sr-only">{copy.enquiryAssistant.TypingIndicator.text01_typing}</span>
      </p>
    </div>
  );
}

interface SummaryProps {
  service: AssistantService;
  answers: Answers;
  details: Details;
  handedOff: boolean;
  firstDetailStep: number;
  focusRef: React.RefObject<HTMLElement | null>;
  onEdit: (step: number) => void;
  onHandOff: () => void;
  onRestart: () => void;
}

function Summary({ service, answers, details, handedOff, firstDetailStep, focusRef, onEdit, onHandOff, onRestart }: SummaryProps) {
  const Icon = service.icon;

  return (
    <div className="ea-summary">
      <span aria-hidden="true" className="ea-summary-badge">
        <PartyPopper className="size-6" strokeWidth={1.75} />
      </span>
      <h3
        ref={(node) => void (focusRef.current = node)}
        tabIndex={-1}
        className="mt-4 font-display text-xl font-semibold tracking-tight outline-none"
      >{copy.enquiryAssistant.Summary.text01_thank_you_your_enquiry}</h3>
      <p className="ea-muted mt-1 text-sm">{copy.enquiryAssistant.Summary.text02_check_your_answers_below}</p>

      <div className="ea-summary-service">
        <span aria-hidden="true" className="ea-service-icon">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="ea-muted text-xs font-medium tracking-wide uppercase">{copy.enquiryAssistant.Summary.text03_selected_service}</p>
          <p className="font-semibold">{service.label}</p>
        </div>
        <button type="button" onClick={() => onEdit(0)} className="ea-edit-btn">{copy.enquiryAssistant.Summary.text04_edit}<span className="sr-only">{copy.enquiryAssistant.Summary.text05_service}</span>
        </button>
      </div>

      <SummaryList title={copy.enquiryAssistant.Summary.title06_your_answers}>
        {service.questions.map((question, i) => (
          <SummaryRow key={question.id} label={question.label} onEdit={() => onEdit(i + 1)}>
            {answers[question.id]}
          </SummaryRow>
        ))}
      </SummaryList>

      <SummaryList title={copy.enquiryAssistant.Summary.title07_your_details}>
        {detailFields.map((field, i) => (
          <SummaryRow key={field.id} label={field.label} onEdit={() => onEdit(firstDetailStep + i)}>
            {details[field.id] || <span className="ea-muted">{copy.enquiryAssistant.Summary.text08_not_provided}</span>}
          </SummaryRow>
        ))}
      </SummaryList>

      <p className="ea-privacy mt-5">
        <LockKeyhole className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {privacyNotice}
      </p>

      <a
        href={assistantWhatsAppUrl(service, answers, details)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onHandOff}
        className="btn btn-whatsapp mt-5 w-full"
      >
        <SocialIcon network="whatsapp" className="size-5" />{copy.enquiryAssistant.Summary.text09_continue_on_whatsapp}<span className="sr-only">{copy.enquiryAssistant.Summary.text10_opens_in_a_new}</span>
      </a>

      <div aria-live="polite">
        {handedOff ? (
          <div className="ea-handoff">
            <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>{copy.enquiryAssistant.Summary.text11_whatsapp_has_opened_with}<strong>{copy.enquiryAssistant.Summary.text12_send}</strong>{copy.enquiryAssistant.Summary.text13_there_to_reach_our}<button type="button" onClick={onRestart} className="ml-1 font-semibold underline underline-offset-2">{copy.enquiryAssistant.Summary.text14_start_a_new_enquiry}</button>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SummaryList({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h4 className="ea-muted mb-2 text-xs font-semibold tracking-wide uppercase">{title}</h4>
      <dl className="ea-list">{children}</dl>
    </section>
  );
}

function SummaryRow({ label, onEdit, children }: { label: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div className="ea-list-row">
      <div className="min-w-0 flex-1">
        <dt className="ea-muted text-xs">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium break-words whitespace-pre-line">{children}</dd>
      </div>
      <button type="button" onClick={onEdit} className="ea-edit-btn">{copy.enquiryAssistant.SummaryRow.text01_edit}<span className="sr-only"> {label}</span>
      </button>
    </div>
  );
}
