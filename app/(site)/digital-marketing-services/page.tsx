import { MarketingSections, MarketingTicker } from "@/components/marketing-sections";
import { ServicePage, serviceMetadata } from "@/components/service-page";

export const metadata = serviceMetadata("digital-marketing-services");

export default function Page() {
  return (
    <ServicePage slug="digital-marketing-services" afterHero={<MarketingTicker />}>
      <MarketingSections />
    </ServicePage>
  );
}
