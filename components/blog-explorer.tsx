"use client";

import { ArrowRight, CalendarDays, Phone, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { BlogShare } from "@/components/blog-share";
import { company } from "@/lib/site";
import copy from "@/content/blogs.json";

type Post = (typeof copy.posts)[number];

/**
 * The "Latest articles" block: image cards in a grid beside a sticky sidebar with search, topics, an about
 * note and a help card (styles in globals.css, .bl-*). Search and topic chips filter the cards as you type.
 */
export function BlogExplorer({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>(copy.page.allLabel);

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) => counts.set(post.category, (counts.get(post.category) ?? 0) + 1));
    return [...counts.entries()];
  }, [posts]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (post) =>
        (topic === copy.page.allLabel || post.category === topic) &&
        (!q || `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(q)),
    );
  }, [posts, query, topic]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_22rem] xl:gap-10">
      <div>
        <p className="mb-5 text-sm text-white/55" aria-live="polite">
          {shown.length} {copy.page.articleCount}
        </p>
        {shown.length === 0 ? (
          <p className="bl-empty">{copy.page.noResults}</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {shown.map((post, i) => (
              <li key={post.slug} className="bl-pop" style={{ "--i": i } as React.CSSProperties}>
                <article className="bl-card group">
                  <Link href={`/blogs/${post.slug}`} className="bl-card-media" tabIndex={-1} aria-hidden="true">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                    <span className="bl-date">
                      <CalendarDays className="size-3.5" />
                      {post.date}
                    </span>
                    <span className="bl-tag">{post.category}</span>
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[1.15rem] leading-snug font-semibold text-white">
                      <Link href={`/blogs/${post.slug}`} className="transition-colors hover:text-accent">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-white/65">{post.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:text-accent"
                      >
                        {copy.page.readMore}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <BlogShare slug={post.slug} title={post.title} dark />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="grid content-start gap-6 lg:sticky lg:top-28 lg:self-start">
        <section className="bl-side">
          <h3 className="bl-side-title">{copy.page.searchTitle}</h3>
          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="mt-5 grid gap-3"
          >
            <label className="sr-only" htmlFor="blog-search">
              {copy.page.searchTitle}
            </label>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.page.searchPlaceholder}
              className="bl-input"
            />
            <button type="submit" className="btn btn-primary justify-center">
              <Search className="size-4" />
              {copy.page.searchButton}
            </button>
          </form>
        </section>

        <section className="bl-side">
          <h3 className="bl-side-title">{copy.page.topicsTitle}</h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {[[copy.page.allLabel, posts.length] as const, ...topics].map(([name, count]) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => setTopic(name)}
                  aria-pressed={topic === name}
                  className="bl-chip"
                  data-on={topic === name || undefined}
                >
                  {name}
                  <span>{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="bl-side">
          <h3 className="bl-side-title">{copy.page.aboutTitle}</h3>
          <p className="mt-5 text-[0.9rem] leading-relaxed text-white/65">{copy.page.aboutText}</p>
        </section>

        <section className="bl-help">
          <h3 className="font-display text-lg font-semibold text-white">{copy.page.helpTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/80">{copy.page.helpText}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-glass">
              {copy.page.helpCta}
              <ArrowRight className="size-4" />
            </Link>
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="bl-call" aria-label={company.phone}>
              <Phone className="size-4" />
              {company.phone}
            </a>
          </div>
        </section>
      </aside>
    </div>
  );
}
