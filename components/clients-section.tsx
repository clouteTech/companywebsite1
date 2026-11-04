import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { clients, type Client } from "@/lib/clients";
import logoMark from "@/public/images/logo-mark.png";

import { CountUp } from "./count-up";
import { Marquee, SectionHeading, SplitText } from "./sections";
import cms from "@/content/common.json";

/*
 * "Trusted by" band: every client gets its own card, drifting past in two rows that move in opposite
 * directions and pause on hover (styles in globals.css, .cl-*). The service, products and about pages use
 * the light band; the home page uses the dark "showcase" with a moving grid floor and tilted rows.
 */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Sectors our clients work in, cycled through in the showcase heading. */
const sectors = [
  "Construction",
  "Energy",
  "Mobility",
  "Digital Identity",
  "Travel",
  "Manufacturing",
  "Education",
  "Agriculture",
  "Non-Profits",
];

function ClientCard({ client, dark = false }: { client: Client; dark?: boolean }) {
  return (
    <figure className={`cl-card group ${dark ? "cl-card-dark" : ""}`}>
      <span aria-hidden="true" className="cl-shine" />
      <span className="cl-logo">
        <Image
          src={client.logo}
          alt={`${client.name} logo`}
          sizes="14rem"
          className={client.wide ? "cl-logo-wide" : "cl-logo-square"}
        />
      </span>
      <figcaption className="cl-body">
        <span className="cl-name">{client.name}</span>
        <span className="cl-meta">
          <span className="cl-industry">{client.industry}</span>
          {client.location ? (
            <span className="cl-location">
              <MapPin aria-hidden="true" className="size-3.5" strokeWidth={2} />
              {client.location}
            </span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}

function ClientRows({ dark = false }: { dark?: boolean }) {
  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)];
  return rows.map((row, i) => (
    <Marquee
      key={i}
      label={i === 0 ? "Our clients" : "More of our clients"}
      reverse={i === 1}
      duration={i === 0 ? 16 : 18}
      className={i === 1 ? "-mt-4" : ""}
      itemClassName="px-2.5 py-6 sm:px-3"
      items={row.map((client, j) => (
        <span key={client.name} className="cl-bob" style={v({ "--b": j + i * 3 })}>
          <ClientCard client={client} dark={dark} />
        </span>
      ))}
    />
  ));
}

/** Client logos circling the Cloute mark on two counter-rotating rings; each logo stays upright. */
function ClientOrbit() {
  const inner = clients.slice(0, 5);
  const outer = clients.slice(5);
  const ring = (list: Client[], kind: "inner" | "outer") => (
    <div className={`cl-ring cl-ring-${kind}`}>
      {list.map((client, i) => (
        <span key={client.name} className="cl-orbit-item" style={v({ "--a": `${(360 / list.length) * i}deg` })}>
          <span className="cl-orbit-logo">
            <Image src={client.logo} alt="" sizes="5rem" loading="eager" className="cl-orbit-img" />
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="cl-orbit reveal">
      <span className="cl-orbit-sweep" />
      {ring(outer, "outer")}
      {ring(inner, "inner")}
      <span className="cl-orbit-core">
        <span className="cl-orbit-pulse" />
        <span className="cl-orbit-pulse" style={v({ "--d": "1.3s" })} />
        <Image src={logoMark} alt="" sizes="5rem" className="relative h-auto w-[62%]" />
      </span>
    </div>
  );
}

/** Home page: a dark stage with a moving grid floor, rising particles and the client rows tilted across it. */
function ClientsShowcase() {
  return (
    <section
      aria-labelledby="clients-title"
      className="cl-section cl-showcase on-dark relative isolate overflow-clip bg-abyss py-[clamp(5rem,3.5rem+6vw,9rem)] text-white"
    >
      <div aria-hidden="true" className="cl-floor" />
      <div aria-hidden="true" className="cl-beam" />
      <div aria-hidden="true" className="aurora" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className="decor-particle" style={v({ "--i": i, "--x": `${(i * 37 + 11) % 100}%` })} />
        ))}
      </div>

      <div className="shell grid items-center gap-14 text-center lg:grid-cols-2 lg:gap-10 lg:text-left">
        <div>
          <p className="text-eyebrow reveal flex items-center justify-center gap-3 text-accent lg:justify-start">
            <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />{cms.clientsSection.ClientsShowcase.text01_our_clients}<span aria-hidden="true" className="h-px w-6 bg-current opacity-60 lg:hidden" />
          </p>
          <h2 id="clients-title" className="text-display split-scroll mx-auto mt-5 max-w-4xl lg:mx-0">
            <SplitText text={cms.clientsSection.ClientsShowcase.text02_trusted_by_organisations_that} />
          </h2>
          <p className="text-lead reveal mx-auto mt-6 max-w-2xl text-white/70 lg:mx-0">{cms.clientsSection.ClientsShowcase.text03_businesses_in}{" "}
            <span className="cl-rotator" aria-hidden="true">
              {sectors.map((sector, i) => (
                <span key={sector} style={v({ "--i": i, "--n": sectors.length })}>
                  {sector}
                </span>
              ))}
            </span>
            <span className="sr-only">{sectors.join(", ")}</span>{cms.clientsSection.ClientsShowcase.text04_and_more_rely_on}</p>

          <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <p className="cl-stat">
              <span className="cl-stat-value">
                <CountUp value={String(clients.length)} />
              </span>
              <span className="cl-stat-label">{cms.clientsSection.ClientsShowcase.text05_featured_clients}</span>
            </p>
            <p className="cl-stat">
              <span className="cl-stat-value">
                <CountUp value={String(sectors.length)} />
              </span>
              <span className="cl-stat-label">{cms.clientsSection.ClientsShowcase.text06_sectors_served}</span>
            </p>
          </div>
        </div>

        <ClientOrbit />
      </div>

      <div className="cl-stage relative mt-16 lg:mt-24">
        {/* Oversized outlined client names drifting behind the cards. */}
        <div aria-hidden="true" className="cl-names">
          <div className="cl-names-track">
            {[0, 1].map((copy) => (
              <span key={copy}>
                {clients.map((client) => (
                  <span key={client.name} className="cl-names-item">
                    {client.name}
                    <span className="cl-names-star">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <ClientRows dark />
      </div>

      <div className="shell reveal mt-14 flex flex-col items-center gap-4 text-center lg:mt-20">
        <p className="font-display text-xl font-semibold tracking-tight">{cms.clientsSection.ClientsShowcase.text07_your_logo_could_be}</p>
        <Link href="/contact" className="btn btn-primary btn-wide">{cms.clientsSection.ClientsShowcase.text08_become_our_next_client}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function ClientsSection({
  variant = "light",
  tone = "white",
  title = "Trusted by Businesses Across Industries",
  text = "From construction and energy to education, travel and non-profits — organisations rely on Cloute Technologies for their IT.",
}: {
  variant?: "light" | "showcase";
  tone?: "white" | "paper";
  title?: string;
  text?: string;
}) {
  if (variant === "showcase") return <ClientsShowcase />;
  return (
    <section
      aria-labelledby="clients-title"
      className={`cl-section section-y relative isolate overflow-clip ${tone === "paper" ? "bg-paper" : "bg-white"}`}
    >
      <span aria-hidden="true" className="cl-orb cl-orb-a" />
      <span aria-hidden="true" className="cl-orb cl-orb-b" />
      <div className="shell">
        <SectionHeading id="clients-title" eyebrow={cms.clientsSection.ClientsSection.eyebrow01_our_clients} title={title} text={text} />
      </div>
      <div className="mt-12 lg:mt-14">
        <ClientRows />
      </div>
    </section>
  );
}
