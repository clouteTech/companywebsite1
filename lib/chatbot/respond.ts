// Keyword matching for the website chat assistant: finds the knowledge-base topic a visitor's message is about and
// returns the predefined answer in the chosen language. Kept free of UI code so it can later be swapped for a call
// to a real AI service without touching the chat components.
import { facts, fallbackAnswer, topics, type Lang, type Topic, type TopicId } from "@/lib/chatbot/knowledge";

export interface BotReply {
  topic: TopicId | "fallback";
  text: string;
  followUps: TopicId[];
  link?: { href: string; label: string };
  /** The visitor asked to send an enquiry: the chat should start the enquiry flow. */
  startEnquiry?: boolean;
}

const fallbackFollowUps: TopicId[] = ["services", "contact", "enquiry"];

function fillFacts(text: string) {
  return text.replace(/\{(phone|sales|support|address)\}/g, (_, key: keyof typeof facts) => facts[key]);
}

/** Guesses the language from the script used: Tamil, Devanagari (Hindi) or Chinese characters. */
export function detectLanguage(text: string): Lang | null {
  if (/[஀-௿]/.test(text)) return "ta";
  if (/[ऀ-ॿ]/.test(text)) return "hi";
  if (/[㐀-鿿]/.test(text)) return "zh";
  return null;
}

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Latin keywords match whole words (so "hi" doesn't match "this"), allowing a plural "s"/"es".
// Other scripts don't separate words with spaces the same way, so they match anywhere in the message.
const matchers = topics.map((topic) => ({
  topic,
  keywords: topic.keywords.map((keyword) => {
    const latin = /^[\x00-\x7F]+$/.test(keyword);
    const lower = keyword.toLowerCase();
    return {
      text: lower,
      // Characters in Tamil, Hindi and Chinese carry more meaning each than Latin letters.
      score: latin ? lower.length : lower.length * 2,
      test: latin
        ? (() => {
            const pattern = new RegExp(`(^|[^a-z0-9])${escape(lower)}(e?s)?(?=$|[^a-z0-9])`);
            return (text: string) => pattern.test(text);
          })()
        : (text: string) => text.includes(lower),
    };
  }),
}));

/** The best-matching topic, or null when nothing in the knowledge base fits. */
export function matchTopic(message: string): Topic | null {
  const text = message.toLowerCase().normalize("NFC");
  let best: { topic: Topic; score: number } | null = null;
  for (const { topic, keywords } of matchers) {
    const hits = keywords.filter((keyword) => keyword.test(text));
    // A keyword inside a longer matched one ("सेवा" in "सेवाएँ", "network" in "network security") isn't counted twice.
    const raw = hits
      .filter((hit) => !hits.some((other) => other !== hit && other.text.includes(hit.text)))
      .reduce((sum, hit) => sum + hit.score, 0);
    const score = raw * (topic.weight ?? 1);
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best?.topic ?? null;
}

export function replyForTopic(id: TopicId, lang: Lang): BotReply {
  const topic = topics.find((item) => item.id === id);
  if (!topic) return fallback(lang);
  return {
    topic: topic.id,
    text: fillFacts(topic.answer[lang]),
    followUps: topic.followUps ?? [],
    link: topic.link ? { href: topic.link.href, label: topic.link.label[lang] } : undefined,
    startEnquiry: topic.id === "enquiry",
  };
}

function fallback(lang: Lang): BotReply {
  return { topic: "fallback", text: fallbackAnswer[lang], followUps: fallbackFollowUps };
}

export function respond(message: string, lang: Lang): BotReply {
  const topic = matchTopic(message);
  return topic ? replyForTopic(topic.id, lang) : fallback(lang);
}

/** Quick-reply label for a topic in the given language. */
export function topicQuestion(id: TopicId, lang: Lang) {
  return topics.find((topic) => topic.id === id)?.question?.[lang] ?? null;
}
