import { Card } from "@/components/ui/card";
import { academicFields, academicProfile } from "@/lib/profile-data";
import { InfoRow, SectionHeading } from "./profile-ui";

export function ProfileAcademicInfo() {
  return (
    <section className="space-y-3">
      <SectionHeading title="اطلاعات تحصیلی" subtitle="این اطلاعات توسط دانشگاه ثبت شده است." />
      <Card className="divide-y divide-border overflow-hidden p-0">
        {academicFields.map((field) => (
          <InfoRow
            key={field.key}
            icon={field.icon}
            label={field.label}
            value={academicProfile[field.key]}
            copyable={field.copyable}
          />
        ))}
      </Card>
    </section>
  );
}
