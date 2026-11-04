import {
  Award,
  Clock,
  Eye,
  CloudUpload,
  Code,
  FolderKanban,
  Globe,
  HeartHandshake,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  Smile,
  Target,
  Waypoints,
} from "lucide-react";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { RotatingImage } from "@/components/rotating-image";
import { withVariants } from "@/lib/image-variants";

import {
  CtaBand,
  IconBadge,
  LightHero,
  Marquee,
  MediaFrame,
  SectionHeading,
  StatGrid,
  cardClass,
  stagger,
} from "@/components/sections";
import { ClientsSection } from "@/components/clients-section";
import { CubeGallery } from "@/components/cube-gallery";
import { CountUp } from "@/components/count-up";
import { milestones, values } from "@/lib/company";
import { pyramidImages } from "@/lib/pyramid-images";
import { getService, type ServiceSlug } from "@/lib/services";
import { company, serviceLinks } from "@/lib/site";
import recruitmentCms from "@/content/recruitment.json";
import companyImage from "@/public/images/company.jpg";
import anand from "@/public/images/leaders/anand-pattanshettar.png";
import govindraj from "@/public/images/leaders/govindraj-krishnamurthy.png";
import nagarajan from "@/public/images/leaders/nagarajan-srinivasan.png";
import navin from "@/public/images/leaders/navin-kawal.png";
import premkumar from "@/public/images/leaders/premkumar-gunasekaran.png";
import sampathkumaran from "@/public/images/leaders/sampathkumaran.png";
import suresh from "@/public/images/leaders/suresh-a-shan.png";
import mission from "@/public/images/mission.jpg";
import officeInterior from "@/public/images/office-interior.jpg";
import skyline from "@/public/images/skyline.jpg";
import teamCollaboration from "@/public/images/team-collaboration-wide.jpg";
import vision from "@/public/images/vision.jpg";
import cms from "@/content/about.json";

export const metadata: Metadata = cms.aboutUs.metadata;

const purpose = [
  {
    title: cms.aboutUs.purpose.i0_title,
    icon: Eye,
    image: vision,
    alt: cms.aboutUs.purpose.i0_alt,
    text: cms.aboutUs.purpose.i0_text,
  },
  {
    title: cms.aboutUs.purpose.i1_title,
    icon: Target,
    image: mission,
    alt: cms.aboutUs.purpose.i1_alt,
    text: cms.aboutUs.purpose.i1_text,
  },
];

const offerings = [
  {
    icon: Waypoints,
    title: cms.aboutUs.offerings.i0_title,
    text: cms.aboutUs.offerings.i0_text,
  },
  {
    icon: Code,
    title: cms.aboutUs.offerings.i1_title,
    text: cms.aboutUs.offerings.i1_text,
  },
  {
    icon: CloudUpload,
    title: cms.aboutUs.offerings.i2_title,
    text: cms.aboutUs.offerings.i2_text,
  },
  {
    icon: Settings,
    title: cms.aboutUs.offerings.i3_title,
    text: cms.aboutUs.offerings.i3_text,
  },
  {
    icon: LockKeyhole,
    title: cms.aboutUs.offerings.i4_title,
    text: cms.aboutUs.offerings.i4_text,
  },
];

const achievements = [
  { value: "1000+", label: cms.aboutUs.achievements.i0_label, icon: Globe },
  { value: "500+", label: cms.aboutUs.achievements.i1_label, icon: Smile },
  { value: "95%", label: cms.aboutUs.achievements.i2_label, icon: HeartHandshake },
  { value: "100+", label: cms.aboutUs.achievements.i3_label, icon: ShieldCheck },
];

const achievementDetails = [
  {
    icon: FolderKanban,
    title: cms.aboutUs.achievementDetails.i0_title,
    text: cms.aboutUs.achievementDetails.i0_text,
  },
  {
    icon: Smile,
    title: cms.aboutUs.achievementDetails.i1_title,
    text: cms.aboutUs.achievementDetails.i1_text,
  },
  {
    icon: ShieldCheck,
    title: cms.aboutUs.achievementDetails.i2_title,
    text: cms.aboutUs.achievementDetails.i2_text,
  },
  {
    icon: Award,
    title: cms.aboutUs.achievementDetails.i3_title,
    text: cms.aboutUs.achievementDetails.i3_text,
  },
];

