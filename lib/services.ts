// Service page content. Networking and software follow the SEO rewrites (Oct 2026); the others are carried over
// from the original HTML pages.
import type { StaticImageData } from "next/image";
import {
  Activity, AppWindow, ArrowLeftRight, BadgeCheck, BarChart3, Building2, Cable, ClipboardCheck, ClipboardList, CloudDownload, CloudUpload, Cloudy, CodeXml, Factory, FileCheck, Fingerprint, Gauge, GraduationCap, Headset, KeyRound, Laptop, Layers, LifeBuoy, LockKeyhole, Mail, MapPin, Monitor, MousePointerClick, Network, Package, Palette, PenLine, Plug, Radar, RefreshCw, Search, Server, ServerCog, Share2, ShieldCheck, ShoppingBag, SlidersHorizontal, Smartphone, Star, Stethoscope, Target, Truck, Video, Waypoints, Wifi, Workflow,
  type LucideIcon,
} from "lucide-react";

import cloudComputing from "@/public/images/cloud-computing.jpg";
import cybersecurity from "@/public/images/cybersecurity.png";
import developerDesk from "@/public/images/developer-desk.jpg";
import itSupport from "@/public/images/it-support.jpg";
import managedIt from "@/public/images/managed-it-services.jpg";
import teamPresentation from "@/public/images/team-presentation.jpg";
import serverRacks from "@/public/images/server-racks.jpg";

import { company } from "./site";
import type { Faq } from "./types";
import cms from "@/content/services.json";

export type ServiceSlug =
  | "networking-and-infrastructure"
  | "software-development-services"
  | "it-support-and-helpdesk"
  | "managed-it-services"
  | "cybersecurity-services"
  | "cloud-services"
  | "digital-marketing-services";

interface Action {
  label: string;
  href: string;
}

/** A titled item with an optional icon, used by the extra sections below. */
interface Item {
  icon?: LucideIcon;
  title: string;
  text: string;
}

interface Section {
  eyebrow: string;
  title: string;
  text?: string;
}

/*
 * Text fields may contain inline links written as [anchor](/path); components/service-sections.tsx renders them.
 * The optional fields carry the fuller SEO pages (networking, software): hero buttons, a problem list in the
 * overview, per-service detail, and the why / process / technologies / industries / local sections.
 */
export interface Service {
  slug: ServiceSlug;
  metaTitle: string;
  metaDescription: string;
  /** Open Graph overrides and the wording used in the page's Service structured data. */
  seo?: { ogTitle?: string; ogDescription?: string; serviceName?: string; serviceType?: string; schemaDescription?: string };
  title: string;
  tagline: string;
  /** Hero: a large supporting line above the tagline, and the two buttons. */
  hero?: { kicker?: string; primary?: Action; secondary?: Action };
  crumb: string;
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    /** Bulleted list after the paragraphs, then more paragraphs. */
    list?: string[];
    after?: string[];
    image: StaticImageData;
    imageAlt: string;
  };
  grid: {
    eyebrow: string;
    title: string;
    text: string;
    features: {
      icon: LucideIcon;
      title: string;
      text: string;
      /** The problem it solves, what it can include, the business benefit and an optional note. */
      problem?: string;
      includes?: string[];
      benefit?: string;
      note?: string;
    }[];
  };
  solutions?: Section & { items: Item[] };
  reasons?: Section & { items: Item[] };
  process?: Section & { steps: Item[] };
  technologies?: Section & { items: Item[] };
  industries?: Section & { items: Item[] };
  local?: Section & { paragraphs: string[] };
  faqs: Faq[];
  cta: { title: string; text: string; primary?: Action; secondary?: Action };
}

/*
 * The helpdesk, managed IT, cybersecurity and cloud pages follow the Oct 2026 SEO rewrites. Their copy is nested
 * under "seoPages" in content/services.json; only the images and icons are chosen here.
 */
