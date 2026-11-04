import { RotatingImage } from "@/components/rotating-image";
import { withVariants } from "@/lib/image-variants";
import { ArrowRight, Cloud, Code, Headset, Phone, Plus, Server, ShieldCheck, Wifi } from "lucide-react";
import { type StaticImageData } from "next/image";
import Link from "next/link";
import { Fragment, type ComponentType, type CSSProperties, type ReactNode } from "react";

import { company } from "@/lib/site";
import type { Faq } from "@/lib/types";

import { CountUp } from "./count-up";
import cms from "@/content/homepage.json";

/** Any icon component that accepts Lucide-style props (Lucide icons or the social marks). */
export type IconType = ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: "true" }>;

/** Stagger index for entrance and scroll-reveal animations. */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

type Tone = "white" | "paper";
const toneClass: Record<Tone, string> = { white: "bg-white", paper: "bg-paper" };

export interface Action {
  label: string;
  href: string;
}

/** Photos narrower than this are shown as a soft colour wash rather than stretched full-bleed. */
const FULL_BLEED_MIN_WIDTH = 1100;

/* ------------------------------------------------------------------ */

/**
 * Splits a heading into words that rise into place one after another — on load inside
 * `.split-in`, or as they scroll into view inside `.split-scroll`. The text stays one
 * readable string for assistive technology and search engines.
 */
