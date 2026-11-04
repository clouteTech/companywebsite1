"use client";

import { ArrowRight, CalendarDays, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";

import { BlogShare } from "@/components/blog-share";
import copy from "@/content/blogs.json";

type Post = (typeof copy.posts)[number];

/**
 * "Top 5 trending": a photo stage that cross-fades between the five stories, with a ranked tab list beside it
 * (styles in globals.css, .tr-*). The active tab fills a progress bar and, when it completes, the next story
 * takes over. Hovering or focusing the block pauses it; reduced motion turns the autoplay off.
 */
export function TrendingShowcase({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pad = (n: number) => String(n + 1).padStart(2, "0");
  const next = () => setActive((current) => (current + 1) % posts.length);

  return (
    <div
      className="tr-wrap"
      data-paused={paused || undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="tr-stage border-glow reveal">
        {posts.map((post, i) => (
          <article key={post.slug} className="tr-slide" data-active={i === active || undefined} aria-hidden={i !== active}>
            <Image
              src={post.image}
              alt={i === active ? post.imageAlt : ""}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="tr-slide-img object-cover"
            />
            <div aria-hidden="true" className="tr-slide-shade" />
            <span aria-hidden="true" className="tr-big">
              {pad(i)}
            </span>
            <div className="tr-copy">
              <span className="bl-hot">
                <TrendingUp className="size-3.5" />
                {copy.page.hotLabel} · #{i + 1}
              </span>
              <time dateTime={post.isoDate} className="text-eyebrow tr-line mt-5 flex items-center gap-2 text-accent" style={{ "--d": 1 } as CSSProperties}>
                <CalendarDays className="size-3.5" />
                {post.date} · {post.category}
              </time>
              <h3 className="tr-line mt-3 font-display text-[clamp(1.5rem,2.5vw,2.3rem)] leading-[1.15] font-semibold text-white" style={{ "--d": 2 } as CSSProperties}>
                <Link href={`/blogs/${post.slug}`} tabIndex={i === active ? 0 : -1} className="transition-colors hover:text-accent">
                  {post.title}
                </Link>
              </h3>
              <p className="tr-line mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/75" style={{ "--d": 3 } as CSSProperties}>
                {post.excerpt}
              </p>
              <div className="tr-line mt-6 flex flex-wrap items-center justify-between gap-4" style={{ "--d": 4 } as CSSProperties}>
                <Link href={`/blogs/${post.slug}`} tabIndex={i === active ? 0 : -1} className="btn btn-primary">
                  {copy.page.readMore}
                  <ArrowRight className="size-4" />
                </Link>
                <BlogShare slug={post.slug} title={post.title} dark />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="tr-tabs reveal" role="tablist" aria-label={copy.page.trendingTabs} style={{ "--n": posts.length } as CSSProperties}>
        {posts.map((post, i) => (
          <button
            key={post.slug}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className="tr-tab"
            data-active={i === active || undefined}
            style={{ "--i": i } as CSSProperties}
          >
            <span className="bl-thumb">
              <Image src={post.image} alt="" fill sizes="96px" className="object-cover" />
              <span className="bl-thumb-rank" aria-hidden="true">
                {pad(i)}
              </span>
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="text-eyebrow block text-accent/90">{post.category}</span>
              <span className="mt-1 block font-display text-[0.98rem] leading-snug font-semibold text-white">{post.title}</span>
            </span>
            {i === active ? <span className="tr-progress" onAnimationEnd={next} aria-hidden="true" /> : null}
          </button>
        ))}
        <p className="tr-hint" aria-hidden="true">
          {copy.page.trendingHint}
        </p>
      </div>
    </div>
  );
}
