import type { Metadata } from "next";

import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "حساب کاربری",
};

export default function ProfilePage() {
  return <ProfileView />;
}
