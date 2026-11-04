import { ArrowRight, Mail, Megaphone, Phone, Sparkles, Store } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { company, socials } from "@/lib/site";

import { CallMenu } from "./call-menu";
import { SocialIcon } from "./social-icon";
import copy from "@/content/navbar.json";

/*
 * Thin contact strip above the main navigation: social links on the left, rotating announcements in the
 * middle (wide screens), phone and email on the right. It folds away once the page is scrolled and comes
 * back at the top. Styles in globals.css (.tb-*).
 */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

const announcements = [
  { icon: Sparkles, text: copy.topBar.announcements.i0_text, href: "/digital-marketing-services" },
  { icon: Store, text: copy.topBar.announcements.i1_text, href: "/products" },
  { icon: Megaphone, text: copy.topBar.announcements.i2_text, href: "/recruitment" },
];

export function TopBar({ hidden }: { hidden: boolean }) {
  return (
    <div className="tb" data-hidden={hidden || undefined} inert={hidden}>
      <div className="tb-inner">
        <div className="tb-bar on-dark">
          <span aria-hidden="true" className="tb-glow" />
          <div className="shell flex h-10 items-center justify-between gap-4 text-[0.8125rem]">
            <ul className="flex items-center gap-1.5" aria-label={copy.topBar.TopBar.arialabel01_follow_us}>
              <li aria-hidden="true" className="tb-follow mr-1.5 hidden lg:block">{copy.topBar.TopBar.text02_follow_us}</li>
              {socials.map((social, i) => (
                <li key={social.network} className="tb-pop" style={v({ "--i": i })}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    data-network={social.network}
                    className="tb-social"
                  >
                    <SocialIcon network={social.network} className="relative size-3.5" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="tb-news" aria-label={copy.topBar.TopBar.arialabel03_announcements}>
              {announcements.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="tb-news-item"
                  style={v({ "--i": i, "--n": announcements.length })}
                >
                  <item.icon className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                  {item.text}
                  <ArrowRight className="tb-news-arrow size-3.5 shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 sm:gap-5">
              <CallMenu label={`Call ${company.phoneTopbar}`} className="tb-contact tb-pop" style={v({ "--i": 5 })}>
                <span className="tb-contact-icon tb-ring">
                  <Phone className="size-3.5" aria-hidden="true" />
                </span>
                <span className="max-[399px]:hidden">{company.phoneTopbar}</span>
              </CallMenu>
              <a href={`mailto:${company.salesEmail}`} className="tb-contact tb-email tb-pop" style={v({ "--i": 6 })}>
                <span className="tb-contact-icon tb-mail">
                  <Mail className="size-3.5" aria-hidden="true" />
                </span>
                <span>{company.salesEmail}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
