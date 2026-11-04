import { ArrowDown, ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { BackgroundVideo } from "@/components/background-video";
import { Presenter } from "@/components/presenter";
import { SplitText, stagger } from "@/components/sections";
import { StageNav, type Stage } from "@/components/stage-nav";
import {
  CloudDiagram,
  ClusterDiagram,
  NeuralNetDiagram,
  ObservabilityDashboard,
  PipelineDiagram,
  SecurityRadar,
} from "@/components/tech-diagrams";
import { company } from "@/lib/site";
import globalNetwork from "@/public/images/global-network.jpg";
import cms from "@/content/solutions.json";

export const metadata: Metadata = cms.technology.metadata;

const stages: Stage[] = cms.technology.stages;

/* ------------------------------------------------------------------ */

function StageIntro({ index, title, lead, accent = "text-accent" }: { index: number; title: string; lead: string; accent?: string }) {
  return (
    <>
      <p className={`text-eyebrow reveal flex items-center gap-3 ${accent}`}>
        <span className="font-display tabular-nums">{cms.technology.StageIntro.text01_stage}{String(index + 1).padStart(2, "0")}</span>
        <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
        {stages[index].label}
      </p>
      <h2 id={`${stages[index].id}-title`} className="text-display split-scroll mt-5">
        <SplitText text={title} />
      </h2>
      <p className="text-lead reveal mt-6 max-w-2xl text-white/70" style={stagger(2)}>
        {lead}
      </p>
    </>
  );
}

/** "Where it meets our work": points drawn from the existing service pages, with a link to them. */
function Connection({ points, href, label, accent = "text-accent" }: { points: string[]; href: string; label: string; accent?: string }) {
  return (
    <div className="reveal mt-10 rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-md sm:p-7" style={stagger(3)}>
      <p className={`text-eyebrow ${accent}`}>{cms.technology.Connection.text01_where_it_meets_our}</p>
      <ul className="mt-4 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-[0.9375rem] leading-relaxed text-white/75">
            <span aria-hidden="true" className={`mt-2 size-1.5 shrink-0 rounded-full bg-current ${accent}`} />
            {point}
          </li>
        ))}
      </ul>
      <Link href={href} className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
        {label}
        <ArrowRight className="btn-arrow size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/** Soft fades at a stage's edges so one stage dissolves into the next. */
function StageEdges({ from = "var(--color-abyss)" }: { from?: string }) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40" style={{ background: `linear-gradient(${from}, transparent)` }} />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40" style={{ background: `linear-gradient(transparent, ${from})` }} />
    </>
  );
}

