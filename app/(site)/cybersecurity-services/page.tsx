import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("cybersecurity-services");

export default function Page() {
  return <ServicePage slug="cybersecurity-services" />;
}
