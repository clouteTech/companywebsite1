// Replaces the website's stock photos (heroes, service banners, team and office shots) with fresh, topic-matched
// photos from Pixabay or Pexels, keeping every file name so no code changes are needed.
//
//   PIXABAY_API_KEY=your_key node scripts/fetch-site-images.mjs           replace the photos
//   node scripts/fetch-site-images.mjs --restore                           put the originals back
//
// A free Pixabay key is instant at https://pixabay.com/api/docs/ (a Pexels key works too, see stock-photos.mjs).
// Both libraries allow free commercial use with no attribution. The first run copies the current photos to
// backup/site-images/, so nothing is lost. Left alone on purpose: client logos, leadership portraits, the
// company logo and the small team photos on the About page (those should be your own real pictures), and the
// video poster frames.
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

import { download, findPhoto, requireKey } from "./stock-photos.mjs";

const images = new URL("../public/images/", import.meta.url);
const backup = new URL("../backup/site-images/", import.meta.url);

const photos = {
  "blueprint.jpg": "architect blueprint technology plan",
  "circuit-board.jpg": "circuit board macro technology",
  "client-meeting.jpg": "business meeting office handshake",
  "cloud-computing.jpg": "cloud computing network abstract",
  "code-screen.jpg": "code on monitor programming",
  "company.jpg": "modern office building technology company",
  "cyber-circuit.jpg": "cyber security digital lock",
  "data-center.jpg": "data center server room",
  "developer-desk.jpg": "developer desk laptop workspace",
  "global-network.jpg": "global network earth connections",
  "hardware-lineup.jpg": "laptops desktops computers hardware",
  "helpdesk.jpg": "customer support headset helpdesk",
  "hero-home.jpg": "technology team modern office",
  "hiring-success.jpg": "hiring handshake job offer",
  "it-engineer.jpg": "it engineer server room",
  "it-hardware.jpg": "computer hardware components",
  "it-support.jpg": "it support technician",
  "laptop-glow.jpg": "laptop dark room glow",
  "managed-it-services.jpg": "network operations center monitoring",
  "mission.jpg": "business team goals planning",
  "office-interior.jpg": "modern office interior",
  "patch-panel.jpg": "network patch panel cables",
  "recruitment.jpg": "recruitment interview candidate",
  "server-racks.jpg": "server racks data center",
  "skyline.jpg": "city skyline night",
  "software-dashboard.jpg": "analytics dashboard monitor",
  "team-collaboration-wide.jpg": "team collaboration meeting",
  "team-collaboration.jpg": "team collaboration laptops",
  "team-presentation.jpg": "team presentation office",
  "team-workshop.jpg": "team workshop whiteboard",
  "vision.jpg": "business vision future city",
  "workstation.jpg": "workstation multiple monitors",
};

if (process.argv.includes("--restore")) {
  for (const name of Object.keys(photos)) {
    if (existsSync(new URL(name, backup))) await copyFile(new URL(name, backup), new URL(name, images));
  }
  console.log("Originals restored from backup/site-images/.");
  process.exit(0);
}

requireKey();

await mkdir(backup, { recursive: true });
const used = new Set();
const credits = [];

for (const [name, query] of Object.entries(photos)) {
  const file = new URL(name, images);
  if (existsSync(file) && !existsSync(new URL(name, backup))) await copyFile(file, new URL(name, backup));

  const photo = await findPhoto(query, used);
  if (!photo) {
    console.warn(`none   ${name}: nothing found for "${query}"`);
    continue;
  }
  await writeFile(file, await download(photo.url));
  credits.push(`${name}	${photo.credit}	${photo.page}`);
  console.log(`saved  ${name}  <-  "${query}"  (${photo.credit})`);
}

await writeFile(new URL("../backup/site-images/CREDITS.txt", import.meta.url), credits.join("\n") + "\n");
console.log("Done. Check the pages in the browser; run with --restore to bring the originals back.");
