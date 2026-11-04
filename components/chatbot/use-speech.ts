"use client";

// Browser speech for the chat assistant: speech-to-text through the Web Speech API's SpeechRecognition (Chrome,
// Edge and Safari; not Firefox) and text-to-speech through speechSynthesis. Availability, languages and voices
// depend on the visitor's browser and device; both hooks report what isn't possible instead of failing silently.
// Note that Chrome and Edge send recorded speech to their own online speech service to transcribe it.
import { useEffect, useRef, useState } from "react";

import type { Lang } from "@/lib/chatbot/knowledge";
import { speechLang, type UiKey } from "@/lib/chatbot/translations";

interface RecognitionResultList {
  length: number;
  [index: number]: { isFinal: boolean; 0: { transcript: string } };
}

interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: RecognitionResultList }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognitionConstructor = new () => Recognition;

function recognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const recognitionErrors: Record<string, UiKey> = {
  "not-allowed": "micDenied",
  "service-not-allowed": "micDenied",
  "audio-capture": "noMic",
  "no-speech": "noSpeech",
};

interface RecognitionHandlers {
  /** Called with the transcript so far; `final` once the browser has settled on it. */
  onText: (text: string, final: boolean) => void;
  onError: (message: UiKey) => void;
}

export function useSpeechRecognition(lang: Lang, handlers: RecognitionHandlers) {
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const latest = useRef(handlers);
  const supported = recognitionConstructor() !== null;

  useEffect(() => {
    latest.current = handlers;
  });

  useEffect(() => () => recognition.current?.abort(), []);

  function start() {
    const Ctor = recognitionConstructor();
    if (!Ctor) {
      latest.current.onError("voiceUnsupported");
      return;
    }
    recognition.current?.abort();
    const rec = new Ctor();
    rec.lang = speechLang[lang];
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onresult = (event) => {
      let text = "";
      let final = false;
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
        final ||= event.results[i].isFinal;
      }
      latest.current.onText(text, final);
    };
    rec.onerror = (event) => {
      if (event.error === "aborted") return;
      latest.current.onError(recognitionErrors[event.error] ?? "voiceError");
    };
    rec.onend = () => {
      setListening(false);
      if (recognition.current === rec) recognition.current = null;
    };
    recognition.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      latest.current.onError("voiceError");
    }
  }

  function stop() {
    recognition.current?.stop();
  }

  return { supported, listening, start, stop };
}

/** Text without emoji, bullets or symbols that speech engines read out literally. */
function speakable(text: string) {
  return text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[•*]/g, "")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Best voice for a language tag: the exact region first (ta-IN before ta-LK), then any voice for the language.
 * Within each, Edge's "Natural" voices win over older desktop voices because they sound far more human.
 */
function pickVoice(voices: SpeechSynthesisVoice[], tag: string) {
  const normalize = (value: string) => value.replace("_", "-").toLowerCase();
  const prefix = tag.split("-")[0].toLowerCase();
  const natural = (voice: SpeechSynthesisVoice) => /natural/i.test(voice.name);
  const best = (list: SpeechSynthesisVoice[]) => list.find(natural) ?? list[0];
  const exact = voices.filter((voice) => normalize(voice.lang) === tag.toLowerCase());
  if (exact.length) return best(exact);
  return best(voices.filter((voice) => normalize(voice.lang).startsWith(`${prefix}-`) || normalize(voice.lang) === prefix));
}

export type SpeakResult = "ok" | "unsupported" | "no-voice";

export function useSpeechSynthesis() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  /** Reads `text` aloud in `lang`; `id` identifies what is speaking (for play/stop buttons). */
  function speak(id: string, text: string, lang: Lang): SpeakResult {
    if (!supported) return "unsupported";
    const synth = window.speechSynthesis;
    synth.cancel();
    const tag = speechLang[lang];
    const voices = synth.getVoices();
    const voice = pickVoice(voices, tag);
    // Voices load asynchronously; with none listed yet, let the browser pick one for the language tag.
    if (voices.length > 0 && !voice) return "no-voice";

    // Chrome cuts off long utterances, so speak sentence by sentence.
    const sentences = speakable(text)
      .split(/(?<=[.!?।。！？])\s*/)
      .filter((sentence) => sentence.trim());
    if (sentences.length === 0) return "ok";
    sentences.forEach((sentence, i) => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = tag;
      if (voice) utterance.voice = voice;
      if (i === sentences.length - 1) {
        utterance.onend = () => setSpeakingId((current) => (current === id ? null : current));
      }
      utterance.onerror = () => setSpeakingId((current) => (current === id ? null : current));
      synth.speak(utterance);
    });
    setSpeakingId(id);
    return "ok";
  }

  function stop() {
    if (supported) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }

  return { supported, speakingId, speak, stop };
}
