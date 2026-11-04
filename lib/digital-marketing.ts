// Extra content for the Digital Marketing page (components/marketing-sections.tsx). The page's overview,
// capabilities and FAQs live with the other services in lib/services.ts.
import {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  Factory,
  FileSearch,
  Gauge,
  GraduationCap,
  Hotel,
  Layers,
  LayoutTemplate,
  LineChart,
  Mail,
  MapPin,
  MonitorSmartphone,
  Rocket,
  Search,
  Settings2,
  Share2,
  ShoppingBag,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import copy from "@/content/services.json";

/** Channels scrolling in the ticker under the hero. */
export const channels = [
  "SEO / SEM",
  "Social Media",
  "Google Ads",
  "Email Campaigns",
  "Content Marketing",
  "Local SEO",
  "Lead Generation",
  "Analytics",
  "ROI Growth",
];

/** Short summary beside the reasons to choose us. */
export const highlights = copy.digitalMarketing.highlights;

export const reasons: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Users,
    title: copy.digitalMarketing.reasons.i0_title,
    text: copy.digitalMarketing.reasons.i0_text,
  },
  {
    icon: LineChart,
    title: copy.digitalMarketing.reasons.i1_title,
    text: copy.digitalMarketing.reasons.i1_text,
  },
  {
    icon: Layers,
    title: copy.digitalMarketing.reasons.i2_title,
    text: copy.digitalMarketing.reasons.i2_text,
  },
  {
    icon: BarChart3,
    title: copy.digitalMarketing.reasons.i3_title,
    text: copy.digitalMarketing.reasons.i3_text,
  },
  {
    icon: MonitorSmartphone,
    title: copy.digitalMarketing.reasons.i4_title,
    text: copy.digitalMarketing.reasons.i4_text,
  },
  {
    icon: TrendingUp,
    title: copy.digitalMarketing.reasons.i5_title,
    text: copy.digitalMarketing.reasons.i5_text,
  },
  {
    icon: MapPin,
    title: copy.digitalMarketing.reasons.i6_title,
    text: copy.digitalMarketing.reasons.i6_text,
  },
];

/** Typical time to see results, used to draw the bars in the "at a glance" table. Months; null = ongoing. */
export const glance: { service: string; bestFor: string; timeframe: string; from: number; to: number | null }[] = [
  { service: copy.digitalMarketing.glance.i0_service, bestFor: copy.digitalMarketing.glance.i0_bestFor, timeframe: copy.digitalMarketing.glance.i0_timeframe, from: 3, to: 6 },
  { service: copy.digitalMarketing.glance.i1_service, bestFor: copy.digitalMarketing.glance.i1_bestFor, timeframe: copy.digitalMarketing.glance.i1_timeframe, from: 0.25, to: 0.5 },
  { service: copy.digitalMarketing.glance.i2_service, bestFor: copy.digitalMarketing.glance.i2_bestFor, timeframe: copy.digitalMarketing.glance.i2_timeframe, from: 0, to: null },
  { service: copy.digitalMarketing.glance.i3_service, bestFor: copy.digitalMarketing.glance.i3_bestFor, timeframe: copy.digitalMarketing.glance.i3_timeframe, from: 2, to: 4 },
  { service: copy.digitalMarketing.glance.i4_service, bestFor: copy.digitalMarketing.glance.i4_bestFor, timeframe: copy.digitalMarketing.glance.i4_timeframe, from: 0.1, to: 0.25 },
  { service: copy.digitalMarketing.glance.i5_service, bestFor: copy.digitalMarketing.glance.i5_bestFor, timeframe: copy.digitalMarketing.glance.i5_timeframe, from: 0, to: null },
  { service: copy.digitalMarketing.glance.i6_service, bestFor: copy.digitalMarketing.glance.i6_bestFor, timeframe: copy.digitalMarketing.glance.i6_timeframe, from: 1, to: 2 },
];

export const platformGroups: { icon: LucideIcon; title: string; items: string[] }[] = [
  { icon: Search, title: copy.digitalMarketing.platformGroups.i0_title, items: ["Google Search", "Google Display Network", "Microsoft Bing Ads"] },
  { icon: Share2, title: copy.digitalMarketing.platformGroups.i1_title, items: ["Meta Ads Manager", "Instagram", "LinkedIn", "YouTube"] },
  { icon: FileSearch, title: copy.digitalMarketing.platformGroups.i2_title, items: ["Google Search Console", "SEMrush", "Ahrefs", "Screaming Frog"] },
  { icon: ChartNoAxesCombined, title: copy.digitalMarketing.platformGroups.i3_title, items: ["Google Analytics 4", "Looker Studio", "Meta Business Suite"] },
  { icon: Mail, title: copy.digitalMarketing.platformGroups.i4_title, items: ["Mailchimp", "HubSpot", "Klaviyo"] },
  { icon: LayoutTemplate, title: copy.digitalMarketing.platformGroups.i5_title, items: ["WordPress", "Shopify", "Webflow", "Custom websites"] },
];

export const industries: { icon: LucideIcon; label: string }[] = [
  { icon: Stethoscope, label: copy.digitalMarketing.industries.i0_label },
  { icon: Building2, label: copy.digitalMarketing.industries.i1_label },
  { icon: GraduationCap, label: copy.digitalMarketing.industries.i2_label },
  { icon: ShoppingBag, label: copy.digitalMarketing.industries.i3_label },
  { icon: Wallet, label: copy.digitalMarketing.industries.i4_label },
  { icon: Hotel, label: copy.digitalMarketing.industries.i5_label },
  { icon: Factory, label: copy.digitalMarketing.industries.i6_label },
  { icon: Rocket, label: copy.digitalMarketing.industries.i7_label },
  { icon: UtensilsCrossed, label: copy.digitalMarketing.industries.i8_label },
  { icon: BriefcaseBusiness, label: copy.digitalMarketing.industries.i9_label },
];

export const process: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FileSearch,
    title: copy.digitalMarketing.process.i0_title,
    text: copy.digitalMarketing.process.i0_text,
  },
  {
    icon: Target,
    title: copy.digitalMarketing.process.i1_title,
    text: copy.digitalMarketing.process.i1_text,
  },
  {
    icon: Settings2,
    title: copy.digitalMarketing.process.i2_title,
    text: copy.digitalMarketing.process.i2_text,
  },
  {
    icon: Gauge,
    title: copy.digitalMarketing.process.i3_title,
    text: copy.digitalMarketing.process.i3_text,
  },
  {
    icon: CalendarClock,
    title: copy.digitalMarketing.process.i4_title,
    text: copy.digitalMarketing.process.i4_text,
  },
];

export const costFactors: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Layers,
    title: copy.digitalMarketing.costFactors.i0_title,
    text: copy.digitalMarketing.costFactors.i0_text,
  },
  {
    icon: TrendingUp,
    title: copy.digitalMarketing.costFactors.i1_title,
    text: copy.digitalMarketing.costFactors.i1_text,
  },
  {
    icon: Target,
    title: copy.digitalMarketing.costFactors.i2_title,
    text: copy.digitalMarketing.costFactors.i2_text,
  },
  {
    icon: BadgeCheck,
    title: copy.digitalMarketing.costFactors.i3_title,
    text: copy.digitalMarketing.costFactors.i3_text,
  },
];

export const mistakes: { title: string; text: string; fix: string }[] = copy.digitalMarketing.mistakes;
