import {
  ArrowRight,
  BadgeCheck,
  Check,
  CloudUpload,
  LayoutGrid,
  Laptop,
  LockKeyhole,
  Server,
  Settings2,
  ShoppingBag,
  Waypoints,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import { RotatingImage } from "@/components/rotating-image";
import { withVariants } from "@/lib/image-variants";
import type { CSSProperties } from "react";

import {
  Breadcrumbs,
  CtaBand,
  FaqSection,
  HeroActions,
  MediaFrame,
  SectionHeading,
  SplitText,
  stagger,
  Marquee,
} from "@/components/sections";
import { brandLogos } from "@/components/brand-logos";
import { ClientsSection } from "@/components/clients-section";
import { productFaqs } from "@/lib/faqs";
import dataCenter from "@/public/images/data-center.jpg";
import hardwareLineup from "@/public/images/hardware-lineup.jpg";
import softwareDashboard from "@/public/images/software-dashboard.jpg";
import cms from "@/content/products.json";

export const metadata: Metadata = cms.products.metadata;

// Each product line has its own colour (--tone) and its products listed as chips (globals.css, .pd-*).
const products = [
  {
    icon: Waypoints,
    title: cms.products.products.i0_title,
    tone: "#1e5fdb",
    items: ["Routers", "Switches", "Firewalls", "Wireless access points"],
    products: cms.products.products.i0_products,
    services: cms.products.products.i0_services,
    benefit:
      cms.products.products.i0_benefit,
  },
  {
    icon: Server,
    title: cms.products.products.i1_title,
    tone: "#7c3aed",
    items: ["High-performance servers", "NAS", "SAN", "Backup systems"],
    products: cms.products.products.i1_products,
    services: cms.products.products.i1_services,
    benefit:
      cms.products.products.i1_benefit,
  },
  {
    icon: Laptop,
    title: cms.products.products.i2_title,
    tone: "#0891b2",
    items: ["Laptops", "Desktops", "Printers", "Peripherals"],
    products: cms.products.products.i2_products,
    services: cms.products.products.i2_services,
    benefit:
      cms.products.products.i2_benefit,
  },
  {
    icon: LockKeyhole,
    title: cms.products.products.i3_title,
    tone: "#e11d48",
    items: ["Antivirus", "Endpoint security"],
    products: cms.products.products.i3_products,
    services: cms.products.products.i3_services,
    benefit:
      cms.products.products.i3_benefit,
  },
  {
    icon: LayoutGrid,
    title: cms.products.products.i4_title,
    tone: "#0d9488",
    items: ["Microsoft Office Suite", "Windows OS", "Enterprise productivity tools"],
    products: cms.products.products.i4_products,
    services: cms.products.products.i4_services,
    benefit:
      cms.products.products.i4_benefit,
  },
  {
    icon: CloudUpload,
    title: cms.products.products.i5_title,
    tone: "#0284c7",
    items: ["Cloud storage", "SaaS applications", "Cloud computing platforms"],
    products: cms.products.products.i5_products,
    services: cms.products.products.i5_services,
    benefit:
      cms.products.products.i5_benefit,
  },
];

// Hotspots pinned on the hardware in the hero photo, as percentages of the image.
const hotspots = [
  { label: cms.products.hotspots.i0_label, x: 17, y: 42 },
  { label: cms.products.hotspots.i1_label, x: 41, y: 27 },
  { label: cms.products.hotspots.i2_label, x: 70, y: 24 },
  { label: cms.products.hotspots.i3_label, x: 74, y: 56 },
  { label: cms.products.hotspots.i4_label, x: 46, y: 80 },
  { label: cms.products.hotspots.i5_label, x: 93, y: 46 },
];

// How every product line is delivered, drawn from their services.
const deliverySteps = [
  {
    icon: ShoppingBag,
    title: cms.products.deliverySteps.i0_title,
    text: cms.products.deliverySteps.i0_text,
  },
  { icon: Wrench, title: cms.products.deliverySteps.i1_title, text: cms.products.deliverySteps.i1_text },
  { icon: Settings2, title: cms.products.deliverySteps.i2_title, text: cms.products.deliverySteps.i2_text },
  { icon: BadgeCheck, title: cms.products.deliverySteps.i3_title, text: cms.products.deliverySteps.i3_text },
];

export default function ProductsPage() {
  return (
    <>
      {/* Product-launch header: copy first, then the line-up framed beneath it. */}
      <section className="on-dark relative isolate overflow-clip bg-abyss text-white">
        <div aria-hidden="true" className="aurora" />
        <div className="shell pt-32 text-center sm:pt-40">
          <Breadcrumbs crumbs={["Products"]} className="hero-in flex justify-center" />
          <h1 className="text-display split-in mx-auto mt-6 max-w-5xl">
            <SplitText text={cms.products.ProductsPage.text01_trusted_it_hardware_software} />
          </h1>
          <p className="text-lead hero-in mx-auto mt-6 max-w-3xl text-white/70" style={stagger(4)}>{cms.products.ProductsPage.text02_empower_your_business_with}</p>
          <div className="hero-in mt-10 flex justify-center" style={stagger(5)}>
            <HeroActions
              primary={{ label: cms.products.ProductsPage.label03_get_started, href: "/contact" }}
              secondary={{ label: cms.products.ProductsPage.label04_view_products, href: "#our-services" }}
            />
          </div>
        </div>
        <div className="shell hero-in mt-16 pb-16 sm:mt-20 lg:pb-24" style={stagger(6)}>
          <div className="expand relative aspect-[16/10] overflow-clip rounded-[1.25rem] bg-navy shadow-[0_80px_160px_-60px_rgb(23_195_230/0.35)] ring-1 ring-white/10 sm:aspect-[2/1]">
            <RotatingImage
              images={withVariants(hardwareLineup)}
              alt={cms.products.ProductsPage.alt05_servers_switches_storage_and}
              fill
              preload
              quality={85}
              sizes="(min-width: 1280px) 1200px, 100vw"
              placeholder="blur"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,rgb(4_12_25/0.6),transparent_45%)]"
            />
            <span aria-hidden="true" className="pd-sweep" />
            <ul aria-label={cms.products.ProductsPage.arialabel06_hardware_shown} className="hidden sm:block">
              {hotspots.map((spot, i) => (
                <li
                  key={spot.label}
                  className="pd-hotspot"
                  data-side={spot.x > 80 ? "left" : "right"}
                  style={{ "--x": `${spot.x}%`, "--y": `${spot.y}%`, "--i": i } as CSSProperties}
                >
                  <span aria-hidden="true" className="pd-hotspot-dot" />
                  <span className="pd-hotspot-label">{spot.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow={cms.products.ProductsPage.eyebrow07_trusted_it_hardware_software}
              title={cms.products.ProductsPage.title08_it_hardware_companies_in}
            />
            <div className="text-lead mt-6 space-y-5 text-muted">
              <p className="reveal">{cms.products.ProductsPage.text09_at_cloute_technologies_we}</p>
              <p className="reveal">{cms.products.ProductsPage.text10_recognized_among_the_top}</p>
              <p className="reveal">{cms.products.ProductsPage.text11_our_comprehensive_portfolio_includes}</p>
            </div>
          </div>
          {/* Two overlapping frames: infrastructure behind, software in front. */}
          <div className="relative pb-20 sm:pb-24">
            <MediaFrame
              src={dataCenter}
              alt={cms.products.ProductsPage.alt12_networking_company_in_bangalore}
              sizes="(min-width: 1280px) 520px, (min-width: 1024px) 40vw, 85vw"
              className="aspect-[4/3] w-[85%]"
              parallax
            />
            <MediaFrame
              src={softwareDashboard}
              alt={cms.products.ProductsPage.alt13_business_software_dashboards_supplie}
              sizes="(min-width: 1280px) 340px, (min-width: 1024px) 26vw, 55vw"
              className="absolute right-0 bottom-0 aspect-[4/3] w-[55%] shadow-[0_40px_80px_-40px_rgb(11_30_57/0.6)] ring-8 ring-white"
            />
          </div>
        </div>
      </section>

      {/* Brands we supply, drifting past. */}
      <div className="border-y border-line bg-paper pt-10 pb-2">
        <p className="text-eyebrow reveal text-center text-brand">{cms.products.ProductsPage.text14_brands_we_supply}</p>
        <Marquee
          label={cms.products.ProductsPage.label15_hardware_brands_we_supply}
          className="mt-1"
          itemClassName="px-2 pt-8 pb-10 sm:px-3"
          items={brandLogos}
          duration={40}
        />
      </div>

      {/* Portfolio as a showroom: each product line on its own coloured panel, alternating sides. */}
      <section id="our-services" className="section-y relative isolate overflow-x-clip bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow={cms.products.ProductsPage.eyebrow16_our_products}
            title={cms.products.ProductsPage.title17_complete_hardware_software_portfolio}
            text={cms.products.ProductsPage.text18_everything_your_business_needs}
          />
          <ol className="mt-14 grid gap-6 lg:mt-20 lg:gap-8">
            {products.map((product, i) => (
              <li
                key={product.title}
                className="pd-card group"
                data-flip={i % 2 === 1}
                style={{ "--tone": product.tone } as CSSProperties}
              >
                <div aria-hidden="true" className="pd-visual">
                  <span className="pd-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pd-orbit" />
                  <span className="pd-icon">
                    <product.icon className="size-10" strokeWidth={1.5} />
                  </span>
                </div>
                <div className="pd-body">
                  <h3 className="text-subheading">{product.title}</h3>
                  <div className="mt-5">
                    <p className="pd-label">{cms.products.ProductsPage.text19_products}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {product.items.map((item) => (
                        <li key={item} className="pd-chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                    {product.title.startsWith("Computer") ? (
                      <p className="mt-3 text-sm text-muted">{cms.products.ProductsPage.text20_from_trusted_brands_like}</p>
                    ) : null}
                  </div>
                  <div className="mt-6">
                    <p className="pd-label">{cms.products.ProductsPage.text21_services}</p>
                    <p className="mt-2 flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-muted">
                      <span aria-hidden="true" className="pd-tick">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {product.services}
                    </p>
                  </div>
                  <blockquote className="pd-benefit">
                    <p className="pd-label">{cms.products.ProductsPage.text22_benefit}</p>
                    <p className="mt-2 leading-relaxed text-ink/80">{product.benefit}</p>
                  </blockquote>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How every product line is delivered: four steps on a line that fills as it scrolls. */}
      <section className="on-dark section-y relative isolate overflow-clip bg-abyss text-white">
        <div aria-hidden="true" className="aurora" />
        <div className="shell">
          <SectionHeading
            dark
            eyebrow={cms.products.ProductsPage.eyebrow23_how_we_deliver}
            title={cms.products.ProductsPage.title24_from_order_to_ongoing}
            text={cms.products.ProductsPage.text25_every_product_line_comes}
          />
          <ol className="pd-steps mt-14 lg:mt-16">
            <span aria-hidden="true" className="pd-steps-line" />
            {deliverySteps.map((step, i) => (
              <li key={step.title} className="pd-step reveal" style={stagger(i)}>
                <span aria-hidden="true" className="pd-step-node">
                  <step.icon className="size-6" strokeWidth={1.75} />
                </span>
                <p className="mt-5 font-display text-xs font-semibold tracking-[0.14em] text-accent uppercase">{cms.products.ProductsPage.text26_step}{String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-card-title mt-2">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/65">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="reveal mt-14 flex justify-center">
            <a href="#faq" className="text-link text-accent">{cms.products.ProductsPage.text27_questions_about_our_products}<ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <ClientsSection tone="paper" />

      <FaqSection faqs={productFaqs} name="faq-products" />

      <CtaBand
        image={hardwareLineup}
        title={cms.products.ProductsPage.title28_need_the_right_hardware}
        text={cms.products.ProductsPage.text29_talk_to_our_team}
      />
    </>
  );
}
