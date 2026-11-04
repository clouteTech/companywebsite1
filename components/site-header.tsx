"use client";

import { HoverImages } from "@/components/hover-images";
import { withVariants } from "@/lib/image-variants";
import { menuImages } from "@/lib/menu-images";
import { ArrowRight, ChevronDown, ChevronRight, Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { company, lightHeroRoutes, mainLinks, serviceLinks, socials } from "@/lib/site";

import { CallMenu } from "./call-menu";
import { LanguageSelect } from "./language-select";
import { Logo } from "./logo";
import { SocialIcon } from "./social-icon";
import cms from "@/content/navbar.json";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Close any open menu when the route changes.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openedByHover = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // The bar is always the white, solid one (top of the page included).
  const solid = true;
  // White text over dark heroes; ink over the bright editorial heroes and once the bar turns solid.
  const dark = !solid && !lightHeroRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const onServicePage = serviceLinks.some((s) => s.href === pathname);

  // Hover indicator: a pill that glides between the desktop nav items.
  const barRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0, on: false, glide: false });
  const showPill = (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    const bar = barRef.current?.getBoundingClientRect();
    if (!bar) return;
    const item = event.currentTarget.getBoundingClientRect();
    // Appear in place when coming from nowhere; glide when moving between items.
    setPill((prev) => ({
      x: item.left - bar.left,
      y: item.top - bar.top,
      w: item.width,
      h: item.height,
      on: true,
      glide: prev.on,
    }));
  };
  const hidePill = () => setPill((prev) => ({ ...prev, on: false }));

  // Desktop services panel: close on outside click or Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [servicesOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Mobile menu: lock scroll, move focus in, close on Escape or when the viewport reaches desktop width.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const close = () => {
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  const openServicesOnHover = () => {
    clearTimeout(closeTimer.current);
    if (!servicesOpen) openedByHover.current = true;
    setServicesOpen(true);
  };
  const closeServicesSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 160);
  };
  const toggleServices = () => {
    if (openedByHover.current) {
      openedByHover.current = false;
      setServicesOpen(true);
      return;
    }
    setServicesOpen((open) => !open);
  };

  // Mobile menu items slide in one after another as the panel opens.
  const menuStep = (step: number) => ({
    className: `transition-[opacity,translate] duration-500 ease-(--ease-premium) motion-reduce:transition-none ${
      menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
    }`,
    style: { transitionDelay: menuOpen ? `${80 + step * 40}ms` : "0ms" },
  });

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  // Keep keyboard focus inside the open mobile menu.
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // The active item carries a glowing gradient underline that draws in from the centre.
  const navItem =
    "relative inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-sm font-bold after:absolute after:inset-x-2.5 after:bottom-0.5 2xl:px-3.5 2xl:after:inset-x-3.5 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-[linear-gradient(90deg,var(--color-brand-light),var(--color-accent))] after:shadow-[0_0_10px_var(--color-accent)] after:transition-transform after:duration-500 after:ease-(--ease-premium) aria-[current=page]:after:scale-x-100 data-[active=true]:after:scale-x-100";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        ref={barRef}
        data-solid={solid}
        className={`nav-bar relative z-10 transition-[background-color,color,box-shadow] duration-500 ease-(--ease-premium) ${
          solid
            ? "bg-white/90 text-ink shadow-[0_1px_0_rgb(15_23_42/0.06)] backdrop-blur-xl backdrop-saturate-150"
            : dark
              ? "on-dark bg-transparent text-white"
              : "bg-transparent text-ink"
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 -z-10 hidden rounded-full xl:block ${
            dark ? "bg-white/14" : "bg-ink/6"
          } ${
            pill.glide
              ? "transition-[translate,width,height,opacity] duration-500 ease-(--ease-premium)"
              : "transition-opacity duration-300"
          }`}
          style={
            {
              translate: `${pill.x}px ${pill.y}px`,
              width: pill.w,
              height: pill.h,
              opacity: pill.on ? 1 : 0,
            } as CSSProperties
          }
        />
        {/* A thin light flowing along the bottom edge of the bar. */}
        <span aria-hidden="true" className="nav-line" />
        <nav
          aria-label={cms.siteHeader.SiteHeader.arialabel01_main}
          className="shell flex h-16 items-center justify-between gap-6 xl:grid xl:h-[4.5rem] xl:grid-cols-[auto_minmax(0,1fr)_auto]"
        >
          <Link href="/" className="shrink-0 justify-self-start rounded-md">
            <Logo tone={dark ? "white" : "color"} preload />
          </Link>

          <ul
            className="nav-capsule nav-glow hidden items-center gap-0.5 justify-self-center xl:flex"
            onMouseLeave={hidePill}
          >
            <li>
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                onMouseEnter={showPill}
                onFocus={showPill}
                onBlur={hidePill}
                className={navItem}
              >
                <NavLabel>{cms.siteHeader.SiteHeader.text02_home}</NavLabel>
              </Link>
            </li>
            {/* Static (not relative) so the panel spans the full header width while staying inside this item for hover. */}
            <li
              ref={servicesRef}
              onMouseEnter={openServicesOnHover}
              onMouseLeave={closeServicesSoon}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape" && servicesOpen) {
                  setServicesOpen(false);
                  servicesButtonRef.current?.focus();
                }
              }}
            >
              <button
                ref={servicesButtonRef}
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                onClick={toggleServices}
                onMouseEnter={showPill}
                onFocus={showPill}
                data-active={onServicePage || servicesOpen}
                className={navItem}
              >
                <NavLabel>{cms.siteHeader.SiteHeader.text03_services}</NavLabel>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 transition-transform duration-300 ease-(--ease-premium) ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id="services-menu"
                className={`absolute inset-x-0 top-full bg-white text-ink shadow-[0_40px_80px_-40px_rgb(11_30_57/0.45)] transition-[opacity,translate,visibility] duration-400 ease-(--ease-premium) ${
                  servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                }`}
              >
                <div className="shell grid grid-cols-[1fr_14rem] gap-10 py-10 xl:gap-14">
                  <ul className="grid grid-cols-4 gap-x-6 gap-y-8">
                    {serviceLinks.map((service, i) => (
                      <li
                        key={service.href}
                        className={`transition-[opacity,translate] duration-500 ease-(--ease-premium) motion-reduce:transition-none ${
                          servicesOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                        }`}
                        style={{ transitionDelay: servicesOpen ? `${80 + i * 45}ms` : "0ms" }}
                      >
                        <Link
                          href={service.href}
                          aria-current={pathname === service.href ? "page" : undefined}
                          onClick={() => setServicesOpen(false)}
                          className="group block rounded-xl text-center"
                        >
                          <span className="relative block aspect-[16/9] overflow-clip rounded-xl bg-paper-2">
                            <HoverImages
                              images={menuImages[service.href] ?? withVariants(service.image)}
                              alt=""
                              fill
                              sizes="(min-width: 1280px) 240px, 18vw"
                              className="object-cover transition-transform duration-700 ease-(--ease-premium) group-hover:scale-[1.06]"
                            />
                          </span>
                          <span className="mt-3 block text-[0.9375rem] font-medium tracking-tight transition-colors group-hover:text-brand group-aria-[current=page]:text-brand">
                            {service.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="border-l border-line pl-8 text-sm">
                    <p className="text-eyebrow text-muted">{cms.siteHeader.SiteHeader.text04_explore}</p>
                    <ul className="mt-4 space-y-1">
                      <li>
                        <Link
                          href="/#services"
                          onClick={() => setServicesOpen(false)}
                          className="group flex min-h-9 items-center justify-between font-medium transition-colors hover:text-brand"
                        >{cms.siteHeader.SiteHeader.text05_all_services}<ArrowRight
                            className="size-4 transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                      {mainLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setServicesOpen(false)}
                            className="flex min-h-9 items-center font-medium transition-colors hover:text-brand"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 space-y-2 border-t border-line pt-6 text-muted">
                      <a href={company.phoneHref} className="flex items-center gap-2 transition-colors hover:text-ink">
                        <Phone className="size-4 shrink-0" aria-hidden="true" />
                        {company.phoneTopbar}
                      </a>
                      <a
                        href={`mailto:${company.salesEmail}`}
                        className="flex items-center gap-2 break-all transition-colors hover:text-ink"
                      >
                        <Mail className="size-4 shrink-0" aria-hidden="true" />
                        {company.salesEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {mainLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onMouseEnter={showPill}
                  onFocus={showPill}
                  onBlur={hidePill}
                  className={navItem}
                >
                  <NavLabel>{link.label}</NavLabel>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 justify-self-end">
            <CallMenu
              label={`Call ${company.phoneTopbar}`}
              className="nav-call hidden size-10 items-center justify-center sm:inline-flex"
            >
              <Phone className="size-4" aria-hidden="true" />
            </CallMenu>
            <Link
              href="/contact"
              className={`nav-cta btn hidden min-h-9 px-4 xl:inline-flex ${dark ? "btn-glass" : "btn-primary"}`}
            >{cms.siteHeader.SiteHeader.text06_get_started}</Link>
            {/* Phones get it inside the menu, where there is room. */}
            <LanguageSelect dark={dark} className="hidden sm:block" />
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
              aria-label={cms.siteHeader.SiteHeader.arialabel07_menu}
              className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors duration-300 min-[380px]:px-4 xl:hidden ${
                dark ? "bg-white/14 backdrop-blur-md hover:bg-white/22" : "bg-ink/5 hover:bg-ink/10"
              }`}
            >
              <Menu className="size-4 min-[380px]:mr-2" aria-hidden="true" />
              <span aria-hidden="true" className="max-[379px]:hidden">{cms.siteHeader.SiteHeader.text08_menu}</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Dims and softens the page while the desktop services panel is open. */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-0 hidden bg-midnight/25 backdrop-blur-[6px] transition-[opacity,visibility] duration-500 ease-(--ease-premium) xl:block ${
          servicesOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-[60] xl:hidden ${
          menuOpen ? "visible" : "invisible transition-[visibility] delay-500"
        }`}
      >
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className={`absolute inset-0 bg-midnight/55 backdrop-blur-sm transition-opacity duration-500 ease-(--ease-premium) ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={cms.siteHeader.SiteHeader.arialabel09_site_menu}
          onKeyDown={trapFocus}
          className={`absolute inset-y-0 right-0 flex w-full flex-col bg-white text-ink shadow-2xl transition-transform duration-500 ease-(--ease-premium) sm:max-w-md ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <Logo />
            <LanguageSelect className="ml-auto mr-1 sm:hidden" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeMenu}
              className="grid size-11 place-items-center rounded-md transition-colors hover:bg-ink/5"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">{cms.siteHeader.SiteHeader.text10_close_menu}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-6 sm:px-4">
            <ul className="space-y-0.5">
              <li {...menuStep(0)}>
                <MobileLink href="/" current={pathname === "/"} onNavigate={() => setMenuOpen(false)}>{cms.siteHeader.SiteHeader.text11_home}</MobileLink>
              </li>
              <li className="pt-4">
                <p className="text-eyebrow px-3 pb-2 text-muted">{cms.siteHeader.SiteHeader.text12_services}</p>
                <ul className="space-y-0.5">
                  {serviceLinks.map((service, i) => (
                    <li key={service.href} {...menuStep(i + 1)}>
                      <Link
                        href={service.href}
                        aria-current={pathname === service.href ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className="flex min-h-14 items-center gap-3.5 rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors hover:bg-paper aria-[current=page]:bg-paper"
                      >
                        <span className="relative h-10 w-16 shrink-0 overflow-clip rounded-md bg-paper-2">
                          <Image src={service.image} alt="" fill sizes="4rem" className="object-cover" />
                        </span>
                        <span className="flex-1">{service.label}</span>
                        <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li aria-hidden="true" className="mx-3 my-4 border-t border-line" />
              {mainLinks.map((link, i) => (
                <li key={link.href} {...menuStep(serviceLinks.length + 1 + i)}>
                  <MobileLink href={link.href} current={pathname === link.href} onNavigate={() => setMenuOpen(false)}>
                    {link.label}
                  </MobileLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 space-y-4 border-t border-line px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">{cms.siteHeader.SiteHeader.text13_get_started}</Link>
            <div className="flex flex-col gap-1 text-sm text-muted">
              <a href={company.phoneHref} className="inline-flex min-h-9 items-center gap-2 hover:text-ink">
                <Phone className="size-4" aria-hidden="true" />
                {company.phoneTopbar}
              </a>
              <a
                href={`mailto:${company.supportEmail}`}
                className="inline-flex min-h-9 items-center gap-2 break-all hover:text-ink"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {company.supportEmail}
              </a>
            </div>
            <ul className="flex gap-1">
              {socials.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink"
                  >
                    <SocialIcon network={social.network} className="size-[1.125rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

interface MobileLinkProps {
  href: string;
  current: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}

function MobileLink({ href, current, onNavigate, children }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className="flex min-h-12 items-center justify-between rounded-lg px-3 font-display text-lg font-semibold tracking-tight transition-colors hover:bg-paper aria-[current=page]:bg-paper"
    >
      {children}
      <ChevronRight className="size-4 text-muted" aria-hidden="true" />
    </Link>
  );
}

/** A nav label that rolls up on hover, revealing a tinted copy drawn with text-shadow (globals.css, .nav-roll). */
function NavLabel({ children }: { children: ReactNode }) {
  return (
    <span className="nav-roll">
      <span>{children}</span>
    </span>
  );
}
