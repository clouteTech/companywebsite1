// Shared by fetch-site-images.mjs and fetch-blog-images.mjs: finds a free-to-use photo for a search phrase.
//
// Set one of these (both providers allow free commercial use with no attribution):
//   PIXABAY_API_KEY   free and instant at https://pixabay.com/api/docs/   (licence: https://pixabay.com/service/license-summary/)
//   PEXELS_API_KEY    https://www.pexels.com/api/ (new keys are paused at the moment)

const pixabay = process.env.PIXABAY_API_KEY;
const pexels = process.env.PEXELS_API_KEY;

export const providerName = pixabay ? "Pixabay" : pexels ? "Pexels" : null;

export function requireKey() {
  if (providerName) return;
  console.error(
    "Set an API key first, e.g.\n  PIXABAY_API_KEY=xxxx node scripts/<script>.mjs\n" +
      "Get a free Pixabay key at https://pixabay.com/api/docs/ (log in, the key is shown on that page).",
  );
  process.exit(1);
}

/** Returns { id, url, alt, credit, page } for the first photo not in `used`, or null. */
export async function findPhoto(query, used) {
  if (pixabay) {
    const params = new URLSearchParams({
      key: pixabay,
      q: query.slice(0, 100),
      image_type: "photo",
      orientation: "horizontal",
      min_width: "1200",
      safesearch: "true",
      order: "popular",
      per_page: "20",
    });
    const res = await fetch(`https://pixabay.com/api/?${params}`);
    if (!res.ok) throw new Error(`Pixabay search failed (${res.status}) for "${query}"`);
    const { hits = [] } = await res.json();
    const hit = hits.find((h) => !used.has(`px-${h.id}`));
    if (!hit) return null;
    used.add(`px-${hit.id}`);
    return { url: hit.largeImageURL, alt: hit.tags, credit: `${hit.user} / Pixabay`, page: hit.pageURL };
  }

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=large&per_page=15`,
    { headers: { Authorization: pexels } },
  );
  if (!res.ok) throw new Error(`Pexels search failed (${res.status}) for "${query}"`);
  const { photos = [] } = await res.json();
  const photo = photos.find((p) => !used.has(`pe-${p.id}`));
  if (!photo) return null;
  used.add(`pe-${photo.id}`);
  return { url: photo.src.large2x, alt: photo.alt, credit: `${photo.photographer} / Pexels`, page: photo.url };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Downloads an image, politely: a browser-like User-Agent, a pause between files and a retry on rate limits. */
export async function download(url) {
  await sleep(1500);
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CloutePhotoFetch/1.0", Accept: "image/*" },
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status !== 429 && res.status < 500) throw new Error(`Download failed (${res.status}) for ${url}`);
    await sleep(attempt * 6000);
  }
  throw new Error(`Download kept failing (rate limited) for ${url}`);
}