const leaders = [
  {
    name: cms.aboutUs.leaders.i0_name,
    role: cms.aboutUs.leaders.i0_role,
    image: govindraj,
    bio: [
      cms.aboutUs.leaders.i0_bio_i0,
      cms.aboutUs.leaders.i0_bio_i1,
    ],
  },
  {
    name: cms.aboutUs.leaders.i1_name,
    role: cms.aboutUs.leaders.i1_role,
    image: suresh,
    bio: [
      cms.aboutUs.leaders.i1_bio_i0,
      cms.aboutUs.leaders.i1_bio_i1,
    ],
  },
  {
    name: cms.aboutUs.leaders.i2_name,
    role: cms.aboutUs.leaders.i2_role,
    image: sampathkumaran,
    bio: [
      cms.aboutUs.leaders.i2_bio_i0,
      cms.aboutUs.leaders.i2_bio_i1,
    ],
  },
  {
    name: cms.aboutUs.leaders.i3_name,
    role: cms.aboutUs.leaders.i3_role,
    image: navin,
    bio: [
      cms.aboutUs.leaders.i3_bio_i0,
      cms.aboutUs.leaders.i3_bio_i1,
    ],
  },
  {
    name: cms.aboutUs.leaders.i4_name,
    role: cms.aboutUs.leaders.i4_role,
    image: nagarajan,
    bio: [
      cms.aboutUs.leaders.i4_bio_i0,
      cms.aboutUs.leaders.i4_bio_i1,
    ],
  },
  {
    name: cms.aboutUs.leaders.i5_name,
    role: cms.aboutUs.leaders.i5_role,
    image: premkumar,
    bio: [
      cms.aboutUs.leaders.i5_bio_i0,
      cms.aboutUs.leaders.i5_bio_i1,
    ],
  },
  {
    name: cms.aboutUs.leaders.i6_name,
    role: cms.aboutUs.leaders.i6_role,
    image: anand,
    bio: [
      cms.aboutUs.leaders.i6_bio_i0,
      cms.aboutUs.leaders.i6_bio_i1,
    ],
  },
];

// The About page wears a navy-and-gold palette of its own (globals.css, .abt-*).
const palette = {
  "--color-brand": "#1d4ed8",
  "--color-brand-strong": "#1e40af",
  "--color-brand-light": "#3b82f6",
  "--color-accent": "#f59e0b",
} as CSSProperties;

// What we specialise in, from the page copy, for the ticker under the hero.
const specialities = [
  "Cybersecurity",
  "Digital Transformation",
  "IT Infrastructure",
  "Software Development",
  "Cloud Services",
  "Managed IT",
];

/** The one-line description shown beside the cube for a service page. */
function serviceText(href: string) {
  if (href === "/recruitment") return recruitmentCms.recruitment.RecruitmentPage.tagline03_helping_businesses_hire_skilled;
  return getService(href.slice(1) as ServiceSlug).tagline;
}

