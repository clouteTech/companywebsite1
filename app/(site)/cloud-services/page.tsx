import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("cloud-services");

export default function Page() {
  return <ServicePage slug="cloud-services" />;
}