function StageShell({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`on-dark relative isolate scroll-mt-8 overflow-clip text-white ${className}`}>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function TechnologyPage() {
  return (
    <>
      {/* Opening: the stage, the presenter and the agenda. */}
      <section className="on-dark relative isolate flex min-h-svh items-center overflow-clip bg-abyss text-white">
        {/* "Dynamic futuristic network connections animation" from Pexels (pexels.com/video/33248294), Pexels License. */}
        <BackgroundVideo
          src="/videos/tech-network-640_360.mp4"
          poster="/images/tech-network-poster.jpg"
          className="hero-drift absolute inset-0 -z-30 size-full object-cover opacity-70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_70%_40%,transparent,rgb(4_12_25/0.85)_75%),linear-gradient(to_bottom,rgb(4_12_25/0.6),rgb(4_12_25/0.3)_40%,var(--color-abyss))]"
        />
        {/* Stage floor */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-[radial-gradient(50%_80%_at_60%_100%,rgb(30_95_219/0.35),transparent_70%)]"
        />

        <div className="shell hero-fade grid items-center gap-10 pt-32 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:pt-28">
          <div>
            <p className="text-eyebrow hero-in border-glow glass relative inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-accent">
              <span aria-hidden="true" className="relative grid size-2 place-items-center">
                <span className="ring-pulse absolute inset-0 rounded-full bg-accent" />
                <span className="size-2 rounded-full bg-accent" />
              </span>
              {company.name}{cms.technology.TechnologyPage.text01_technology_keynote}</p>
            <h1 className="text-hero split-in mt-7">
              <SplitText text={cms.technology.TechnologyPage.text02_the_technology_behind_every} />
            </h1>
            <p className="text-lead hero-in mt-7 max-w-xl text-white/75" style={stagger(5)}>{cms.technology.TechnologyPage.text03_six_stages_one_story}</p>
            <div className="hero-in mt-10 flex flex-wrap items-center gap-4" style={stagger(6)}>
              <a href={`#${stages[0].id}`} className="btn btn-primary btn-wide shadow-[0_0_40px_-6px_rgb(23_195_230/0.7)]">{cms.technology.TechnologyPage.text04_explore_technology}<ArrowDown className="btn-arrow size-4" aria-hidden="true" />
              </a>
              <Link href="/contact" className="btn btn-glass btn-wide">{cms.technology.TechnologyPage.text05_talk_to_an_expert}</Link>
            </div>
            {/* Agenda */}
            <ol className="hero-in mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3" style={stagger(7)}>
              {stages.map((stage, i) => (
                <li key={stage.id}>
                  <a href={`#${stage.id}`} className="group flex items-baseline gap-2 text-sm text-white/60 transition-colors hover:text-white">
                    <span className="font-display text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="link-underline">{stage.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="hero-in relative mx-auto hidden w-full max-w-sm sm:block lg:max-w-none" style={stagger(3)}>
            <Presenter className="mx-auto h-[min(34rem,62svh)] w-auto" />
          </div>
        </div>
      </section>

      {/* The keynote: stages scroll past while the presenter rail keeps the place. */}
      <div className="relative bg-abyss">
        <StageNav stages={stages} />

        {/* 01 — AI & Machine Learning: violet, diagram beside the copy. */}
        <StageShell id="stage-ai" className="section-y bg-[radial-gradient(60%_60%_at_80%_50%,rgb(123_140_255/0.18),transparent_70%),var(--color-abyss)]">
          <div className="shell grid items-center gap-12 stage-offset xl:grid-cols-2">
            <div>
              <div>
                <StageIntro
                  index={0}
                  accent="text-iris"
                  title={cms.technology.TechnologyPage.title06_systems_that_learn_from}
                  lead={cms.technology.TechnologyPage.lead07_machine_learning_models_find}
                />
              </div>
              <Connection
                accent="text-iris"
                points={[
                  cms.technology.TechnologyPage.item08_our_threat_detection_uses,
                  cms.technology.TechnologyPage.item09_our_advisors_include_an,
                ]}
                href="/cybersecurity-services"
                label={cms.technology.TechnologyPage.label10_see_ai_driven_threat}
              />
            </div>
            <div className="reveal-media rounded-[1.75rem] bg-[#0b1235]/60 p-6 ring-1 ring-iris/20 backdrop-blur-md sm:p-8">
              <NeuralNetDiagram />
            </div>
          </div>
        </StageShell>

        {/* 02 — Cloud: full-bleed world map, architecture diagram on a glass panel. */}
        <StageShell id="stage-cloud" className="section-y bg-navy">
          <Image src={globalNetwork} alt="" fill sizes="100vw" placeholder="blur" className="parallax -z-30 object-cover opacity-40" />
          <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,rgb(4_12_25/0.92)_25%,rgb(11_30_57/0.55))]" />
          <StageEdges />
          <div className="shell stage-offset">
            <div className="max-w-3xl">
              <StageIntro
                index={1}
                title={cms.technology.TechnologyPage.title11_infrastructure_without_limits}
                lead={cms.technology.TechnologyPage.lead12_cloud_computing_turns_servers}
              />
            </div>
            <div className="mt-12 grid items-start gap-8 xl:grid-cols-[1.25fr_1fr]">
              <div className="glass reveal-media rounded-[1.75rem] p-5 sm:p-8">
                <CloudDiagram />
              </div>
              <Connection
                points={[
                  cms.technology.TechnologyPage.item13_cloud_migration_with_a,
                  cms.technology.TechnologyPage.item14_infrastructure_platform_and_software,
                  cms.technology.TechnologyPage.item15_hybrid_and_multi_cloud,
                  cms.technology.TechnologyPage.item16_cloud_backup_and_disaster,
                ]}
                href="/cloud-services"
                label={cms.technology.TechnologyPage.label17_explore_cloud_services}
              />
            </div>
          </div>
        </StageShell>

        {/* 03 — DevOps & CI/CD: centred, the pipeline runs the full width. */}
        <StageShell id="stage-devops" className="section-y bg-[#060d1c]">
          <div className="shell stage-offset">
            <div className="mx-auto max-w-3xl text-center [&_p]:mx-auto [&_p.text-eyebrow]:justify-center">
              <StageIntro
                index={2}
                title={cms.technology.TechnologyPage.title18_from_commit_to_production}
                lead={cms.technology.TechnologyPage.lead19_devops_joins_development_and}
              />
            </div>
            <div className="reveal mt-14 rounded-[1.75rem] bg-white/[0.03] px-5 py-10 ring-1 ring-white/10 sm:px-10">
              <PipelineDiagram />
            </div>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: cms.technology.TechnologyPage.title20_structured_delivery,
                  text: cms.technology.TechnologyPage.text21_requirement_analysis_agile_developme,
                },
                {
                  title: cms.technology.TechnologyPage.title22_testing_quality_assurance,
                  text: cms.technology.TechnologyPage.text23_functional_performance_and_security,
                },
                {
                  title: cms.technology.TechnologyPage.title24_cloud_native_software,
                  text: cms.technology.TechnologyPage.text25_cloud_based_applications_apis,
                },
              ].map((item, i) => (
                <li key={item.title} className="group reveal spotlight spotlight-dark rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10" style={stagger(i)}>
                  <h3 className="text-card-title">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/65">{item.text}</p>
                </li>
              ))}
            </ul>
            <div className="reveal mt-8 text-center">
              <Link href="/software-development-services" className="group inline-flex items-center gap-2 text-sm font-medium">{cms.technology.TechnologyPage.text26_explore_software_development}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </StageShell>

        {/* 04 — Cybersecurity: green-tinted video field, radar on the left. */}
        <StageShell id="stage-security" className="section-y bg-[#03140f]">
          {/* "Green code digital abstract background animation" from Pexels (pexels.com/video/33503696), Pexels License. */}
          <BackgroundVideo
            src="/videos/secure-code-640_360.mp4"
            poster="/images/secure-code-poster.jpg"
            lazy
            className="absolute inset-0 -z-30 size-full object-cover opacity-30"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_30%_50%,rgb(3_20_15/0.4),rgb(3_20_15/0.92)_70%)]" />
          <StageEdges />
          <div className="shell grid items-center gap-12 stage-offset xl:grid-cols-[0.9fr_1.1fr]">
            <div className="reveal-media mx-auto w-full max-w-md xl:order-first">
              <SecurityRadar />
            </div>
            <div>
              <div>
                <StageIntro
                  index={3}
                  accent="text-emerald-300"
                  title={cms.technology.TechnologyPage.title27_defence_in_every_layer}
                  lead={cms.technology.TechnologyPage.lead28_modern_security_is_layered}
                />
              </div>
              <Connection
                accent="text-emerald-300"
                points={[
                  cms.technology.TechnologyPage.item29_threat_detection_and_response,
                  cms.technology.TechnologyPage.item30_identity_and_access_management,
                  cms.technology.TechnologyPage.item31_enterprise_grade_encryption_at,
                  cms.technology.TechnologyPage.item32_firewalls_intrusion_detection_and,
                ]}
                href="/cybersecurity-services"
                label={cms.technology.TechnologyPage.label33_explore_cybersecurity_services}
              />
            </div>
          </div>
        </StageShell>

        {/* 05 — Containers & Kubernetes: teal, cluster diagram above two explainer columns. */}
        <StageShell id="stage-containers" className="section-y bg-[radial-gradient(55%_60%_at_20%_30%,rgb(23_195_230/0.14),transparent_70%),#04121a]">
          <div className="shell stage-offset">
            <div className="grid items-end gap-10 xl:grid-cols-2">
              <div>
                <StageIntro
                  index={4}
                  title={cms.technology.TechnologyPage.title34_applications_that_run_anywhere}
                  lead={cms.technology.TechnologyPage.lead35_containers_package_an_application}
                />
              </div>
              <div className="reveal-media rounded-[1.75rem] bg-white/[0.03] p-5 ring-1 ring-accent/20 sm:p-7">
                <ClusterDiagram />
              </div>
            </div>
            <dl className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["Package", cms.technology.TechnologyPage.item36_an_image_bundles_code],
                ["Orchestrate", cms.technology.TechnologyPage.item37_the_control_plane_places],
                ["Scale", cms.technology.TechnologyPage.item38_replicas_are_added_or],
              ].map(([term, text], i) => (
                <div key={term} className="reveal border-t border-accent/30 pt-5" style={stagger(i)}>
                  <dt className="font-display text-lg font-semibold tracking-tight">{term}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-white/65">{text}</dd>
                </div>
              ))}
            </dl>
            <Connection
              points={[
                cms.technology.TechnologyPage.item39_cloud_native_application_development,
                cms.technology.TechnologyPage.item40_hybrid_cloud_solutions_with,
                cms.technology.TechnologyPage.item41_multi_cloud_management_with,
              ]}
              href="/cloud-services"
              label={cms.technology.TechnologyPage.label42_explore_cloud_services}
            />
          </div>
        </StageShell>

        {/* 06 — Data & Observability: dashboard first, copy beneath. */}
        <StageShell id="stage-observability" className="section-y bg-abyss">
          <div aria-hidden="true" className="aurora" />
          <div className="shell stage-offset">
            <div className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr] xl:items-center">
              <div>
                <StageIntro
                  index={5}
                  title={cms.technology.TechnologyPage.title43_see_everything_fix_it}
                  lead={cms.technology.TechnologyPage.lead44_observability_brings_metrics_logs}
                />
              </div>
              <div className="reveal-media">
                <ObservabilityDashboard />
                <p className="mt-3 text-center text-xs text-white/40">{cms.technology.TechnologyPage.text45_illustration_sample_data_for}</p>
              </div>
            </div>
            <Connection
              points={[
                cms.technology.TechnologyPage.item46_24_7_monitoring_and,
                cms.technology.TechnologyPage.item47_proactive_system_monitoring_and,
                cms.technology.TechnologyPage.item48_help_desk_management_with,
              ]}
              href="/managed-it-services"
              label={cms.technology.TechnologyPage.label49_explore_managed_it_services}
            />
          </div>
        </StageShell>
      </div>

      {/* Q&A — the close. */}
      <section className="on-dark relative isolate overflow-clip bg-midnight py-[clamp(5rem,3rem+8vw,10rem)] text-center text-white">
        <div aria-hidden="true" className="aurora" />
        <div className="shell">
          <p className="text-eyebrow reveal text-accent">{cms.technology.TechnologyPage.text50_q_a}</p>
          <h2 className="text-display split-scroll mx-auto mt-5 max-w-4xl">
            <SplitText text={cms.technology.TechnologyPage.text51_questions_after_the_keynote} />
          </h2>
          <p className="text-lead reveal mx-auto mt-6 max-w-xl text-white/70" style={stagger(2)}>{cms.technology.TechnologyPage.text52_talk_to_our_team}</p>
          <div className="reveal mt-10 flex justify-center" style={stagger(3)}>
            <div className="btn-pair">
              <Link href="/contact" className="btn btn-primary shadow-[0_0_40px_-6px_rgb(23_195_230/0.7)]">{cms.technology.TechnologyPage.text53_contact_us}<ArrowRight className="btn-arrow size-4" aria-hidden="true" />
              </Link>
              <a href={company.phoneHref} className="btn btn-glass">
                <Phone className="size-4" aria-hidden="true" />
                {company.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
