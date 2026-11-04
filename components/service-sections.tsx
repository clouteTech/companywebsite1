import { ArrowRight, Check, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { Service } from "@/lib/services";
import { company } from "@/lib/site";

import { ChaosBoard } from "./chaos-board";
import { Pipeline } from "./pipeline";
import { IconBadge, SectionHeading, stagger } from "./sections";
import copy from "@/content/services.json";

/*
 * Extra content blocks for the fuller service pages (lib/services.ts optional fields), styled with each page's
 * palette (globals.css, .svx-*). Everything is plain, crawlable HTML: the "What it can include" lists sit in
 * <details>, which keeps them in the page source while folding them away.
 */

type Feature = Service["grid"]["features"][number];

const SITE = "https://cloute.co.in";
const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Renders text with inline links written as [anchor](/path) — internal paths use Next links. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const [whole, anchor, href] = match;
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push(
      href.startsWith("/") ? (
        <Link key={index} href={href} className="svx-link">
          {anchor}
        </Link>
      ) : (
        <a key={index} href={href} className="svx-link">
          {anchor}
        </a>
      ),
    );
    last = index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Per-service detail inside a capability card: the problem, what it can include, the benefit and a note. */
export function FeatureDetail({ feature, dark = false }: { feature: Feature; dark?: boolean }) {
  const tone = dark ? "text-white/65" : "text-muted";
  return (
    <>
      {feature.problem ? (
        <p className={`svx-problem ${dark ? "svx-problem-dark" : ""}`}>
          <span className="svx-problem-label">{copy.serviceSections.FeatureDetail.text01_the_problem_it_solves}</span>
          {feature.problem}
        </p>
      ) : null}
      <p className={`mt-3 text-[0.9375rem] leading-relaxed ${tone}`}>
        <RichText text={feature.text} />
      </p>
      {feature.includes ? (
        <details className={`svx-includes ${dark ? "svx-includes-dark" : ""}`}>
          <summary>{copy.serviceSections.FeatureDetail.text02_what_it_can_include}<ChevronDown className="svx-includes-chevron size-4" aria-hidden="true" />
          </summary>
          <ul>
            {feature.includes.map((item) => (
              <li key={item}>
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  <RichText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      {feature.benefit ? (
        <p className={`svx-benefit ${dark ? "svx-benefit-dark" : ""}`}>
          <strong>{copy.serviceSections.FeatureDetail.text03_business_benefit}</strong> <RichText text={feature.benefit} />
        </p>
      ) : null}
      {feature.note ? (
        <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-white/55" : "text-muted"}`}>
          <RichText text={feature.note} />
        </p>
      ) : null}
    </>
  );
}

function IconCards({
  section,
  tone = "white",
}: {
  section: NonNullable<Service["solutions"]>;
  tone?: "white" | "paper";
}) {
  return (
    <section className={`section-y relative isolate overflow-clip ${tone === "paper" ? "bg-paper" : "bg-white"}`}>
      <div className="shell">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} text={section.text} />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {section.items.map((item, i) => (
            <li key={item.title} className="svx-card card-premium lift group reveal" style={stagger(i % 3)}>
              {item.icon ? <IconBadge icon={item.icon} /> : null}
              <h3 className="text-card-title mt-5">{item.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                <RichText text={item.text} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Reasons({ section }: { section: NonNullable<Service["reasons"]> }) {
  return (
    <section className="svx-reasons section-y relative isolate overflow-clip">
      <div className="shell">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} text={section.text} />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {section.items.map((item, i) => (
            <li key={item.title} className="svx-reason card-premium fx-border lift group reveal" style={stagger(i % 3)}>
              <span aria-hidden="true" className="svx-reason-num">
                {pad(i)}
              </span>
              <h3 className="text-card-title">{item.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                <RichText text={item.text} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Process({ section }: { section: NonNullable<Service["process"]> }) {
  return (
    <section className="on-dark section-y relative isolate overflow-clip bg-midnight text-white">
      <div aria-hidden="true" className="aurora" />
      <div className="shell">
        <SectionHeading dark eyebrow={section.eyebrow} title={section.title} text={section.text} />
        <ol className="svx-steps mt-14 lg:mt-16">
          {section.steps.map((step, i) => (
            <li key={step.title} className="svx-step reveal" style={stagger(i % 3)}>
              <span aria-hidden="true" className="svx-step-num">
                {pad(i)}
              </span>
              <h3 className="text-card-title mt-5">{step.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-white/65">
                <RichText text={step.text} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Industries({ section }: { section: NonNullable<Service["industries"]> }) {
  return (
    <section className="section-y relative isolate overflow-clip bg-paper">
      <div className="shell">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} text={section.text} />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {section.items.map((item, i) => (
            <li key={item.title} className="svx-industry group reveal" style={stagger(i % 4)}>
              {item.icon ? (
                <span className="svx-industry-icon">
                  <item.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
              ) : null}
              <h3 className="mt-4 font-display text-[1.0625rem] leading-snug font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <RichText text={item.text} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Local({ section }: { section: NonNullable<Service["local"]> }) {
  return (
    <section className="section-y relative isolate overflow-clip bg-white">
      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading align="left" eyebrow={section.eyebrow} title={section.title} />
          <div className="text-lead mt-8 space-y-5 text-muted">
            {section.paragraphs.map((paragraph, i) => (
              <p key={paragraph.slice(0, 32)} className="reveal" style={stagger(i)}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        </div>
        <address className="svx-address reveal not-italic lg:col-span-5" style={stagger(1)}>
          <span aria-hidden="true" className="svx-address-pin">
            <MapPin className="size-6" strokeWidth={1.75} />
          </span>
          <p className="font-display text-lg font-semibold">{company.legalName}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{company.address}</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a href={company.phoneHref} className="svx-address-link">
                <Phone className="size-4" aria-hidden="true" />
                {company.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.salesEmail}`} className="svx-address-link">
                <Mail className="size-4" aria-hidden="true" />
                {company.salesEmail}
              </a>
            </li>
          </ul>
          <Link href="/contact" className="btn btn-primary mt-6 w-full">{copy.serviceSections.Local.text01_contact_our_team}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
          </Link>
        </address>
      </div>
    </section>
  );
}

/** All the optional sections a service defines, in reading order. */
/** Managed IT: the challenges start scattered and crooked, then swing into a neat, ticked list as they scroll in. */
function ChallengeBoard({ section }: { section: NonNullable<Service["solutions"]> }) {
  return (
    <section className="section-y relative isolate overflow-clip bg-white">
      <div className="shell">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} text={section.text} />
        <div className="mx-auto mt-12 max-w-3xl lg:mt-14">
          <ChaosBoard problems={section.items.map((item) => item.title)} />
        </div>
      </div>
    </section>
  );
}

/** Managed IT: the delivery process as a pipeline a light runs along, stage by stage. */
function PipelineSection({ section }: { section: NonNullable<Service["process"]> }) {
  return (
    <section className="on-dark section-y relative isolate overflow-clip bg-midnight text-white">
      <div aria-hidden="true" className="aurora" />
      <div className="shell">
        <SectionHeading dark eyebrow={section.eyebrow} title={section.title} text={section.text} />
        <div className="mt-14 lg:mt-20">
          <Pipeline steps={section.steps.map((step) => ({ title: step.title, text: step.text }))} />
        </div>
      </div>
    </section>
  );
}

export function ServiceSections({ service }: { service: Service }) {
  const managed = service.slug === "managed-it-services";
  return (
    <>
      {service.solutions ? managed ? <ChallengeBoard section={service.solutions} /> : <IconCards section={service.solutions} /> : null}
      {service.reasons ? <Reasons section={service.reasons} /> : null}
      {service.process ? managed ? <PipelineSection section={service.process} /> : <Process section={service.process} /> : null}
      {service.technologies ? <IconCards section={service.technologies} tone="paper" /> : null}
      {service.industries ? <Industries section={service.industries} /> : null}
      {service.local ? <Local section={service.local} /> : null}
    </>
  );
}

/** Service + BreadcrumbList structured data for the page (Organization is sitewide, not repeated here). */
export function ServiceJsonLd({ service }: { service: Service }) {
  const url = `${SITE}/${service.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.seo?.serviceName ?? service.crumb,
        serviceType: service.seo?.serviceType ?? service.crumb,
        description: service.seo?.schemaDescription ?? service.metaDescription,
        url,
        provider: { "@type": "Organization", name: company.legalName, url: `${SITE}/` },
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: service.crumb, item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON; "<" is escaped so the content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
