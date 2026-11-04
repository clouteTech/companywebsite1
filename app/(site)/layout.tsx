import { BackToTop } from "@/components/back-to-top";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import { LeadPopup } from "@/components/lead-popup";
import { MotionFx } from "@/components/motion-fx";
import { OffscreenPause } from "@/components/offscreen-pause";
import { PointerSpotlight } from "@/components/pointer-spotlight";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="btn btn-primary fixed top-3 left-3 z-[90] -translate-y-24 focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <PointerSpotlight />
      <ChatbotWidget />
      <WhatsAppButton />
      <BackToTop />
      <LeadPopup />
      <MotionFx />
      <OffscreenPause />
      <ScrollReveal />
    </>
  );
}
