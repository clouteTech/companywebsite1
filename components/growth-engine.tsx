import { GrowthLoop } from "./growth-loop";
import { SectionHeading } from "./sections";
import copy from "@/content/services.json";

/*
 * Digital marketing page, straight after the overview: how a marketing plan runs as a loop (reach, engage,
 * convert, measure), drawn as a ring a light travels round. The stages describe the approach in general terms and
 * make no promise about results. Styles in globals.css (.ge-*).
 */

const ui = copy.serviceExtras.GrowthEngine;

export function GrowthEngine() {
  return (
    <section className="ge-section section-y relative isolate overflow-clip">
      <span aria-hidden="true" className="ge-wash" />
      <div className="shell">
        <SectionHeading eyebrow={ui.eyebrow} title={ui.title} text={ui.text} />
        <div className="mt-14 lg:mt-16">
          <GrowthLoop
            stages={ui.stages}
            scenes={ui.scenes}
            sample={ui.sample}
          />
        </div>
      </div>
    </section>
  );
}
