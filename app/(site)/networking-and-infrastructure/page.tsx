import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("networking-and-infrastructure");

export default function Page() {
  return <ServicePage slug="networking-and-infrastructure" />;
}
