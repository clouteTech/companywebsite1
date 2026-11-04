import { Flame } from "lucide-react";
import type { Metadata } from "next";

import { BlogExplorer } from "@/components/blog-explorer";
import { CtaBand, PageHero, SplitText } from "@/components/sections";
import { TrendingShowcase } from "@/components/trending-showcase";
import copy from "@/content/blogs.json";
import globalNetwork from "@/public/images/global-network.jpg";

export const metadata: Metadata = copy.metadata;

export default function BlogsPage() {
  // Posts flagged "trending" in content/blogs.json make up the Top 5 showcase.
  const trending = copy.posts.filter((post) => post.trending).slice(0, 5);

  return (
    <>
      <PageHero
        title={copy.page.title}
        tagline={copy.page.tagline}
        crumbs={[copy.page.crumb]}
        image={globalNetwork}
        primary={{ label: copy.page.heroCta, href: "#trending" }}
        size="compact"
      />

      <section id="trending" className="on-dark bl-trending relative isolate overflow-clip bg-midnight pt-20 pb-8 text-white lg:pt-28">
        <div aria-hidden="true" className="bl-glow bl-glow-a" />
        <div aria-hidden="true" className="bl-glow bl-glow-b" />
        <div className="shell">
          <div className="reveal flex items-center gap-3">
            <span className="bl-flame" aria-hidden="true">
              <Flame className="size-5" />
            </span>
            <p className="text-eyebrow text-accent">{copy.page.trendingEyebrow}</p>
          </div>
          <h2 className="text-heading split-scroll mt-4 max-w-3xl">
            <SplitText text={copy.page.trendingTitle} />
          </h2>
          <TrendingShowcase posts={trending} />
        </div>
      </section>

      <section className="on-dark bl-trending relative isolate overflow-clip bg-midnight pt-12 pb-24 text-white lg:pb-32">
        <div className="shell">
          <div className="reveal">
            <p className="text-eyebrow text-accent">{copy.page.latestEyebrow}</p>
          </div>
          <h2 className="text-heading split-scroll mt-4 mb-12 max-w-3xl">
            <SplitText text={copy.page.latestTitle} />
          </h2>
          <BlogExplorer posts={copy.posts} />
        </div>
      </section>

      <CtaBand title={copy.page.ctaTitle} text={copy.page.ctaText} />
    </>
  );
}
