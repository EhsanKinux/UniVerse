import { SectionLandingPage } from "@/components/section-page";
import { sectionPages } from "@/lib/university-data";

export default function EducationalPage() {
  return <SectionLandingPage {...sectionPages.educational} />;
}
