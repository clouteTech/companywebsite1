import {
  AppWindow,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Briefcase,
  Building2,
  ChevronDown,
  ClipboardList,
  Code,
  Cpu,
  Factory,
  FileCheck,
  Gauge,
  Globe,
  Handshake,
  Headset,
  KeyRound,
  Laptop,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
  Plug,
  Printer,
  Rocket,
  Router,
  Search,
  Server,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { RotatingImage } from "@/components/rotating-image";
import { withVariants } from "@/lib/image-variants";
import Link from "next/link";

import {
  CtaBand,
  FaqSection,
  HeroActions,
  IconBadge,
  Marquee,
  MediaFrame,
  SectionHeading,
  SplitText,
  TypeText,
  stagger,
} from "@/components/sections";
import { BackgroundVideo } from "@/components/background-video";
import { brandLogos, platformBadges } from "@/components/brand-logos";
import { CallMenu } from "@/components/call-menu";
import { ClientsSection } from "@/components/clients-section";
import { GoogleReviews } from "@/components/google-reviews";
import { LaptopShowcase } from "@/components/laptop-showcase";
import { NumFill } from "@/components/num-fill";
import { BuildArt } from "@/components/build-art";
import { ChaosBoard } from "@/components/chaos-board";
import { Seen } from "@/components/seen";
import { HeroFx } from "@/components/hero-fx";
import { ServiceCube } from "@/components/service-cube";
import { ServiceSlider } from "@/components/service-slider";
import { homeFaqs } from "@/lib/faqs";
import { company, serviceLinks } from "@/lib/site";
import blueprint from "@/public/images/blueprint.jpg";
import clientMeeting from "@/public/images/client-meeting.jpg";
import cloudComputing from "@/public/images/cloud-computing.jpg";
import dataCenter from "@/public/images/data-center.jpg";
import globalNetwork from "@/public/images/global-network.jpg";
import itHardware from "@/public/images/it-hardware.jpg";
import itSupport from "@/public/images/it-support.jpg";
import heroPoster from "@/public/images/it-team-poster.jpg";
import laptopGlow from "@/public/images/laptop-glow.jpg";
import recruitment from "@/public/images/recruitment.jpg";
import teamCollaboration from "@/public/images/team-collaboration-wide.jpg";
import teamPresentation from "@/public/images/team-presentation.jpg";
import teamWorkshop from "@/public/images/team-workshop.jpg";
import workstation from "@/public/images/workstation.jpg";
import cms from "@/content/homepage.json";

export const metadata: Metadata = cms.site.metadata;

const servicePage = (href: string) => {
  const link = serviceLinks.find((service) => service.href === href);
  if (!link) throw new Error(`No service page at ${href}`);
  return link;
};

// The nine services, in the order they are presented. The seven with their own page reuse its menu icon and photo.
const services = [
  {
    ...servicePage("/software-development-services"),
    title: cms.site.services.title01_software_development,
    text: cms.site.services.text02_custom_software_built_around,
    cta: cms.site.services.cta03_discuss_your_software_project,
    alt: cms.site.services.alt04_application_source_code_on,
  },
  {
    href: "/products",
    icon: Laptop,
    image: itHardware,
    title: cms.site.services.title05_it_hardware_supply,
    text: cms.site.services.text06_business_grade_laptops_desktops,
    cta: cms.site.services.cta07_request_a_hardware_quote,
    alt: cms.site.services.alt08_business_laptops_and_it,
  },
  {
    ...servicePage("/networking-and-infrastructure"),
    title: cms.site.services.title09_networking_it_infrastructure,
    text: cms.site.services.text10_a_dependable_network_is,
    cta: cms.site.services.cta11_plan_your_network,
    alt: cms.site.services.alt12_structured_network_cabling_in,
  },
  {
    ...servicePage("/it-support-and-helpdesk"),
    title: cms.site.services.title13_it_support_helpdesk,
    text: cms.site.services.text14_when_a_system_fails,
    cta: cms.site.services.cta15_get_it_support,
    alt: cms.site.services.alt16_it_helpdesk_engineer_supporting,
    position: "object-[70%_center]",
  },
  {
    ...servicePage("/managed-it-services"),
    title: cms.site.services.title17_managed_it_services,
    text: cms.site.services.text18_hand_over_day_to,
    cta: cms.site.services.cta19_explore_managed_it,
    alt: cms.site.services.alt20_it_engineers_monitoring_managed,
    position: "object-[60%_center]",
  },
  {
    ...servicePage("/cybersecurity-services"),
    title: cms.site.services.title21_cybersecurity_solutions,
    text: cms.site.services.text22_protect_data_devices_and,
    cta: cms.site.services.cta23_secure_your_business,
    alt: cms.site.services.alt24_illuminated_circuitry_representing_c,
  },
  {
    ...servicePage("/cloud-services"),
    title: cms.site.services.title25_cloud_computing_solutions,
    text: cms.site.services.text26_move_to_the_cloud,
    cta: cms.site.services.cta27_talk_about_cloud,
    alt: cms.site.services.alt28_connected_cities_across_the,
  },
  {
    ...servicePage("/digital-marketing-services"),
    title: cms.site.services.title29_digital_marketing,
    text: cms.site.services.text30_help_more_customers_find,
    cta: cms.site.services.cta31_grow_your_business_online,
    alt: cms.site.services.alt32_marketing_analytics_dashboard_showin,
  },
  {
    href: "/recruitment",
    icon: Users,
    image: recruitment,
    title: cms.site.services.title33_it_staffing_recruitment,
    text: cms.site.services.text34_find_technical_talent_without,
    cta: cms.site.services.cta35_hire_it_talent,
    alt: cms.site.services.alt36_recruiter_interviewing_a_candidate,
  },
] as const satisfies {
  href: string;
  icon: unknown;
  image: unknown;
  title: string;
  text: string;
  cta: string;
  alt: string;
  position?: string;
}[];

/* Each hardware card gets its own accent (--tone in globals.css, .hw-card). */
const hardware = [
  {
    icon: Laptop,
    title: cms.site.hardware.i0_title,
    text: cms.site.hardware.i0_text,
  },
  {
    icon: Server,
    tone: "#1e5fdb",
    title: cms.site.hardware.i1_title,
    text: cms.site.hardware.i1_text,
  },
  {
    icon: Router,
    tone: "#0891b2",
    title: cms.site.hardware.i2_title,
    text: cms.site.hardware.i2_text,
  },
  {
    icon: Printer,
    tone: "#6d5dfc",
    title: cms.site.hardware.i3_title,
    text: cms.site.hardware.i3_text,
  },
  {
    icon: Cpu,
    tone: "#0d9488",
    title: cms.site.hardware.i4_title,
    text: cms.site.hardware.i4_text,
  },
  {
    icon: KeyRound,
    tone: "#0284c7",
    title: cms.site.hardware.i5_title,
    text: cms.site.hardware.i5_text,
  },
];

// Where each hardware icon floats around the section heading, in the same order as `hardware`.
const orbitSpots = [
  "top-[4%] left-[8%]",
  "top-[44%] left-[2%]",
  "bottom-[2%] left-[12%]",
  "top-[2%] right-[9%]",
  "top-[46%] right-[2%]",
  "bottom-[4%] right-[13%]",
];

const hardwareReasons = [
  { icon: Gauge, text: cms.site.hardwareReasons.i0_text },
  { icon: Plug, text: cms.site.hardwareReasons.i1_text },
  { icon: FileCheck, text: cms.site.hardwareReasons.i2_text },
  { icon: BadgeCheck, text: cms.site.hardwareReasons.i3_text },
  { icon: Wrench, text: cms.site.hardwareReasons.i4_text },
];

const hardwareBrands = ["HP", "Dell", "Lenovo", "Apple", "Cisco", "Poly", "Epson", "Canon"];

const softwareBuilds = [
  { icon: Code, label: cms.site.softwareBuilds.i0_label, text: cms.site.softwareBuilds.i0_text },
  { icon: AppWindow, label: cms.site.softwareBuilds.i1_label, text: cms.site.softwareBuilds.i1_text },
  { icon: Boxes, label: cms.site.softwareBuilds.i2_label, text: cms.site.softwareBuilds.i2_text },
  {
    icon: LayoutDashboard,
    label: cms.site.softwareBuilds.i3_label,
    text: cms.site.softwareBuilds.i3_text,
  },
  {
    icon: Workflow,
    label: cms.site.softwareBuilds.i4_label,
    text: cms.site.softwareBuilds.i4_text,
  },
];

const softwareProblems = cms.site.softwareProblems;

const reasons = [
  {
    icon: Boxes,
    title: cms.site.reasons.i0_title,
    text: cms.site.reasons.i0_text,
  },
  {
    icon: Target,
    title: cms.site.reasons.i1_title,
    text: cms.site.reasons.i1_text,
  },
  {
    icon: Wrench,
    title: cms.site.reasons.i2_title,
    text: cms.site.reasons.i2_text,
  },
  {
    icon: Headset,
    title: cms.site.reasons.i3_title,
    text: cms.site.reasons.i3_text,
  },
  {
    icon: TrendingUp,
    title: cms.site.reasons.i4_title,
    text: cms.site.reasons.i4_text,
  },
  {
    icon: Handshake,
    title: cms.site.reasons.i5_title,
    text: cms.site.reasons.i5_text,
  },
];

// Who we work with, on the dark band; each card glows in its own colour (--tone in globals.css, .ind-card).
const audiences = [
  {
    icon: Rocket,
    tone: "#f5b942",
    title: cms.site.audiences.i0_title,
    text: cms.site.audiences.i0_text,
  },
  {
    icon: Briefcase,
    tone: "#34d399",
    title: cms.site.audiences.i1_title,
    text: cms.site.audiences.i1_text,
  },
  {
    icon: Building2,
    tone: "#60a5fa",
    title: cms.site.audiences.i2_title,
    text: cms.site.audiences.i2_text,
  },
  {
    icon: Factory,
    tone: "#a78bfa",
    title: cms.site.audiences.i3_title,
    text: cms.site.audiences.i3_text,
  },
];

const steps = [
  {
    icon: Search,
    title: cms.site.steps.i0_title,
    text: cms.site.steps.i0_text,
  },
  {
    icon: ClipboardList,
    title: cms.site.steps.i1_title,
    text: cms.site.steps.i1_text,
  },
  {
    icon: Rocket,
    title: cms.site.steps.i2_title,
    text: cms.site.steps.i2_text,
  },
  {
    icon: LifeBuoy,
    title: cms.site.steps.i3_title,
    text: cms.site.steps.i3_text,
  },
];

const contactAddress = "1125, 21st A-Cross, 14th Main, Sector 3, HSR Layout, Bengaluru, Karnataka 560102";

export default function HomePage() {
  return (
    <>
      {/* Hero: scrolls away with the page. */}
      <section
        id="home"
        className="on-dark relative isolate z-0 flex min-h-svh flex-col overflow-clip bg-midnight text-center text-white"
      >
        <div className="absolute inset-0 -z-20">
          {/* The video's own first frame paints instantly; the video fades in over it once playing. */}
          <Image
            src={heroPoster}
            alt={cms.site.HomePage.alt01_cloute_technologies_it_team}
            fill
            preload
            quality={85}
            sizes="100vw"
            placeholder="blur"
            className="hero-media object-cover"
          />
          <BackgroundVideo
            // IT team at work, from Pexels (pexels.com/video/6804114), Pexels License.
            src="/videos/it-team-1366_720.mp4"
            largeSrc="/videos/it-team-2048_1080.mp4"
            mobileSrc="/videos/it-team-640_338.mp4"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(7_20_39/0.8)_0%,rgb(7_20_39/0.35)_32%,rgb(7_20_39/0.35)_55%,rgb(7_20_39/0.94)_100%)]"
        />
        <HeroFx />

        <div className="shell hero-fade flex flex-1 flex-col items-center pt-28 sm:pt-36 lg:pt-40">
          <h1 className="text-hero relative mt-6 max-w-5xl">
            <TypeText text={cms.site.HomePage.text02_best_it_software_and} highlight={["Software", "Hardware"]} flourish />
          </h1>
          <p
            className="hero-in mt-6 max-w-2xl text-[clamp(1.0625rem,1rem+0.4vw,1.25rem)] leading-snug font-medium text-white/90"
            style={stagger(4)}
          >{cms.site.HomePage.text03_one_partner_for_the}</p>
        </div>

        <div className="shell flex flex-col items-center gap-9 pt-16 pb-10 sm:pb-14 lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <p className="text-lead hero-in max-w-2xl text-justify hyphens-auto text-white/75 lg:max-w-xl" style={stagger(5)}>{cms.site.HomePage.text04_cloute_technologies_is_a}</p>
          <div className="hero-in flex w-full flex-col items-center gap-8 lg:w-auto lg:items-end" style={stagger(6)}>
            <HeroActions
              className="hero-ctas"
              primary={{ label: cms.site.HomePage.label05_get_a_quote, href: "/contact" }}
              secondary={{ label: cms.site.HomePage.label06_explore_our_solutions, href: "#services" }}
            />
            <a
              href="#about"
              aria-label={cms.site.HomePage.arialabel07_scroll_to_about_cloute}
              className="hidden size-10 place-items-center rounded-full text-white/70 ring-1 ring-white/20 transition-colors hover:text-white hover:ring-white/50 sm:grid"
            >
              <ChevronDown className="scroll-cue size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-white shadow-[0_-24px_60px_-12px_rgb(7_20_39/0.45)]">
        {/* About — layered collage beside the story */}
        <section id="about" className="section-y overflow-clip">
          <div className="shell grid gap-16 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div>
              <p className="text-eyebrow reveal flex items-center gap-3 text-brand">
                <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />{cms.site.HomePage.text08_about_cloute_technologies}</p>
              <h2 className="text-heading split-scroll mt-4">
                <SplitText text={cms.site.HomePage.text09_a_bangalore_it_solutions} />
              </h2>
              <div className="text-lead mt-6 space-y-5 text-muted">
                <p className="reveal">{cms.site.HomePage.text10_cloute_technologies_private_limited}</p>
                <p className="reveal">{cms.site.HomePage.text11_on_the_hardware_side}</p>
                <p className="reveal">{cms.site.HomePage.text12_having_these_capabilities_together}</p>
                <p className="reveal">{cms.site.HomePage.text13_our_approach_is_simple}</p>
              </div>
              <Link href="/about-us" className="btn btn-dark btn-wide reveal mt-9">{cms.site.HomePage.text14_learn_more_about_us}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="ab-collage relative mx-auto w-full max-w-xl pb-14 sm:pb-16 lg:sticky lg:top-28 lg:pb-20">
              {/* Backdrop: glow, dotted grid and a turning ring with a light circling it (styles: .ab-*). */}
              <span aria-hidden="true" className="ab-glow" />
              <span aria-hidden="true" className="ab-dots" />
              <span aria-hidden="true" className="ab-ring">
                <i />
              </span>
              <MediaFrame
                src={teamWorkshop}
                alt={cms.site.HomePage.alt15_cloute_technologies_team_planning}
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 80vw, 85vw"
                className="collage-main ml-auto aspect-[4/3] w-full sm:aspect-[4/5] sm:w-[85%]"
                parallax
              />
              <MediaFrame
                src={clientMeeting}
                alt={cms.site.HomePage.alt16_client_meeting_with_the}
                sizes="(min-width: 1024px) 260px, 45vw"
                className="collage-b absolute bottom-0 left-4 aspect-square w-[40%] shadow-[0_40px_80px_-40px_rgb(11_30_57/0.6)] ring-4 ring-white sm:left-0 sm:w-[48%] sm:ring-8"
              />
              <MediaFrame
                src={blueprint}
                alt={cms.site.HomePage.alt17_office_infrastructure_plan}
                sizes="(min-width: 1024px) 180px, 30vw"
                className="collage-a absolute top-10 left-[4%] hidden aspect-[3/4] w-[30%] shadow-[0_30px_60px_-30px_rgb(11_30_57/0.6)] ring-8 ring-white sm:block"
              />
              {/* Light sweeping across the main photo, and corner brackets drawn around it. */}
              <span aria-hidden="true" className="ab-shine" />
              <span aria-hidden="true" className="ab-corners">
                <i />
                <i />
                <i />
                <i />
              </span>
              {/* Floating glass badges summarising the copy beside them. */}
              <span aria-hidden="true" className="ab-badge ab-badge-top">
                <span className="ab-badge-swap">
                  <Laptop className="size-4" strokeWidth={2} />
                  <Code className="size-4" strokeWidth={2} />
                </span>{cms.site.HomePage.text18_hardware_software}</span>
              <span aria-hidden="true" className="ab-badge ab-badge-mid">
                <span className="ab-badge-pin">
                  <MapPin className="size-4" strokeWidth={2} />
                </span>{cms.site.HomePage.text19_hsr_layout_bengaluru}</span>
              <span aria-hidden="true" className="ab-badge ab-badge-bottom">
                <span className="ab-badge-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>{cms.site.HomePage.text20_one_accountable_partner}</span>
            </div>
          </div>
        </section>

        {/* Services — introduction, then one full-screen panel per service */}
        <section id="services" aria-labelledby="services-title">
          <div className="section-y overflow-clip bg-paper">
            {/* Collage on the left, introduction and service links on the right (stacked on phones). */}
            <div className="shell grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
              <div>
                <SectionHeading
                  id="services-title"
                  align="left"
                  eyebrow={cms.site.HomePage.eyebrow21_our_services}
                  title={cms.site.HomePage.title22_our_it_solutions_and}
                  text={cms.site.HomePage.text23_nine_connected_services_covering}
                />
                {/* A tidy 2-column grid of tiles on phones; wrapping pills from 640px. */}
                <ul className="reveal mt-10 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" style={stagger(3)}>
                  {services.map((service) => (
                    <li key={service.title}>
                      <Link
                        href={service.href}
                        className="flex h-full min-h-12 items-center gap-2.5 rounded-xl bg-white px-3 py-2 text-[0.8125rem] leading-snug font-medium ring-1 ring-line transition-[color,box-shadow] duration-300 hover:text-brand hover:ring-brand/40 sm:inline-flex sm:min-h-10 sm:rounded-full sm:px-4 sm:py-0 sm:text-sm"
                      >
                        <service.icon className="size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mx-auto w-full max-w-xl pb-14 sm:pb-16 lg:order-first lg:pb-20">
                <MediaFrame
                  src={workstation}
                  alt={cms.site.HomePage.alt24_developer_workstation_running_softwa}
                  position="object-[12%_50%]"
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 80vw, 85vw"
                  className="collage-main mr-auto aspect-[4/3] w-full sm:aspect-[4/5] sm:w-[85%]"
                  parallax
                />
                <MediaFrame
                  src={itSupport}
                  alt={cms.site.HomePage.alt25_it_support_engineer_assisting}
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="collage-b absolute right-4 bottom-0 aspect-square w-[40%] shadow-[0_40px_80px_-40px_rgb(11_30_57/0.6)] ring-4 ring-white sm:right-0 sm:w-[48%] sm:ring-8"
                />
                <MediaFrame
                  src={cloudComputing}
                  alt={cms.site.HomePage.alt26_cloud_computing_services_connecting}
                  sizes="(min-width: 1024px) 180px, 30vw"
                  className="collage-a absolute top-10 right-[4%] hidden aspect-[3/4] w-[30%] shadow-[0_30px_60px_-30px_rgb(11_30_57/0.6)] ring-8 ring-white sm:block"
                />
                <div className="glass-light float absolute bottom-4 left-4 rounded-2xl px-4 py-3 sm:bottom-6 sm:left-[-1rem] sm:px-5 sm:py-4 lg:bottom-10">
                  <p className="text-stat text-gradient text-[2rem] sm:text-[2.5rem]">{services.length}</p>
                  <p className="mt-1 text-xs font-medium text-muted sm:text-sm">{cms.site.HomePage.text27_connected_services}</p>
                </div>
              </div>
            </div>
          </div>

          {/* One full-screen slide per service, advancing on its own from left to right. */}
          <ServiceSlider
            labels={services.map((service) => service.title)}
            slides={services.map((service, i) => (
              <article key={service.title} className="relative isolate flex h-full flex-col overflow-clip text-center">
                <RotatingImage
                  images={withVariants(service.image)}
                  alt={service.alt}
                  fill
                  sizes="100vw"
                  quality={85}
                  placeholder="blur"
                  className={`slide-media -z-20 object-cover ${"position" in service ? service.position : "object-center"}`}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(7_20_39/0.82)_0%,rgb(7_20_39/0.4)_36%,rgb(7_20_39/0.35)_60%,rgb(7_20_39/0.9)_100%)]"
                />

                <div className="shell flex flex-1 flex-col items-center pt-24 sm:pt-32">
                  <p className="text-eyebrow slide-item text-accent">
                    <span className="sr-only">{cms.site.HomePage.text28_service}</span>
                    {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </p>
                  <h3 className="text-display mt-4 max-w-4xl">
                    <SplitText text={service.title} />
                  </h3>
                </div>

                <div className="shell flex flex-col items-center pt-8 pb-28 sm:pb-32">
                  <p className="text-lead slide-item max-w-3xl text-white/80" style={stagger(1)}>
                    {service.text}
                  </p>
                  <div className="slide-item mt-8 flex w-full justify-center" style={stagger(2)}>
                    <Link href={service.href} className="btn btn-primary">
                      {service.cta}
                      <ArrowRight className="btn-arrow size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          />
        </section>

        {/* Services in 3D: a turning "4D" cube with every service, and a list to jump to one. */}
        <section aria-labelledby="s3d-title" className="s3d-section on-dark section-y relative isolate overflow-clip text-white">
          <div className="shell">
            <SectionHeading
              id="s3d-title"
              dark
              eyebrow={cms.site.HomePage.eyebrow29_explore_in_3d}
              title={cms.site.HomePage.title30_spin_through_our_services}
              text={cms.site.HomePage.text31_watch_every_service_come}
            />
            <ServiceCube />
          </div>
        </section>

        {/* IT hardware — bento grid */}
        <section id="products" className="section-y relative z-10 bg-white">
          <div className="shell">
            <div className="relative">
              {/* Orbit rings and the hardware icons popping in and floating around the heading (wide screens). */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
                <span className="orbit-ring size-[44rem]" />
                <span className="orbit-ring orbit-ring-inner size-[32rem]" />
                {hardware.map((item, i) => (
                  <span
                    key={item.title}
                    className={`orbit-chip ${orbitSpots[i]}`}
                    style={{ ...stagger(i), "--tone": item.tone ?? "var(--color-accent)" } as CSSProperties}
                  >
                    <item.icon className="size-6" strokeWidth={1.6} />
                  </span>
                ))}
              </div>
              <SectionHeading
                eyebrow={cms.site.HomePage.eyebrow32_it_hardware}
                title={cms.site.HomePage.title33_it_hardware_suppliers_in}
                text={cms.site.HomePage.text34_source_business_hardware_and}
              />
            </div>
            <NumFill />
            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
              {hardware.map((item, i) =>
                i === 0 ? (
                  <li
                    key={item.title}
                    className="hw-feature border-glow group reveal on-dark relative isolate flex min-h-[36rem] flex-col sm:min-h-[32rem] lg:min-h-[22rem] justify-end overflow-clip rounded-[1.25rem] bg-midnight p-7 text-white sm:col-span-2 sm:p-9 lg:row-span-2"
                  >
                    <LaptopShowcase className="-z-20" />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(7_20_39/0.9)_4%,rgb(7_20_39/0.5)_18%,transparent_34%)]"
                    />
                    <span aria-hidden="true" className="hw-num hw-num-dark">{cms.site.HomePage.text35_01}</span>
                    <IconBadge icon={item.icon} />
                    <h3 className="text-subheading mt-6 max-w-md">{item.title}</h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-white/75">{item.text}</p>
                  </li>
                ) : (
                  <li
                    key={item.title}
                    className={`hw-card group reveal lift relative isolate flex flex-col overflow-clip rounded-[1.25rem] p-7 sm:p-8 ${
                      i === hardware.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                    }`}
                    style={{ ...stagger(i % 3), "--tone": item.tone } as CSSProperties}
                  >
                    <span aria-hidden="true" className="hw-fill" />
                    <span aria-hidden="true" className="hw-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <IconBadge icon={item.icon} />
                    <h3 className="text-card-title mt-6 pr-10">{item.title}</h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{item.text}</p>
                    <Link href="/products" className="hw-link mt-auto pt-6">{cms.site.HomePage.text36_explore}<span className="sr-only"> {item.title}</span>
                      <span className="hw-link-arrow" aria-hidden="true">
                        <ArrowRight className="size-4" />
                      </span>
                    </Link>
                    <item.icon className="card-watermark" strokeWidth={1.25} aria-hidden="true" />
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Brands & platforms: two rows drifting in opposite directions. */}
          <div className="mt-20 border-y border-line bg-paper pt-10 pb-4 lg:mt-24 lg:pt-14 lg:pb-8">
            <p className="text-eyebrow reveal flex items-center justify-center gap-3 text-brand">
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />{cms.site.HomePage.text37_brands_platforms}<span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
            </p>
            <Marquee
              label={cms.site.HomePage.label38_laptop_and_hardware_brands}
              className="mt-1"
              itemClassName="px-2 pt-8 pb-10 sm:px-3"
              items={brandLogos}
              duration={40}
            />
            <Marquee
              label={cms.site.HomePage.label39_platforms_we_work_with}
              className="-mt-8"
              itemClassName="px-2 pt-8 pb-10 sm:px-3"
              items={platformBadges}
              duration={34}
              reverse
            />
          </div>

          {/* Why buy hardware from us: reason cards beside the product photo, with the brands we supply floating over it. */}
          <div className="shell">
            <div className="mt-20 grid gap-14 lg:mt-24 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <h3 className="text-heading split-scroll">
                  <SplitText text={cms.site.HomePage.text40_why_businesses_buy_hardware} />
                </h3>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {hardwareReasons.map((reason, i) => (
                    <li
                      key={reason.text}
                      className={`card-premium fx-border group reveal lift flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-line ${
                        i === hardwareReasons.length - 1 ? "sm:col-span-2" : ""
                      }`}
                      style={stagger(i % 2)}
                    >
                      <IconBadge icon={reason.icon} />
                      <p className="pt-0.5 text-[0.9375rem] leading-relaxed font-medium text-ink">{reason.text}</p>
                    </li>
                  ))}
                </ul>
                <HeroActions
                  light
                  className="reveal mt-8"
                  primary={{ label: cms.site.HomePage.label41_request_a_quote, href: "/contact" }}
                  secondary={{ label: cms.site.HomePage.label42_view_all_products, href: "/products" }}
                />
              </div>
              <div className="relative pb-24 sm:pb-16">
                <div className="hw-showcase">
                  <MediaFrame
                    src={laptopGlow}
                    alt={cms.site.HomePage.alt43_business_laptop_supplied_by}
                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
                    className="aspect-[4/3] bg-abyss"
                    parallax
                  />
                </div>
                <div className="hw-why border-glow on-dark reveal absolute inset-x-4 bottom-0 rounded-2xl p-5 text-white sm:inset-x-auto sm:right-6 sm:w-80 lg:right-auto lg:-left-8">
                  <p className="text-eyebrow text-accent">{cms.site.HomePage.text44_brands_we_supply}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {hardwareBrands.map((brand, i) => (
                      <li
                        key={brand}
                        className="hw-why-item rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 ring-1 ring-white/15"
                        style={stagger(i)}
                      >
                        {brand}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom software — what we build beside the problems it solves */}
        <section id="software" className="section-y overflow-clip bg-paper">
          <div className="shell">
            <SectionHeading
              eyebrow={cms.site.HomePage.eyebrow45_software_development}
              title={cms.site.HomePage.title46_custom_software_development_company}
              text={cms.site.HomePage.text47_off_the_shelf_tools}
            />
            <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <h3 className="text-subheading reveal">{cms.site.HomePage.text48_what_we_build}</h3>
                <Seen />
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {softwareBuilds.map((item, i) => (
                    <li
                      key={item.label}
                      data-seen-target
                      className={`sc2-card group ${i === softwareBuilds.length - 1 ? "sm:col-span-2" : ""}`}
                    >
                      <div className="sc2-art">
                        <span aria-hidden="true" className="sc2-tag">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <BuildArt index={i} />
                      </div>
                      <div className="sc2-body">
                        <p className="text-card-title">{item.label}</p>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <ChaosBoard title={cms.site.HomePage.text49_business_problems_we_help} problems={softwareProblems} />
                  <HeroActions
                    light
                    className="reveal mt-8"
                    primary={{ label: cms.site.HomePage.label50_discuss_your_project, href: "/contact" }}
                    secondary={{ label: cms.site.HomePage.label51_talk_to_our_experts, href: company.phoneHref }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why choose us — headline and team photo beside cards with oversized watermark numbers */}
        <section className="section-y overflow-x-clip bg-white">
          <div className="shell grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <SectionHeading align="left" eyebrow={cms.site.HomePage.eyebrow52_why_choose_us} title={cms.site.HomePage.title53_why_businesses_choose_cloute} />
              <div className="why-photo relative isolate mt-10">
                <div className="hw-showcase">
                  <MediaFrame
                    src={teamCollaboration}
                    alt={cms.site.HomePage.alt54_cloute_technologies_team_collaborati}
                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
                    className="aspect-[4/3] shadow-[0_40px_80px_-40px_rgb(11_30_57/0.45)]"
                    parallax
                  />
                </div>
                <div className="why-chip why-chip-a glass-light">
                  <span className="relative grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--color-brand),var(--color-accent))] text-white">
                    <ShieldCheck className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    <span aria-hidden="true" className="why-live" />
                  </span>
                  <span className="text-sm font-semibold text-ink">{cms.site.HomePage.text55_one_accountable_partner}</span>
                </div>
              </div>
            </div>
            <ol className="grid gap-5">
              {reasons.map((reason, i) => (
                <li
                  key={reason.title}
                  className="why-card card-premium fx-border group lift relative isolate overflow-clip rounded-2xl bg-white p-7 sm:p-9"
                  style={stagger(i % 2)}
                >
                  <span aria-hidden="true" className="why-bar" />
                  <span aria-hidden="true" className="why-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-4">
                    <IconBadge icon={reason.icon} />
                    <h3 className="text-card-title text-[1.25rem] sm:text-[1.375rem]">{reason.title}</h3>
                  </div>
                  <p className="mt-4 max-w-[34rem] leading-relaxed text-muted">{reason.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Who we work with */}
        <section className="on-dark section-y relative isolate overflow-clip bg-abyss text-white">
          <Image
            src={globalNetwork}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            className="parallax -z-30 object-cover opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,var(--color-abyss),rgb(4_12_25/0.55)_40%,rgb(4_12_25/0.55)_60%,var(--color-abyss))]"
          />
          <div aria-hidden="true" className="aurora" />
          <div className="shell">
            <SectionHeading
              dark
              eyebrow={cms.site.HomePage.eyebrow56_who_we_serve}
              title={cms.site.HomePage.title57_it_solutions_for_startups}
              text={cms.site.HomePage.text58_technology_needs_change_with}
            />
            <ul className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4">
              {audiences.map((card, i) => (
                <li
                  key={card.title}
                  className="ind-card group relative isolate flex flex-col gap-5 overflow-clip rounded-2xl p-5 sm:p-6"
                  style={{ ...stagger(i), "--tone": card.tone } as CSSProperties}
                >
                  <span aria-hidden="true" className="ind-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="ind-icon">
                    <card.icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <div className="mt-auto">
                    <h3 className="ind-label">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed font-normal text-white/65">{card.text}</p>
                  </div>
                  <card.icon className="ind-mark" strokeWidth={1} aria-hidden="true" />
                </li>
              ))}
            </ul>
            <div className="reveal mt-12 flex justify-center">
              <Link href="/contact" className="btn btn-primary btn-wide">{cms.site.HomePage.text59_discuss_your_requirement}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* How we work — four steps on a timeline that fills as it is read */}
        <section className="section-y overflow-clip bg-white">
          <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <SectionHeading align="left" eyebrow={cms.site.HomePage.eyebrow60_our_process} title={cms.site.HomePage.title61_how_we_work_with} />
              <div className="hw-showcase mt-10">
                <MediaFrame
                  src={teamPresentation}
                  alt={cms.site.HomePage.alt62_cloute_technologies_team_presenting}
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
                  className="aspect-[4/3]"
                  parallax
                />
              </div>
            </div>
            <ol className="hw-steps relative">
              <span aria-hidden="true" className="hw-steps-line" />
              {steps.map((step) => (
                <li key={step.title} className="hw-step">
                  <span aria-hidden="true" className="hw-step-node">
                    <step.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-subheading reveal">{step.title}</h3>
                  <p className="text-lead reveal mt-3 text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ClientsSection variant="showcase" />

        {/* Customer reviews from Google */}
        <GoogleReviews />

        <FaqSection
          faqs={homeFaqs}
          tone="paper"
          name="faq-home"
          title={cms.site.HomePage.title63_frequently_asked_questions_about}
        />

        <CtaBand
          id="contact"
          image={dataCenter}
          title={cms.site.HomePage.title64_ready_to_upgrade_your}
          text={cms.site.HomePage.text65_tell_us_what_your}
          primary={{ label: cms.site.HomePage.label66_get_a_quote, href: "/contact" }}
          secondary={{ label: cms.site.HomePage.label67_talk_to_our_experts, href: company.phoneHref }}
        />

        {/* Contact details */}
        <section aria-label={cms.site.HomePage.arialabel68_contact_details} className="border-b border-line bg-paper py-12 sm:py-14">
          <div className="shell">
            <p className="text-card-title reveal">{cms.site.HomePage.text69_cloute_technologies_private_limited}</p>
            <address className="mt-6 grid gap-6 not-italic sm:grid-cols-2 lg:grid-cols-4">
              <ContactItem icon={MapPin} label={cms.site.HomePage.label70_address}>
                {contactAddress}
              </ContactItem>
              <ContactItem
                icon={Phone}
                label={cms.site.HomePage.label71_phone}
                callLabel={`Call Cloute Technologies on ${company.phone}`}
              >
                {company.phone}
              </ContactItem>
              <ContactItem icon={Mail} label={cms.site.HomePage.label72_email}>
                <a href={`mailto:${company.salesEmail}`} className="link-underline break-all hover:text-brand">
                  {company.salesEmail}
                </a>
              </ContactItem>
              <ContactItem icon={Globe} label={cms.site.HomePage.label73_website}>
                <a href="https://cloute.co.in/" className="link-underline hover:text-brand">{cms.site.HomePage.text74_https_cloute_co_in}</a>
              </ContactItem>
            </address>
          </div>
        </section>
      </div>
    </>
  );
}

function ContactItem({
  icon: Icon,
  label,
  callLabel,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  /** Makes the whole item, icon included, one button that asks: phone call or WhatsApp call. */
  callLabel?: string;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <span aria-hidden="true" className="contact-icon grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand ring-1 ring-line">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold tracking-wide text-muted uppercase">{label}</span>
        <span className="contact-value mt-1 block text-[0.9375rem] leading-relaxed text-ink">{children}</span>
      </span>
    </>
  );
  if (callLabel) {
    return (
      <CallMenu
        label={callLabel}
        className="contact-call reveal -m-2 flex items-start gap-4 self-start rounded-2xl p-2 pr-4 text-left"
      >
        {content}
      </CallMenu>
    );
  }
  return <div className="reveal flex items-start gap-4">{content}</div>;
}
