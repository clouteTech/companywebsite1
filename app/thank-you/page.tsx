import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SplitText, stagger } from "@/components/sections";
import copy from "@/content/contact.json";

export const metadata: Metadata = copy.thankYou.metadata;

export default function ThankYouPage() {
  return (
    <main className="on-dark relative isolate grid min-h-svh place-items-center overflow-clip bg-midnight px-5 py-16 text-white">
      <div aria-hidden="true" className="aurora" />
      <div className="max-w-lg text-center">
        <span className="hero-in relative mx-auto grid size-20 place-items-center" style={stagger(0)}>
          <span aria-hidden="true" className="ring-pulse absolute inset-0 rounded-full bg-accent/30" />
          <span
            aria-hidden="true"
            className="ring-pulse absolute inset-0 rounded-full bg-accent/20 [animation-delay:1.4s]"
          />
          <span className="relative grid size-20 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-brand),var(--color-accent))] shadow-[0_20px_50px_-15px_rgb(23_195_230/0.7)]">
            <Check className="size-8" strokeWidth={2.25} aria-hidden="true" />
          </span>
        </span>
        <h1 className="text-display split-in mt-10">
          <SplitText text={copy.thankYou.ThankYouPage.text01_thank_you} offset={2} />
        </h1>
        <p className="text-lead hero-in mt-5 text-white/70" style={stagger(3)}>{copy.thankYou.ThankYouPage.text02_your_message_has_been}</p>
        <div className="hero-in mt-10" style={stagger(4)}>
          <Link href="/" className="btn btn-primary btn-wide">{copy.thankYou.ThankYouPage.text03_back_to_home}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
