import { createFileRoute } from "@tanstack/react-router";
// import "@/styles/style.css";
import HeroSec from "@/components/marketing/heroSec";
import LoseDeals from "@/components/marketing/loseDeals";
import Features from "@/components/marketing/features";
import Touch from "@/components/marketing/touch";
import Integrations from "@/components/marketing/integrations";
import Techstack from "@/components/marketing/techstack";
import Pricing from "@/components/marketing/pricing";
import Faq from "@/components/marketing/faq";

export const Route = createFileRoute("/_appLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <HeroSec />
      <LoseDeals />
      <Touch />
      <Features />
      <Touch />
      <Integrations />
      <Pricing />
      <Faq />
      <Techstack />
      <Touch />
    </>
  );
}
