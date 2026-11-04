import { Layers, ShieldCheck } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import type { getService } from "@/lib/services";

import { Marquee, SectionHeading, stagger } from "./sections";
import { CloudArt } from "./cloud-art";
import { RailProgress } from "./rail-progress";
import { Seen } from "./seen";
import type { DecorKind } from "./service-decor";
import copy from "@/content/services.json";

/*
 * One extra band per service page, each a different visual built from that page's own
 * capabilities (styles in globals.css, .x-*). IT support has its contact band in service-page.tsx.
 */

type Feature = ReturnType<typeof getService>["grid"]["features"][number];

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Networking: the capabilities as stops on one line; a light runs down it as the page scrolls and lights each stop. */
function NetworkMap({ features }: { features: Feature[] }) {
  const stops = features.slice(0, 8);
  return (
    <section className="section-y relative isolate overflow-clip bg-white">
      <RailProgress />
      <div className="shell">
        <SectionHeading
          eyebrow={copy.serviceExtras.NetworkMap.eyebrow01_network_map}
          title={
            copy.serviceExtras.NetworkMap.title02_every_capability_connected
          }
          text={
            copy.serviceExtras.NetworkMap.text03_our_networking_services_are
          }
        />
        <div className="nt mt-14 lg:mt-16" data-rail>
          <div aria-hidden="true" className="nt-rail">
            <span className="nt-fill" />
            <span className="nt-head" />
          </div>
          <ol className="nt-stops">
            {stops.map((feature, i) => (
              <li key={feature.title} className="nt-stop">
                <span aria-hidden="true" className="nt-node">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="nt-card">
                  <span className="nt-icon">
                    <feature.icon
                      className="size-5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h3 className="nt-title">{feature.title}</h3>
                    {feature.benefit ? (
                      <p className="nt-text">{feature.benefit}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const camel = (title: string) =>
  title
    .replace(/&/g, "and")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word, i) =>
      i
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase(),
    )
    .join("");

/** Software: the capabilities as function calls scrolling past in two directions. */
function CodeStream({ features }: { features: Feature[] }) {
  const chip = (feature: Feature) => (
    <span className="x-code-chip">
      <feature.icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
      <code>
        {camel(feature.title)}
        <span className="x-code-paren">()</span>
      </code>
    </span>
  );
  const half = Math.ceil(features.length / 2);
  return (
    <section className="on-dark relative isolate overflow-clip bg-[#0d0a1c] py-20 text-white sm:py-24">
      <div className="shell">
        <SectionHeading
          dark
          eyebrow={copy.serviceExtras.CodeStream.eyebrow01_what_we_ship}
          title={copy.serviceExtras.CodeStream.title02_from_first_commit_to}
          text={
            copy.serviceExtras.CodeStream.text03_the_capabilities_our_developers
          }
        />
      </div>
      <Marquee
        label={copy.serviceExtras.CodeStream.label04_software_capabilities}
        className="mt-12"
        itemClassName="px-2 py-2"
        items={features.slice(0, half).map(chip)}
        duration={36}
      />
      <Marquee
        label={copy.serviceExtras.CodeStream.label05_more_software_capabilities}
        className="mt-2"
        itemClassName="px-2 py-2"
        items={features.slice(half).map(chip)}
        duration={30}
        reverse
      />
    </section>
  );
}

/** Managed IT: a health-check board, a scan passing down the services one after another. */
/** Where the radar's blips sit (left, top). */
const blips = [
  ["62%", "18%"],
  ["82%", "34%"],
  ["74%", "70%"],
  ["38%", "82%"],
  ["20%", "56%"],
  ["30%", "24%"],
];

function HealthBoard({ features }: { features: Feature[] }) {
  return (
    <section className="section-y relative isolate overflow-clip bg-paper">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow={copy.serviceExtras.HealthBoard.eyebrow01_always_on}
            title={
              copy.serviceExtras.HealthBoard.title02_round_the_clock_health
            }
            text={copy.serviceExtras.HealthBoard.text03_with_24_7_monitoring}
          />
          {/* A radar sweeping round, lighting up each system it passes. */}
          <div className="hs-radar mt-10" aria-hidden="true">
            <span className="hs-sweep" />
            {blips.map(([x, y], i) => (
              <span
                key={i}
                className="hs-blip"
                style={v({ "--i": i, "--x": x, "--y": y })}
              />
            ))}
            <span className="hs-hub" />
          </div>
        </div>
        <div className="hs reveal" style={v({ "--n": features.length })}>
          <span aria-hidden="true" className="hs-beam" />
          <ul className="hs-list">
            {features.map((feature, i) => (
              <li
                key={feature.title}
                className="hs-row"
                style={v({ "--i": i })}
              >
                <span className="hs-icon">
                  <feature.icon
                    className="size-4"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <span className="hs-title">{feature.title}</span>
                <svg
                  aria-hidden="true"
                  className="hs-ecg"
                  viewBox="0 0 120 24"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 12 H34 L40 3 L48 21 L55 8 L60 12 H120"
                    pathLength="1"
                  />
                </svg>
                <span className="hs-status">
                  <span className="hs-chk">
                    <i aria-hidden="true" />
                    {copy.serviceExtras.HealthBoard.text05_checking}
                  </span>
                  <span className="hs-ok">
                    <i aria-hidden="true" />
                    {copy.serviceExtras.HealthBoard.text04_monitored}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Cybersecurity: protection drawn as layers of rings around the business at the centre. */
function ShieldLayers({ features }: { features: Feature[] }) {
  const layers = features.slice(0, 4);
  return (
    <section className="on-dark section-y svc-cyber-field relative isolate overflow-clip text-white">
      <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
        <SectionHeading
          dark
          align="left"
          eyebrow={copy.serviceExtras.ShieldLayers.eyebrow01_defense_in_depth}
          title={
            copy.serviceExtras.ShieldLayers
              .title02_layered_protection_around_your
          }
          text={
            copy.serviceExtras.ShieldLayers.text03_our_security_services_stack
          }
        />
        <div className="x-shield">
          <div aria-hidden="true" className="x-shield-rings">
            {layers.map((feature, i) => (
              <span
                key={feature.title}
                className="x-shield-ring"
                style={v({ "--i": i })}
              />
            ))}
            <span className="x-shield-core">
              <ShieldCheck className="size-9" strokeWidth={1.5} />
            </span>
          </div>
          <ol className="x-shield-list">
            {layers.map((feature, i) => (
              <li
                key={feature.title}
                className="x-shield-item reveal"
                style={stagger(i)}
              >
                <span className="x-shield-num">
                  {copy.serviceExtras.ShieldLayers.text04_l}
                  {layers.length - i}
                </span>
                <feature.icon
                  className="size-5 shrink-0 text-accent"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="font-medium">{feature.title}</span>
              </li>
            ))}
            <li
              className="x-shield-item x-shield-item-core reveal"
              style={stagger(layers.length)}
            >
              <span className="x-shield-num">
                <Layers className="size-3.5" aria-hidden="true" />
              </span>
              <ShieldCheck
                className="size-5 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="font-semibold">
                {
                  copy.serviceExtras.ShieldLayers
                    .text05_your_business_protected_at
                }
              </span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Cloud: the capabilities as a console of tiles, each with its own small looping picture. */
function CloudOrbit({ features }: { features: Feature[] }) {
  const tiles = features.slice(0, 9);
  return (
    <section className="section-y svc-sky relative isolate overflow-clip">
      <Seen />
      <div aria-hidden="true" className="cc-clouds">
        {[0, 1, 2].map((i) => (
          <i key={i} style={v({ "--i": i })} />
        ))}
      </div>
      <div className="shell cc">
        <SectionHeading
          eyebrow={copy.serviceExtras.CloudOrbit.eyebrow01_one_cloud_partner}
          title={
            copy.serviceExtras.CloudOrbit
              .title02_everything_revolves_around_your
          }
          text={
            copy.serviceExtras.CloudOrbit
              .text03_migration_management_security_and
          }
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {tiles.map((feature, i) => (
            <li
              key={feature.title}
              className="cc-tile"
              data-seen-target
              style={v({ "--i": i % 3 })}
            >
              <div className="cc-art">
                <span aria-hidden="true" className="cc-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <CloudArt index={i} />
              </div>
              <div className="cc-body">
                <h3 className="cc-title">{feature.title}</h3>
                {feature.benefit ? (
                  <p className="cc-text">{feature.benefit}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Digital marketing: the capabilities grouped into the steps of a customer's journey, narrowing like a funnel. */
const funnelStages = copy.serviceExtras.funnelStages;

function MarketingFunnel({ features }: { features: Feature[] }) {
  const byTitle = new Map(features.map((feature) => [feature.title, feature]));
  return (
    <section className="section-y relative isolate overflow-clip bg-white">
      <div className="shell">
        <SectionHeading
          eyebrow={
            copy.serviceExtras.MarketingFunnel.eyebrow01_your_customer_journey
          }
          title={
            copy.serviceExtras.MarketingFunnel.title02_from_first_search_to
          }
          text={
            copy.serviceExtras.MarketingFunnel.text03_every_service_we_offer
          }
        />
        <ol className="x-funnel mt-14 lg:mt-16">
          {funnelStages.map((stage, i) => (
            <li
              key={stage.title}
              className="x-funnel-stage reveal"
              style={{ ...stagger(i), ...v({ "--i": i }) }}
            >
              <div className="x-funnel-band">
                <span className="x-funnel-step">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="x-funnel-title">{stage.title}</span>
                  <span className="x-funnel-text">{stage.text}</span>
                </span>
              </div>
              <ul className="x-funnel-chips">
                {stage.features.map((title) => {
                  const feature = byTitle.get(title);
                  return feature ? (
                    <li key={title} className="x-funnel-chip">
                      <feature.icon
                        className="size-4 shrink-0"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      {title}
                    </li>
                  ) : null;
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const extras: Partial<
  Record<DecorKind, (props: { features: Feature[] }) => ReactNode>
> = {
  network: NetworkMap,
  code: CodeStream,
  managed: HealthBoard,
  cyber: ShieldLayers,
  cloud: CloudOrbit,
  marketing: MarketingFunnel,
};

export function ServiceExtra({
  kind,
  features,
}: {
  kind: DecorKind;
  features: Feature[];
}) {
  const Extra = extras[kind];
  return Extra ? <Extra features={features} /> : null;
}
