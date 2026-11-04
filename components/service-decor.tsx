import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Cog,
  Heart,
  Megaphone,
  MessageCircle,
  Search,
  ShieldCheck,
  ShieldX,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import cms from "@/content/services.json";

/*
 * Animated hero backdrops, one per service page (styles in globals.css, .decor-*). They are purely
 * decorative: aria-hidden, behind the hero copy, and never take pointer events.
 */

export type DecorKind = "network" | "code" | "support" | "managed" | "cyber" | "cloud" | "marketing";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Networking: a mesh of nodes, with packets travelling along the links. */
function NetworkDecor() {
  const nodes = [
    [120, 140],
    [360, 90],
    [560, 230],
    [300, 380],
    [80, 520],
    [470, 560],
    [700, 420],
    [860, 160],
    [1040, 330],
    [920, 620],
    [1150, 560],
    [640, 720],
  ];
  const links = [
    [0, 1],
    [1, 2],
    [0, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [2, 6],
    [5, 6],
    [6, 7],
    [7, 8],
    [6, 8],
    [8, 9],
    [9, 10],
    [8, 10],
    [5, 11],
    [9, 11],
    [1, 7],
  ];
  return (
    <svg className="decor decor-network" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      {links.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
      ))}
      {links
        .filter((_, i) => i % 2 === 0)
        .map(([a, b], i) => (
          <circle key={`p${a}-${b}`} r="3.5" className="decor-packet">
            <animateMotion
              dur={`${4 + (i % 4)}s`}
              begin={`${-i * 0.7}s`}
              repeatCount="indefinite"
              path={`M${nodes[a][0]},${nodes[a][1]} L${nodes[b][0]},${nodes[b][1]}`}
            />
          </circle>
        ))}
      {nodes.map(([x, y], i) => (
        <g key={i} className="decor-node" style={v({ "--i": i })}>
          <circle cx={x} cy={y} r="14" className="decor-node-halo" />
          <circle cx={x} cy={y} r="5" />
        </g>
      ))}
    </svg>
  );
}

const codeLines = cms.serviceDecor.codeLines;

/** Software: two columns of code drifting upwards, with a blinking caret. */
function CodeDecor() {
  const column = [...codeLines, ...codeLines];
  return (
    <div className="decor decor-code">
      {[0, 1].map((col) => (
        <div key={col} className="decor-code-col" style={v({ "--col": col })}>
          {column.map((line, i) => (
            <p key={i}>
              <span className="decor-code-ln">{String((i % codeLines.length) + 1).padStart(2, "0")}</span>
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

/** IT support: rings pulsing out like a signal, and chat bubbles with typing dots. */
function SupportDecor() {
  return (
    <>
      <div className="decor decor-support">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="decor-ring" style={v({ "--i": i })} />
        ))}
        {[0, 1].map((i) => (
          <span key={i} className={`decor-bubble decor-bubble-${i}`}>
            <MessageCircle className="size-4" strokeWidth={2} />
            <span className="decor-typing">
              <i />
              <i />
              <i />
            </span>
          </span>
        ))}
      </div>
      {/* An illustrative helpdesk chat that plays through on a loop; it sits above the hero photo. */}
      <div className="decor-chat">
        <p className="decor-chat-head">
          <span className="decor-chat-dot" />{cms.serviceDecor.SupportDecor.text01_helpdesk_chat}</p>
        <p className="decor-msg decor-msg-user">{cms.serviceDecor.SupportDecor.text02_our_office_wi_fi}</p>
        <span className="decor-msg decor-msg-typing decor-typing">
          <i />
          <i />
          <i />
        </span>
        <p className="decor-msg decor-msg-agent">{cms.serviceDecor.SupportDecor.text03_on_it_connecting_remotely}</p>
        <p className="decor-msg decor-msg-done">
          <CheckCircle2 className="size-3.5" strokeWidth={2.25} />{cms.serviceDecor.SupportDecor.text04_issue_resolved}</p>
      </div>
    </>
  );
}

/** Managed IT: slowly meshing gears and a live bar chart. */
function ManagedDecor() {
  return (
    <div className="decor decor-managed">
      <Cog className="decor-gear decor-gear-a" strokeWidth={0.75} />
      <Cog className="decor-gear decor-gear-b" strokeWidth={0.75} />
      <Cog className="decor-gear decor-gear-c" strokeWidth={0.75} />
      <div className="decor-bars">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span key={i} style={v({ "--i": i })} />
        ))}
      </div>
    </div>
  );
}

/** Cybersecurity: a radar sweep with blips, and a scan line passing down the hero. */
function CyberDecor() {
  return (
    <div className="decor decor-cyber">
      <div className="decor-radar">
        <span className="decor-radar-sweep" />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`decor-blip decor-blip-${i}`} />
        ))}
        <ShieldCheck className="decor-radar-shield" strokeWidth={1.25} />
      </div>
      <span className="decor-scan" />
    </div>
  );
}

