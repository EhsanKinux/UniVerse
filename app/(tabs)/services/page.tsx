import { SectionLandingPage } from "@/components/layout/section-page";
import { sectionPages } from "@/lib/data/university-data";

export default function ServicesPage() {
  return <SectionLandingPage {...sectionPages.services} />;
}
