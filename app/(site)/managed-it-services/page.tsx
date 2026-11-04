import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("managed-it-services");

export default function Page() {
  return <ServicePage slug="managed-it-services" />;
}
