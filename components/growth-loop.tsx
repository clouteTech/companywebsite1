"use client";

import { Check, Heart, MessageCircle, Search, Send, Star } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

interface Stage {
  title: string;
  text: string;
}

/** Sample wording shown inside the window (content/services.json, serviceExtras.GrowthEngine.scenes). */
export interface Scenes {
  reach: { query: string; ad: string[]; you: string[]; others: string[][] };
  engage: { name: string; tag: string; caption: string; liked: string };
  convert: {
    name: string;
    nameValue: string;
    email: string;
    emailValue: string;
    message: string;
    messageValue: string;
    button: string;
    toast: string;
    toastSub: string;
  };
  measure: {
    title: string;
    visits: string;
    enquiries: string;
    months: string[];
  };
}

const STEP_MS = 5600;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Scene 1, Reach: a query types itself, then the results slide in, with the business highlighted. */
function Reach({ s }: { s: Scenes["reach"] }) {
  return (
    <div className="gs">
      <div className="gs-search">
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="gs-type" style={v({ "--chars": s.query.length })}>
          {s.query}
        </span>
      </div>
      <div className="gs-results">
        <div className="gs-result gs-ad" style={v({ "--i": 0 })}>
          <em>Ad</em>
          <b>{s.ad[0]}</b>
          <small>{s.ad[1]}</small>
        </div>
        <div className="gs-result gs-you" style={v({ "--i": 1 })}>
          <Star className="size-4" aria-hidden="true" />
          <b>{s.you[0]}</b>
          <small>{s.you[1]}</small>
        </div>
        {s.others.map((item, i) => (
          <div key={item[0]} className="gs-result" style={v({ "--i": i + 2 })}>
            <b>{item[0]}</b>
            <small>{item[1]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Scene 2, Engage: a post with a caption, a heart that pops and hearts floating away. */
function Engage({ s }: { s: Scenes["engage"] }) {
  return (
    <div className="gs gs-engage">
      <div className="gs-post">
        <div className="gs-post-head">
          <i />
          <span>{s.name}</span>
        </div>
        <div className="gs-post-img">
          <strong>{s.tag}</strong>
        </div>
        <div className="gs-post-actions">
          <Heart className="gs-heart size-5" aria-hidden="true" />
          <MessageCircle className="size-5" aria-hidden="true" />
          <Send className="size-5" aria-hidden="true" />
          <em>{s.liked}</em>
        </div>
        <p className="gs-caption">
          <b>{s.name}</b> {s.caption}
        </p>
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Heart
          key={i}
          className="gs-float size-5"
          aria-hidden="true"
          style={v({ "--i": i })}
        />
      ))}
    </div>
  );
}

/** Scene 3, Convert: a short form filling in, the button pressed and an enquiry arriving. */
function Convert({ s }: { s: Scenes["convert"] }) {
  const fields = [
    [s.name, s.nameValue],
    [s.email, s.emailValue],
    [s.message, s.messageValue],
  ];
  return (
    <div className="gs gs-convert">
      <div className="gs-form">
        {fields.map(([label, value], i) => (
          <div key={label} className="gs-field" style={v({ "--i": i })}>
            <small>{label}</small>
            <span className="gs-type" style={v({ "--chars": value.length })}>
              {value}
            </span>
          </div>
        ))}
        <span className="gs-button">
          <Send className="size-4" aria-hidden="true" />
          {s.button}
        </span>
      </div>
      <div className="gs-toast">
        <span className="gs-toast-icon">
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        </span>
        <div>
          <b>{s.toast}</b>
          <small>{s.toastSub}</small>
        </div>
      </div>
    </div>
  );
}

/** Scene 4, Measure: a titled chart, a line drawing itself over growing bars, with month labels and a legend. */
function Measure({ s }: { s: Scenes["measure"] }) {
  return (
    <div className="gs gs-measure">
      <div className="gs-chart-head">
        <b>{s.title}</b>
        <span>
          <i className="gs-dot-a" />
          {s.visits}
          <i className="gs-dot-b" />
          {s.enquiries}
        </span>
      </div>
      <div className="gs-plot">
        <svg
          viewBox="0 0 220 90"
          preserveAspectRatio="none"
          className="gs-line"
          aria-hidden="true"
        >
          <path
            className="gs-area"
            d="M0 78 L34 62 L68 68 L104 40 L140 50 L176 22 L220 8 V90 H0z"
          />
          <path
            className="gs-stroke"
            d="M0 78 L34 62 L68 68 L104 40 L140 50 L176 22 L220 8"
            pathLength="1"
          />
        </svg>
        <div className="gs-bars">
          {[46, 70, 54, 86, 64, 96].map((h, i) => (
            <i key={i} style={v({ "--h": `${h}%`, "--i": i })} />
          ))}
        </div>
      </div>
      <div className="gs-months">
        {s.months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}

const addresses = [
  "yourbusiness.com/search",
  "yourbusiness.com/social",
  "yourbusiness.com/contact",
  "yourbusiness.com/reports",
];

/*
 * The marketing loop as a story: a browser window plays four short scenes in turn (found in search, a post liked,
 * a form sent and an enquiry arriving, a chart climbing), each with readable sample wording, while the four stages
 * listed beside it light up in step. It runs while it is on screen; the list can be clicked to jump to a stage.
 * The sample content is generic and shows no figures or results. Styles in globals.css (.ge-*, .gs-*).
 */
export function GrowthLoop({
  stages,
  scenes,
  sample,
}: {
  stages: Stage[];
  scenes: Scenes;
  sample: string;
}) {
  const count = stages.length;
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(
      () => setActive((n) => (n + 1) % count),
      STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [visible, active, count]);

  const scene = [
    <Reach key="reach" s={scenes.reach} />,
    <Engage key="engage" s={scenes.engage} />,
    <Convert key="convert" s={scenes.convert} />,
    <Measure key="measure" s={scenes.measure} />,
  ][active % 4];

  return (
    <div ref={rootRef} className="ge">
      <div>
        <div className="ge-window" aria-hidden="true">
          <div className="ge-window-bar">
            <i />
            <i />
            <i />
            <span>{addresses[active % addresses.length]}</span>
          </div>
          <div className="ge-stage" key={active}>
            {scene}
          </div>
          <span className="ge-glow" />
        </div>
        <p className="ge-sample">{sample}</p>
      </div>

      <ol className="ge-list">
        {stages.map((stage, i) => (
          <li
            key={stage.title}
            className="ge-item"
            data-on={i === active || undefined}
          >
            <button
              type="button"
              onClick={() => setActive(i)}
              className="ge-item-btn"
            >
              <span className="ge-item-no">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="ge-item-body">
                <span className="ge-item-title">{stage.title}</span>
                <span className="ge-item-text">{stage.text}</span>
              </span>
              <span aria-hidden="true" className="ge-item-bar">
                {i === active ? (
                  <i key={active} style={v({ "--ms": `${STEP_MS}ms` })} />
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
