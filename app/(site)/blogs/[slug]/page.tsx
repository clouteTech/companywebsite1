import { ArrowLeft, ArrowRight, CalendarDays, Clock, ListTree, MessageCircle, Sparkles, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type CSSProperties, type ReactNode } from "react";

import { BlogShare } from "@/components/blog-share";
import { CtaBand, PageHero, stagger } from "@/components/sections";
import { SocialIcon } from "@/components/social-icon";
import { company, serviceLinks, socials } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import copy from "@/content/blogs.json";
import globalNetwork from "@/public/images/global-network.jpg";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return copy.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = copy.posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Cloute Technologies`,
    description: post.excerpt,
    alternates: { canonical: `/blogs/${post.slug}` },
  };
}

const headingId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * The article body is a list of blocks in content/blogs.json: plain text is a paragraph, "## " starts a
 * heading, "> " is a pull quote and consecutive "- " lines make a bullet list.
 */
function renderBody(blocks: string[]) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="ba-list">
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  blocks.forEach((block, i) => {
    if (block.startsWith("- ")) {
      list.push(block.slice(2));
      return;
    }
    flush();
    if (block.startsWith("## ")) out.push(<h2 key={i} id={headingId(block.slice(3))} className="ba-heading">{block.slice(3)}</h2>);
    else if (block.startsWith("> ")) out.push(<blockquote key={i} className="ba-quote">{block.slice(2)}</blockquote>);
    else out.push(<p key={i} className={i === 0 ? "ba-lead" : "ba-p"}>{block}</p>);
  });
  flush();
  return out;
}

// Reading `params` waits for the request, so the article sits inside a Suspense boundary; the slugs are all known
// from generateStaticParams, so in production every article is prerendered anyway.
export default function BlogPostPage(props: { params: Promise<Params> }) {
  return (
    <Suspense fallback={<div aria-hidden="true" className="min-h-[70svh] bg-navy" />}>
      <BlogPost params={props.params} />
    </Suspense>
  );
}

async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = copy.posts.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const post = copy.posts[index];
  const newer = copy.posts[index - 1];
  const older = copy.posts[index + 1];
  // The full article goes in the post's "body" list in content/blogs.json; until then the summary is shown.
  const blocks: string[] = post.body.length ? post.body : [post.excerpt];
  const words = blocks.join(" ").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  const related = copy.posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const headings = blocks.filter((block) => block.startsWith("## ")).map((block) => block.slice(3));
  const topicServices = (copy.categoryServices[post.category as keyof typeof copy.categoryServices] ?? [])
    .map((href) => serviceLinks.find((service) => service.href === href))
    .filter((service) => service !== undefined);
  const chatUrl = whatsappUrl(`Hi ${company.name},\n\n${copy.page.waMessage} "${post.title}" ${copy.page.waMessageEnd}`);

  const meta = [
    { icon: CalendarDays, label: copy.page.publishedLabel, value: post.date },
    { icon: Tag, label: copy.page.topicLabel, value: post.category },
    { icon: Clock, label: copy.page.readTimeLabel, value: `${minutes} ${copy.page.minRead}` },
  ];

  return (
    <>
      <PageHero
        title={post.title}
        tagline={post.category}
        crumbs={[copy.page.crumb, post.title]}
        image={globalNetwork}
        size="compact"
        primary={{ label: copy.page.heroCta, href: "#article" }}
      />

      <article id="article" className="ba relative isolate overflow-clip bg-paper py-16 lg:py-24">
        <div aria-hidden="true" className="ba-blob ba-blob-a" />
        <div aria-hidden="true" className="ba-blob ba-blob-b" />
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[3.5rem_1fr] lg:gap-14 xl:grid-cols-[3.5rem_1fr_4rem]">
            {/* Share rail, pinned beside the article on wide screens. */}
            <div className="hidden lg:block">
              <div className="ba-rail">
                <Link href="/blogs" aria-label={copy.page.backToBlogs} className="ba-back">
                  <ArrowLeft className="size-4" />
                </Link>
                <span aria-hidden="true" className="ba-rail-line" />
                <BlogShare slug={post.slug} title={post.title} vertical />
              </div>
            </div>

            <div className="mx-auto w-full max-w-3xl min-w-0">
              <ul className="grid gap-3 sm:grid-cols-3">
                {meta.map((item, i) => (
                  <li key={item.label} className="ba-meta reveal" style={stagger(i)}>
                    <span className="ba-meta-icon">
                      <item.icon className="size-5" />
                    </span>
                    <span>
                      <span className="text-eyebrow block text-muted">{item.label}</span>
                      <span className="mt-0.5 block font-display text-[0.95rem] font-semibold text-ink">{item.value}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <figure className="ba-cover reveal-media">
                <div className="parallax absolute inset-0">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    priority
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                  />
                </div>
                <span className="ba-cover-tag">
                  <Sparkles className="size-3.5" />
                  {post.category}
                </span>
              </figure>

              <span aria-hidden="true" className="ba-divider draw-x" />

              {headings.length ? (
                <nav className="ba-toc reveal" aria-label={copy.page.tocTitle}>
                  <p className="flex items-center gap-2 font-display font-semibold text-ink">
                    <ListTree className="size-5 text-brand" />
                    {copy.page.tocTitle}
                  </p>
                  <ol>
                    {headings.map((heading) => (
                      <li key={heading}>
                        <a href={`#${headingId(heading)}`}>{heading}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              <div className="ba-body">{renderBody(blocks)}</div>

              {/* Shown while only the summary is published; invites the reader to ask for the full guide. */}
              {post.body.length === 0 ? (
                <aside className="ba-callout border-glow reveal">
                  <span className="ba-callout-icon">
                    <Sparkles className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl font-semibold text-white">{copy.page.fullTitle}</h2>
                    <p className="mt-2 text-white/75">{copy.page.fullText}</p>
                  </div>
                  <Link href="/contact" className="btn btn-primary">
                    {copy.page.fullCta}
                    <ArrowRight className="size-4" />
                  </Link>
                </aside>
              ) : null}

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                <p className="text-eyebrow text-muted">{copy.page.shareArticle}</p>
                <BlogShare slug={post.slug} title={post.title} />
              </div>

              <section className="ba-author reveal">
                <span className="ba-author-avatar">
                  <Image src="/images/logo-mark.png" alt="" width={44} height={44} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-eyebrow text-brand">{copy.page.authorEyebrow}</p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-ink">{copy.page.authorName}</h2>
                  <p className="text-sm text-muted">{copy.page.authorRole}</p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{copy.page.authorText}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link href="/about-us" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                      {copy.page.authorCta}
                      <ArrowRight className="size-4" />
                    </Link>
                    <ul className="flex items-center gap-2">
                      {socials.filter((item) => item.network !== "whatsapp").map((item) => (
                        <li key={item.network}>
                          <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="bs-btn" data-network={item.network}>
                            <SocialIcon network={item.network} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <aside className="ba-wa reveal">
                <span className="ba-wa-icon">
                  <MessageCircle className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-semibold text-white">{copy.page.waTitle}</h2>
                  <p className="mt-1 text-sm text-white/85">{copy.page.waText}</p>
                </div>
                <a href={chatUrl} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
                  {copy.page.waCta}
                  <ArrowRight className="size-4" />
                </a>
              </aside>

              <nav className="mt-10 grid gap-4 sm:grid-cols-2" aria-label={copy.page.relatedTitle}>
                {newer ? <PostLink post={newer} label={copy.page.newerLabel} dir="newer" /> : <span />}
                {older ? <PostLink post={older} label={copy.page.olderLabel} dir="older" /> : null}
              </nav>
            </div>
          </div>
        </div>
      </article>

      {topicServices.length ? (
        <section className="relative isolate overflow-clip bg-white py-20 lg:py-24">
          <div className="shell">
            <p className="text-eyebrow reveal text-brand">{copy.page.servicesEyebrow}</p>
            <h2 className="text-heading mt-4">{copy.page.servicesTitle}</h2>
            <p className="text-lead mt-3 max-w-2xl text-muted">{copy.page.servicesText}</p>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {topicServices.map((service, i) => (
                <li key={service.href} className="reveal" style={stagger(i)}>
                  <Link href={service.href} className="ba-svc group">
                    <Image src={service.image} alt="" fill sizes="(min-width: 768px) 30vw, 90vw" className="ba-svc-img object-cover" />
                    <span aria-hidden="true" className="ba-svc-shade" />
                    <span className="ba-svc-icon">
                      <service.icon className="size-5" />
                    </span>
                    <span className="relative mt-auto block">
                      <span className="block font-display text-lg leading-snug font-semibold text-white">{service.label}</span>
                      <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-accent uppercase">
                        {copy.page.servicesCta}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="on-dark bl-trending relative isolate overflow-clip bg-midnight py-20 text-white lg:py-24">
        <div aria-hidden="true" className="bl-glow bl-glow-a" />
        <div className="shell">
          <p className="text-eyebrow reveal text-accent">{copy.page.relatedEyebrow}</p>
          <h2 className="text-heading mt-4 mb-10">{copy.page.relatedTitle}</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {related.map((item, i) => (
              <li key={item.slug} className="bl-pop" style={{ "--i": i } as CSSProperties}>
                <article className="bl-card group">
                  <Link href={`/blogs/${item.slug}`} className="bl-card-media" tabIndex={-1} aria-hidden="true">
                    <Image src={item.image} alt="" fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
                    <span className="bl-date">
                      <CalendarDays className="size-3.5" />
                      {item.date}
                    </span>
                    <span className="bl-tag">{item.category}</span>
                  </Link>
                  <div className="p-6">
                    <h3 className="font-display text-[1.05rem] leading-snug font-semibold text-white">
                      <Link href={`/blogs/${item.slug}`} className="transition-colors hover:text-accent">
                        {item.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={copy.page.ctaTitle} text={copy.page.ctaText} />
    </>
  );
}

function PostLink({ post, label, dir }: { post: (typeof copy.posts)[number]; label: string; dir: "newer" | "older" }) {
  return (
    <Link href={`/blogs/${post.slug}`} className={`ba-nav group ${dir === "older" ? "sm:text-right" : ""}`}>
      <Image src={post.image} alt="" fill sizes="(min-width: 640px) 380px, 100vw" className="ba-nav-img object-cover" />
      <span aria-hidden="true" className="ba-nav-shade" />
      <span className={`relative flex items-center gap-2 text-eyebrow text-accent ${dir === "older" ? "sm:justify-end" : ""}`}>
        {dir === "newer" ? <ArrowLeft className="ba-nav-arrow size-4" /> : null}
        {label}
        {dir === "older" ? <ArrowRight className="ba-nav-arrow size-4" /> : null}
      </span>
      <span className="relative mt-2 block font-display text-base leading-snug font-semibold text-white">{post.title}</span>
    </Link>
  );
}
