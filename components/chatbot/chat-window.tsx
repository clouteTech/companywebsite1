"use client";

import { Bot, Mic, MicOff, Minus, RotateCcw, SendHorizontal, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { ChatMessage, type ChatMessageData } from "@/components/chatbot/chat-message";
import { EnquirySummary } from "@/components/chatbot/enquiry-summary";
import { LanguageSelector } from "@/components/chatbot/language-selector";
import { useSpeechRecognition, useSpeechSynthesis } from "@/components/chatbot/use-speech";
import {
  emptyDraft,
  enquiryServices,
  fieldQuestion,
  nextField,
  validateAnswer,
  type EnquiryDraft,
  type EnquiryField,
} from "@/lib/chatbot/enquiry";
import { languages, starterTopics, type Lang, type TopicId } from "@/lib/chatbot/knowledge";
import { saveEnquiry } from "@/lib/chatbot/local-enquiries";
import { detectLanguage, replyForTopic, respond, topicQuestion, type BotReply } from "@/lib/chatbot/respond";
import { t, te, type UiKey } from "@/lib/chatbot/translations";

export type WindowState = "closed" | "open" | "minimized";

interface EnquiryState {
  /** The question being answered, or "summary" while the visitor reviews it. */
  field: EnquiryField | "summary";
  draft: EnquiryDraft;
  /** Editing from the summary: answering returns to the summary. */
  resume: boolean;
}

interface Session {
  lang: Lang;
  messages: ChatMessageData[];
  enquiry: EnquiryState | null;
  voiceReplies: boolean;
}

const SESSION_KEY = "cloute-chat-session-v1";
const TYPING_MS = 650;

let sequence = 0;
const newId = () => `${Date.now().toString(36)}-${(sequence++).toString(36)}`;
const now = () => new Date().toISOString();

const welcome = (lang: Lang): ChatMessageData => ({ id: "welcome", from: "bot", text: "", kind: "welcome", time: now(), lang });

/** The browser's language if it is one we support, else English. */
function browserLanguage(): Lang {
  const code = navigator.language.slice(0, 2).toLowerCase();
  return (languages as readonly string[]).includes(code) ? (code as Lang) : "en";
}

// The conversation survives page navigation (the widget lives in the layout) and reloads within this tab.
function loadSession(): Session | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

type BotMessage = Omit<ChatMessageData, "id" | "time" | "from">;

/**
 * The chat assistant window: company Q&A from the predefined knowledge base, the enquiry flow, voice input and
 * spoken replies. Everything runs in the browser; nothing is sent anywhere unless the visitor opens WhatsApp or email.
 */
export function ChatWindow({ state, onState }: { state: WindowState; onState: (state: WindowState) => void }) {
  const [saved] = useState(loadSession);
  const [lang, setLang] = useState<Lang>(() => saved?.lang ?? browserLanguage());
  const [messages, setMessages] = useState<ChatMessageData[]>(() => saved?.messages ?? [welcome(lang)]);
  const [enquiry, setEnquiry] = useState<EnquiryState | null>(() => saved?.enquiry ?? null);
  const [voiceReplies, setVoiceReplies] = useState(() => saved?.voiceReplies ?? false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState<{ key: UiKey; tone: "info" | "error" } | null>(null);

  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const voiceRepliesRef = useRef(voiceReplies);
  const ids = useId();

  const synth = useSpeechSynthesis();
  const recognition = useSpeechRecognition(lang, {
    onText: (text, final) => {
      setInput(text);
      if (final) setNotice({ key: "heard", tone: "info" });
    },
    onError: (key) => setNotice({ key, tone: "error" }),
  });

  useEffect(() => {
    voiceRepliesRef.current = voiceReplies;
  }, [voiceReplies]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ lang, messages, enquiry, voiceReplies }));
    } catch {
      // Storage blocked: the chat still works, it just won't survive a reload.
    }
  }, [lang, messages, enquiry, voiceReplies]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    log.scrollTo({ top: log.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, typing, state]);

  useEffect(() => {
    if (state === "open") inputRef.current?.focus({ preventScroll: true });
  }, [state]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  function speakMessage(id: string, text: string, messageLang: Lang) {
    const result = synth.speak(id, text, messageLang);
    if (result === "unsupported") setNotice({ key: "ttsUnsupported", tone: "error" });
    if (result === "no-voice") setNotice({ key: "noVoice", tone: "error" });
  }

  /** Shows the typing indicator, then adds each bot message in turn (and reads them aloud if enabled). */
  function botSay(items: BotMessage[]) {
    setTyping(true);
    items.forEach((item, i) => {
      const timer = window.setTimeout(
        () => {
          const message: ChatMessageData = { ...item, id: newId(), from: "bot", time: now() };
          setMessages((current) => [...current, message]);
          if (i === items.length - 1) {
            setTyping(false);
            const spoken = items.map((entry) => entry.text).filter(Boolean).join("\n");
            if (voiceRepliesRef.current && spoken) speakMessage(message.id, spoken, item.lang);
          }
        },
        TYPING_MS * (i + 1),
      );
      timers.current.push(timer);
    });
  }

  function addUser(text: string, messageLang: Lang) {
    setMessages((current) => [...current, { id: newId(), from: "user", text, time: now(), lang: messageLang }]);
  }

  const question = (field: EnquiryField, messageLang: Lang): BotMessage => ({
    text: te(fieldQuestion[field], messageLang),
    lang: messageLang,
    enquiryField: field,
  });

  function deliver(reply: BotReply, replyLang: Lang) {
    if (reply.startEnquiry) {
      startEnquiry(replyLang);
      return;
    }
    botSay([{ text: reply.text, lang: replyLang, followUps: reply.followUps, link: reply.link }]);
  }

  function startEnquiry(replyLang: Lang) {
    setEnquiry({ field: "name", draft: emptyDraft, resume: false });
    botSay([{ text: replyForTopic("enquiry", replyLang).text, lang: replyLang }, question("name", replyLang)]);
  }

  function answerEnquiry(current: EnquiryState, raw: string, replyLang: Lang) {
    if (current.field === "summary") return;
    const field = current.field;
    const result = validateAnswer(field, raw);
    if ("error" in result) {
      botSay([{ text: te(result.error, replyLang), lang: replyLang, kind: "error", enquiryField: field }]);
      return;
    }
    const draft = { ...current.draft, [field]: result.value };
    const next = current.resume ? null : nextField(field);
    if (next) {
      setEnquiry({ field: next, draft, resume: false });
      botSay([question(next, replyLang)]);
    } else {
      setEnquiry({ field: "summary", draft, resume: false });
      botSay([{ text: "", lang: replyLang, kind: "summary", draft }]);
    }
  }

  function send(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;
    recognition.stop();
    setInput("");
    setNotice(null);
    // Writing in Tamil, Hindi or Chinese script switches the conversation to that language.
    const detected = detectLanguage(text);
    const replyLang = detected ?? lang;
    if (detected && detected !== lang) setLang(detected);
    addUser(text, replyLang);
    if (enquiry && enquiry.field !== "summary") answerEnquiry(enquiry, text, replyLang);
    else deliver(respond(text, replyLang), replyLang);
  }

  function quickReply(topic: TopicId) {
    if (typing) return;
    addUser(topicQuestion(topic, lang) ?? topic, lang);
    deliver(replyForTopic(topic, lang), lang);
  }

  function chooseOption(label: string, value: string) {
    if (!enquiry || typing) return;
    addUser(label, lang);
    answerEnquiry(enquiry, value, lang);
  }

  function editField(field: EnquiryField) {
    if (!enquiry || typing) return;
    setEnquiry({ ...enquiry, field, resume: true });
    if (field !== "service") setInput(enquiry.draft[field]);
    botSay([question(field, lang)]);
    inputRef.current?.focus();
  }

  function confirmEnquiry() {
    if (!enquiry || typing) return;
    const draft = enquiry.draft;
    const stored = saveEnquiry(draft, lang);
    setEnquiry(null);
    botSay([
      {
        text: stored ? te("success", lang, { name: draft.name }) : te("saveFailed", lang),
        lang,
        kind: "success",
        draft,
        saved: Boolean(stored),
      },
    ]);
  }

  function cancelEnquiry() {
    if (typing) return;
    setEnquiry(null);
    addUser(te("cancel", lang), lang);
    botSay([{ text: te("cancelled", lang), lang, followUps: ["services", "contact", "enquiry"] }]);
  }

  function clearChat() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    synth.stop();
    recognition.stop();
    setTyping(false);
    setEnquiry(null);
    setInput("");
    setNotice(null);
    setMessages([welcome(lang)]);
  }

  function changeLanguage(next: Lang) {
    recognition.stop();
    synth.stop();
    setNotice(null);
    setLang(next);
  }

  function toggleVoiceReplies() {
    if (voiceReplies) {
      synth.stop();
      setVoiceReplies(false);
      return;
    }
    if (!synth.supported) {
      setNotice({ key: "ttsUnsupported", tone: "error" });
      return;
    }
    setVoiceReplies(true);
  }

  function toggleMic() {
    if (recognition.listening) {
      recognition.stop();
      return;
    }
    if (!recognition.supported) {
      setNotice({ key: "voiceUnsupported", tone: "error" });
      return;
    }
    synth.stop();
    setNotice(null);
    recognition.start();
  }

  function close() {
    recognition.stop();
    synth.stop();
    onState("closed");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  if (state === "minimized") {
    return (
      <div className="cb-mini" role="region" aria-label={t("title", lang)}>
        <button type="button" onClick={() => onState("open")} className="cb-mini-open" aria-label={t("expand", lang)}>
          <span aria-hidden="true" className="cb-avatar">
            <Bot className="size-4" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold">{t("title", lang)}</span>
          {typing ? <span className="cb-mini-dot" aria-hidden="true" /> : null}
        </button>
        <button type="button" onClick={close} className="cb-icon-btn" aria-label={t("close", lang)} title={t("close", lang)}>
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  const lastBot = messages.findLastIndex((message) => message.from === "bot");
  const status = recognition.listening ? t("listening", lang) : synth.speakingId ? t("speaking", lang) : t("subtitle", lang);

  return (
    <section
      hidden={state === "closed"}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${ids}-title`}
      className="cb-panel"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <header className="cb-header">
        <span aria-hidden="true" className="cb-avatar cb-avatar-lg">
          <Bot className="size-5" strokeWidth={2} />
          <span className="cb-avatar-ring" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${ids}-title`} className="cb-title">
            {t("title", lang)}
          </h2>
          <p className="cb-status" aria-live="polite">
            {recognition.listening || synth.speakingId ? (
              <span aria-hidden="true" className="cb-wave">
                <span />
                <span />
                <span />
                <span />
              </span>
            ) : (
              <span aria-hidden="true" className="cb-online" />
            )}
            <span className="truncate">{status}</span>
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={toggleVoiceReplies}
            className="cb-icon-btn"
            aria-pressed={voiceReplies}
            aria-label={voiceReplies ? t("mute", lang) : t("unmute", lang)}
            title={voiceReplies ? t("mute", lang) : t("unmute", lang)}
          >
            {voiceReplies ? <Volume2 className="size-4" aria-hidden="true" /> : <VolumeX className="size-4" aria-hidden="true" />}
          </button>
          <button type="button" onClick={clearChat} className="cb-icon-btn" aria-label={t("clear", lang)} title={t("clear", lang)}>
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onState("minimized")}
            className="cb-icon-btn"
            aria-label={t("minimize", lang)}
            title={t("minimize", lang)}
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={close} className="cb-icon-btn" aria-label={t("close", lang)} title={t("close", lang)}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="cb-toolbar">
        <LanguageSelector lang={lang} onChange={changeLanguage} />
      </div>

      <div ref={logRef} role="log" aria-live="polite" aria-relevant="additions" className="cb-log">
        {messages.map((message, index) => {
          const latest = index === lastBot && !typing;
          const isWelcome = message.kind === "welcome";
          // The welcome message always follows the current language.
          const shown = isWelcome ? { ...message, text: t("welcome", lang), lang } : message;
          const followUps = isWelcome ? starterTopics : (message.followUps ?? []);
          const field = message.enquiryField;
          const askingNow = latest && field !== undefined && enquiry?.field === field;

          return (
            <ChatMessage
              key={message.id}
              message={shown}
              speaking={synth.speakingId === message.id}
              canSpeak={synth.supported}
              onSpeak={() => speakMessage(message.id, shown.text, shown.lang)}
              onStopSpeaking={synth.stop}
            >
              {message.kind === "summary" && message.draft ? (
                <EnquirySummary
                  draft={message.draft}
                  lang={message.lang}
                  interactive={latest && enquiry?.field === "summary"}
                  onEdit={editField}
                  onConfirm={confirmEnquiry}
                  onCancel={cancelEnquiry}
                />
              ) : null}
              {latest && followUps.length > 0 && !enquiry ? (
                <div className="cb-chips" role="group" aria-label={t("suggestions", shown.lang)}>
                  {followUps.map((topic) => (
                    <button key={topic} type="button" onClick={() => quickReply(topic)} className="cb-chip">
                      {topicQuestion(topic, shown.lang)}
                    </button>
                  ))}
                </div>
              ) : null}
              {askingNow ? (
                <div className="cb-chips" role="group">
                  {field === "service"
                    ? enquiryServices.map((service) => (
                        <button key={service} type="button" onClick={() => chooseOption(service, service)} className="cb-chip">
                          {service}
                        </button>
                      ))
                    : null}
                  {field === "company" ? (
                    <button type="button" onClick={() => chooseOption(te("skip", lang), "")} className="cb-chip">
                      {te("skip", lang)}
                    </button>
                  ) : null}
                  <button type="button" onClick={cancelEnquiry} className="cb-chip cb-chip-quiet">
                    {te("cancel", lang)}
                  </button>
                </div>
              ) : null}
            </ChatMessage>
          );
        })}
        {typing ? (
          <div className="cb-row">
            <span aria-hidden="true" className="cb-avatar-sm">
              <Bot className="size-3.5" strokeWidth={2} />
            </span>
            <p className="cb-bubble cb-bubble-bot cb-typing">
              <span />
              <span />
              <span />
              <span className="sr-only">{t("typing", lang)}</span>
            </p>
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="cb-composer">
        {notice ? (
          <p role={notice.tone === "error" ? "alert" : "status"} className={`cb-notice cb-notice-${notice.tone}`}>
            {t(notice.key, lang)}
            <button type="button" onClick={() => setNotice(null)} className="ml-auto shrink-0" aria-label={t("close", lang)}>
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </p>
        ) : null}
        <div className="cb-input-row">
          <button
            type="button"
            onClick={toggleMic}
            className={`cb-mic ${recognition.listening ? "cb-mic-on" : ""}`}
            aria-pressed={recognition.listening}
            aria-label={recognition.listening ? t("micStop", lang) : t("micStart", lang)}
            title={recognition.listening ? t("micStop", lang) : t("micStart", lang)}
          >
            {recognition.supported ? <Mic className="size-4.5" aria-hidden="true" /> : <MicOff className="size-4.5" aria-hidden="true" />}
          </button>
          <label htmlFor={`${ids}-input`} className="sr-only">
            {t("placeholder", lang)}
          </label>
          <textarea
            ref={inputRef}
            id={`${ids}-input`}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={2000}
            lang={lang}
            placeholder={recognition.listening ? t("listening", lang) : t("placeholder", lang)}
            className="cb-input"
          />
          <button type="submit" disabled={!input.trim() || typing} className="cb-send" aria-label={t("send", lang)} title={t("send", lang)}>
            <SendHorizontal className="size-4.5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}
