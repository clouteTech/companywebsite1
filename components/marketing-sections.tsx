import { ArrowRight, CheckCircle2, Quote, Search, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import {
  channels,
  costFactors,
  glance,
  highlights,
  industries,
  mistakes,
  platformGroups,
  process,
  reasons,
} from "@/lib/digital-marketing";

import { Marquee, SectionHeading, SplitText, stagger } from "./sections";
import copy from "@/content/services.json";

/*
 * Sections only the Digital Marketing page has, slotted into ServicePage (styles in globals.css, .mk-*).
 * Everything animates with CSS only and slows down for visitors who prefer reduced motion.
 */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const pad = (i: number) => String(i + 1).padStart(2, "0");

/** The channels we run, scrolling in a gradient band under the hero. */
export function MarketingTicker() {
  return (
    <div className="mk-ticker">
      <Marquee
        label={copy.marketingSections.MarketingTicker.label01_digital_marketing_channels}
        duration={30}
        itemClassName="px-5 sm:px-7"
        items={channels.map((channel) => (
          <span key={channel} className="mk-ticker-item">
            <Sparkles aria-hidden="true" className="size-4" strokeWidth={2} />
            {channel}
          </span>
        ))}
      />
    </div>
  );
}

/** Why choose us: key highlights on the left, the reasons as glowing cards on the right. */
function WhyChoose() {
  return (
    <section className="on-dark section-y relative isolate overflow-clip bg-midnight text-white">
      <div aria-hidden="true" className="aurora" />
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              dark
              align="left"
              eyebrow={copy.marketingSections.WhyChoose.eyebrow01_our_edge}
              title={copy.marketingSections.WhyChoose.title02_why_choose_cloute_for}
              text={copy.marketingSections.WhyChoose.text03_the_partner_you_choose}
            />
            <p className="text-eyebrow reveal mt-10 text-white/60">{copy.marketingSections.WhyChoose.text04_key_highlights}</p>
            <ul className="mt-5 space-y-4">
              {highlights.map((item, i) => (
                <li key={item} className="mk-check reveal flex items-start gap-3 text-white/80" style={stagger(i)}>
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {reasons.map((reason, i) => (
            <li
              key={reason.title}
              className={`card-premium-dark group reveal spotlight spotlight-dark mk-reason relative overflow-clip rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/10 ${
                i === reasons.length - 1 ? "sm:col-span-2" : ""
              }`}
              style={stagger(i % 2)}
            >
              <span aria-hidden="true" className="mk-reason-num">
                {pad(i)}
              </span>
              <span className="mk-reason-icon">
                <reason.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="text-card-title mt-5">{reason.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-white/70">{reason.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Services at a glance: a table with a bar showing when each channel usually starts to pay off. */
function AtAGlance() {
  const months = 6;
  return (
    <section className="section-y relative isolate overflow-clip bg-white">
      <div className="shell">
        <SectionHeading
          eyebrow={copy.marketingSections.AtAGlance.eyebrow01_quick_reference}
          title={copy.marketingSections.AtAGlance.title02_services_at_a_glance}
          text={copy.marketingSections.AtAGlance.text03_each_channel_does_a}
        />
        <div className="mk-glance reveal mt-14 lg:mt-16">
          <table>
            <thead>
              <tr>
                <th scope="col">{copy.marketingSections.AtAGlance.text04_service}</th>
                <th scope="col">{copy.marketingSections.AtAGlance.text05_best_for}</th>
                <th scope="col">{copy.marketingSections.AtAGlance.text06_typical_time_to_results}</th>
              </tr>
            </thead>
            <tbody>
              {glance.map((row, i) => (
                <tr key={row.service} style={stagger(i)}>
                  <th scope="row">{row.service}</th>
                  <td data-label="Best for">{row.bestFor}</td>
                  <td data-label="Time to results">
                    <span className="mk-glance-time">{row.timeframe}</span>
                    <span aria-hidden="true" className="mk-glance-track">
                      <span
                        className={`mk-glance-bar draw-x ${row.to === null ? "mk-glance-ongoing" : ""}`}
                        style={v(
                          row.to === null
                            ? { "--from": "0%", "--w": "100%" }
                            : {
                                "--from": `${(row.from / months) * 100}%`,
                                "--w": `${Math.max(((row.to - row.from) / months) * 100, 4)}%`,
                              },
                        )}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p aria-hidden="true" className="mk-glance-scale">
            <span>{copy.marketingSections.AtAGlance.text07_week_1}</span>
            <span>{copy.marketingSections.AtAGlance.text08_month_2}</span>
            <span>{copy.marketingSections.AtAGlance.text09_month_4}</span>
            <span>{copy.marketingSections.AtAGlance.text10_month_6}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Platforms, grouped, with every name drifting past in a marquee underneath. */
function Platforms() {
  const all = platformGroups.flatMap((group) => group.items);
  return (
    <section className="section-y svc-glow relative isolate overflow-clip">
      <div className="shell">
        <SectionHeading
          eyebrow={copy.marketingSections.Platforms.eyebrow01_ecosystem}
          title={copy.marketingSections.Platforms.title02_platforms_we_work_across}
          text={copy.marketingSections.Platforms.text03_we_work_within_the}
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {platformGroups.map((group, i) => (
            <li key={group.title} className="mk-platform card-premium lift group reveal" style={stagger(i % 3)}>
              <p className="flex items-center gap-3">
                <span className="svc-mkt-icon">
                  <group.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="text-card-title">{group.title}</span>
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="mk-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <Marquee
        label={copy.marketingSections.Platforms.label04_platforms_and_tools}
        className="mt-14"
        duration={45}
        itemClassName="px-2"
        items={all.map((item) => (
          <span key={item} className="mk-marquee-pill">
            {item}
          </span>
        ))}
      />
    </section>
  );
}

/** Industries: pills that bob gently, filling with colour on hover. */
function Industries() {
  return (
    <section className="section-y relative isolate overflow-clip bg-white">
      <div className="shell">
        <SectionHeading
          eyebrow={copy.marketingSections.Industries.eyebrow01_industries}
          title={copy.marketingSections.Industries.title02_industries_we_help_grow}
          text={copy.marketingSections.Industries.text03_every_industry_has_its}
        />
        <ul className="mk-industries mt-14 lg:mt-16">
          {industries.map((industry, i) => (
            <li key={industry.label} className="reveal" style={stagger(i % 5)}>
              <span className="mk-industry" style={v({ "--i": i })}>
                <industry.icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {industry.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Process: five numbered steps joined by a line that draws itself as the section scrolls in. */
function Process() {
  return (
    <section className="section-y relative isolate overflow-clip bg-paper">
      <div className="shell">
        <SectionHeading
          eyebrow={copy.marketingSections.Process.eyebrow01_our_process}
          title={copy.marketingSections.Process.title02_how_we_run_your}
          text={copy.marketingSections.Process.text03_a_clear_five_step}
        />
        <ol className="mk-process mt-14 lg:mt-20">
          <span aria-hidden="true" className="mk-process-line draw-x" />
          {process.map((step, i) => (
            <li key={step.title} className="mk-process-step reveal" style={stagger(i)}>
              <span aria-hidden="true" className="mk-process-node" style={v({ "--i": i })}>
                <step.icon className="size-6" strokeWidth={1.75} />
              </span>
              <p className="text-eyebrow mt-6 text-brand">{copy.marketingSections.Process.text04_step}{pad(i)}</p>
              <h3 className="text-card-title mt-2">{step.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Why India needs it: the argument beside an animated search, then what drives the cost. */
function MarketAndCost() {
  return (
    <section className="section-y relative isolate overflow-clip bg-white">
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-eyebrow reveal flex items-center gap-3 text-brand">
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />{copy.marketingSections.MarketAndCost.text01_market_reality}</p>
            <h2 className="text-heading split-scroll mt-4">
              <SplitText text={copy.marketingSections.MarketAndCost.text02_why_bangalore_businesses_need} />
            </h2>
            <div className="text-lead mt-8 space-y-6 text-muted">
              <p className="reveal">{copy.marketingSections.MarketAndCost.text03_in_bangalore_being_visible}</p>
              <p className="reveal" style={stagger(1)}>{copy.marketingSections.MarketAndCost.text04_a_business_without_an}</p>
            </div>
          </div>
          <div aria-hidden="true" className="mk-search reveal" style={stagger(1)}>
            <div className="mk-search-bar">
              <Search className="size-5 shrink-0" strokeWidth={2} />
              <span className="mk-search-typed">{copy.marketingSections.MarketAndCost.text05_best_it_company_in}</span>
            </div>
            <ul className="mk-search-results">
              {[copy.marketingSections.MarketAndCost.item06_your_business_first_in, copy.marketingSections.MarketAndCost.item07_google_maps_listing_with, copy.marketingSections.MarketAndCost.item08_ad_that_leads_to].map(
                (label, i) => (
                  <li key={label} className="mk-search-result" style={v({ "--i": i })}>
                    <span className="mk-search-dot" />
                    <span>
                      <span className="mk-search-title">{label}</span>
                      <span className="mk-search-line" />
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-24 lg:mt-32">
          <SectionHeading
            eyebrow={copy.marketingSections.MarketAndCost.eyebrow09_investment}
            title={copy.marketingSections.MarketAndCost.title10_what_does_digital_marketing}
            text={copy.marketingSections.MarketAndCost.text11_it_depends_on_what}
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {costFactors.map((factor, i) => (
              <li key={factor.title} className="mk-cost group reveal" style={stagger(i)}>
                <span className="svc-mkt-icon">
                  <factor.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="text-card-title mt-5">{factor.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{factor.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Mistakes we help avoid: each card shows the problem, and how we prevent it. */
function Mistakes() {
  return (
    <section className="section-y svc-glow relative isolate overflow-clip">
      <div className="shell">
        <SectionHeading
          eyebrow={copy.marketingSections.Mistakes.eyebrow01_avoid_the_pitfalls}
          title={copy.marketingSections.Mistakes.title02_common_mistakes_we_help}
          text={copy.marketingSections.Mistakes.text03_many_businesses_lose_marketing}
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-6">
          {mistakes.map((mistake, i) => (
            <li
              key={mistake.title}
              className={`mk-mistake card-premium lift group reveal ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
              style={stagger(i % 3)}
            >
              <h3 className="mk-mistake-head text-card-title">
                <XCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#e11d48]" strokeWidth={2} />
                {mistake.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{mistake.text}</p>
              <div className="mk-mistake-fix">
                <CheckCircle2 aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
                <span>{mistake.fix}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Our commitment: a glowing card closing the page before the FAQ. */
function Commitment() {
  return (
    <section className="section-y relative isolate overflow-clip bg-white">
      <div className="shell">
        <div className="mk-commit reveal text-center">
          <Quote aria-hidden="true" className="mk-commit-quote" strokeWidth={1.25} />
          <p className="text-eyebrow text-brand">{copy.marketingSections.Commitment.text01_our_commitment}</p>
          <h2 className="text-heading split-scroll mt-4">
            <SplitText text={copy.marketingSections.Commitment.text02_quality_and_transparency_every} />
          </h2>
          <div className="text-lead mx-auto mt-6 max-w-3xl space-y-5 text-muted">
            <p>{copy.marketingSections.Commitment.text03_you_get_regular_reports}</p>
            <p>{copy.marketingSections.Commitment.text04_every_decision_we_take}</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn btn-primary btn-wide">{copy.marketingSections.Commitment.text05_get_a_free_consultation}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
            </Link>
            <a href="#faq" className="btn btn-outline">{copy.marketingSections.Commitment.text06_read_the_faq}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketingSections() {
  return (
    <>
      <WhyChoose />
      <AtAGlance />
      <Platforms />
      <Process />
      <Industries />
      <MarketAndCost />
      <Mistakes />
      <Commitment />
    </>
  );
}
