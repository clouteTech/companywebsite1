// Company details and navigation shared by every page (taken from the original header and footer).
import {
  CloudUpload,
  Code,
  Headset,
  LockKeyhole,
  Megaphone,
  Settings,
  UserPlus,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import type { StaticImageData } from "next/image";

import codeScreen from "@/public/images/code-screen.jpg";
import cyberCircuit from "@/public/images/cyber-circuit.jpg";
import globalNetwork from "@/public/images/global-network.jpg";
import helpdesk from "@/public/images/helpdesk.jpg";
import itEngineer from "@/public/images/it-engineer.jpg";
import patchPanel from "@/public/images/patch-panel.jpg";
import recruitmentPhoto from "@/public/images/recruitment.jpg";
import softwareDashboard from "@/public/images/software-dashboard.jpg";
import copy from "@/content/common.json";

export const company = {
  name: copy.site.company.name,
  legalName: copy.site.company.legalName,
  tagline: copy.site.company.tagline,
  phone: copy.site.company.phone,
  phoneTopbar: copy.site.company.phoneTopbar,
  phoneHref: "tel:+919952110515",
  /** WhatsApp Click-to-Chat number: country code and digits only (no +, spaces or hyphens). Used by lib/whatsapp.ts. */
  whatsapp: "919952110515",
  supportEmail: copy.site.company.supportEmail,
  salesEmail: copy.site.company.salesEmail,
  address: copy.site.company.address,
  mapEmbed:
    copy.site.company.mapEmbed,
} as const;

export type SocialNetwork = "instagram" | "linkedin" | "x" | "whatsapp" | "facebook";

export const socials: { network: SocialNetwork; label: string; href: string }[] = [
  { network: "instagram", label: copy.site.socials.i0_label, href: "https://www.instagram.com/cloutetechnologies/" },
  { network: "linkedin", label: copy.site.socials.i1_label, href: "https://www.linkedin.com/company/cloute-technologies/" },
  { network: "x", label: copy.site.socials.i2_label, href: "https://x.com/ClouteTech" },
  { network: "whatsapp", label: copy.site.socials.i3_label, href: `https://wa.me/${company.whatsapp}` },
  {
    network: "facebook",
    label: copy.site.socials.i4_label,
    href: "https://www.facebook.com/people/Cloute-Technologies-Pvt-Ltd/61587800623452/",
  },
];

export interface NavService {
  label: string;
  footerLabel: string;
  href: string;
  icon: LucideIcon;
  /** Wide, high-resolution photo used for menus, panels and page heroes. */
  image: StaticImageData;
}

export const serviceLinks: NavService[] = [
  {
    label: copy.site.serviceLinks.i0_label,
    footerLabel: copy.site.serviceLinks.i0_footerLabel,
    href: "/networking-and-infrastructure",
    icon: Waypoints,
    image: patchPanel,
  },
  {
    label: copy.site.serviceLinks.i1_label,
    footerLabel: copy.site.serviceLinks.i1_footerLabel,
    href: "/software-development-services",
    icon: Code,
    image: codeScreen,
  },
  {
    label: copy.site.serviceLinks.i2_label,
    footerLabel: copy.site.serviceLinks.i2_footerLabel,
    href: "/it-support-and-helpdesk",
    icon: Headset,
    image: helpdesk,
  },
  {
    label: copy.site.serviceLinks.i3_label,
    footerLabel: copy.site.serviceLinks.i3_footerLabel,
    href: "/managed-it-services",
    icon: Settings,
    image: itEngineer,
  },
  {
    label: copy.site.serviceLinks.i4_label,
    footerLabel: copy.site.serviceLinks.i4_footerLabel,
    href: "/cybersecurity-services",
    icon: LockKeyhole,
    image: cyberCircuit,
  },
  {
    label: copy.site.serviceLinks.i5_label,
    footerLabel: copy.site.serviceLinks.i5_footerLabel,
    href: "/cloud-services",
    icon: CloudUpload,
    image: globalNetwork,
  },
  {
    label: copy.site.serviceLinks.i6_label,
    footerLabel: copy.site.serviceLinks.i6_footerLabel,
    href: "/digital-marketing-services",
    icon: Megaphone,
    image: softwareDashboard,
  },
  {
    label: copy.site.recruitmentService.label,
    footerLabel: copy.site.recruitmentService.footerLabel,
    href: "/recruitment",
    icon: UserPlus,
    image: recruitmentPhoto,
  },
];

/** Routes whose hero is bright, so the transparent header starts with dark text. */
export const lightHeroRoutes = ["/about-us", "/recruitment", "/enquiries"];

export const mainLinks = [
  { label: copy.site.mainLinks.i0_label, href: "/products" },
  { label: copy.site.mainLinks.i1_label, href: "/technology" },
  { label: copy.site.mainLinks.i5_label, href: "/blogs" },
  { label: copy.site.mainLinks.i3_label, href: "/about-us" },
  { label: copy.site.mainLinks.i4_label, href: "/contact" },
];

export const footerMenu = [
  { label: copy.site.footerMenu.i0_label, href: "/" },
  { label: copy.site.footerMenu.i1_label, href: "/products" },
  { label: copy.site.footerMenu.i2_label, href: "/technology" },
  { label: copy.site.footerMenu.i3_label, href: "/recruitment" },
  { label: copy.site.footerMenu.i6_label, href: "/blogs" },
  { label: copy.site.footerMenu.i4_label, href: "/contact" },
  { label: copy.site.footerMenu.i5_label, href: "/about-us" },
];