interface PageItem { title: string; text: string }
interface PageSection { eyebrow: string; title: string; text?: string }
interface PageCopy {
  metaTitle: string;
  metaDescription: string;
  seo: NonNullable<Service["seo"]>;
  title: string;
  hero: { kicker: string; primary: string; secondary: string };
  tagline: string;
  crumb: string;
  intro: { eyebrow: string; title: string; paragraphs: string[]; list: string[]; after: string[]; imageAlt: string };
  grid: { eyebrow: string; title: string; text: string; features: { title: string; problem: string; text: string; includes: string[]; benefit: string; note?: string }[] };
  solutions: PageSection & { items: PageItem[] };
  reasons: PageSection & { items: PageItem[] };
  process: PageSection & { steps: PageItem[] };
  technologies: PageSection & { items: PageItem[] };
  industries: PageSection & { items: PageItem[] };
  local: PageSection & { paragraphs: string[] };
  faqs: Faq[];
  cta: { title: string; text: string; primary: string; secondary: string };
}

const seoPages = cms.services.seoPages as unknown as Record<string, PageCopy>;

function fromPage(
  slug: ServiceSlug,
  art: { image: StaticImageData; features: LucideIcon[]; industries: LucideIcon[] },
): Service {
  const p = seoPages[slug];
  const withPhone = (text: string) => text.replace("{{phone}}", company.phone);
  return {
    slug,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    seo: p.seo,
    title: p.title,
    hero: {
      kicker: p.hero.kicker,
      primary: { label: p.hero.primary, href: "/contact" },
      secondary: { label: p.hero.secondary, href: "mailto:sales@cloute.co.in" },
    },
    tagline: p.tagline,
    crumb: p.crumb,
    intro: { ...p.intro, image: art.image },
    grid: { ...p.grid, features: p.grid.features.map((f, i) => ({ ...f, icon: art.features[i] ?? Layers })) },
    solutions: p.solutions,
    reasons: p.reasons,
    process: p.process,
    technologies: p.technologies,
    industries: { ...p.industries, items: p.industries.items.map((item, i) => ({ ...item, icon: art.industries[i] ?? Layers })) },
    local: p.local,
    faqs: p.faqs.map((f) => ({ q: f.q, a: withPhone(f.a) })),
    cta: {
      title: p.cta.title,
      text: p.cta.text,
      primary: { label: p.cta.primary, href: "/contact" },
      secondary: { label: p.cta.secondary, href: "mailto:sales@cloute.co.in" },
    },
  };
}

