import { createFileRoute } from "@tanstack/react-router";
// import "@/styles/style.css";
import HeroSec from "@/components/marketing/heroSec";
import LoseDeals from "@/components/marketing/loseDeals";
import Touch from "@/components/marketing/touch";
import Techstack from "@/components/marketing/techstack";
import Pricing from "@/components/marketing/pricing";
import Faq from "@/components/marketing/faq";
import Header from "@/components/marketing/header";
import ServicesSec from "@/components/marketing/servicesSec";
import ETCCRMSection from "@/components/marketing/ETCCRMSec";
import AICRMBanner from "@/components/marketing/AICRMBanner";
import WorkshopGrid from "@/components/marketing/workshopGrid";
import ComSec from "@/components/marketing/ComSec";
import ComSec2 from "@/components/marketing/ComSec2";
import CRMBanner from "@/components/marketing/CrmBanner";
import MassonarySec from "@/components/marketing/massonarySec";

export const Route = createFileRoute("/_appLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <HeroSec />
      <LoseDeals />
      <ServicesSec />
      <CRMBanner />
      <ETCCRMSection />
      <AICRMBanner />
      <WorkshopGrid />
      <ComSec />
      <MassonarySec />
      <Techstack />
      <Touch />
      <ComSec2 />
      {/* <Features /> */}
      <Touch />
      {/* <Integrations /> */}
      <Pricing />
      <Faq />
      <Touch />
    </>
  );
}
