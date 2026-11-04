import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Network,
  Search,
  Timer,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

import { CtaBand, IconBadge, LightHero, Marquee, MediaFrame, SectionHeading, stagger } from "@/components/sections";
import { TalentMatch } from "@/components/talent-match";
import { SocialIcon } from "@/components/social-icon";
import hiringSuccess from "@/public/images/hiring-success.jpg";
import recruitment from "@/public/images/recruitment.jpg";
import teamCollaboration from "@/public/images/team-collaboration.jpg";
import teamPresentation from "@/public/images/team-presentation.jpg";
import cms from "@/content/recruitment.json";

export const metadata: Metadata = cms.recruitment.metadata;

const features = [
  {
    icon: Users,
    title: cms.recruitment.features.i0_title,
    text: cms.recruitment.features.i0_text,
  },
  {
    icon: Network,
    title: cms.recruitment.features.i1_title,
    text: cms.recruitment.features.i1_text,
  },
  {
    icon: Timer,
    title: cms.recruitment.features.i2_title,
    text: cms.recruitment.features.i2_text,
  },
  {
    icon: Award,
    title: cms.recruitment.features.i3_title,
    text: cms.recruitment.features.i3_text,
  },
];

function LinkedInIcon(props: { className?: string }) {
  return <SocialIcon network="linkedin" className={props.className} />;
}

const reasons = [
  {
    icon: ClipboardCheck,
    title: cms.recruitment.reasons.i0_title,
    text: cms.recruitment.reasons.i0_text,
  },
  {
    icon: Search,
    title: cms.recruitment.reasons.i1_title,
    text: cms.recruitment.reasons.i1_text,
  },
  {
    icon: LinkedInIcon,
    title: cms.recruitment.reasons.i2_title,
    text: cms.recruitment.reasons.i2_text,
  },
  {
    icon: Briefcase,
    title: cms.recruitment.reasons.i3_title,
    text: cms.recruitment.reasons.i3_text,
  },
];

// The recruitment page has its own warm palette; it overrides the brand colours for the whole page.
const palette = {
  "--color-brand": "#4f46e5",
  "--color-brand-strong": "#4338ca",
  "--color-brand-light": "#818cf8",
  "--color-accent": "#ec4899",
} as CSSProperties;

// Who we hire for, from the page copy, for the ticker.
const hiringFor = [
  "Technical roles",
  "Non-technical roles",
  "Executive positions",
  "Startups",
  "SMEs",
  "Large enterprises",
];

const initials = ["AK", "RS", "PM", "NV", "SJ", "DK", "LT", "MR", "VP", "KS"];