const services: Service[] = [
  {
    slug: "networking-and-infrastructure",
    metaTitle: cms.services.services.i0_metaTitle,
    metaDescription: cms.services.services.i0_metaDescription,
    seo: {
      ogTitle: cms.services.services.i0_seo_ogTitle,
      ogDescription: cms.services.services.i0_seo_ogDescription,
      serviceName: cms.services.services.i0_seo_serviceName,
      serviceType: cms.services.services.i0_seo_serviceType,
      schemaDescription: cms.services.services.i0_seo_schemaDescription,
    },
    title: cms.services.services.i0_title,
    hero: {
      kicker: cms.services.services.i0_hero_kicker,
      primary: { label: cms.services.services.i0_hero_primary_label, href: "/contact" },
      secondary: { label: cms.services.services.i0_hero_secondary_label, href: "mailto:sales@cloute.co.in" },
    },
    tagline: cms.services.services.i0_tagline,
    crumb: cms.services.services.i0_crumb,
    intro: {
      eyebrow: cms.services.services.i0_intro_eyebrow,
      title: cms.services.services.i0_intro_title,
      paragraphs: [
      cms.services.services.i0_intro_paragraphs_i0,
      cms.services.services.i0_intro_paragraphs_i1,
      cms.services.services.i0_intro_paragraphs_i2,
      ],
      list: [
      cms.services.services.i0_intro_list_i0,
      cms.services.services.i0_intro_list_i1,
      cms.services.services.i0_intro_list_i2,
      cms.services.services.i0_intro_list_i3,
      cms.services.services.i0_intro_list_i4,
      cms.services.services.i0_intro_list_i5,
      cms.services.services.i0_intro_list_i6,
      ],
      after: [
      cms.services.services.i0_intro_after_i0,
      cms.services.services.i0_intro_after_i1,
      ],
      image: serverRacks,
      imageAlt: cms.services.services.i0_intro_imageAlt,
    },
    grid: {
      eyebrow: cms.services.services.i0_grid_eyebrow,
      title: cms.services.services.i0_grid_title,
      text: cms.services.services.i0_grid_text,
      features: [
      {
        icon: Network,
        title: cms.services.services.i0_grid_features_i0_title,
        problem: cms.services.services.i0_grid_features_i0_problem,
        text: cms.services.services.i0_grid_features_i0_text,
        includes: [
        cms.services.services.i0_grid_features_i0_includes_i0,
        cms.services.services.i0_grid_features_i0_includes_i1,
        cms.services.services.i0_grid_features_i0_includes_i2,
        cms.services.services.i0_grid_features_i0_includes_i3,
        ],
        benefit: cms.services.services.i0_grid_features_i0_benefit,
      },
      {
        icon: Waypoints,
        title: cms.services.services.i0_grid_features_i1_title,
        problem: cms.services.services.i0_grid_features_i1_problem,
        text: cms.services.services.i0_grid_features_i1_text,
        includes: [
        cms.services.services.i0_grid_features_i1_includes_i0,
        cms.services.services.i0_grid_features_i1_includes_i1,
        cms.services.services.i0_grid_features_i1_includes_i2,
        cms.services.services.i0_grid_features_i1_includes_i3,
        ],
        benefit: cms.services.services.i0_grid_features_i1_benefit,
      },
      {
        icon: Cable,
        title: cms.services.services.i0_grid_features_i2_title,
        problem: cms.services.services.i0_grid_features_i2_problem,
        text: cms.services.services.i0_grid_features_i2_text,
        includes: [
        cms.services.services.i0_grid_features_i2_includes_i0,
        cms.services.services.i0_grid_features_i2_includes_i1,
        cms.services.services.i0_grid_features_i2_includes_i2,
        cms.services.services.i0_grid_features_i2_includes_i3,
        ],
        benefit: cms.services.services.i0_grid_features_i2_benefit,
      },
      {
        icon: Wifi,
        title: cms.services.services.i0_grid_features_i3_title,
        problem: cms.services.services.i0_grid_features_i3_problem,
        text: cms.services.services.i0_grid_features_i3_text,
        includes: [
        cms.services.services.i0_grid_features_i3_includes_i0,
        cms.services.services.i0_grid_features_i3_includes_i1,
        cms.services.services.i0_grid_features_i3_includes_i2,
        cms.services.services.i0_grid_features_i3_includes_i3,
        ],
        benefit: cms.services.services.i0_grid_features_i3_benefit,
      },
      {
        icon: LockKeyhole,
        title: cms.services.services.i0_grid_features_i4_title,
        problem: cms.services.services.i0_grid_features_i4_problem,
        text: cms.services.services.i0_grid_features_i4_text,
        includes: [
        cms.services.services.i0_grid_features_i4_includes_i0,
        cms.services.services.i0_grid_features_i4_includes_i1,
        cms.services.services.i0_grid_features_i4_includes_i2,
        cms.services.services.i0_grid_features_i4_includes_i3,
        ],
        benefit: cms.services.services.i0_grid_features_i4_benefit,
        note: cms.services.services.i0_grid_features_i4_note,
      },
      {
        icon: Server,
        title: cms.services.services.i0_grid_features_i5_title,
        problem: cms.services.services.i0_grid_features_i5_problem,
        text: cms.services.services.i0_grid_features_i5_text,
        includes: [
        cms.services.services.i0_grid_features_i5_includes_i0,
        cms.services.services.i0_grid_features_i5_includes_i1,
        cms.services.services.i0_grid_features_i5_includes_i2,
        cms.services.services.i0_grid_features_i5_includes_i3,
        ],
        benefit: cms.services.services.i0_grid_features_i5_benefit,
      },
      {
        icon: CloudUpload,
        title: cms.services.services.i0_grid_features_i6_title,
        problem: cms.services.services.i0_grid_features_i6_problem,
        text: cms.services.services.i0_grid_features_i6_text,
        includes: [
        cms.services.services.i0_grid_features_i6_includes_i0,
        cms.services.services.i0_grid_features_i6_includes_i1,
        cms.services.services.i0_grid_features_i6_includes_i2,
        cms.services.services.i0_grid_features_i6_includes_i3,
        ],
        benefit: cms.services.services.i0_grid_features_i6_benefit,
      },
      {
        icon: Activity,
        title: cms.services.services.i0_grid_features_i7_title,
        problem: cms.services.services.i0_grid_features_i7_problem,
        text: cms.services.services.i0_grid_features_i7_text,
        includes: [
        cms.services.services.i0_grid_features_i7_includes_i0,
        cms.services.services.i0_grid_features_i7_includes_i1,
        cms.services.services.i0_grid_features_i7_includes_i2,
        cms.services.services.i0_grid_features_i7_includes_i3,
        ],
        benefit: cms.services.services.i0_grid_features_i7_benefit,
      },
      {
        icon: Video,
        title: cms.services.services.i0_grid_features_i8_title,
        problem: cms.services.services.i0_grid_features_i8_problem,
        text: cms.services.services.i0_grid_features_i8_text,
        includes: [
        cms.services.services.i0_grid_features_i8_includes_i0,
        cms.services.services.i0_grid_features_i8_includes_i1,
        cms.services.services.i0_grid_features_i8_includes_i2,
        ],
        benefit: cms.services.services.i0_grid_features_i8_benefit,
      },
      ],
    },
    reasons: {
      eyebrow: cms.services.services.i0_reasons_eyebrow,
      title: cms.services.services.i0_reasons_title,
      items: [
      { title: cms.services.services.i0_reasons_items_i0_title, text: cms.services.services.i0_reasons_items_i0_text },
      { title: cms.services.services.i0_reasons_items_i1_title, text: cms.services.services.i0_reasons_items_i1_text },
      { title: cms.services.services.i0_reasons_items_i2_title, text: cms.services.services.i0_reasons_items_i2_text },
      { title: cms.services.services.i0_reasons_items_i3_title, text: cms.services.services.i0_reasons_items_i3_text },
      { title: cms.services.services.i0_reasons_items_i4_title, text: cms.services.services.i0_reasons_items_i4_text },
      { title: cms.services.services.i0_reasons_items_i5_title, text: cms.services.services.i0_reasons_items_i5_text },
      ],
    },
    process: {
      eyebrow: cms.services.services.i0_process_eyebrow,
      title: cms.services.services.i0_process_title,
      steps: [
      { title: cms.services.services.i0_process_steps_i0_title, text: cms.services.services.i0_process_steps_i0_text },
      { title: cms.services.services.i0_process_steps_i1_title, text: cms.services.services.i0_process_steps_i1_text },
      { title: cms.services.services.i0_process_steps_i2_title, text: cms.services.services.i0_process_steps_i2_text },
      { title: cms.services.services.i0_process_steps_i3_title, text: cms.services.services.i0_process_steps_i3_text },
      { title: cms.services.services.i0_process_steps_i4_title, text: cms.services.services.i0_process_steps_i4_text },
      { title: cms.services.services.i0_process_steps_i5_title, text: cms.services.services.i0_process_steps_i5_text },
      ],
    },
    industries: {
      eyebrow: cms.services.services.i0_industries_eyebrow,
      title: cms.services.services.i0_industries_title,
      text: cms.services.services.i0_industries_text,
      items: [
      { icon: Building2, title: cms.services.services.i0_industries_items_i0_title, text: cms.services.services.i0_industries_items_i0_text },
      { icon: CodeXml, title: cms.services.services.i0_industries_items_i1_title, text: cms.services.services.i0_industries_items_i1_text },
      { icon: Factory, title: cms.services.services.i0_industries_items_i2_title, text: cms.services.services.i0_industries_items_i2_text },
      { icon: Stethoscope, title: cms.services.services.i0_industries_items_i3_title, text: cms.services.services.i0_industries_items_i3_text },
      { icon: GraduationCap, title: cms.services.services.i0_industries_items_i4_title, text: cms.services.services.i0_industries_items_i4_text },
      { icon: ShoppingBag, title: cms.services.services.i0_industries_items_i5_title, text: cms.services.services.i0_industries_items_i5_text },
      { icon: Truck, title: cms.services.services.i0_industries_items_i6_title, text: cms.services.services.i0_industries_items_i6_text },
      { icon: Layers, title: cms.services.services.i0_industries_items_i7_title, text: cms.services.services.i0_industries_items_i7_text },
      ],
    },
    local: {
      eyebrow: cms.services.services.i0_local_eyebrow,
      title: cms.services.services.i0_local_title,
      paragraphs: [
      cms.services.services.i0_local_paragraphs_i0,
      cms.services.services.i0_local_paragraphs_i1,
      cms.services.services.i0_local_paragraphs_i2,
      ],
    },
    faqs: [
    { q: cms.services.services.i0_faqs_i0_q, a: cms.services.services.i0_faqs_i0_a },
    { q: cms.services.services.i0_faqs_i1_q, a: cms.services.services.i0_faqs_i1_a },
    { q: cms.services.services.i0_faqs_i2_q, a: cms.services.services.i0_faqs_i2_a },
    { q: cms.services.services.i0_faqs_i3_q, a: cms.services.services.i0_faqs_i3_a },
    { q: cms.services.services.i0_faqs_i4_q, a: cms.services.services.i0_faqs_i4_a },
    { q: cms.services.services.i0_faqs_i5_q, a: cms.services.services.i0_faqs_i5_a },
    { q: cms.services.services.i0_faqs_i6_q, a: cms.services.services.i0_faqs_i6_a },
    { q: cms.services.services.i0_faqs_i7_q, a: cms.services.services.i0_faqs_i7_a },
    { q: cms.services.services.i0_faqs_i8_q, a: cms.services.services.i0_faqs_i8_a },
    { q: cms.services.services.i0_faqs_i9_q, a: `Email sales@cloute.co.in or use the contact page, and include your location, number of users, existing equipment and what you need to achieve. Our office is at 1125, 21st A-Cross, 14th Main, Sector 3, HSR Layout, Bengaluru 560102. Phone: ${company.phone}.` },
    ],
    cta: {
      title: cms.services.services.i0_cta_title,
      text: cms.services.services.i0_cta_text,
      primary: { label: cms.services.services.i0_cta_primary_label, href: "/contact" },
      secondary: { label: cms.services.services.i0_cta_secondary_label, href: "mailto:sales@cloute.co.in" },
    },
  },
  {
    slug: "software-development-services",
    metaTitle: cms.services.services.i1_metaTitle,
    metaDescription: cms.services.services.i1_metaDescription,
    seo: {
      ogTitle: cms.services.services.i1_seo_ogTitle,
      ogDescription: cms.services.services.i1_seo_ogDescription,
      serviceName: cms.services.services.i1_seo_serviceName,
      serviceType: cms.services.services.i1_seo_serviceType,
      schemaDescription: cms.services.services.i1_seo_schemaDescription,
    },
    title: cms.services.services.i1_title,
    hero: {
      primary: { label: cms.services.services.i1_hero_primary_label, href: "/contact" },
      secondary: { label: cms.services.services.i1_hero_secondary_label, href: "mailto:sales@cloute.co.in" },
    },
    tagline: cms.services.services.i1_tagline,
    crumb: cms.services.services.i1_crumb,
    intro: {
      eyebrow: cms.services.services.i1_intro_eyebrow,
      title: cms.services.services.i1_intro_title,
      paragraphs: [
      cms.services.services.i1_intro_paragraphs_i0,
      cms.services.services.i1_intro_paragraphs_i1,
      ],
      image: developerDesk,
      imageAlt: cms.services.services.i1_intro_imageAlt,
    },
    grid: {
      eyebrow: cms.services.services.i1_grid_eyebrow,
      title: cms.services.services.i1_grid_title,
      text: cms.services.services.i1_grid_text,
      features: [
      { icon: SlidersHorizontal, title: cms.services.services.i1_grid_features_i0_title, text: cms.services.services.i1_grid_features_i0_text },
      { icon: AppWindow, title: cms.services.services.i1_grid_features_i1_title, text: cms.services.services.i1_grid_features_i1_text },
      { icon: Smartphone, title: cms.services.services.i1_grid_features_i2_title, text: cms.services.services.i1_grid_features_i2_text },
      { icon: Building2, title: cms.services.services.i1_grid_features_i3_title, text: cms.services.services.i1_grid_features_i3_text },
      { icon: Layers, title: cms.services.services.i1_grid_features_i4_title, text: cms.services.services.i1_grid_features_i4_text },
      { icon: CloudUpload, title: cms.services.services.i1_grid_features_i5_title, text: cms.services.services.i1_grid_features_i5_text },
      { icon: Workflow, title: cms.services.services.i1_grid_features_i6_title, text: cms.services.services.i1_grid_features_i6_text },
      { icon: Plug, title: cms.services.services.i1_grid_features_i7_title, text: cms.services.services.i1_grid_features_i7_text },
      { icon: RefreshCw, title: cms.services.services.i1_grid_features_i8_title, text: cms.services.services.i1_grid_features_i8_text },
      ],
    },
    solutions: {
      eyebrow: cms.services.services.i1_solutions_eyebrow,
      title: cms.services.services.i1_solutions_title,
      text: cms.services.services.i1_solutions_text,
      items: [
      { icon: Workflow, title: cms.services.services.i1_solutions_items_i0_title, text: cms.services.services.i1_solutions_items_i0_text },
      { icon: ClipboardList, title: cms.services.services.i1_solutions_items_i1_title, text: cms.services.services.i1_solutions_items_i1_text },
      { icon: BarChart3, title: cms.services.services.i1_solutions_items_i2_title, text: cms.services.services.i1_solutions_items_i2_text },
      { icon: Headset, title: cms.services.services.i1_solutions_items_i3_title, text: cms.services.services.i1_solutions_items_i3_text },
      { icon: Package, title: cms.services.services.i1_solutions_items_i4_title, text: cms.services.services.i1_solutions_items_i4_text },
      { icon: Plug, title: cms.services.services.i1_solutions_items_i5_title, text: cms.services.services.i1_solutions_items_i5_text },
      ],
    },
    process: {
      eyebrow: cms.services.services.i1_process_eyebrow,
      title: cms.services.services.i1_process_title,
      text: cms.services.services.i1_process_text,
      steps: [
      { title: cms.services.services.i1_process_steps_i0_title, text: cms.services.services.i1_process_steps_i0_text },
      { title: cms.services.services.i1_process_steps_i1_title, text: cms.services.services.i1_process_steps_i1_text },
      { title: cms.services.services.i1_process_steps_i2_title, text: cms.services.services.i1_process_steps_i2_text },
      { title: cms.services.services.i1_process_steps_i3_title, text: cms.services.services.i1_process_steps_i3_text },
      { title: cms.services.services.i1_process_steps_i4_title, text: cms.services.services.i1_process_steps_i4_text },
      { title: cms.services.services.i1_process_steps_i5_title, text: cms.services.services.i1_process_steps_i5_text },
      ],
    },
    technologies: {
      eyebrow: cms.services.services.i1_technologies_eyebrow,
      title: cms.services.services.i1_technologies_title,
      text: cms.services.services.i1_technologies_text,
      items: [
      { icon: Monitor, title: cms.services.services.i1_technologies_items_i0_title, text: cms.services.services.i1_technologies_items_i0_text },
      { icon: ServerCog, title: cms.services.services.i1_technologies_items_i1_title, text: cms.services.services.i1_technologies_items_i1_text },
      { icon: Layers, title: cms.services.services.i1_technologies_items_i2_title, text: cms.services.services.i1_technologies_items_i2_text },
      { icon: CloudUpload, title: cms.services.services.i1_technologies_items_i3_title, text: cms.services.services.i1_technologies_items_i3_text },
      { icon: Plug, title: cms.services.services.i1_technologies_items_i4_title, text: cms.services.services.i1_technologies_items_i4_text },
      { icon: ClipboardCheck, title: cms.services.services.i1_technologies_items_i5_title, text: cms.services.services.i1_technologies_items_i5_text },
      ],
    },
    reasons: {
      eyebrow: cms.services.services.i1_reasons_eyebrow,
      title: cms.services.services.i1_reasons_title,
      items: [
      { title: cms.services.services.i1_reasons_items_i0_title, text: cms.services.services.i1_reasons_items_i0_text },
      { title: cms.services.services.i1_reasons_items_i1_title, text: cms.services.services.i1_reasons_items_i1_text },
      { title: cms.services.services.i1_reasons_items_i2_title, text: cms.services.services.i1_reasons_items_i2_text },
      { title: cms.services.services.i1_reasons_items_i3_title, text: cms.services.services.i1_reasons_items_i3_text },
      ],
    },
    industries: {
      eyebrow: cms.services.services.i1_industries_eyebrow,
      title: cms.services.services.i1_industries_title,
      text: cms.services.services.i1_industries_text,
      items: [
      { icon: Factory, title: cms.services.services.i1_industries_items_i0_title, text: cms.services.services.i1_industries_items_i0_text },
      { icon: Stethoscope, title: cms.services.services.i1_industries_items_i1_title, text: cms.services.services.i1_industries_items_i1_text },
      { icon: ShoppingBag, title: cms.services.services.i1_industries_items_i2_title, text: cms.services.services.i1_industries_items_i2_text },
      { icon: GraduationCap, title: cms.services.services.i1_industries_items_i3_title, text: cms.services.services.i1_industries_items_i3_text },
      { icon: Truck, title: cms.services.services.i1_industries_items_i4_title, text: cms.services.services.i1_industries_items_i4_text },
      { icon: Headset, title: cms.services.services.i1_industries_items_i5_title, text: cms.services.services.i1_industries_items_i5_text },
      ],
    },
    local: {
      eyebrow: cms.services.services.i1_local_eyebrow,
      title: cms.services.services.i1_local_title,
      paragraphs: [
      cms.services.services.i1_local_paragraphs_i0,
      cms.services.services.i1_local_paragraphs_i1,
      ],
    },
    faqs: [
    { q: cms.services.services.i1_faqs_i0_q, a: cms.services.services.i1_faqs_i0_a },
    { q: cms.services.services.i1_faqs_i1_q, a: cms.services.services.i1_faqs_i1_a },
    { q: cms.services.services.i1_faqs_i2_q, a: cms.services.services.i1_faqs_i2_a },
    { q: cms.services.services.i1_faqs_i3_q, a: cms.services.services.i1_faqs_i3_a },
    { q: cms.services.services.i1_faqs_i4_q, a: cms.services.services.i1_faqs_i4_a },
    { q: cms.services.services.i1_faqs_i5_q, a: cms.services.services.i1_faqs_i5_a },
    { q: cms.services.services.i1_faqs_i6_q, a: cms.services.services.i1_faqs_i6_a },
    { q: cms.services.services.i1_faqs_i7_q, a: cms.services.services.i1_faqs_i7_a },
    { q: cms.services.services.i1_faqs_i8_q, a: cms.services.services.i1_faqs_i8_a },
    { q: cms.services.services.i1_faqs_i9_q, a: `Visit the contact page at cloute.co.in/contact, email sales@cloute.co.in, or call ${company.phone}. Share a short description of the business problem, application type, and any existing systems or deadlines.` },
    ],
    cta: {
      title: cms.services.services.i1_cta_title,
      text: cms.services.services.i1_cta_text,
      primary: { label: cms.services.services.i1_cta_primary_label, href: "/contact" },
    },
  },
  fromPage("it-support-and-helpdesk", {
    image: itSupport,
    features: [Headset, ArrowLeftRight, MapPin, Laptop, Package, AppWindow, Wifi, Activity, Search, CloudDownload, ClipboardList, KeyRound],
    industries: [CodeXml, Building2, Factory, Stethoscope, ShoppingBag, GraduationCap, Truck],
  }),
  fromPage("managed-it-services", {
    image: managedIt,
    features: [Network, Activity, CloudDownload, LockKeyhole, Cloudy, Waypoints, AppWindow, Target],
    industries: [CodeXml, Building2, Factory, Stethoscope, ShoppingBag, GraduationCap, Truck, Layers],
  }),
  fromPage("cybersecurity-services", {
    image: cybersecurity,
    features: [ClipboardCheck, LifeBuoy, Radar, Waypoints, ServerCog, GraduationCap, Laptop, KeyRound, Fingerprint, FileCheck, BadgeCheck],
    industries: [CodeXml, Building2, Factory, Stethoscope, BadgeCheck, ShoppingBag, GraduationCap, Truck],
  }),
  fromPage("cloud-services", {
    image: cloudComputing,
    features: [CloudUpload, ServerCog, ShieldCheck, CloudDownload, Layers, Server, CodeXml, Share2, AppWindow],
    industries: [CodeXml, Building2, Factory, Stethoscope, BadgeCheck, ShoppingBag, GraduationCap, Truck, Star],
  }),
  {
    slug: "digital-marketing-services",
    metaTitle: cms.services.services.i6_metaTitle,
    metaDescription: cms.services.services.i6_metaDescription,
    title: cms.services.services.i6_title,
    tagline: cms.services.services.i6_tagline,
    crumb: cms.services.services.i6_crumb,
    intro: {
      eyebrow: cms.services.services.i6_intro_eyebrow,
      title: cms.services.services.i6_intro_title,
      paragraphs: [
      cms.services.services.i6_intro_paragraphs_i0,
      cms.services.services.i6_intro_paragraphs_i1,
      cms.services.services.i6_intro_paragraphs_i2,
      ],
      image: teamPresentation,
      imageAlt: cms.services.services.i6_intro_imageAlt,
    },
    grid: {
      eyebrow: cms.services.services.i6_grid_eyebrow,
      title: cms.services.services.i6_grid_title,
      text: cms.services.services.i6_grid_text,
      features: [
      { icon: Search, title: cms.services.services.i6_grid_features_i0_title, text: cms.services.services.i6_grid_features_i0_text },
      { icon: MousePointerClick, title: cms.services.services.i6_grid_features_i1_title, text: cms.services.services.i6_grid_features_i1_text },
      { icon: Share2, title: cms.services.services.i6_grid_features_i2_title, text: cms.services.services.i6_grid_features_i2_text },
      { icon: MapPin, title: cms.services.services.i6_grid_features_i3_title, text: cms.services.services.i6_grid_features_i3_text },
      { icon: PenLine, title: cms.services.services.i6_grid_features_i4_title, text: cms.services.services.i6_grid_features_i4_text },
      { icon: Mail, title: cms.services.services.i6_grid_features_i5_title, text: cms.services.services.i6_grid_features_i5_text },
      { icon: Target, title: cms.services.services.i6_grid_features_i6_title, text: cms.services.services.i6_grid_features_i6_text },
      { icon: Gauge, title: cms.services.services.i6_grid_features_i7_title, text: cms.services.services.i6_grid_features_i7_text },
      { icon: Palette, title: cms.services.services.i6_grid_features_i8_title, text: cms.services.services.i6_grid_features_i8_text },
      { icon: Star, title: cms.services.services.i6_grid_features_i9_title, text: cms.services.services.i6_grid_features_i9_text },
      { icon: BarChart3, title: cms.services.services.i6_grid_features_i10_title, text: cms.services.services.i6_grid_features_i10_text },
      ],
    },
    faqs: [
    { q: cms.services.services.i6_faqs_i0_q, a: cms.services.services.i6_faqs_i0_a },
    { q: cms.services.services.i6_faqs_i1_q, a: cms.services.services.i6_faqs_i1_a },
    { q: cms.services.services.i6_faqs_i2_q, a: cms.services.services.i6_faqs_i2_a },
    { q: cms.services.services.i6_faqs_i3_q, a: cms.services.services.i6_faqs_i3_a },
    { q: cms.services.services.i6_faqs_i4_q, a: cms.services.services.i6_faqs_i4_a },
    { q: cms.services.services.i6_faqs_i5_q, a: cms.services.services.i6_faqs_i5_a },
    { q: cms.services.services.i6_faqs_i6_q, a: cms.services.services.i6_faqs_i6_a },
    { q: cms.services.services.i6_faqs_i7_q, a: cms.services.services.i6_faqs_i7_a },
    { q: cms.services.services.i6_faqs_i8_q, a: cms.services.services.i6_faqs_i8_a },
    { q: cms.services.services.i6_faqs_i9_q, a: cms.services.services.i6_faqs_i9_a },
    ],
    cta: { title: cms.services.services.i6_cta_title, text: cms.services.services.i6_cta_text },
  },
];

export function getService(slug: ServiceSlug): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}
