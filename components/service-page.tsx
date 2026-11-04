import { RotatingImage } from "@/components/rotating-image";
import { withVariants } from "@/lib/image-variants";
import { ArrowRight, ArrowUpRight, Cloud, Mail, MessageSquareText, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { getService, type ServiceSlug } from "@/lib/services";
import { company, serviceLinks, socials } from "@/lib/site";

import { ClientsSection } from "./clients-section";
import { CtaBand, FaqSection, IconBadge, MediaFrame, SectionHeading, SplitHero, SplitText, stagger } from "./sections";
import { ServiceDecor, type DecorKind } from "./service-decor";
import { ServiceExtra } from "./service-extras";
import { GrowthEngine } from "./growth-engine";
import { TechIntelligence } from "./tech-intelligence";
import { FeatureDetail, RichText, ServiceJsonLd, ServiceSections } from "./service-sections";
import { SocialIcon } from "./social-icon";
import cms from "@/content/services.json";

export function serviceMetadata(slug: ServiceSlug): Metadata {
  const service = getService(slug);
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      url: `/${slug}`,
      title: service.seo?.ogTitle ?? service.metaTitle,
      description: service.seo?.ogDescription ?? service.metaDescription,
    },
  };
}

/*
 * Every service page has its own identity: a palette (it overrides the brand colour variables for
 * the whole page, so buttons, badges, links and glows all follow), an animated hero backdrop and a
 * different layout for its capabilities. Styles live in globals.css under .svc-*.
 */
interface Theme {
  kind: DecorKind;
  brand: string;
  brandStrong: string;
  brandLight: string;
  accent: string;
}

const themes: Record<ServiceSlug, Theme> = {
  "networking-and-infrastructure": {
    kind: "network",
    brand: "#1e5fdb",
    brandStrong: "#184fbb",
    brandLight: "#4a85f0",
    accent: "#17c3e6",
  },
  "software-development-services": {
    kind: "code",
    brand: "#7c3aed",
    brandStrong: "#6d28d9",
    brandLight: "#a78bfa",
    accent: "#ec4899",
  },
  "it-support-and-helpdesk": {
    kind: "support",
    brand: "#059669",
    brandStrong: "#047857",
    brandLight: "#34d399",
    accent: "#2dd4bf",
  },
  "managed-it-services": {
    kind: "managed",
    brand: "#ea580c",
    brandStrong: "#c2410c",
    brandLight: "#fb923c",
    accent: "#f59e0b",
  },
  "cybersecurity-services": {
    kind: "cyber",
    brand: "#e11d48",
    brandStrong: "#be123c",
    brandLight: "#fb7185",
    accent: "#f43f5e",
  },
  "cloud-services": {
    kind: "cloud",
    brand: "#0284c7",
    brandStrong: "#0369a1",
    brandLight: "#38bdf8",
    accent: "#6366f1",
  },
  "digital-marketing-services": {
    kind: "marketing",
    brand: "#c026d3",
    brandStrong: "#a21caf",
    brandLight: "#e879f9",
    accent: "#f97316",
  },
};

type Feature = ReturnType<typeof getService>["grid"]["features"][number];
type Grid = ReturnType<typeof getService>["grid"];

const pad = (i: number) => String(i + 1).padStart(2, "0");
const fileName = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Heading row shared by the capability layouts. */
function GridHeading({ grid, dark }: { grid: Grid; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <SectionHeading dark={dark} align="left" eyebrow={grid.eyebrow} title={grid.title} text={grid.text} />
      <p className={`reveal shrink-0 font-display text-sm ${dark ? "text-white/50" : "text-muted"}`} style={stagger(2)}>
        <span className={`text-stat ${dark ? "text-gradient-light" : "text-gradient"}`}>
          {String(grid.features.length).padStart(2, "0")}
        </span>
        <span className="ml-3">{cms.servicePage.GridHeading.text01_capabilities}</span>
      </p>
    </div>
  );
}

