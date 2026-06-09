import { SectionLandingPage } from "@/components/section-page";
import { sectionPages } from "@/lib/university-data";

export default function StudentPage() {
  return <SectionLandingPage {...sectionPages.student} />;
}
