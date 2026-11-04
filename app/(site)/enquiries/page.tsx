import type { Metadata } from "next";

import { EnquiryDashboard } from "@/components/chatbot/enquiry-dashboard";
import copy from "@/content/contact.json";

// Browser-local list of enquiries confirmed in the chat assistant (see lib/chatbot/local-enquiries.ts).
// Not linked from the site and kept out of search engines; it is not a secure admin area.
export const metadata: Metadata = {
  title: copy.enquiries.metadata.title,
  robots: { index: false, follow: false },
};

export default function EnquiriesPage() {
  return (
    <section className="bg-paper pt-32 pb-20 sm:pt-36">
      <div className="shell">
        <p className="text-eyebrow text-brand">{copy.enquiries.EnquiriesPage.text01_chat_assistant}</p>
        <h1 className="text-heading mt-3">{copy.enquiries.EnquiriesPage.text02_chat_enquiries}</h1>
        <p className="text-lead mt-3 max-w-2xl text-muted">{copy.enquiries.EnquiriesPage.text03_enquiries_confirmed_in_the}</p>
        <div className="mt-10">
          <EnquiryDashboard />
        </div>
      </div>
    </section>
  );
}
