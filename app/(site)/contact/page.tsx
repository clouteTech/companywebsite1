import {
  ArrowUpRight,
  Cable,
  Clock,
  CloudUpload,
  DatabaseBackup,
  Headset,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Server,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { CopyEmail, OpenStatus } from "@/components/contact-extras";
import { ContactForm } from "@/components/contact-form";
import { CtaBand, IconBadge, MediaFrame, PageHero, SectionHeading, stagger } from "@/components/sections";
import { company } from "@/lib/site";
import clientMeeting from "@/public/images/client-meeting.jpg";
import officeInterior from "@/public/images/office-interior.jpg";
import teamCollaboration from "@/public/images/team-collaboration.jpg";
import cms from "@/content/contact.json";

export const metadata: Metadata = cms.contact.metadata;

// A calm blue-and-teal palette for the contact page (globals.css, .ct-*).
const palette = {
  "--color-brand": "#1e5fdb",
  "--color-brand-strong": "#184fbb",
  "--color-brand-light": "#4a85f0",
  "--color-accent": "#14b8a6",
} as CSSProperties;

const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;

// Services named in the copy below, shown as chips.
const highlights = [
  { icon: Server, label: cms.contact.highlights.i0_label },
  { icon: ShieldCheck, label: cms.contact.highlights.i1_label },
  { icon: Cable, label: cms.contact.highlights.i2_label },
  { icon: DatabaseBackup, label: cms.contact.highlights.i3_label },
  { icon: CloudUpload, label: cms.contact.highlights.i4_label },
  { icon: Headset, label: cms.contact.highlights.i5_label },
];

export default function ContactPage() {
  return (
    <div className="ct" style={palette}>
      <PageHero
        size="compact"
        title={cms.contact.ContactPage.title01_it_company_in_bangalore}
        tagline={cms.contact.ContactPage.tagline02_looking_for_reliable_it}
        crumbs={["Contact"]}
        image={officeInterior}
        imageAlt={cms.contact.ContactPage.imageAlt03_cloute_technologies_office_ready}
        primary={{ label: cms.contact.ContactPage.label04_send_a_message, href: "#contact-form" }}
        secondary={{ label: `Call ${company.phone}`, href: company.phoneHref }}
        tint="strong"
      />

      {/* Contact cards ride up over the bottom edge of the hero. */}
      <section aria-labelledby="get-in-touch" className="relative z-10 -mt-10 sm:-mt-14">
        <h2 id="get-in-touch" className="sr-only">{cms.contact.ContactPage.text05_get_in_touch_with}</h2>
        {/* Bento of ways to reach us, each with a real action. */}
        <div className="shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="ct-card ct-card-feature sm:col-span-2" style={stagger(0)}>
            <span aria-hidden="true" className="ct-icon ct-icon-light">
              <MapPin className="size-5" strokeWidth={1.75} />
            </span>
            <h3 className="text-card-title mt-6">{cms.contact.ContactPage.text06_visit_our_office}</h3>
            <address className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-white/80 not-italic">
              {company.address}
            </address>
            <a href={directions} target="_blank" rel="noopener noreferrer" className="ct-action ct-action-light mt-6">
              <Navigation className="size-4" aria-hidden="true" />{cms.contact.ContactPage.text07_get_directions}</a>
          </article>
          <article className="ct-card" style={stagger(1)}>
            <span aria-hidden="true" className="ct-icon">
              <Phone className="size-5" strokeWidth={1.75} />
            </span>
            <h3 className="text-card-title mt-6">{cms.contact.ContactPage.text08_call_us}</h3>
            <p className="mt-2 text-[0.9375rem] text-muted">{company.phone}</p>
            <a href={company.phoneHref} className="ct-action mt-5">{cms.contact.ContactPage.text09_call_now}<ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </article>
          <article className="ct-card" style={stagger(2)}>
            <span aria-hidden="true" className="ct-icon">
              <Mail className="size-5" strokeWidth={1.75} />
            </span>
            <h3 className="text-card-title mt-6">{cms.contact.ContactPage.text10_email_us}</h3>
            <p className="mt-2 text-[0.9375rem] break-all text-muted">{company.salesEmail}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(company.salesEmail)}`} target="_blank" rel="noopener noreferrer" className="ct-action">{cms.contact.ContactPage.text11_write}<ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              <CopyEmail email={company.salesEmail} />
            </div>
          </article>
          <article className="ct-card sm:col-span-2 lg:col-span-4 lg:flex lg:items-center lg:gap-8" style={stagger(3)}>
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="ct-icon">
                <Clock className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-card-title">{cms.contact.ContactPage.text12_business_hours}</h3>
                <OpenStatus />
              </div>
            </div>
            <ul className="ct-hours mt-5 lg:mt-0">
              <li>
                <span>{cms.contact.ContactPage.text13_monday_friday}</span>{cms.contact.ContactPage.text14_9_00_am_6}</li>
              <li>
                <span>{cms.contact.ContactPage.text15_saturday}</span>{cms.contact.ContactPage.text16_10_00_am_2}</li>
              <li>
                <span>{cms.contact.ContactPage.text17_sunday}</span>{cms.contact.ContactPage.text18_closed}</li>
            </ul>
            <p className="mt-4 text-sm text-muted lg:mt-0 lg:ml-auto">{cms.contact.ContactPage.text19_all_times_ist}</p>
          </article>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading align="left" eyebrow={cms.contact.ContactPage.eyebrow20_contact_info} title={cms.contact.ContactPage.title21_why_contact_our_it} />
            <div className="text-lead mt-6 space-y-5 text-muted">
              <p className="reveal">{cms.contact.ContactPage.text22_cloute_technologies_is_a}</p>
              <p className="reveal">{cms.contact.ContactPage.text23_we_provide_secure_scalable}</p>
              <p className="reveal">{cms.contact.ContactPage.text24_we_partner_with_globally}</p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {highlights.map((item, i) => (
                <li key={item.label} className="ct-chip reveal" style={stagger(i)}>
                  <item.icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <MediaFrame
            src={clientMeeting}
            alt={cms.contact.ContactPage.alt25_contact_cloute_technologies_it}
            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5]"
            parallax
          />
        </div>
      </section>

      <section id="contact-form" className="on-dark section-y relative isolate overflow-clip bg-midnight">
        <div aria-hidden="true" className="aurora" />
        <div className="shell">
          <div className="text-white">
            <SectionHeading
              dark
              eyebrow={cms.contact.ContactPage.eyebrow26_send_us_a_message}
              title={cms.contact.ContactPage.title27_we_re_here_to}
              text={cms.contact.ContactPage.text28_as_a_trusted_it}
            />
          </div>
          <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-12">
            <div className="on-light reveal border-glow relative rounded-[1.75rem] bg-white p-5 sm:p-8 lg:col-span-7 lg:p-10">
              <h3 className="text-subheading">{cms.contact.ContactPage.text29_tell_us_about_your}</h3>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
            <div className="flex flex-col gap-5 lg:col-span-5" style={stagger(1)}>
              {/* The skeleton shimmers underneath until the embedded map paints over it. */}
              <div className="reveal skeleton relative min-h-[22rem] flex-1 overflow-clip rounded-[1.75rem] ring-1 ring-white/10">
                <iframe
                  src={company.mapEmbed}
                  title={cms.contact.ContactPage.title30_cloute_technologies_location_map}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 size-full border-0"
                />
                <div className="ct-map-card">
                  <span aria-hidden="true" className="ct-map-pin">
                    <MapPin className="size-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-ink">{cms.contact.ContactPage.text31_cloute_technologies}</p>
                    <p className="truncate text-xs text-muted">{cms.contact.ContactPage.text32_hsr_layout_bengaluru}</p>
                  </div>
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="ct-action">{cms.contact.ContactPage.text33_directions}</a>
                </div>
              </div>
              <div className="reveal glass rounded-[1.75rem] p-6 text-white" style={stagger(2)}>
                <div className="flex items-start gap-4">
                  <IconBadge icon={Phone} dark />
                  <div className="text-[0.9375rem] leading-relaxed">
                    <p className="font-medium">{cms.contact.ContactPage.text34_talk_to_us_directly}</p>
                    <p className="mt-1 text-white/70">
                      <a href={company.phoneHref} className="link-underline hover:text-white">
                        {company.phone}
                      </a>
                      <span aria-hidden="true"> · </span>
                      <a href={`mailto:${company.supportEmail}`} className="link-underline break-all hover:text-white">
                        {company.supportEmail}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        image={teamCollaboration}
        title={cms.contact.ContactPage.title35_prefer_to_talk_directly}
        text={cms.contact.ContactPage.text36_call_our_team_for}
        secondary={{ label: cms.contact.ContactPage.label37_email_us, href: `mailto:${company.salesEmail}` }}
      />
    </div>
  );
}
