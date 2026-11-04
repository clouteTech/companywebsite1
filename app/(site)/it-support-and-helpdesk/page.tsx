import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("it-support-and-helpdesk");

export default function Page() {
  return <ServicePage slug="it-support-and-helpdesk" />;
}