export function SplitText({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(" ");
  // The animated copy is split word by word, which page translators would translate piece by
  // piece. They skip it and translate the whole sentence instead, which screen readers also use
  // and which takes the animated copy's place once a page is translated (styles in globals.css).
  return (
    <>
      <span aria-hidden="true" translate="no" className="split-copy notranslate">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="split-word">
              <span style={{ "--w": i + offset } as CSSProperties}>{word}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
      <span className="split-plain">{text}</span>
    </>
  );
}

/**
 * Heading that types itself out letter by letter behind a blinking cursor (styles in globals.css,
 * .type-*). Pure CSS, so it starts as soon as the page paints. Words never break mid-word, and
 * the plain sentence serves screen readers and page translators, as with SplitText.
 */
export function TypeText({
  text,
  delay = 400,
  speed = 110,
  highlight = [],
  flourish = false,
}: {
  text: string;
  delay?: number;
  speed?: number;
  /** Words that take a flowing gradient once typing has finished. */
  highlight?: string[];
  /** After typing: a light sweeping across the words and a glowing line drawn beneath (styles: .type-flourish). */
  flourish?: boolean;
}) {
  const words = text.split(" ");
  // Each word's first letter index; spaces take a beat too, like a real typist.
  const starts = words.map((_, w) => words.slice(0, w).reduce((sum, word) => sum + word.length + 1, 0));
  // When the last letter has been typed: the flourish starts then.
  const end = delay + text.length * speed;
  return (
    <>
      <span
        aria-hidden="true"
        translate="no"
        className={`split-copy notranslate ${flourish ? "type-flourish" : ""}`}
        style={{ "--type-delay": `${delay}ms`, "--type-speed": `${speed}ms`, "--type-end": `${end}ms` } as CSSProperties}
      >
        {words.map((word, w) => (
          <Fragment key={`${word}-${w}`}>
            <span className={`type-word ${highlight.includes(word) ? "type-word-hl" : ""}`}>
              {[...word].map((char, c) => {
                const wordEnd = c === word.length - 1;
                const last = wordEnd && w === words.length - 1;
                return (
                  <span
                    key={c}
                    className="type-char"
                    data-last={last || undefined}
                    data-word-end={(wordEnd && !last) || undefined}
                    style={{ "--c": starts[w] + c } as CSSProperties}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        ))}
        {flourish ? <span className="type-underline" /> : null}
      </span>
      <span className="split-plain">{text}</span>
    </>
  );
}

/* ------------------------------------------------------------------ */

/** Primary + frosted secondary button pair used over photography. */
export function HeroActions({
  primary,
  secondary,
  className = "",
  style,
  light = false,
}: {
  primary: Action;
  secondary?: Action;
  className?: string;
  style?: CSSProperties;
  /** On light backgrounds the secondary button becomes an outline. */
  light?: boolean;
}) {
  return (
    <div className={`btn-pair ${className}`} style={style}>
      <ActionLink action={primary} className="btn btn-primary">
        <ArrowRight className="btn-arrow size-4" aria-hidden="true" />
      </ActionLink>
      {secondary ? <ActionLink action={secondary} className={`btn ${light ? "btn-outline" : "btn-glass"}`} /> : null}
    </div>
  );
}

export function ActionLink({ action, className, children }: { action: Action; className: string; children?: ReactNode }) {
  // Phone and mail links are not routes; render them as plain anchors.
  if (/^(tel|mailto):/.test(action.href)) {
    return (
      <a href={action.href} className={className}>
        {action.label}
        {children}
      </a>
    );
  }
  return (
    <Link href={action.href} className={className}>
      {action.label}
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */

export function Breadcrumbs({ crumbs, light = false, className = "" }: { crumbs: string[]; light?: boolean; className?: string }) {
  return (
    <nav aria-label={cms.sections.Breadcrumbs.arialabel01_breadcrumb} className={className}>
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${light ? "text-muted" : "text-white/65"}`}>
        <li>
          <Link href="/" className={`transition-colors ${light ? "hover:text-ink" : "hover:text-white"}`}>{cms.sections.Breadcrumbs.text02_home}</Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={crumb} className="flex items-center gap-2">
            <span aria-hidden="true" className="opacity-50">
              /
            </span>
            <span aria-current={i === crumbs.length - 1 ? "page" : undefined}>{crumb}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */

interface PageHeroProps {
  title: string;
  tagline?: string;
  crumbs: string[];
  image: StaticImageData;
  imageAlt?: string;
  primary?: Action;
  secondary?: Action;
  /** Extra shading behind the text, for bright photos. */
  tint?: "default" | "strong";
  /** `compact` leaves room for content that overlaps the bottom edge. */
  size?: "full" | "compact";
}

/**
 * Cinematic full-bleed header. High-resolution photos run edge to edge and drift with the
 * scroll; smaller ones are softened into a colour wash so they never look stretched.
 */
export function PageHero({
  title,
  tagline,
  crumbs,
  image,
  imageAlt = "",
  primary = { label: cms.sections.PageHero.label01_get_started, href: "/contact" },
  secondary,
  tint = "default",
  size = "full",
}: PageHeroProps) {
  const fullBleed = image.width >= FULL_BLEED_MIN_WIDTH;

  return (
    <section
      className={`on-dark relative isolate flex items-end overflow-clip bg-navy text-white ${
        size === "full" ? "min-h-[clamp(32rem,88svh,56rem)]" : "min-h-[clamp(30rem,72svh,46rem)]"
      }`}
    >
      <div className="hero-drift absolute inset-0 -z-20">
        <RotatingImage
          images={fullBleed ? withVariants(image) : [image]}
          alt={fullBleed ? imageAlt : ""}
          fill
          preload
          quality={fullBleed ? 85 : 75}
          sizes={fullBleed ? "100vw" : "60vw"}
          placeholder="blur"
          className={`hero-media object-cover ${fullBleed ? "" : "scale-110 opacity-50 blur-2xl"}`}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-midnight)_0%,rgb(7_20_39/0.72)_38%,rgb(7_20_39/0.25)_70%,rgb(7_20_39/0.55)_100%)]"
      />
      {tint === "strong" ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(7_20_39/0.92)_0%,rgb(7_20_39/0.78)_45%,rgb(7_20_39/0.35)_100%)]"
        />
      ) : null}

      <div className={`shell hero-fade pt-36 ${size === "full" ? "pb-14 sm:pb-20 lg:pb-24" : "pb-20 sm:pb-24 lg:pb-28"}`}>
        <Breadcrumbs crumbs={crumbs} className="hero-in" />
        <h1 className="text-page-title split-in mt-5 max-w-4xl">
          <SplitText text={title} />
        </h1>
        {tagline ? (
          <p className="text-lead hero-in mt-5 max-w-2xl text-white/80" style={stagger(3)}>
            {tagline}
          </p>
        ) : null}
        <HeroActions primary={primary} secondary={secondary} className="hero-in mt-9" style={stagger(4)} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface SplitHeroProps {
  title: string;
  tagline: string;
  crumbs: string[];
  image: StaticImageData;
  imageAlt: string;
  /** Large supporting line between the title and the tagline (a paragraph, not a heading). */
  kicker?: string;
  /** Defaults to "Get Started" → /contact. */
  primary?: Action;
  secondary?: Action;
  /** Short list shown on the floating glass card over the image. */
  highlights: { icon: IconType; title: string }[];
  /** Small label above the highlights, e.g. the service name. */
  label: string;
  /** Optional animated backdrop drawn behind the hero (each service page has its own). */
  decor?: ReactNode;
}

/** Dark split header: copy on the left, a tall framed photo with a floating highlights card on the right. */
export function SplitHero({
  title,
  tagline,
  crumbs,
  image,
  imageAlt,
  kicker,
  primary = { label: cms.sections.SplitHero.label01_get_started, href: "/contact" },
  secondary,
  highlights,
  label,
  decor,
}: SplitHeroProps) {
  return (
    <section className="on-dark relative isolate overflow-clip bg-midnight text-white">
      <div aria-hidden="true" className="aurora" />
      {decor}

      <div className="shell grid items-center gap-12 pt-32 pb-16 sm:pt-36 lg:min-h-[clamp(40rem,92svh,60rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-28 lg:pb-20">
        <div>
          <Breadcrumbs crumbs={crumbs} className="hero-in" />
          <h1 className="text-page-title split-in mt-6">
            <SplitText text={title} />
          </h1>
          {kicker ? (
            <p
              className="hero-in mt-6 max-w-xl text-left font-display text-xl leading-snug font-medium hyphens-none text-white/90 sm:text-2xl"
              style={stagger(2)}
            >
              {kicker}
            </p>
          ) : null}
          <p className="text-lead hero-in mt-6 max-w-xl text-white/75" style={stagger(3)}>
            {tagline}
          </p>
          <HeroActions
            primary={primary}
            secondary={secondary}
            className="hero-in mt-10"
            style={stagger(4)}
          />
        </div>

        <div className="hero-in relative" style={stagger(2)}>
          <div className="hero-frame relative aspect-[4/5] overflow-clip rounded-[2rem] bg-navy-2 shadow-[0_60px_120px_-50px_rgb(0_0_0/0.8)] ring-1 ring-white/10 sm:aspect-[5/4] lg:aspect-[4/5]">
            <RotatingImage
              images={withVariants(image)}
              alt={imageAlt}
              fill
              preload
              quality={85}
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 100vw"
              placeholder="blur"
              className="hero-media object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_20_39/0.75),transparent_55%)]"
            />
          </div>
          {/* Floating highlights card, tucked over the lower-left corner of the photo. */}
          <div className="glass float border-glow absolute right-4 -bottom-8 left-4 rounded-2xl p-5 sm:right-auto sm:-left-6 sm:w-80 lg:-left-10">
            <p className="text-eyebrow text-accent">{label}</p>
            <ul className="mt-4 space-y-3">
              {highlights.map((item) => (
                <li key={item.title} className="flex items-center gap-3 text-sm font-medium">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-accent">
                    <item.icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface LightHeroProps {
  title: string;
  tagline: string;
  crumbs: string[];
  eyebrow?: string;
  primary?: Action;
  secondary?: Action;
  /** Imagery composition placed beside (desktop) or below (mobile) the copy. */
  media: ReactNode;
  /** `stacked` puts the media full-width under the copy instead of beside it. */
  layout?: "split" | "stacked";
}

/** Bright editorial header: oversized type on a soft paper background with layered imagery. */
export function LightHero({
  title,
  tagline,
  crumbs,
  eyebrow,
  primary = { label: cms.sections.LightHero.label01_get_started, href: "/contact" },
  secondary,
  media,
  layout = "split",
}: LightHeroProps) {
  const split = layout === "split";
  return (
    <section className="relative isolate overflow-clip bg-paper">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_85%_10%,rgb(23_195_230/0.14),transparent_70%),radial-gradient(45%_55%_at_0%_100%,rgb(30_95_219/0.1),transparent_70%)]"
      />
      <div
        className={`shell pt-32 pb-16 sm:pt-40 lg:pb-24 ${
          split ? "grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16" : ""
        }`}
      >
        <div className={split ? "" : "grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16"}>
          <div>
            <Breadcrumbs crumbs={crumbs} light className="hero-in" />
            {eyebrow ? (
              <p className="text-eyebrow hero-in mt-8 text-brand" style={stagger(1)}>
                {eyebrow}
              </p>
            ) : null}
            <h1 className={`split-in mt-5 ${split ? "text-display" : "text-hero"}`}>
              <SplitText text={title} />
            </h1>
          </div>
          <div>
            <p className="text-lead hero-in mt-6 max-w-xl text-muted" style={stagger(3)}>
              {tagline}
            </p>
            <HeroActions primary={primary} secondary={secondary} light className="hero-in mt-9" style={stagger(4)} />
          </div>
        </div>
        <div className={`hero-in ${split ? "" : "mt-14 lg:mt-20"}`} style={stagger(3)}>
          {media}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
  id?: string;
}

/** Eyebrow, word-by-word title and lead paragraph, cascading in as they scroll into view. */
export function SectionHeading({ eyebrow, title, text, align = "center", dark = false, className = "", id }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}>
      <p className={`text-eyebrow reveal flex items-center gap-3 ${centered ? "justify-center" : ""} ${dark ? "text-accent" : "text-brand"}`}>
        <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
        {eyebrow}
      </p>
      <h2 id={id} className="text-heading split-scroll mt-4">
        <SplitText text={title} />
      </h2>
      {text ? (
        <p
          className={`text-lead reveal mt-5 ${centered ? "mx-auto max-w-2xl" : ""} ${dark ? "text-white/70" : "text-muted"}`}
          style={stagger(2)}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface MediaFrameProps {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  /** Use `contain` for product shots on a light background. */
  fit?: "cover" | "contain";
  /** Let the photo drift against the scroll inside its frame. */
  parallax?: boolean;
  /** Tailwind object-position class for art-directed cropping. */
  position?: string;
}

/**
 * Rounded image with a gentle clip reveal as it scrolls into view.
 * Sections use `overflow-clip`, not `overflow-hidden`: a hidden-overflow ancestor becomes the scroll
 * container that `animation-timeline: view()` tracks, which would freeze reveals half-way.
 */
export function MediaFrame({
  src,
  alt,
  sizes,
  className = "aspect-[4/3]",
  fit = "cover",
  parallax = false,
  position = "object-center",
}: MediaFrameProps) {
  // Frames layered in a collage arrive already positioned; the rest anchor their own fill image.
  const positioned = /(^|\s)(absolute|sticky|fixed)(\s|$)/.test(className);
  return (
    <div
      className={`group/media reveal-media overflow-clip rounded-2xl bg-paper-2 ${positioned ? "" : "relative"} ${className}`}
    >
      <div className={`absolute inset-0 ${parallax && fit === "cover" ? "parallax" : ""}`}>
        <RotatingImage
          images={withVariants(src)}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          className={`transition-transform duration-[1200ms] ease-(--ease-premium) group-hover/media:scale-[1.04] ${
            fit === "cover" ? `object-cover ${position}` : "object-contain p-6"
          }`}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Icon tile in the original site's blue-to-cyan gradient. */
export function IconBadge({ icon: Icon, dark = false }: { icon: IconType; dark?: boolean }) {
  return (
    <span
      className={`icon-badge grid size-11 shrink-0 place-items-center rounded-xl transition-[scale,rotate,translate,box-shadow] duration-500 ease-(--ease-premium) group-hover:scale-110 group-hover:-rotate-6 ${
        dark
          ? "bg-white/8 text-accent ring-1 ring-white/10"
          : "bg-[linear-gradient(135deg,var(--color-brand),var(--color-accent))] text-white shadow-[0_10px_24px_-12px_rgb(30_95_219/0.7)]"
      }`}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

/** Light card shell: premium shadow, pointer glow, lift, and an accent line drawn on hover (.card-premium). */
export const cardClass = "card-premium group reveal spotlight lift h-full rounded-2xl bg-white p-7 ring-1 ring-line";

export function FeatureCard({ icon: Icon, title, text, index }: { icon: IconType; title: string; text: string; index?: number }) {
  return (
    <article className={`${cardClass} overflow-clip`} style={index === undefined ? undefined : stagger(index)}>
      {/* The card's icon again, large and faint in the corner; it tilts in on hover. */}
      <Icon className="card-watermark" strokeWidth={1.25} aria-hidden="true" />
      <IconBadge icon={Icon} />
      <h3 className="text-card-title mt-6">{title}</h3>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{text}</p>
    </article>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Stat cards: icon, odometer number, and a line that fills while the number rolls (styles in
 * globals.css, .stat-*). Cards lift and glow on hover.
 */
export function StatGrid({
  stats,
  dark = true,
}: {
  stats: { value: string; label: string; icon?: IconType }[];
  dark?: boolean;
}) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-5">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`stat-card group reveal spotlight lift relative flex flex-col overflow-clip rounded-2xl p-5 ring-1 sm:p-7 ${
            dark ? "stat-card-dark spotlight-dark bg-white/[0.04] ring-white/10" : "bg-white ring-line"
          }`}
          style={stagger(i)}
        >
          <dt className={`mt-3 text-sm leading-snug ${dark ? "text-white/65" : "text-muted"}`}>{stat.label}</dt>
          <dd className="order-first">
            {stat.icon ? (
              <span aria-hidden="true" className="mb-6 block">
                <IconBadge icon={stat.icon} dark={dark} />
              </span>
            ) : null}
            <span className={`text-stat block ${dark ? "text-gradient-light" : "text-gradient"}`}>
              <CountUp value={stat.value} />
            </span>
            <span aria-hidden="true" className={`mt-4 block h-1 overflow-clip rounded-full ${dark ? "bg-white/10" : "bg-ink/6"}`}>
              <span className="stat-bar block h-full rounded-full" style={stagger(i)} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */

/** Endless horizontal ticker. The list is rendered twice; the copy is hidden from assistive tech. */
export function Marquee({
  items,
  className = "",
  itemClassName = "",
  duration = 40,
  label,
  reverse = false,
}: {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  duration?: number;
  label: string;
  /** Scroll left to right instead (for a second row moving against the first). */
  reverse?: boolean;
}) {
  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={i} className={itemClassName}>
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      role="region"
      aria-label={label}
      className={`marquee ${reverse ? "marquee-reverse" : ""} ${className}`}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="marquee-track">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface FaqSectionProps {
  faqs: Faq[];
  tone?: Tone;
  /** Groups the <details> elements so only one is open at a time. */
  name: string;
  title?: string;
}

export function FaqSection({ faqs, tone = "white", name, title = "Frequently Asked Questions" }: FaqSectionProps) {
  return (
    <section id="faq" className={`section-y overflow-x-clip ${toneClass[tone]}`}>
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading align="left" eyebrow={cms.sections.FaqSection.eyebrow01_faq_s} title={title} />
            <div
              className="faq-support border-glow on-dark reveal relative isolate mt-8 overflow-clip rounded-2xl bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-strong))] p-6 text-white shadow-[0_30px_60px_-30px_rgb(30_95_219/0.7)]"
              style={stagger(3)}
            >
              <span aria-hidden="true" className="faq-blob faq-blob-a" />
              <span aria-hidden="true" className="faq-blob faq-blob-b" />
              <Headset aria-hidden="true" strokeWidth={1.25} className="faq-mark absolute -right-6 -bottom-6 -z-10 size-32 text-white/10" />
              <span className="faq-headset relative grid size-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Headset className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="mt-5 font-display text-lg font-semibold tracking-tight">{cms.sections.FaqSection.text02_still_have_questions}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/75">{cms.sections.FaqSection.text03_talk_to_our_team}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={company.phoneHref} className="btn btn-light min-h-10 px-4">
                  <Phone className="size-4" aria-hidden="true" />{cms.sections.FaqSection.text04_call_us}</a>
                <Link href="/contact" className="btn btn-outline-light min-h-10 px-4">{cms.sections.FaqSection.text05_contact_us}</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="grid content-start gap-3 lg:col-span-8">
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              name={name}
              open={i === 0}
              className={`faq-item faq-card group relative isolate overflow-clip rounded-2xl px-4 sm:px-5 ${
                tone === "paper" ? "bg-white/70 open:bg-white" : "bg-paper/60 open:bg-white"
              }`}
              style={stagger(i)}
            >
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-5 text-[1.0625rem] leading-snug font-medium tracking-tight transition-colors duration-300 hover:text-brand">
                <span className="flex items-start gap-4">
                  <span className="faq-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pt-1">{faq.q}</span>
                </span>
                <span className="faq-toggle">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="faq-answer pr-2 pb-7 pl-13 leading-relaxed text-muted sm:pr-14">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface CtaBandProps {
  title: string;
  text: string;
  id?: string;
  /** Optional backdrop photo; defaults to the brand gradient. */
  image?: StaticImageData;
  /** Defaults to a call button with the company phone number. */
  primary?: Action;
  secondary?: Action;
}

const ctaChips = [
  { icon: ShieldCheck, className: "top-[16%] left-[7%]" },
  { icon: Cloud, className: "top-[48%] left-[3%]" },
  { icon: Server, className: "bottom-[14%] left-[10%]" },
  { icon: Wifi, className: "top-[14%] right-[8%]" },
  { icon: Headset, className: "top-[50%] right-[3%]" },
  { icon: Code, className: "bottom-[16%] right-[11%]" },
];

/** Full-bleed closing call to action. */
export function CtaBand({ title, text, id, image, primary, secondary = { label: cms.sections.CtaBand.label01_contact_us, href: "/contact" } }: CtaBandProps) {
  return (
    <section
      id={id}
      className="on-dark relative isolate grid min-h-[clamp(28rem,70svh,40rem)] place-items-center overflow-clip bg-navy text-center text-white"
    >
      {image ? (
        <RotatingImage images={withVariants(image)} alt="" fill sizes="100vw" placeholder="blur" className="panel-media -z-20 object-cover" />
      ) : (
        <div aria-hidden="true" className="aurora" />
      )}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${
          image
            ? "bg-[linear-gradient(to_bottom,rgb(7_20_39/0.82),rgb(7_20_39/0.66)_50%,rgb(7_20_39/0.88))]"
            : "bg-[radial-gradient(60%_80%_at_100%_0%,rgb(30_95_219/0.45),transparent_70%),radial-gradient(50%_70%_at_0%_100%,rgb(23_195_230/0.16),transparent_70%)]"
        }`}
      />
      {/* Glass icon chips drifting around the edges (large screens). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        {ctaChips.map(({ icon: Icon, className }, i) => (
          <span key={i} className={`cta-chip ${className}`} style={stagger(i)}>
            <Icon className="size-6" strokeWidth={1.5} />
          </span>
        ))}
      </div>
      <div className="shell py-20">
        <h2 className="text-display split-scroll mx-auto max-w-4xl">
          <SplitText text={title} />
        </h2>
        <p className="text-lead reveal mx-auto mt-6 max-w-xl text-white/75" style={stagger(2)}>
          {text}
        </p>
        <div className="reveal mt-10 flex justify-center" style={stagger(3)}>
          <div className="btn-pair">
            {primary ? (
              <ActionLink action={primary} className="btn btn-primary">
                <ArrowRight className="btn-arrow size-4" aria-hidden="true" />
              </ActionLink>
            ) : (
              <a href={company.phoneHref} className="btn btn-primary">
                <Phone className="size-4" aria-hidden="true" />
                {company.phone}
              </a>
            )}
            <ActionLink action={secondary} className="btn btn-glass" />
          </div>
        </div>
      </div>
    </section>
  );
}
