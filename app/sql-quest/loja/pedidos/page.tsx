import type { Metadata } from "next";
import { RewardOrdersClient } from "@/components/sql-quest/RewardsClient";

export const metadata: Metadata = { title: "Meus pedidos · SQL Quest" };

export default function RewardOrdersPage() {
  return <RewardOrdersClient />;
}