export default function RecruitmentPage() {
  return (
    <div className="rec" style={palette}>
      <LightHero
        title={cms.recruitment.RecruitmentPage.title01_recruitment_company_in_bangalore}
        eyebrow={cms.recruitment.RecruitmentPage.eyebrow02_recruitment}
        tagline={cms.recruitment.RecruitmentPage.tagline03_helping_businesses_hire_skilled}
        crumbs={["Recruitment"]}
        secondary={{ label: cms.recruitment.RecruitmentPage.label04_how_we_help, href: "#what-we-do" }}
        media={
          <div className="relative mx-auto max-w-xl pb-10 lg:max-w-none">
            <MediaFrame
              src={hiringSuccess}
              alt={cms.recruitment.RecruitmentPage.alt05_recruitment_company_in_bangalore}
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 90vw"
              className="ml-auto aspect-[4/5] w-[88%] sm:aspect-[5/4] lg:aspect-[4/5]"
              position="object-[40%_center]"
              parallax
            />
            <MediaFrame
              src={recruitment}
              alt={cms.recruitment.RecruitmentPage.alt06_recruitment_company_in_bangalore}
              sizes="(min-width: 1024px) 220px, 38vw"
              className="absolute bottom-0 left-0 aspect-[4/5] w-[38%] shadow-[0_40px_80px_-40px_rgb(11_30_57/0.6)] ring-8 ring-paper"
            />
            {/* Illustrative hiring progress, playing through on a loop (globals.css, .rec-*). */}
            <div aria-hidden="true" className="rec-progress">
              <p className="rec-progress-head">
                <span className="rec-live" />{cms.recruitment.RecruitmentPage.text07_hiring_progress}</p>
              {["Candidates sourced", "Shortlisted", "Interview scheduled", "Offer accepted"].map((step, i) => (
                <p key={step} className={`rec-progress-row decor-step-${i + 1}`}>
                  <CheckCircle2 className="size-4 shrink-0" strokeWidth={2.25} />
                  {step}
                </p>
              ))}
            </div>
            <div aria-hidden="true">
              {initials.slice(0, 3).map((name, i) => (
                <span key={name} className={`rec-avatar rec-avatar-${i}`}>
                  {name}
                </span>
              ))}
            </div>
            <div className="glass-light float absolute top-8 left-0 rounded-2xl px-5 py-4 sm:-left-4">
              <p className="text-eyebrow text-brand">{cms.recruitment.RecruitmentPage.text08_all_levels_of_talent}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5 text-xs font-medium">
                {["Technical", "Non-technical", "Executive"].map((level) => (
                  <li key={level} className="rounded-full bg-paper-2 px-3 py-1.5">
                    {level}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <section className="section-y">
        <div className="shell grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              align="left"
              eyebrow={cms.recruitment.RecruitmentPage.eyebrow09_recruitment_services}
              title={cms.recruitment.RecruitmentPage.title10_we_offer_a_unique}
            />
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="text-lead reveal text-muted" style={stagger(1)}>{cms.recruitment.RecruitmentPage.text11_cloute_technologies_is_a}</p>
            <Link href="/contact" className="btn btn-dark btn-wide reveal mt-9" style={stagger(2)}>{cms.recruitment.RecruitmentPage.text12_get_started}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Who we hire for, drifting past. */}
      <div className="rec-ticker border-y border-line py-5">
        <Marquee
          label={cms.recruitment.RecruitmentPage.label13_who_we_hire_for}
          itemClassName="px-3"
          duration={30}
          items={hiringFor.map((item) => (
            <span key={item} className="rec-ticker-item">
              <span aria-hidden="true" className="rec-ticker-star">
                ✦
              </span>
              {item}
            </span>
          ))}
        />
      </div>

      {/* What we do: four columns joined by a rule that draws across as it scrolls in. */}
      <section id="what-we-do" className="section-y bg-paper">
        <div className="shell">
          <SectionHeading eyebrow={cms.recruitment.RecruitmentPage.eyebrow14_what_we_do} title={cms.recruitment.RecruitmentPage.title15_a_recruitment_partner_built} />
          <div className="relative mt-14 lg:mt-20">
            <span
              aria-hidden="true"
              className="draw-x absolute inset-x-0 top-0 hidden h-px bg-[linear-gradient(90deg,var(--color-brand),var(--color-accent))] lg:block"
            />
            <span aria-hidden="true" className="rec-runner hidden lg:block" />
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {features.map((feature, i) => (
                <li
                  key={feature.title}
                  className="rec-card group reveal lift relative rounded-2xl p-7 lg:mx-2 lg:mt-10 lg:p-7"
                  style={stagger(i)}
                >
                  <span
                    aria-hidden="true"
                    className="rec-pin absolute -top-10 left-7 hidden size-3 -translate-y-1/2 rounded-full bg-brand ring-4 ring-paper lg:block"
                  />
                  <p className="text-index text-gradient">{String(i + 1).padStart(2, "0")}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <IconBadge icon={feature.icon} />
                    <h3 className="text-card-title">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{feature.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Hiring pipeline: a board whose columns narrow from sourcing to onboarding. */}
      <section className="on-dark section-y relative isolate overflow-clip bg-[#0f0b24] text-white">
        <div aria-hidden="true" className="aurora" />
        <div className="shell">
          <SectionHeading
            dark
            eyebrow={cms.recruitment.RecruitmentPage.eyebrow16_our_hiring_process}
            title={cms.recruitment.RecruitmentPage.title17_from_sourcing_to_onboarding}
            text={cms.recruitment.RecruitmentPage.text18_from_sourcing_and_screening}
          />
          <div className="mt-14 lg:mt-16">
            <TalentMatch
              candidates={cms.recruitment.board.candidates}
              labels={{
                live: cms.recruitment.board.live,
                sample: cms.recruitment.board.sample,
                brief: cms.recruitment.board.brief,
                role: cms.recruitment.board.role,
                need: cms.recruitment.board.need,
                scanning: cms.recruitment.board.scanning,
                match: cms.recruitment.board.match,
                shortlist: cms.recruitment.board.shortlist,
                interview: cms.recruitment.board.interview,
                offer: cms.recruitment.board.offer,
                joined: cms.recruitment.board.joined,
              }}
            />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow={cms.recruitment.RecruitmentPage.eyebrow20_why_choose_us}
              title={cms.recruitment.RecruitmentPage.title21_why_choose_our_recruitment}
            />
            <ul className="mt-8 grid gap-4">
              {reasons.map((reason, i) => (
                <li key={reason.title} className="rec-reason card-premium group reveal lift" style={stagger(i)}>
                  <IconBadge icon={reason.icon} />
                  <div>
                    <h3 className="text-card-title">{reason.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{reason.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative sm:pb-28">
            <MediaFrame
              src={teamCollaboration}
              alt={cms.recruitment.RecruitmentPage.alt22_professional_hiring_solutions_and}
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3]"
              parallax
            />
            <p className="rec-linkedin">
              <span className="grid size-9 place-items-center rounded-xl bg-[#0a66c2] text-white">
                <LinkedInIcon className="size-4" />
              </span>{cms.recruitment.RecruitmentPage.text23_sourcing_talent_on_linkedin}</p>
            <div className="border-glow reveal relative mx-4 -mt-16 rounded-2xl bg-[linear-gradient(140deg,#1e1b4b,#0f0b24)] p-7 text-white shadow-[0_40px_80px_-40px_rgb(15_11_36/0.8)] sm:absolute sm:right-0 sm:bottom-0 sm:mx-0 sm:mt-0 sm:w-[80%] sm:p-8">
              <h3 className="text-subheading">{cms.recruitment.RecruitmentPage.text24_professional_hiring_solutions_for}</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/70">{cms.recruitment.RecruitmentPage.text25_our_recruitment_services_help}</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        id="contact"
        image={teamPresentation}
        title={cms.recruitment.RecruitmentPage.title26_looking_to_hire_top}
        text={cms.recruitment.RecruitmentPage.text27_talk_to_our_recruitment}
      />
    </div>
  );
}
