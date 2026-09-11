import type { Metadata } from "next";
import { RewardOrdersClient, RewardsStoreClient } from "@/components/sql-quest/RewardsClient";

export const metadata: Metadata = { title: "Loja de recompensas · SQL Quest" };

export default function StorePage() {
  return <><RewardsStoreClient /><div id="pedidos"><RewardOrdersClient /></div></>;
}