export default function AboutPage() {
  const [featured, ...team] = leaders;

  return (
    <div className="abt" style={palette}>
      <LightHero
        layout="stacked"
        title={cms.aboutUs.AboutPage.title01_about_us}
        eyebrow={cms.aboutUs.AboutPage.eyebrow02_cloute_technologies_pvt_ltd}
        tagline={cms.aboutUs.AboutPage.tagline03_it_solutions_company_in}
        crumbs={["About Us"]}
        secondary={{ label: cms.aboutUs.AboutPage.label04_our_leadership, href: "#leadership" }}
        media={
          <div className="relative grid grid-cols-2 items-start gap-4 sm:gap-5 lg:grid-cols-12">
            <p className="abt-badge abt-badge-a">
              <span aria-hidden="true" className="abt-badge-icon">
                <Award className="size-4" strokeWidth={2} />
              </span>{cms.aboutUs.AboutPage.text05_founded_by_it_veterans}</p>
            <p className="abt-badge abt-badge-b">
              <span aria-hidden="true" className="abt-badge-icon">
                <MapPin className="size-4" strokeWidth={2} />
              </span>{cms.aboutUs.AboutPage.text06_hsr_layout_bengaluru}</p>
            <MediaFrame
              src={skyline}
              alt={cms.aboutUs.AboutPage.alt07_cloute_technologies_building_future}
              sizes="(min-width: 1024px) 520px, 50vw"
              className="aspect-[4/5] lg:col-span-5 lg:aspect-[5/4]"
              parallax
            />
            <MediaFrame
              src={teamCollaboration}
              alt={cms.aboutUs.AboutPage.alt08_cloute_technologies_team_collaborati}
              sizes="(min-width: 1024px) 420px, 50vw"
              className="mt-12 aspect-[4/5] lg:col-span-4 lg:mt-20 lg:aspect-[4/3]"
              parallax
            />
            <MediaFrame
              src={officeInterior}
              alt={cms.aboutUs.AboutPage.alt09_cloute_technologies_office_in}
              sizes="(min-width: 1024px) 320px, 100vw"
              className="col-span-2 aspect-[16/9] lg:col-span-3 lg:mt-8 lg:aspect-[3/4]"
              parallax
            />
          </div>
        }
      />

      {/* What we specialise in, drifting past. */}
      <div className="abt-ticker py-5">
        <Marquee
          label={cms.aboutUs.AboutPage.label10_what_we_specialise_in}
          itemClassName="px-4"
          duration={32}
          items={specialities.map((item) => (
            <span key={item} className="abt-ticker-item">
              <span aria-hidden="true" className="abt-ticker-star">
                ✦
              </span>
              {item}
            </span>
          ))}
        />
      </div>

      {/* Intro */}
      <section className="section-y">
        <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading align="left" eyebrow={cms.aboutUs.AboutPage.eyebrow11_who_we_are} title={cms.aboutUs.AboutPage.title12_it_solutions_company_in} />
            <p className="text-lead reveal mt-6 text-muted" style={stagger(2)}>{cms.aboutUs.AboutPage.text13_cloute_technologies_pvt_ltd}</p>
            <dl className="reveal mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8" style={stagger(3)}>
              {achievements.slice(0, 2).map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="mt-2 text-sm text-muted">{stat.label}</dt>
                  <dd className="text-stat text-gradient order-first">
                    <CountUp value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <MediaFrame
              src={companyImage}
              alt={cms.aboutUs.AboutPage.alt14_cloute_technologies_company_overview}
              sizes="(min-width: 1024px) 500px, (min-width: 640px) 28rem, 100vw"
              className="aspect-[4/5] w-full"
              parallax
            />
            {/* A seal turning slowly over the photo's corner. */}
            <svg aria-hidden="true" viewBox="0 0 120 120" className="abt-seal">
              <defs>
                <path id="abt-seal-path" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <circle cx="60" cy="60" r="58" className="abt-seal-bg" />
              <text className="abt-seal-text">
                <textPath href="#abt-seal-path">{cms.aboutUs.AboutPage.text15_cloute_technologies_it_solutions}</textPath>
              </text>
              <circle cx="60" cy="60" r="20" className="abt-seal-core" />
            </svg>
          </div>
        </div>

        {/* A cube showing every service, turning by itself and draggable. */}
        <div className="overflow-x-clip">
        <div className="shell mt-16 sm:mt-20">
          <CubeGallery
            items={serviceLinks.map((service) => ({
              image: pyramidImages[service.href] ?? service.image,
              label: service.label,
              href: service.href,
              text: serviceText(service.href),
            }))}
            labels={{
              hint: cms.aboutUs.cube.hint,
              previous: cms.aboutUs.cube.previous,
              next: cms.aboutUs.cube.next,
              play: cms.aboutUs.cube.play,
              pause: cms.aboutUs.cube.pause,
              explore: cms.aboutUs.cube.explore,
              service: cms.aboutUs.cube.service,
            }}
          />
        </div>
        </div>
      </section>

      {/* Company overview */}
      <section className="section-y bg-paper">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow={cms.aboutUs.AboutPage.eyebrow16_company_overview}
              title={cms.aboutUs.AboutPage.title17_founded_by_it_veterans}
            />
            <div className="text-lead mt-6 space-y-5 text-muted">
              <p className="reveal">{cms.aboutUs.AboutPage.text18_cloute_technologies_founded_by}</p>
              <p className="reveal">{cms.aboutUs.AboutPage.text19_we_understand_that_each}</p>
            </div>
          </div>
          {/* Timeline: the connecting line draws itself as the steps scroll past. */}
          <ol className="relative self-center">
            <span
              aria-hidden="true"
              className="draw-y absolute top-6 bottom-6 left-[1.6875rem] w-px bg-[linear-gradient(to_bottom,var(--color-brand),var(--color-accent))]"
            />
            {milestones.map((milestone, i) => (
              <li key={milestone.title} className="group reveal relative flex gap-6 pb-8 last:pb-0">
                <span className="abt-node relative grid size-14 shrink-0 place-items-center rounded-full">
                  <milestone.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="abt-milestone card-premium lift flex-1">
                  <span aria-hidden="true" className="abt-milestone-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-xs font-semibold tracking-[0.16em] text-brand uppercase tabular-nums">{cms.aboutUs.AboutPage.text20_step}{String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-subheading mt-1.5">{milestone.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{milestone.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Vision & Mission — copy laid over full-bleed imagery */}
      <section className="section-y">
        <div className="shell grid gap-5 md:grid-cols-2">
          {purpose.map((item, i) => (
            <article
              key={item.title}
              className="abt-purpose group reveal on-dark relative isolate flex min-h-[30rem] flex-col justify-end overflow-clip rounded-[1.75rem] bg-navy p-7 text-white sm:min-h-[34rem] sm:p-10"
              style={stagger(i)}
            >
              <RotatingImage
                images={withVariants(item.image)}
                alt={item.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                className="-z-20 object-cover transition-transform duration-[1400ms] ease-(--ease-premium) group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(7_20_39/0.95)_20%,rgb(7_20_39/0.35)_70%,rgb(7_20_39/0.15))]"
              />
              <span aria-hidden="true" className="abt-purpose-icon">
                <item.icon className="size-6" strokeWidth={1.75} />
              </span>
              <p className="text-eyebrow mt-6 text-accent">{cms.aboutUs.AboutPage.text21_0}{i + 1}</p>
              <h3 className="text-heading mt-3">{item.title}</h3>
              <p className="mt-4 max-w-lg leading-relaxed text-white/80">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Core values */}
      <section className="section-y bg-paper">
        <div className="shell">
          <SectionHeading
            eyebrow={cms.aboutUs.AboutPage.eyebrow22_core_values}
            title={cms.aboutUs.AboutPage.title23_the_principles_that_guide}
            text={cms.aboutUs.AboutPage.text24_at_cloute_technologies_our}
          />
          {/* Panels that widen on hover (desktop); stacked cards on smaller screens. */}
          <ul className="abt-values mt-14 lg:mt-16">
            {values.map((value, i) => (
              <li key={value.title} className="abt-value group reveal" style={stagger(i)}>
                <span aria-hidden="true" className="abt-value-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="abt-value-icon">
                  <value.icon className="size-6" strokeWidth={1.75} />
                </span>
                <h3 className="text-card-title mt-auto pt-10">{value.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/75">{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Products & services */}
      <section className="section-y">
        <div className="shell">
          <SectionHeading
            eyebrow={cms.aboutUs.AboutPage.eyebrow25_what_we_offer}
            title={cms.aboutUs.AboutPage.title26_our_products_services}
            text={cms.aboutUs.AboutPage.text27_at_cloute_technologies_we}
          />
          <div className="reveal mt-14 grid gap-px overflow-clip rounded-2xl bg-line ring-1 ring-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
            {offerings.map((item, i) => (
              <div
                key={item.title}
                // Three across, then two wider cards; the odd last card spans both columns on tablets.
                className={`abt-offer group relative isolate overflow-clip bg-white p-7 sm:p-8 ${
                  i < 3 ? "lg:col-span-2" : "lg:col-span-3"
                } ${i === offerings.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <IconBadge icon={item.icon} />
                <h3 className="text-card-title mt-6">{item.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="on-dark section-y relative isolate overflow-clip bg-midnight text-white">
        <div aria-hidden="true" className="aurora" />
        <div className="shell">
          <SectionHeading
            dark
            eyebrow={cms.aboutUs.AboutPage.eyebrow28_key_achievements_milestones}
            title={cms.aboutUs.AboutPage.title29_a_growing_legacy_in}
            text={cms.aboutUs.AboutPage.text30_since_our_inception_cloute}
          />
          <div className="mt-14 lg:mt-20">
            <StatGrid stats={achievements} />
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {achievementDetails.map((item, i) => (
              <article
                key={item.title}
                className="card-premium-dark group reveal spotlight spotlight-dark rounded-2xl bg-white/[0.05] p-7 ring-1 ring-white/10 backdrop-blur-sm"
                style={stagger(i)}
              >
                <IconBadge icon={item.icon} dark />
                <h3 className="text-card-title mt-6">{item.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClientsSection />

      {/* Leadership — the CEO first, then the wider team */}
      <section id="leadership" className="section-y bg-paper">
        <div className="shell">
          <SectionHeading
            eyebrow={cms.aboutUs.AboutPage.eyebrow31_about_our_leadership}
            title={cms.aboutUs.AboutPage.title32_visionary_leaders_shaping_our}
            text={cms.aboutUs.AboutPage.text33_the_leadership_team_at}
          />

          <article className="reveal border-glow relative mt-14 grid overflow-clip rounded-[1.75rem] bg-white ring-1 ring-line lg:mt-16 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <div className="abt-portrait relative isolate grid place-items-center bg-[radial-gradient(80%_80%_at_50%_30%,rgb(29_78_216/0.18),transparent_70%),var(--color-paper-2)] p-10">
              <span aria-hidden="true" className="abt-portrait-ring" />
              <span aria-hidden="true" className="abt-portrait-ring abt-portrait-ring-b" />
              <Image
                src={featured.image}
                alt={`${featured.name} - ${featured.role}`}
                placeholder="blur"
                sizes="14rem"
                className="size-48 rounded-full object-contain drop-shadow-[0_24px_30px_rgb(11_30_57/0.25)] sm:size-56"
              />
            </div>
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-eyebrow text-brand">{featured.role}</p>
              <h3 className="text-heading mt-3">{featured.name}</h3>
              <div className="text-lead mt-6 space-y-4 text-muted">
                {featured.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {team.map((leader, i) => (
              <article
                key={leader.name}
                className={`flex flex-col gap-6 sm:flex-row sm:items-start ${cardClass}`}
                style={stagger(i % 2)}
              >
                <span className="abt-avatar relative grid size-28 shrink-0 place-items-center rounded-full p-[3px] transition-transform duration-500 ease-(--ease-premium) group-hover:scale-105 sm:size-32">
                  <Image
                    src={leader.image}
                    alt={`${leader.name} - ${leader.role}`}
                    placeholder="blur"
                    sizes="8rem"
                    className="size-full rounded-full bg-paper object-contain"
                  />
                </span>
                <div>
                  <h3 className="text-subheading">{leader.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-brand">{leader.role}</p>
                  <div className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-muted">
                    {leader.bio.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact information */}
      <section id="contact" className="section-y">
        <div className="shell">
          <SectionHeading
            eyebrow={cms.aboutUs.AboutPage.eyebrow34_get_in_touch}
            title={cms.aboutUs.AboutPage.title35_contact_information}
            text={cms.aboutUs.AboutPage.text36_we_are_always_eager}
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            <article className={cardClass} style={stagger(0)}>
              <IconBadge icon={Phone} />
              <h3 className="text-card-title mt-6">{cms.aboutUs.AboutPage.text37_phone}</h3>
              <p className="mt-2 text-[0.9375rem] text-muted">
                <a href={company.phoneHref} className="transition-colors hover:text-brand">
                  {company.phone}
                </a>
              </p>
              <p className="mt-1 text-[0.9375rem] text-muted">{cms.aboutUs.AboutPage.text38_24_7_emergency}{company.phone}</p>
            </article>
            <article className={cardClass} style={stagger(1)}>
              <IconBadge icon={Mail} />
              <h3 className="text-card-title mt-6">{cms.aboutUs.AboutPage.text39_email}</h3>
              <p className="mt-2 text-[0.9375rem] break-all text-muted">
                <a href={`mailto:${company.salesEmail}`} className="transition-colors hover:text-brand">
                  {company.salesEmail}
                </a>
              </p>
            </article>
            <article className={cardClass} style={stagger(2)}>
              <IconBadge icon={MapPin} />
              <h3 className="text-card-title mt-6">{cms.aboutUs.AboutPage.text40_address}</h3>
              <address className="mt-2 text-[0.9375rem] leading-relaxed text-muted not-italic">
                {company.address}
              </address>
            </article>
            <article className={cardClass} style={stagger(3)}>
              <IconBadge icon={Clock} />
              <h3 className="text-card-title mt-6">{cms.aboutUs.AboutPage.text41_business_hours}</h3>
              <ul className="mt-2 space-y-1 text-[0.9375rem] text-muted">
                <li>{cms.aboutUs.AboutPage.text42_monday_friday_9_00}</li>
                <li>{cms.aboutUs.AboutPage.text43_saturday_10_00_am}</li>
                <li>{cms.aboutUs.AboutPage.text44_sunday_closed}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <CtaBand
        image={companyImage}
        title={cms.aboutUs.AboutPage.title45_ready_to_work_with}
        text={cms.aboutUs.AboutPage.text46_let_s_discuss_how}
      />
    </div>
  );
}
