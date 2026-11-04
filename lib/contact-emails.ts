// HTML and plain-text emails sent by app/api/contact/route.ts. Email clients ignore stylesheets, so everything is
// table layout with inline styles; gradients fall back to the solid brand colour in Outlook.
import type { Enquiry } from "@/lib/contact";
import { company } from "@/lib/site";

const colors = {
  midnight: "#071427",
  brand: "#1e5fdb",
  accent: "#17c3e6",
  ink: "#0f172a",
  muted: "#55657e",
  line: "#e3e9f2",
  paper: "#f4f7fb",
};

const font = "font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;";
const siteUrl = "https://cloute.co.in";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escapes text and keeps the customer's line breaks. */
function multiline(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

export function formatSubmittedAt(date: Date) {
  return `${new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date)} IST`;
}

function layout({ preheader, heading, body }: { preheader: string; heading: string; body: string }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${colors.paper};${font}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.paper};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${colors.line};">
    <tr><td bgcolor="${colors.brand}" style="background:${colors.brand};background-image:linear-gradient(120deg,${colors.midnight} 0%,${colors.brand} 60%,${colors.accent} 100%);padding:28px 32px;">
      <p style="margin:0;${font}font-size:20px;font-weight:700;letter-spacing:-0.01em;color:#ffffff;">${escapeHtml(company.name)}</p>
      <p style="margin:6px 0 0;${font}font-size:13px;color:#d6e4ff;">${escapeHtml(company.tagline)}</p>
    </td></tr>
    <tr><td style="padding:32px;">
      <h1 style="margin:0 0 16px;${font}font-size:22px;line-height:1.3;color:${colors.ink};">${escapeHtml(heading)}</h1>
      ${body}
    </td></tr>
    <tr><td style="padding:20px 32px;background:${colors.paper};border-top:1px solid ${colors.line};">
      <p style="margin:0;${font}font-size:12px;line-height:1.6;color:${colors.muted};">
        ${escapeHtml(company.legalName)} · ${escapeHtml(company.address)}<br>
        <a href="${company.phoneHref}" style="color:${colors.brand};text-decoration:none;">${escapeHtml(company.phone)}</a> ·
        <a href="mailto:${company.salesEmail}" style="color:${colors.brand};text-decoration:none;">${company.salesEmail}</a> ·
        <a href="${siteUrl}" style="color:${colors.brand};text-decoration:none;">cloute.co.in</a>
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function detailRow(label: string, valueHtml: string) {
  return `<tr>
  <td valign="top" style="padding:12px 16px 12px 0;border-bottom:1px solid ${colors.line};${font}font-size:13px;font-weight:600;color:${colors.muted};white-space:nowrap;width:140px;">${label}</td>
  <td valign="top" style="padding:12px 0;border-bottom:1px solid ${colors.line};${font}font-size:15px;line-height:1.6;color:${colors.ink};">${valueHtml}</td>
</tr>`;
}

/** The enquiry as delivered to the company inbox. Replying goes straight to the customer. */
export function companyEnquiryEmail(enquiry: Enquiry, submittedAt: Date) {
  const when = formatSubmittedAt(submittedAt);
  const phoneHref = `tel:${enquiry.phone.replace(/[^\d+]/g, "")}`;
  const link = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" style="color:${colors.brand};text-decoration:none;">${escapeHtml(label)}</a>`;

  const html = layout({
    preheader: `${enquiry.fullName} is asking about ${enquiry.service}.`,
    heading: "New Website Enquiry",
    body: `
      <p style="margin:0 0 24px;${font}font-size:15px;line-height:1.6;color:${colors.muted};">
        A new enquiry was submitted through the contact form on the website. Reply to this email to respond to the customer directly.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Customer Name", escapeHtml(enquiry.fullName))}
        ${detailRow("Customer Phone", link(phoneHref, enquiry.phone))}
        ${detailRow("Customer Email", link(`mailto:${enquiry.email}`, enquiry.email))}
        ${detailRow(
          "Service Needed",
          `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:#e8f0ff;color:${colors.brand};font-weight:600;font-size:13px;">${escapeHtml(enquiry.service)}</span>`,
        )}
        ${detailRow("Submitted", escapeHtml(when))}
      </table>
      <p style="margin:28px 0 8px;${font}font-size:13px;font-weight:600;color:${colors.muted};">Customer Message</p>
      <div style="padding:16px 20px;border-radius:12px;background:${colors.paper};border-left:4px solid ${colors.brand};${font}font-size:15px;line-height:1.7;color:${colors.ink};">
        ${multiline(enquiry.message)}
      </div>`,
  });

  const text = [
    "New Website Enquiry",
    "",
    `Customer Name:  ${enquiry.fullName}`,
    `Customer Phone: ${enquiry.phone}`,
    `Customer Email: ${enquiry.email}`,
    `Service Needed: ${enquiry.service}`,
    `Submitted:      ${when}`,
    "",
    "Customer Message:",
    enquiry.message,
  ].join("\n");

  return { subject: `New Website Enquiry – ${enquiry.service}`, html, text };
}

/** The acknowledgement sent back to the customer. */
export function customerAcknowledgementEmail(enquiry: Enquiry) {
  const firstName = enquiry.fullName.split(" ")[0];

  const html = layout({
    preheader: `Thanks for contacting ${company.name}. We've received your enquiry about ${enquiry.service}.`,
    heading: `Thank you, ${firstName}!`,
    body: `
      <p style="margin:0 0 16px;${font}font-size:15px;line-height:1.7;color:${colors.ink};">
        Thank you for contacting ${escapeHtml(company.name)}. This is a quick note to confirm that we have received your enquiry.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
        <tr><td style="padding:16px 20px;border-radius:12px;background:${colors.paper};border:1px solid ${colors.line};">
          <p style="margin:0;${font}font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${colors.muted};">Service requested</p>
          <p style="margin:6px 0 0;${font}font-size:17px;font-weight:700;color:${colors.brand};">${escapeHtml(enquiry.service)}</p>
        </td></tr>
      </table>
      <p style="margin:0 0 16px;${font}font-size:15px;line-height:1.7;color:${colors.ink};">
        One of our specialists is reviewing your requirement and will contact you soon, usually within one business day.
      </p>
      <p style="margin:0 0 24px;${font}font-size:15px;line-height:1.7;color:${colors.ink};">
        If it's urgent, call us on
        <a href="${company.phoneHref}" style="color:${colors.brand};font-weight:600;text-decoration:none;">${escapeHtml(company.phone)}</a>
        (Monday – Friday, 9:00 AM – 6:00 PM IST).
      </p>
      <p style="margin:0;${font}font-size:15px;line-height:1.7;color:${colors.ink};">
        Warm regards,<br><strong>The ${escapeHtml(company.name)} Team</strong>
      </p>`,
  });

  const text = [
    `Thank you, ${firstName}!`,
    "",
    `Thank you for contacting ${company.name}. This is a quick note to confirm that we have received your enquiry.`,
    "",
    `Service requested: ${enquiry.service}`,
    "",
    "One of our specialists is reviewing your requirement and will contact you soon, usually within one business day.",
    `If it's urgent, call us on ${company.phone} (Monday – Friday, 9:00 AM – 6:00 PM IST).`,
    "",
    "Warm regards,",
    `The ${company.name} Team`,
  ].join("\n");

  return { subject: "We Have Received Your Enquiry", html, text };
}
