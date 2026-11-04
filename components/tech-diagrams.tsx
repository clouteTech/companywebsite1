// Animated explainer diagrams for the technology keynote. Pure SVG/HTML animated with CSS
// (classes in globals.css: .flow, .packet, .blink, .sweep, .pod, .log-scroll, .bar-pulse,
// .spark-draw); with reduced motion they render as static, still-readable diagrams.
import type { CSSProperties } from "react";
import copy from "@/content/solutions.json";

const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* AI & ML — a small neural network with signals flowing layer to layer. */
/* ------------------------------------------------------------------ */
const layers = [
  [70, 150, 230],
  [50, 110, 170, 230, 290].map((y) => y - 20),
  [70, 150, 230],
  [110, 190],
];
const layerX = [50, 170, 290, 410];

export function NeuralNetDiagram() {
  const edges: { x1: number; y1: number; x2: number; y2: number; k: number }[] = [];
  layers.slice(0, -1).forEach((layer, l) =>
    layer.forEach((y1, i) =>
      layers[l + 1].forEach((y2, j) => edges.push({ x1: layerX[l], y1, x2: layerX[l + 1], y2, k: l * 7 + i * 3 + j })),
    ),
  );
  return (
    <svg viewBox="0 0 460 300" role="img" aria-label={copy.techDiagrams.NeuralNetDiagram.arialabel01_diagram_of_a_neural} className="h-auto w-full">
      <g stroke="#7b8cff" strokeOpacity="0.22" strokeWidth="1">
        {edges.map((e) => (
          <line key={`l${e.k}-${e.x1}-${e.y1}-${e.y2}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
        ))}
      </g>
      {/* Travelling signals along a subset of the connections. */}
      <g stroke="#9fdcf0" strokeWidth="4" fill="none">
        {edges
          .filter((_, i) => i % 3 === 0)
          .map((e, i) => (
            <path
              key={`p${e.k}-${e.x1}-${e.y1}-${e.y2}`}
              className="packet"
              pathLength={100}
              d={`M${e.x1} ${e.y1} L${e.x2} ${e.y2}`}
              style={d((i % 7) * 0.35)}
            />
          ))}
      </g>
      {layers.map((layer, l) =>
        layer.map((y, i) => (
          <g key={`n${l}-${y}`}>
            <circle cx={layerX[l]} cy={y} r="13" fill="#0b1235" stroke="#7b8cff" strokeWidth="1.5" />
            <circle className="blink" cx={layerX[l]} cy={y} r="6" fill={l === layers.length - 1 ? "#17c3e6" : "#7b8cff"} style={d((l + i) * 0.3)} />
          </g>
        )),
      )}
      {["Input", "Hidden", "Hidden", "Output"].map((label, l) => (
        <text key={`t${l}`} x={layerX[l]} y="298" textAnchor="middle" fontSize="11" fill="#ffffff" fillOpacity="0.5" letterSpacing="1.5">
          {label.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Cloud — users through a load balancer into two regions and storage. */
/* ------------------------------------------------------------------ */
export function CloudDiagram() {
  const box = "fill-[#0b1e39]/80 stroke-[#4a85f0]/50";
  return (
    <svg viewBox="0 0 520 320" role="img" aria-label={copy.techDiagrams.CloudDiagram.arialabel01_cloud_architecture_users_reach} className="h-auto w-full">
      {/* Connections */}
      <g fill="none" stroke="#4a85f0" strokeOpacity="0.35" strokeWidth="1.5">
        <path d="M80 160 L190 160" />
        <path d="M250 160 C300 160 300 80 350 80" />
        <path d="M250 160 C300 160 300 240 350 240" />
        <path d="M420 80 L470 80 L470 240 L420 240" />
      </g>
      <g fill="none" stroke="#17c3e6" strokeWidth="1.5">
        <path className="flow" d="M80 160 L190 160" />
        <path className="flow" d="M250 160 C300 160 300 80 350 80" />
        <path className="flow" d="M250 160 C300 160 300 240 350 240" />
        <path className="flow" d="M470 100 L470 220" style={{ animationDirection: "alternate" }} />
      </g>
      <g stroke="#ffffff" strokeWidth="5" fill="none">
        <path className="packet" pathLength={100} d="M80 160 L190 160" style={d(0)} />
        <path className="packet" pathLength={100} d="M250 160 C300 160 300 80 350 80" style={d(0.8)} />
        <path className="packet" pathLength={100} d="M250 160 C300 160 300 240 350 240" style={d(1.6)} />
      </g>

      {/* Users */}
      {[110, 160, 210].map((y, i) => (
        <g key={y} transform={`translate(44 ${y - 50 + i * 0})`} opacity="0.85">
          <circle cx="0" cy="44" r="7" fill="#9fdcf0" />
          <path d="M-11 66 Q0 52 11 66 Z" fill="#9fdcf0" />
        </g>
      ))}
      <text x="44" y="260" textAnchor="middle" fontSize="11" fill="#fff" fillOpacity="0.55" letterSpacing="1.5">{copy.techDiagrams.CloudDiagram.text02_users}</text>

      {/* Load balancer */}
      <rect x="190" y="130" width="60" height="60" rx="14" className={box} strokeWidth="1.5" />
      <path d="M205 160 h30 M220 145 v30" stroke="#17c3e6" strokeWidth="3" strokeLinecap="round" />
      <text x="220" y="212" textAnchor="middle" fontSize="11" fill="#fff" fillOpacity="0.55" letterSpacing="1.5">{copy.techDiagrams.CloudDiagram.text03_load_balancer}</text>

      {/* Regions */}
      {[
        { y: 80, label: copy.techDiagrams.CloudDiagram.label04_region_a },
        { y: 240, label: copy.techDiagrams.CloudDiagram.label05_region_b },
      ].map((r, i) => (
        <g key={r.label}>
          <rect x="350" y={r.y - 36} width="70" height="72" rx="14" className={box} strokeWidth="1.5" />
          {[0, 1, 2].map((k) => (
            <rect key={k} className="blink" x="362" y={r.y - 24 + k * 18} width="46" height="10" rx="3" fill="#4a85f0" style={d(i * 0.5 + k * 0.4)} />
          ))}
          <text x="385" y={r.y + 54} textAnchor="middle" fontSize="11" fill="#fff" fillOpacity="0.55" letterSpacing="1.5">{r.label}</text>
        </g>
      ))}
      <text x="492" y="164" textAnchor="middle" fontSize="10" fill="#17c3e6" fillOpacity="0.8" letterSpacing="1" transform="rotate(90 492 160)">{copy.techDiagrams.CloudDiagram.text06_replicated_data}</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* DevOps & CI/CD — a pipeline whose stages light up as a change passes. */
/* ------------------------------------------------------------------ */
const pipeline = ["Plan", "Code", "Build", "Test", "Deploy", "Monitor"];

export function PipelineDiagram() {
  return (
    <div role="img" aria-label={copy.techDiagrams.PipelineDiagram.arialabel01_ci_cd_pipeline_plan} className="relative">
      <div aria-hidden="true" className="absolute top-7 right-[8%] left-[8%] hidden h-px bg-white/15 sm:block" />
      <div aria-hidden="true" className="pipeline-token absolute top-7 left-[8%] hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_18px_4px_rgb(23_195_230/0.7)] sm:block" />
      <ol className="relative grid grid-cols-3 gap-y-8 sm:grid-cols-6">
        {pipeline.map((step, i) => (
          <li key={step} className="flex flex-col items-center gap-3 text-center">
            <span
              className="pipeline-stage grid size-14 place-items-center rounded-2xl bg-white/[0.06] font-display text-sm text-white/80 ring-1 ring-white/15 backdrop-blur-md"
              // The token takes 6s to cross, reaching stage i at i × 6 / (stages − 1) seconds.
              style={d(i * (6 / (pipeline.length - 1)))}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-medium tracking-tight text-white/85">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-8 flex items-center justify-center gap-2 text-xs tracking-[0.16em] text-white/45 uppercase">
        <span aria-hidden="true" className="h-px w-8 bg-white/25" />{copy.techDiagrams.PipelineDiagram.text02_continuous_feedback_loop}<span aria-hidden="true" className="h-px w-8 bg-white/25" />
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cybersecurity — a radar sweep around a shield, blocking threats.    */
/* ------------------------------------------------------------------ */
export function SecurityRadar() {
  const threats = [
    { x: 70, y: 90, k: 0 },
    { x: 250, y: 70, k: 1 },
    { x: 280, y: 230, k: 2 },
    { x: 60, y: 240, k: 3 },
  ];
  return (
    <svg viewBox="0 0 320 320" role="img" aria-label={copy.techDiagrams.SecurityRadar.arialabel01_security_radar_a_protected} className="h-auto w-full">
      <defs>
        <radialGradient id="radar-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#34d399" stopOpacity="0.25" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="radar-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34d399" stopOpacity="0" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <circle cx="160" cy="160" r="150" fill="url(#radar-glow)" />
      {[150, 112, 74].map((r) => (
        <circle key={r} cx="160" cy="160" r={r} fill="none" stroke="#34d399" strokeOpacity="0.28" strokeDasharray="3 5" />
      ))}
      <path d="M160 10 V310 M10 160 H310" stroke="#34d399" strokeOpacity="0.12" />
      <g className="sweep">
        <path d="M160 160 L160 10 A150 150 0 0 1 266 54 Z" fill="url(#radar-beam)" />
      </g>
      {threats.map((t) => (
        <g key={t.k} className="threat" style={d(t.k * 0.9)}>
          <circle cx={t.x} cy={t.y} r="6" fill="#f87171" />
          <circle cx={t.x} cy={t.y} r="12" fill="none" stroke="#f87171" strokeOpacity="0.6" />
          <path d={`M${t.x - 5} ${t.y - 5} l10 10 m0 -10 l-10 10`} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      {/* Protected core */}
      <path
        d="M160 118 L192 130 V158 C192 180 178 196 160 204 C142 196 128 180 128 158 V130 Z"
        fill="#052e22"
        stroke="#34d399"
        strokeWidth="2"
      />
      <path d="M146 160 l10 10 l20 -22" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Containers & Kubernetes — a control plane scheduling pods on nodes. */
/* ------------------------------------------------------------------ */
export function ClusterDiagram() {
  const nodes = [
    { label: copy.techDiagrams.ClusterDiagram.label01_node_1, pods: ["web", "web", "api"] },
    { label: copy.techDiagrams.ClusterDiagram.label02_node_2, pods: ["api", "web", "db"] },
    { label: copy.techDiagrams.ClusterDiagram.label03_node_3, pods: ["web", "api", "job"] },
  ];
  const tone: Record<string, string> = {
    web: "bg-accent/80",
    api: "bg-brand-light/90",
    db: "bg-iris/90",
    job: "bg-emerald-400/80",
  };
  return (
    <div role="img" aria-label={copy.techDiagrams.ClusterDiagram.arialabel04_kubernetes_cluster_a_control} className="relative">
      <div className="mx-auto w-fit rounded-2xl bg-white/[0.07] px-5 py-3 text-center ring-1 ring-white/15 backdrop-blur-md">
        <p className="text-eyebrow text-accent">{copy.techDiagrams.ClusterDiagram.text05_control_plane}</p>
        <p className="mt-1 text-xs text-white/60">{copy.techDiagrams.ClusterDiagram.text06_schedules_heals_scales}</p>
      </div>
      {/* Links from the control plane to each node */}
      <svg viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true" className="h-10 w-full">
        {[50, 150, 250].map((x) => (
          <path key={x} className="flow" d={`M150 0 L${x} 40`} stroke="#17c3e6" strokeOpacity="0.6" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="grid grid-cols-3 gap-3">
        {nodes.map((node, n) => (
          <div key={node.label} className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/12">
            <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-white/55 uppercase">{node.label}</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {node.pods.map((pod, p) => (
                <li
                  key={`${pod}-${p}`}
                  className={`pod flex h-9 items-center justify-center rounded-lg text-[0.625rem] font-semibold tracking-wide text-midnight uppercase ${tone[pod]}`}
                  style={d(n * 0.6 + p * 0.45)}
                >
                  {pod}
                </li>
              ))}
              {/* A new replica being scheduled in. */}
              <li
                className="pod-spawn flex h-9 items-center justify-center rounded-lg border border-dashed border-white/30 text-[0.625rem] tracking-wide text-white/60 uppercase"
                style={d(n * 1.1)}
              >{copy.techDiagrams.ClusterDiagram.text07_1}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Data & Observability — metrics, logs and traces on one dashboard.   */
/* ------------------------------------------------------------------ */
const logLines = [
  ["INFO", "request completed", "GET /orders 200"],
  ["INFO", "cache refreshed", "region-a"],
  ["WARN", "latency above target", "checkout"],
  ["INFO", "deployment healthy", "api v2"],
  ["INFO", "backup verified", "nightly"],
  ["ERROR", "connection retried", "db-replica"],
  ["INFO", "alert resolved", "auto-heal"],
];

export function ObservabilityDashboard() {
  const spark = "M0 60 L30 52 L60 56 L90 38 L120 44 L150 30 L180 36 L210 22 L240 28 L270 14 L300 20";
  return (
    <div
      role="img"
      aria-label={copy.techDiagrams.ObservabilityDashboard.arialabel01_illustrative_observability_dashboard}
      className="grid gap-3 rounded-[1.75rem] bg-white/[0.04] p-3 ring-1 ring-white/10 backdrop-blur-md sm:grid-cols-5 sm:p-4"
    >
      {/* Metrics */}
      <div className="rounded-2xl bg-abyss/80 p-4 ring-1 ring-white/10 sm:col-span-3">
        <div className="flex items-center justify-between">
          <p className="text-eyebrow text-accent">{copy.techDiagrams.ObservabilityDashboard.text02_metrics}</p>
          <span className="flex items-center gap-1.5 text-[0.6875rem] text-emerald-300">
            <span className="blink size-1.5 rounded-full bg-emerald-400" style={d(0)} />{copy.techDiagrams.ObservabilityDashboard.text03_live}</span>
        </div>
        <svg viewBox="0 0 300 70" className="mt-3 h-20 w-full" aria-hidden="true" preserveAspectRatio="none">
          <path d={`${spark} L300 70 L0 70 Z`} fill="#17c3e6" fillOpacity="0.12" />
          <path className="spark-draw" pathLength={100} d={spark} fill="none" stroke="#17c3e6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-3 flex h-14 items-end gap-1.5" aria-hidden="true">
          {[40, 65, 50, 80, 55, 90, 70, 60, 85, 75, 95, 68].map((h, i) => (
            <span key={i} className="bar-pulse flex-1 origin-bottom rounded-sm bg-brand-light/70" style={{ height: `${h}%`, ...d(i * 0.15) }} />
          ))}
        </div>
      </div>
      {/* Logs */}
      <div className="h-56 overflow-clip rounded-2xl bg-abyss/80 p-4 ring-1 ring-white/10 sm:col-span-2 sm:h-auto">
        <p className="text-eyebrow text-accent">{copy.techDiagrams.ObservabilityDashboard.text04_logs}</p>
        <div className="relative mt-3 h-[calc(100%-1.75rem)] overflow-clip [mask-image:linear-gradient(transparent,#000_15%,#000_85%,transparent)]">
          <ul className="log-scroll space-y-2 font-mono text-[0.6875rem] leading-tight" aria-hidden="true">
            {[...logLines, ...logLines].map(([level, message, detail], i) => (
              <li key={i} className="flex gap-2">
                <span className={level === "ERROR" ? "text-red-300" : level === "WARN" ? "text-amber-300" : "text-emerald-300"}>{level}</span>
                <span className="truncate text-white/70">
                  {message} <span className="text-white/40">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Trace */}
      <div className="rounded-2xl bg-abyss/80 p-4 ring-1 ring-white/10 sm:col-span-5">
        <p className="text-eyebrow text-accent">{copy.techDiagrams.ObservabilityDashboard.text05_trace}</p>
        <ul className="mt-3 space-y-2" aria-hidden="true">
          {[
            ["gateway", 0, 100],
            ["auth", 4, 18],
            ["orders-api", 22, 62],
            ["database", 30, 34],
            ["cache", 66, 12],
          ].map(([name, start, width], i) => (
            <li key={name as string} className="grid grid-cols-[6rem_1fr] items-center gap-3 text-[0.6875rem] text-white/60">
              <span className="truncate font-mono">{name}</span>
              <span className="relative h-2.5 rounded-full bg-white/5">
                <span
                  className="draw-x absolute inset-y-0 rounded-full bg-[linear-gradient(90deg,var(--color-brand-light),var(--color-accent))]"
                  style={{ left: `${start}%`, width: `${width}%`, ...d(i * 0.1) }}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
