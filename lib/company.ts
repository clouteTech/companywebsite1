// Company story and values shared by the About page and the home page.
import { Flag, Globe, HeartHandshake, Lightbulb, LockKeyhole, Recycle, Rocket, TrendingUp } from "lucide-react";
import copy from "@/content/about.json";

export const milestones = [
  {
    icon: Flag,
    title: copy.company.milestones.i0_title,
    text: copy.company.milestones.i0_text,
  },
  {
    icon: Globe,
    title: copy.company.milestones.i1_title,
    text: copy.company.milestones.i1_text,
  },
  {
    icon: Lightbulb,
    title: copy.company.milestones.i2_title,
    text: copy.company.milestones.i2_text,
  },
  {
    icon: TrendingUp,
    title: copy.company.milestones.i3_title,
    text: copy.company.milestones.i3_text,
  },
];

export const values = [
  {
    icon: HeartHandshake,
    title: copy.company.values.i0_title,
    text: copy.company.values.i0_text,
  },
  {
    icon: Rocket,
    title: copy.company.values.i1_title,
    text: copy.company.values.i1_text,
  },
  {
    icon: LockKeyhole,
    title: copy.company.values.i2_title,
    text: copy.company.values.i2_text,
  },
  {
    icon: Recycle,
    title: copy.company.values.i3_title,
    text: copy.company.values.i3_text,
  },
];
