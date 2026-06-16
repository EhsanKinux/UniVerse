import { CallIcon, InformationCircleIcon, Mail01Icon } from "@hugeicons/core-free-icons";

import { Card } from "@/components/ui/card";
import { APP_VERSION, SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_DISPLAY } from "@/lib/profile-data";
import { ActionRow, InfoRow, SectionHeading } from "./profile-ui";

export function ProfileSupportCard() {
  return (
    <section className="space-y-3">
      <SectionHeading title="پشتیبانی و درباره" />
      <Card className="divide-y divide-border overflow-hidden p-0">
        <ActionRow
          icon={Mail01Icon}
          label="تماس با پشتیبانی"
          value={SUPPORT_EMAIL}
          href={`mailto:${SUPPORT_EMAIL}`}
          ltr
        />
        <ActionRow
          icon={CallIcon}
          label="تماس با دانشگاه"
          value={SUPPORT_PHONE_DISPLAY}
          href={`tel:${SUPPORT_PHONE}`}
        />
        <InfoRow icon={InformationCircleIcon} label="نسخه برنامه" value={APP_VERSION} />
      </Card>
    </section>
  );
}