/** Networking: numbered glass cards over a dark, softly lit field. */
function NetworkFeatures({ grid }: { grid: Grid }) {
  return (
    <section id="our-services" className="on-dark section-y relative isolate overflow-clip bg-midnight text-white">
      <div aria-hidden="true" className="aurora" />
      <div className="shell">
        <GridHeading grid={grid} dark />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {grid.features.map((feature, i) => (
            <li
              key={feature.title}
              className="card-premium-dark group reveal spotlight spotlight-dark relative overflow-clip rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/10 hover:bg-white/[0.07]"
              style={stagger(i % 3)}
            >
              <feature.icon className="card-watermark card-watermark-dark" strokeWidth={1.25} aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-6 right-7 font-display text-sm text-white/35 tabular-nums transition-colors duration-500 group-hover:text-accent"
              >
                {pad(i)}
              </span>
              <IconBadge icon={feature.icon} dark />
              <h3 className="text-card-title mt-6 pr-8">{feature.title}</h3>
              <FeatureDetail feature={feature} dark />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Software: each capability is an editor window, with a file tab and line numbers. */
function CodeFeatures({ grid }: { grid: Grid }) {
  return (
    <section id="our-services" className="on-dark section-y relative isolate overflow-clip bg-[#0d0a1c] text-white">
      <div aria-hidden="true" className="aurora" />
      <div className="shell">
        <GridHeading grid={grid} dark />
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {grid.features.map((feature, i) => (
            <li key={feature.title} className="svc-editor group" style={stagger(i % 3)}>
              <div className="svc-editor-bar" aria-hidden="true">
                <span className="svc-editor-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="svc-editor-tab">{fileName(feature.title)}{cms.servicePage.CodeFeatures.text01_ts}</span>
              </div>
              <div className="svc-editor-body">
                <span aria-hidden="true" className="svc-editor-gutter">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="svc-editor-icon">
                      <feature.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="text-card-title">{feature.title}</h3>
                  </div>
                  <FeatureDetail feature={feature} dark />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** IT support: a timeline down the middle that fills as it is read, cards alternating sides. */
function SupportFeatures({ grid }: { grid: Grid }) {
  return (
    <section id="our-services" className="section-y relative isolate overflow-x-clip bg-paper">
      <div className="shell">
        <GridHeading grid={grid} />
        <ol className="svc-timeline relative mt-14 lg:mt-20">
          <span aria-hidden="true" className="svc-timeline-line" />
          {grid.features.map((feature, i) => (
            <li key={feature.title} className="svc-timeline-item group" data-side={i % 2 ? "right" : "left"}>
              <span aria-hidden="true" className="svc-timeline-node">
                <feature.icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="svc-timeline-card card-premium lift">
                <p className="text-eyebrow text-brand">{cms.servicePage.SupportFeatures.text01_step}{pad(i)}</p>
                <h3 className="text-card-title mt-2">{feature.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{feature.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Managed IT: a bento board led by a live "dashboard" card. */
function ManagedFeatures({ grid }: { grid: Grid }) {
  const [lead, ...rest] = grid.features;
  return (
    <section id="our-services" className="section-y relative isolate overflow-clip bg-white">
      <div className="shell">
        <GridHeading grid={grid} />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          <li className="svc-bento-lead on-dark reveal sm:col-span-2 lg:row-span-2">
            <div className="flex items-center justify-between">
              <span className="svc-bento-icon svc-bento-icon-light">
                <lead.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span aria-hidden="true" className="svc-bento-live">
                <i />{cms.servicePage.ManagedFeatures.text01_live}</span>
            </div>
            <h3 className="text-subheading mt-8">{lead.title}</h3>
            <p className="mt-3 max-w-md leading-relaxed text-white/80">{lead.text}</p>
            <div aria-hidden="true" className="svc-bento-chart">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
                <span key={n} style={{ "--i": n } as CSSProperties} />
              ))}
            </div>
          </li>
          {rest.map((feature, i) => (
            <li key={feature.title} className="svc-bento card-premium group reveal lift" style={stagger(i % 4)}>
              <span className="svc-bento-icon">
                <feature.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="text-card-title mt-5">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
              <span aria-hidden="true" className="svc-bento-num">
                {pad(i + 1)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Cybersecurity: terminal-style panels with a scan line and a monospace header. */
function CyberFeatures({ grid }: { grid: Grid }) {
  return (
    <section id="our-services" className="on-dark section-y svc-cyber-field relative isolate overflow-clip text-white">
      <div className="shell">
        <GridHeading grid={grid} dark />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {grid.features.map((feature, i) => (
            <li key={feature.title} className="svc-terminal group reveal" style={stagger(i % 3)}>
              <p aria-hidden="true" className="svc-terminal-head">
                <span>{`> ${pad(i)}_${fileName(feature.title).toUpperCase().replace(/-/g, "_")}`}</span>
                <span className="svc-terminal-ok">{cms.servicePage.CyberFeatures.text01_secure}</span>
              </p>
              <div className="flex items-center gap-3">
                <span className="svc-terminal-icon">
                  <feature.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="text-card-title">{feature.title}</h3>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/65">{feature.text}</p>
              <span aria-hidden="true" className="svc-terminal-scan" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Cloud: airy cards floating in a soft sky, the middle column set lower so the rows stagger. */
function CloudFeatures({ grid }: { grid: Grid }) {
  return (
    <section id="our-services" className="section-y svc-sky relative isolate overflow-clip">
      <div className="shell">
        <GridHeading grid={grid} />
        <ol className="svc-cloud-grid mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {grid.features.map((feature: Feature, i) => (
            <li key={feature.title} className="svc-cloud-card group reveal" style={stagger(i % 3)}>
              <div className="svc-cloud-float" style={{ "--i": i } as CSSProperties}>
                <Cloud aria-hidden="true" className="svc-cloud-mark" strokeWidth={1} />
                <span className="svc-cloud-icon">
                  <feature.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="text-card-title mt-5">{feature.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{feature.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Digital marketing: campaign cards on a warm glow, each with a small growth chart that rises on hover. */
function MarketingFeatures({ grid }: { grid: Grid }) {
  return (
    <section id="our-services" className="section-y svc-glow relative isolate overflow-clip">
      <div className="shell">
        <GridHeading grid={grid} />
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {grid.features.map((feature: Feature, i) => (
            <li
              key={feature.title}
              className="svc-mkt-card card-premium lift group reveal"
              style={{ ...stagger(i % 3), "--i": i } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="svc-mkt-icon">
                  <feature.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span aria-hidden="true" className="svc-mkt-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <h3 className="text-card-title mt-5">{feature.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{feature.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const whatsapp = socials.find((s) => s.network === "whatsapp");

/** IT support only: the ways to reach the helpdesk, each tile a real link. */
function SupportChannels() {
  const channels = [
    {
      label: cms.servicePage.SupportChannels.label01_call_the_helpdesk,
      value: company.phoneTopbar,
      href: company.phoneHref,
      icon: <Phone className="size-6" strokeWidth={1.75} />,
    },
    {
      label: cms.servicePage.SupportChannels.label02_email_support,
      value: company.supportEmail,
      href: `mailto:${company.supportEmail}`,
      icon: <Mail className="size-6" strokeWidth={1.75} />,
    },
    ...(whatsapp
      ? [
          {
            label: cms.servicePage.SupportChannels.label03_chat_on_whatsapp,
            value: "Message our team",
            href: whatsapp.href,
            icon: <SocialIcon network="whatsapp" className="size-6" />,
          },
        ]
      : []),
    {
      label: cms.servicePage.SupportChannels.label04_raise_a_request,
      value: cms.servicePage.SupportChannels.value05_use_our_contact_form,
      href: "/contact",
      icon: <MessageSquareText className="size-6" strokeWidth={1.75} />,
    },
  ];
  return (
    <section className="on-dark section-y svc-channels relative isolate overflow-clip text-white">
      <div aria-hidden="true" className="aurora" />
      <div className="shell">
        <SectionHeading
          dark
          eyebrow={cms.servicePage.SupportChannels.eyebrow06_get_support}
          title={cms.servicePage.SupportChannels.title07_reach_our_helpdesk_your}
          text={cms.servicePage.SupportChannels.text08_call_email_or_message}
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {channels.map((channel, i) => {
            const external = channel.href.startsWith("http");
            const className = "svc-channel group";
            const body = (
              <>
                <span aria-hidden="true" className="svc-channel-icon">
                  {channel.icon}
                </span>
                <span className="mt-6 block text-sm text-white/60">{channel.label}</span>
                <span className="mt-1 block font-display text-[1.0625rem] font-semibold tracking-tight break-words">
                  {channel.value}
                </span>
                <span aria-hidden="true" className="svc-channel-arrow">
                  <ArrowUpRight className="size-4" />
                </span>
              </>
            );
            return (
              <li key={channel.label} className="reveal" style={stagger(i)}>
                {channel.href.startsWith("/") ? (
                  <Link href={channel.href} className={className}>
                    {body}
                  </Link>
                ) : (
                  <a
                    href={channel.href}
                    className={className}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {body}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const featureLayouts = {
  network: NetworkFeatures,
  code: CodeFeatures,
  support: SupportFeatures,
  managed: ManagedFeatures,
  cyber: CyberFeatures,
  cloud: CloudFeatures,
  marketing: MarketingFeatures,
};

export function ServicePage({
  slug,
  afterHero,
  children,
}: {
  slug: ServiceSlug;
  /** Page-specific band between the hero and the overview. */
  afterHero?: ReactNode;
  /** Page-specific sections between the capabilities and the FAQ. */
  children?: ReactNode;
}) {
  const service = getService(slug);
  const { title, tagline, crumb, intro, grid, faqs, cta, hero } = service;
  const theme = themes[slug];
  const link = serviceLinks.find((s) => s.href === `/${slug}`);
  const heroImage = link?.image ?? intro.image;
  const otherServices = serviceLinks.filter((s) => s.href !== `/${slug}`);
  const Features = featureLayouts[theme.kind];
  const palette = {
    "--color-brand": theme.brand,
    "--color-brand-strong": theme.brandStrong,
    "--color-brand-light": theme.brandLight,
    "--color-accent": theme.accent,
  } as CSSProperties;

  return (
    <div className={`svc svc-${theme.kind}`} style={palette}>
      <SplitHero
        title={title}
        tagline={tagline}
        crumbs={[crumb]}
        image={heroImage}
        imageAlt={intro.imageAlt}
        label={crumb}
        highlights={grid.features.slice(0, 3)}
        kicker={hero?.kicker}
        primary={hero?.primary}
        secondary={hero?.secondary ?? { label: cms.servicePage.ServicePage.label01_what_we_offer, href: "#our-services" }}
        decor={<ServiceDecor kind={theme.kind} />}
      />

      {afterHero}

      {/* Overview: the photo holds its place while the copy scrolls past it. */}
      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="svc-media relative lg:sticky lg:top-28">
              <MediaFrame
                src={intro.image}
                alt={intro.imageAlt}
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, 100vw"
                className="aspect-[4/3] lg:aspect-[4/5]"
                parallax
              />
            </div>
          </div>
          <div className="lg:col-span-7 lg:pt-6">
            <p className="text-eyebrow reveal flex items-center gap-3 text-brand">
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
              {intro.eyebrow}
            </p>
            <h2 className="text-heading split-scroll mt-4">
              <SplitText text={intro.title} />
            </h2>
            <div className="text-lead mt-8 space-y-6 text-muted">
              {intro.paragraphs.map((paragraph, i) => (
                <p key={paragraph.slice(0, 40)} className="reveal" style={stagger(i)}>
                  <RichText text={paragraph} />
                </p>
              ))}
              {intro.list ? (
                <ul className="svx-problems reveal">
                  {intro.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {intro.after?.map((paragraph, i) => (
                <p key={paragraph.slice(0, 40)} className="reveal" style={stagger(i)}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
            <div className="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={stagger(2)}>
              <Link href="/contact" className="btn btn-primary btn-wide">{cms.servicePage.ServicePage.text02_get_started}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
              </Link>
              <a href="#faq" className="text-link">{cms.servicePage.ServicePage.text03_read_the_faq}<ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Software: where code meets intelligence, straight after the overview. */}
      {theme.kind === "code" ? <TechIntelligence /> : null}

      {/* Digital marketing: the marketing loop, straight after the overview. */}
      {theme.kind === "marketing" ? <GrowthEngine /> : null}

      <Features grid={grid} />

      {theme.kind === "support" ? <SupportChannels /> : <ServiceExtra kind={theme.kind} features={grid.features} />}

      {children}

      <ServiceSections service={service} />

      <ClientsSection />

      <FaqSection faqs={faqs} tone="paper" name={`faq-${slug}`} />

      {/* Onward navigation to the other services. */}
      <section aria-labelledby="more-services" className="section-y">
        <div className="shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading id="more-services" align="left" eyebrow={cms.servicePage.ServicePage.eyebrow04_explore} title={cms.servicePage.ServicePage.title05_more_ways_we_can} />
            <Link href="/#services" className="text-link reveal shrink-0" style={stagger(2)}>{cms.servicePage.ServicePage.text06_all_services}<ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
            {otherServices.map((service, i) => (
              <li key={service.href} className="reveal w-[72%] shrink-0 snap-start sm:w-auto" style={stagger(i)}>
                <Link href={service.href} className="group block">
                  <span className="relative block aspect-[4/5] overflow-clip rounded-2xl bg-navy">
                    <RotatingImage
                      images={withVariants(service.image)}
                      offset={i * 900}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 72vw"
                      placeholder="blur"
                      className="object-cover transition-transform duration-[1200ms] ease-(--ease-premium) group-hover:scale-[1.08]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_20_39/0.85),rgb(7_20_39/0.05)_60%)] transition-opacity duration-500 group-hover:opacity-90"
                    />
                    <span className="absolute top-4 left-4 grid size-11 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-[background-color,scale] duration-500 ease-(--ease-premium) group-hover:scale-110 group-hover:bg-brand">
                      <service.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                      <span className="font-display text-[1.0625rem] leading-snug font-semibold tracking-tight">
                        {service.label}
                      </span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-[background-color,rotate] duration-500 ease-(--ease-premium) group-hover:rotate-45 group-hover:bg-brand">
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={cta.title} text={cta.text} image={heroImage} primary={cta.primary} secondary={cta.secondary} />

      <ServiceJsonLd service={service} />
    </div>
  );
}
