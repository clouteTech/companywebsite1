// Clients shown in the "Trusted by" section (components/clients-section.tsx). Logos are the files supplied by
// the company; industry and location come from each organisation's public listings. Where a listing couldn't be
// confirmed, the card shows only what the logo itself says (no location).
import type { StaticImageData } from "next/image";

import almatar from "@/public/images/clients/almatar.jpg";
import apd from "@/public/images/clients/apd.jpg";
import apeiron from "@/public/images/clients/apeiron.jpg";
import baliga from "@/public/images/clients/baliga.jpg";
import envision from "@/public/images/clients/envision-energy.jpg";
import firstSystems from "@/public/images/clients/first-systems.jpg";
import grdCollege from "@/public/images/clients/grd-college.jpg";
import greenAgroPack from "@/public/images/clients/green-agro-pack.jpg";
import ksmTraders from "@/public/images/clients/ksm-traders.jpg";
import moveInSync from "@/public/images/clients/moveinsync.jpg";
import shapoorji from "@/public/images/clients/shapoorji-pallonji.svg";
import trolex from "@/public/images/clients/trolex.jpg";
import yoti from "@/public/images/clients/yoti.jpg";
import copy from "@/content/common.json";

export interface Client {
  name: string;
  industry: string;
  location?: string;
  logo: StaticImageData;
  /** Wide logos fill the width; square ones are capped by height. */
  wide?: boolean;
}

export const clients: Client[] = [
  { name: copy.clients.clients.i0_name, industry: copy.clients.clients.i0_industry, location: copy.clients.clients.i0_location, logo: shapoorji, wide: true },
  { name: copy.clients.clients.i1_name, industry: copy.clients.clients.i1_industry, location: copy.clients.clients.i1_location, logo: envision },
  { name: copy.clients.clients.i2_name, industry: copy.clients.clients.i2_industry, location: copy.clients.clients.i2_location, logo: moveInSync },
  { name: copy.clients.clients.i3_name, industry: copy.clients.clients.i3_industry, location: copy.clients.clients.i3_location, logo: yoti, wide: true },
  { name: copy.clients.clients.i4_name, industry: copy.clients.clients.i4_industry, location: copy.clients.clients.i4_location, logo: almatar },
  { name: copy.clients.clients.i5_name, industry: copy.clients.clients.i5_industry, location: copy.clients.clients.i5_location, logo: trolex },
  { name: copy.clients.clients.i6_name, industry: copy.clients.clients.i6_industry, location: copy.clients.clients.i6_location, logo: baliga },
  { name: copy.clients.clients.i7_name, industry: copy.clients.clients.i7_industry, location: copy.clients.clients.i7_location, logo: apd },
  { name: copy.clients.clients.i8_name, industry: copy.clients.clients.i8_industry, location: copy.clients.clients.i8_location, logo: grdCollege, wide: true },
  { name: copy.clients.clients.i9_name, industry: copy.clients.clients.i9_industry, location: copy.clients.clients.i9_location, logo: greenAgroPack, wide: true },
  { name: copy.clients.clients.i10_name, industry: copy.clients.clients.i10_industry, logo: firstSystems, wide: true },
  { name: copy.clients.clients.i11_name, industry: copy.clients.clients.i11_industry, logo: apeiron },
  { name: copy.clients.clients.i12_name, industry: copy.clients.clients.i12_industry, logo: ksmTraders },
];
