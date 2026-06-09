import { SectionLandingPage } from "@/components/section-page";
import { sectionPages } from "@/lib/university-data";

export default function ServicesPage() {
  return <SectionLandingPage {...sectionPages.services} />;
}
