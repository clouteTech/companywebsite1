import {
  BarChart3,
  Bot,
  Brain,
  Cog,
  Database,
  MessageSquareText,
  Network,
  ScanEye,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import angular from "@/public/images/tech/angular.svg";
import css from "@/public/images/tech/css.svg";
import go from "@/public/images/tech/go.svg";
import html from "@/public/images/tech/html.svg";
import java from "@/public/images/tech/java.svg";
import javascript from "@/public/images/tech/javascript.svg";
import kotlin from "@/public/images/tech/kotlin.svg";
import node from "@/public/images/tech/node.svg";
import php from "@/public/images/tech/php.svg";
import python from "@/public/images/tech/python.svg";
import react from "@/public/images/tech/react.svg";
import solidity from "@/public/images/tech/solidity.svg";
import swift from "@/public/images/tech/swift.svg";
import vue from "@/public/images/tech/vue.svg";

import { CardTilt } from "./card-tilt";
import { Seen } from "./seen";
import copy from "@/content/services.json";

/*
 * "Where code meets intelligence" band for the software page: the technologies we work with as logo cards on a
 * ring that turns by itself in 3D, beside the grid of AI and data topics, which builds itself as the band scrolls
 * into view and has a spotlight walking along it. Pure markup and CSS; Seen starts the motion. Styles in
 * globals.css (.ti-*, .tr-*).
 */

const ui = copy.serviceExtras.TechIntelligence;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

const intelligent: { icon: LucideIcon; label: string }[] = [
  { icon: Brain, label: ui.tech_ai },
  { icon: BarChart3, label: ui.tech_ml },
  { icon: Network, label: ui.tech_dl },
  { icon: MessageSquareText, label: ui.tech_nlp },
  { icon: ScanEye, label: ui.tech_cv },
  { icon: Sparkles, label: ui.tech_genai },
  { icon: Database, label: ui.tech_bigdata },
  { icon: Cog, label: ui.tech_cognitive },
  { icon: Bot, label: ui.tech_robotics },
  { icon: TrendingUp, label: ui.tech_predictive },
];

/** The technologies we work with, each shown with its own logo (public/images/tech, from the Devicon set). */
const stack: { name: string; logo: StaticImageData }[] = [
  { name: "Python", logo: python },
  { name: "Java", logo: java },
  { name: "JavaScript", logo: javascript },
  { name: "Vue.js", logo: vue },
  { name: "AngularJS", logo: angular },
  { name: "React", logo: react },
  { name: "Solidity", logo: solidity },
  { name: "PHP", logo: php },
  { name: "React Native", logo: react },
  { name: "CSS", logo: css },
  { name: "Node.js", logo: node },
  { name: "Swift", logo: swift },
  { name: "HTML", logo: html },
  { name: "Golang", logo: go },
  { name: "Kotlin", logo: kotlin },
];

/** React Native shares React's logo, so the orbits show it once; every technology is still listed for readers. */
const logos = stack.filter((item) => item.name !== "React Native");

/** Code-flavoured symbols that drift up behind the band. */
const glyphs = [
  "{ }",
  "</>",
  "01",
  "AI",
  "fn()",
  "=>",
  "10",
  "#",
  "{ }",
  "</>",
  "01",
  "&&",
];

export function TechIntelligence() {
  return (
    <section
      className="ti relative isolate overflow-clip bg-paper py-20 sm:py-24"
      data-seen-target
    >
      <Seen />
      <CardTilt />
      <span aria-hidden="true" className="ti-wash" />
      <div aria-hidden="true" className="ti-glyphs">
        {glyphs.map((glyph, i) => (
          <span key={i} style={v({ "--i": i })}>
            {glyph}
          </span>
        ))}
      </div>
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow flex items-center justify-center gap-3 text-brand">
            <span
              aria-hidden="true"
              className="h-px w-6 bg-current opacity-60"
            />
            {ui.eyebrow}
          </p>
          <h2 className="text-heading mt-4">
            {ui.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="ti-grad">{ui.title.split(" ").slice(-1)}</span>
          </h2>
          <span aria-hidden="true" className="ti-rule" />
          <p className="text-lead mx-auto mt-4 max-w-xl text-muted">
            {ui.text}
          </p>
        </div>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            {/* The logos on a ring that turns by itself in 3D: the front half faces you, the back is hidden. */}
            <div className="tr mx-auto" aria-hidden="true">
              <span className="tr-glow" />
              <ul className="tr-cyl">
                {logos.map((item, i) => (
                  <li
                    key={item.name}
                    className="tr-logo"
                    style={v({ "--k": i, "--n": logos.length })}
                  >
                    <span className="tr-face">
                      <Image
                        src={item.logo}
                        alt=""
                        width={64}
                        height={64}
                        className="tr-img"
                      />
                      <span className="tr-name">{item.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <span className="tr-floor" />
            </div>
            <p className="sr-only">{ui.group_stack_title}</p>
            <ul className="sr-only">
              {stack.map((item) => (
                <li key={item.name}>{item.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <div>
              <p className="text-eyebrow flex items-center gap-2 text-brand">
                <span aria-hidden="true" className="ti-dot" />
                {ui.group_ai_eyebrow}
              </p>
              <h3 className="text-subheading mt-2">{ui.group_ai_title}</h3>
              <ul className="ti-cards mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                {intelligent.map((item, i) => (
                  <li
                    key={item.label}
                    className="ti-card"
                    style={v({ "--i": i })}
                  >
                    <span className="ti-card-icon">
                      <item.icon
                        className="size-5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