/** Cloud: soft clouds drifting across and particles rising like uploads. */
function CloudDecor() {
  return (
    <div className="decor decor-cloud">
      {[0, 1, 2, 3, 4].map((i) => (
        <Cloud key={i} className={`decor-cloud-shape decor-cloud-${i}`} strokeWidth={0.75} />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="decor-particle" style={v({ "--i": i, "--x": `${(i * 37) % 100}%` })} />
      ))}
    </div>
  );
}

/** Digital marketing: a bar chart growing along the bottom, with likes, searches and shares floating up. */
function MarketingDecor() {
  const icons = [Heart, ThumbsUp, Search, Megaphone, Heart, TrendingUp, ThumbsUp, Search];
  return (
    <div className="decor decor-marketing">
      <div className="decor-mkt-chart">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={v({ "--i": i, "--h": `${18 + ((i * 29) % 50) + i * 2.5}%` })} />
        ))}
      </div>
      {icons.map((Icon, i) => (
        <Icon
          key={i}
          className="decor-mkt-float"
          strokeWidth={1.5}
          style={v({ "--i": i, "--x": `${6 + ((i * 41) % 88)}%` })}
        />
      ))}
    </div>
  );
}

/*
 * Illustrative status widgets that sit over the hero photo on wide screens, each playing a short
 * loop (the support page has its chat instead). Steps appear in order via .decor-step-1…4.
 */
function NetworkWidget() {
  return (
    <div className="decor-widget">
      <p className="decor-chat-head">
        <span className="decor-chat-dot" />{cms.serviceDecor.NetworkWidget.text01_network_status}</p>
      <svg className="decor-spark" viewBox="0 0 200 48" preserveAspectRatio="none">
        <path d="M0 38 L20 30 L40 34 L60 18 L80 24 L100 12 L120 22 L140 9 L160 16 L180 6 L200 12" />
      </svg>
      {["Core switch", "Firewall", "Wi-Fi access points"].map((label, i) => (
        <p key={label} className={`decor-row decor-step-${i + 1}`}>
          {label}
          <span className="decor-ok">{cms.serviceDecor.NetworkWidget.text02_online}</span>
        </p>
      ))}
    </div>
  );
}

function CodeWidget() {
  return (
    <div className="decor-widget decor-terminal">
      <p className="decor-chat-head">
        <span className="decor-term-dots">
          <i />
          <i />
          <i />
        </span>{cms.serviceDecor.CodeWidget.text01_terminal}</p>
      <p className="decor-term-line decor-step-1">
        <span className="decor-term-prompt">$</span>{cms.serviceDecor.CodeWidget.text02_npm_run_build}</p>
      <p className="decor-term-line decor-step-2 decor-term-ok">{cms.serviceDecor.CodeWidget.text03_compiled_successfully}</p>
      <p className="decor-term-line decor-step-3 decor-term-ok">{cms.serviceDecor.CodeWidget.text04_all_tests_passed}</p>
      <p className="decor-term-line decor-step-4 decor-term-accent">{cms.serviceDecor.CodeWidget.text05_deployed_to_production}</p>
    </div>
  );
}

