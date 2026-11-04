"use client";

import { Bot } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import type { WindowState } from "@/components/chatbot/chat-window";
import copy from "@/content/chatbot.json";

// The chat window's code loads the first time it's needed (or on hover/focus of the button, to feel instant).
const loadWindow = () => import("@/components/chatbot/chat-window");
const ChatWindow = lazy(() => loadWindow().then((module) => ({ default: module.ChatWindow })));

/**
 * Floating chat assistant button, stacked above the WhatsApp button (styles in globals.css, .cb-*).
 * The window stays mounted once opened, so the conversation survives closing and page navigation.
 */
export function ChatbotWidget() {
  const [state, setState] = useState<WindowState>("closed");
  const [mounted, setMounted] = useState(false);

  return (
    <>
      {state === "closed" ? (
        <button
          type="button"
          onPointerEnter={loadWindow}
          onFocus={loadWindow}
          onClick={() => {
            setMounted(true);
            setState("open");
          }}
          aria-haspopup="dialog"
          aria-label={copy.chatbotWidget.ChatbotWidget.arialabel01_chat_with_cloute_assistant}
          className="cb-fab"
        >
          <span aria-hidden="true" className="cb-fab-glow" />
          <Bot className="relative size-6" strokeWidth={2} aria-hidden="true" />
          <span aria-hidden="true" className="cb-fab-tip">{copy.chatbotWidget.ChatbotWidget.text02_ask_cloute_assistant}</span>
        </button>
      ) : null}
      {mounted ? (
        <Suspense fallback={null}>
          <ChatWindow state={state} onState={setState} />
        </Suspense>
      ) : null}
    </>
  );
}
