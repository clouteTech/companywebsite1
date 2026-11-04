# Cloute Technologies website

The Cloute Technologies company site, migrated from the static HTML site in `../../Cloute-main` to Next.js (App Router, TypeScript, Tailwind CSS 4).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run lint
npm run build
npm run start
```

## Structure

```
app/
  layout.tsx              Root layout: Inter font, global metadata
  globals.css             Design tokens, fluid type scale, buttons, form fields, motion
  (site)/layout.tsx       Header + footer shell used by every page except /thank-you
  (site)/page.tsx         Home
  (site)/about-us, contact, products, recruitment
  (site)/<service>/       Six service pages, rendered from lib/services.ts
  thank-you/              Standalone confirmation page
components/
  site-header.tsx         Header, Services dropdown, mobile menu (client component)
  site-footer.tsx
  sections.tsx            Page hero, section heading, cards, stats, FAQ, CTA band
  service-page.tsx        Shared service-page template
  contact-form.tsx        Contact form (client component), posts to /api/contact
lib/
  site.ts                 Contact details, navigation and social links
  services.ts             Service page copy (carried over verbatim from the HTML pages)
  faqs.ts                 Home and products FAQs
  contact.ts              Contact form validation shared by the form and the API route
  contact-emails.ts       HTML/text templates for the enquiry and acknowledgement emails
app/api/contact/route.ts  Validates enquiries and sends both emails through Resend
public/images/            Company images (previously hot-linked from cloute.co.in)
```

## Notes

- Old URLs such as `/about-us.html` permanently redirect to the new routes (see `next.config.ts`).
- The contact form posts to `/api/contact`; see [Contact form email](#contact-form-email) below.
- Scroll reveals use CSS scroll-driven animations. Sections that contain them must use `overflow-clip`, not
  `overflow-hidden`, or the reveal animation tracks the wrong scroll container.
- All motion is disabled under `prefers-reduced-motion: reduce`.

## Contact form email

Submissions go to `app/api/contact/route.ts`. The route validates the enquiry, emails the full details to the company inbox
(replying to that email goes straight to the customer), and then sends the customer an acknowledgement. Emails are sent
through the [Resend](https://resend.com) REST API. Nothing is stored in a database or on disk.

### Configure

1. Create `.env.local` in the project root with:

   | Variable             | Example                                      |
   | -------------------- | -------------------------------------------- |
   | `RESEND_API_KEY`     | `re_...` (Resend → API Keys, sending access) |
   | `CONTACT_FROM_EMAIL` | `Cloute Technologies <noreply@cloute.co.in>` |
   | `CONTACT_TO_EMAIL`   | `sales@cloute.co.in` (comma-separate several) |

   These are server-only. Never prefix them with `NEXT_PUBLIC_`. Restart `npm run dev` after changing them, and add
   the same variables in your hosting provider's settings for production.
2. The sending domain must be verified in Resend (**Domains**). `cloute.co.in` is verified through GoDaddy DNS.

### Protection

- Server-side validation of every field (`lib/contact.ts`, same rules the form uses in the browser).
- Hidden honeypot field and a minimum fill time. Bots get a normal-looking success, but no email is sent.
- Rate limit of 5 requests per IP every 10 minutes, and identical resubmissions within 10 minutes are not emailed twice.
  These counters are kept in memory per server instance. On serverless hosting each instance keeps its own counts.
- Cross-origin posts and bodies over 10 KB are rejected.
- If the company email fails, the visitor sees an error and can retry. If only the acknowledgement fails, the enquiry
  still counts as sent and the failure is logged.
