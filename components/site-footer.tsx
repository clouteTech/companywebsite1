import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { company, footerMenu, serviceLinks, socials } from "@/lib/site";

import { Logo } from "./logo";
import { SocialIcon } from "./social-icon";
import copy from "@/content/footer.json";

const linkClass = "link-underline text-sm text-white/65 transition-colors duration-300 hover:text-white";

export function SiteFooter() {
  return (
    <footer className="on-dark relative isolate overflow-clip bg-midnight text-white/65">
      <div
        aria-hidden="true"
        className="h-px bg-[linear-gradient(90deg,transparent,var(--color-brand)_30%,var(--color-accent)_70%,transparent)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(50%_100%_at_50%_0%,rgb(30_95_219/0.18),transparent_70%)]"
      />
      <div className="shell pt-20 pb-10 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block rounded-md">
              <Logo tone="white" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">{company.tagline}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={company.phoneHref} className={`inline-flex items-center gap-2.5 ${linkClass}`}>
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.salesEmail}`} className={`inline-flex items-center gap-2.5 ${linkClass}`}>
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  {company.salesEmail}
                </a>
              </li>
              <li className="flex gap-2.5 leading-relaxed">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <address className="not-italic">{company.address}</address>
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8 lg:pl-10">
            <FooterColumn title={copy.siteFooter.SiteFooter.title01_services}>
              {serviceLinks.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className={linkClass}>
                    {service.footerLabel}
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title={copy.siteFooter.SiteFooter.title02_menu}>
              {footerMenu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <div>
              <h2 className="text-sm font-medium text-white">{copy.siteFooter.SiteFooter.text03_connect_with_us}</h2>
              <p className="mt-2 text-sm text-white/50">{copy.siteFooter.SiteFooter.text04_follow_us_for_updates}</p>
              {/* Brand-coloured pills: the colour sweeps across on hover (styles in globals.css, .ft-social*). */}
              <ul className="ft-socials mt-5">
                {socials.map((social, i) => (
                  <li key={social.network} className="ft-social-item" style={{ "--i": i } as CSSProperties}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-network={social.network}
                      className="ft-social"
                    >
                      <span className="ft-social-icon">
                        <SocialIcon network={social.network} className="relative size-[1.125rem]" />
                      </span>
                      <span className="ft-social-name">{social.label}</span>
                      <ArrowUpRight className="ft-social-arrow size-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 bg-[linear-gradient(to_bottom,rgb(255_255_255/0.14),rgb(255_255_255/0.02))] bg-clip-text text-center font-display text-[clamp(4rem,1rem+18vw,16rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-transparent select-none"
        >{copy.siteFooter.SiteFooter.text05_cloute}</p>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-xs text-white/50 max-md:pb-44">{copy.siteFooter.SiteFooter.text06_copyright_2026_cloute_technologies}</div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}