function ManagedWidget() {
  return (
    <div className="decor-widget">
      <p className="decor-chat-head">
        <span className="decor-chat-dot" />{cms.serviceDecor.ManagedWidget.text01_system_health}</p>
      <div className="decor-gauges">
        {["Monitoring", "Backups", "Updates"].map((label, i) => (
          <span key={label} className="decor-gauge-wrap">
            <span className="decor-gauge" style={v({ "--i": i })}>
              <CheckCircle2 className="size-4" strokeWidth={2.25} />
            </span>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CyberWidget() {
  return (
    <div className="decor-widget decor-alerts">
      <p className="decor-alert decor-alert-warn decor-step-1">
        <AlertTriangle className="size-4 shrink-0" strokeWidth={2} />{cms.serviceDecor.CyberWidget.text01_suspicious_login_detected}</p>
      <p className="decor-alert decor-alert-block decor-step-2">
        <ShieldX className="size-4 shrink-0" strokeWidth={2} />{cms.serviceDecor.CyberWidget.text02_threat_blocked_by_firewall}</p>
      <p className="decor-msg-done decor-step-3">
        <ShieldCheck className="size-3.5" strokeWidth={2.25} />{cms.serviceDecor.CyberWidget.text03_all_systems_secure}</p>
    </div>
  );
}

function CloudWidget() {
  return (
    <div className="decor-widget">
      <p className="decor-chat-head">
        <Cloud className="size-3.5" strokeWidth={2} />{cms.serviceDecor.CloudWidget.text01_migrating_to_cloud}</p>
      <span className="decor-progress">
        <span />
      </span>
      {["Databases", "Applications", "File storage"].map((label, i) => (
        <p key={label} className={`decor-row decor-step-${i + 1}`}>
          {label}
          <CheckCircle2 className="size-4 text-[#4ade80]" strokeWidth={2.25} />
        </p>
      ))}
      <p className="decor-msg-done decor-step-4">
        <CheckCircle2 className="size-3.5" strokeWidth={2.25} />{cms.serviceDecor.CloudWidget.text02_migration_complete}</p>
    </div>
  );
}

function MarketingWidget() {
  return (
    <div className="decor-widget">
      <p className="decor-chat-head">
        <TrendingUp className="size-3.5" strokeWidth={2} />{cms.serviceDecor.MarketingWidget.text01_campaign_performance}</p>
      <svg className="decor-spark" viewBox="0 0 200 48" preserveAspectRatio="none">
        <path d="M0 44 L25 40 L50 42 L75 32 L100 34 L125 22 L150 24 L175 10 L200 4" />
      </svg>
      {["Website visitors", "Search ranking", "New enquiries"].map((label, i) => (
        <p key={label} className={`decor-row decor-step-${i + 1}`}>
          {label}
          <TrendingUp className="size-4 text-[#4ade80]" strokeWidth={2.25} />
        </p>
      ))}
    </div>
  );
}

const widgets: Partial<Record<DecorKind, ComponentType>> = {
  network: NetworkWidget,
  code: CodeWidget,
  managed: ManagedWidget,
  cyber: CyberWidget,
  cloud: CloudWidget,
  marketing: MarketingWidget,
};

const decors = {
  network: NetworkDecor,
  code: CodeDecor,
  support: SupportDecor,
  managed: ManagedDecor,
  cyber: CyberDecor,
  cloud: CloudDecor,
  marketing: MarketingDecor,
};

export function ServiceDecor({ kind }: { kind: DecorKind }) {
  const Decor = decors[kind];
  const Widget = widgets[kind];
  return (
    // No z-index here, so the chat widget can rise above the photo; the backdrops sit at z-index -1.
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip">
      <Decor />
      {Widget ? <Widget /> : null}
    </div>
  );
}
