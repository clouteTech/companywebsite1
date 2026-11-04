"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useId, useRef, type CSSProperties, type ReactNode } from "react";

import { company } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

import { SocialIcon } from "./social-icon";
import copy from "@/content/navbar.json";

/*
 * A call button that asks how to call: a normal phone call (tel:, opens the device's dialler) or WhatsApp.
 * WhatsApp has no web link that starts a call directly, so that option opens a chat with our number, where
 * the visitor taps WhatsApp's own call button. The menu is a native popover (top layer), so it escapes
 * clipped containers like the top bar, closes on Escape or an outside click, and is placed under the button.
 * Styles in globals.css (.call-menu*).
 */

const whatsappCallMessage = `Hi ${company.name}, I'd like to speak with your team.`;
const MENU_WIDTH = 256;

export function CallMenu({
  className,
  style,
  label = `Call ${company.name}`,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  /** Accessible name for the button; the visible content can be just an icon. */
  label?: string;
  children: ReactNode;
}) {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function place() {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;
    const rect = button.getBoundingClientRect();
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - MENU_WIDTH - 8);
    const below = rect.bottom + 8;
    const height = menu.offsetHeight;
    const top = below + height > window.innerHeight - 8 ? Math.max(8, rect.top - height - 8) : below;
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function onToggle(event: { newState?: string }) {
    if (event.newState !== "open") return;
    place();
    // The page moves under a fixed menu, so close it on scroll or resize rather than leave it floating.
    const close = () => {
      menuRef.current?.hidePopover();
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
    window.addEventListener("scroll", close, { passive: true, once: true });
    window.addEventListener("resize", close, { once: true });
  }

  const hide = () => menuRef.current?.hidePopover();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        popoverTarget={id}
        aria-haspopup="menu"
        aria-label={label}
        className={className}
        style={style}
      >
        {children}
      </button>
      <div
        ref={menuRef}
        id={id}
        popover="auto"
        role="menu"
        aria-label={copy.callMenu.CallMenu.arialabel01_choose_how_to_call}
        className="call-menu"
        onToggle={(event) => onToggle(event.nativeEvent as unknown as { newState?: string })}
      >
        <p className="call-menu-title">{copy.callMenu.CallMenu.text02_how_would_you_like}</p>
        <a role="menuitem" href={company.phoneHref} className="call-menu-option" onClick={hide}>
          <span className="call-menu-icon call-menu-icon-phone">
            <Phone className="size-4" aria-hidden="true" />
          </span>
          <span className="call-menu-text">
            <span className="call-menu-name">{copy.callMenu.CallMenu.text03_phone_call}</span>
            <span className="call-menu-hint">{company.phoneTopbar}</span>
          </span>
        </a>
        <a
          role="menuitem"
          href={whatsappUrl(whatsappCallMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="call-menu-option"
          onClick={hide}
        >
          <span className="call-menu-icon call-menu-icon-whatsapp">
            <SocialIcon network="whatsapp" className="size-4" />
          </span>
          <span className="call-menu-text">
            <span className="call-menu-name">{copy.callMenu.CallMenu.text04_whatsapp_call}</span>
            <span className="call-menu-hint">
              <MessageCircle className="size-3" aria-hidden="true" />{copy.callMenu.CallMenu.text05_opens_chat_tap}</span>
          </span>
        </a>
      </div>
    </>
  );
}
