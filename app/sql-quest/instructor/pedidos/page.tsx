import type { Metadata } from "next";
import { InstructorRewardOrdersClient } from "@/components/sql-quest/RewardsClient";

export const metadata: Metadata = { title: "Pedidos de recompensas · SQL Quest" };

export default function InstructorRewardOrdersPage() {
  return <InstructorRewardOrdersClient />;
}
