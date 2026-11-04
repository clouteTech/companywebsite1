import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("software-development-services");

export default function Page() {
  return <ServicePage slug="software-development-services" />;
}
