import type { Metadata } from "next";
import { ProfileClient } from "@/components/sql-quest/SocialClient";

export const metadata: Metadata = { title: "Meu perfil · SQL Quest" };

export default function ProfilePage() {
  return <ProfileClient />;
}
