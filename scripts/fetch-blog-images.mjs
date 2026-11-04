// Downloads a topic-matched, free-to-use photo from Pixabay or Pexels for every blog post and points content/blogs.json at it.
//
//   PIXABAY_API_KEY=your_key node scripts/fetch-blog-images.mjs
//
// A free Pixabay key is instant at https://pixabay.com/api/docs/ (a Pexels key works too, see stock-photos.mjs).
// Both libraries allow free commercial use with no attribution. Photos land in public/images/blog/<slug>.jpg and each
// post gets its photographer's name in "imageCredit". Run it again with --force to replace photos already fetched.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

import { download, findPhoto, requireKey } from "./stock-photos.mjs";

requireKey();
const force = process.argv.includes("--force");
// --only=word,word fetches just the posts whose slug contains one of the words.
const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);

// What to search for, by a word in the post's slug. The first match wins.
const topics = [
  ["hire-it-talent", "job interview candidate laptop"],
  ["zero-trust", "cybersecurity padlock laptop"],
  ["cloud-migration", "cloud computing data center servers"],
  ["managed-it", "it support engineer working computer"],
  ["structured-cabling", "network switch ethernet cables"],
  ["ai-vision-inspection", "factory automation quality control robot"],
  ["warehouse-automation", "warehouse logistics shelves forklift"],
  ["software-requirements", "agile team sticky notes meeting"],
  ["cheapest-development", "software developers coding screen"],
  ["multi-agent", "artificial intelligence network abstract"],
  ["google-business-profile", "local business owner shop smartphone"],
  ["integrate-ai", "developer working with ai software laptop"],
  ["business-software-cuts", "office worker automation spreadsheet"],
  ["proof-of-concept", "startup team prototype whiteboard"],
];

const file = new URL("../content/blogs.json", import.meta.url);
const data = JSON.parse(await readFile(file, "utf8"));
await mkdir(new URL("../public/images/blog/", import.meta.url), { recursive: true });

const used = new Set();
for (const post of data.posts) {
  if (only.length && !only.some((word) => post.slug.includes(word))) continue;
  const topic = topics.find(([word]) => post.slug.includes(word));
  const query = topic ? topic[1] : post.title;
  const target = `/images/blog/${post.slug.slice(0, 60).replace(/-$/, "")}.jpg`;
  const out = new URL(`../public${target}`, import.meta.url);

  if (!force && post.image === target && existsSync(out)) {
    console.log(`skip   ${post.slug} (already fetched)`);
    continue;
  }

  const photo = await findPhoto(query, used);
  if (!photo) {
    console.warn(`none   ${post.slug}: no photo found for "${query}"`);
    continue;
  }
  await writeFile(out, await download(photo.url));
  post.image = target;
  post.imageCredit = photo.credit;
  console.log(`saved  ${post.slug}  <-  "${query}"  (${photo.credit})`);
}

await writeFile(file, JSON.stringify(data, null, 2) + "\n");
console.log("Done. content/blogs.json now points at the downloaded photos.");
