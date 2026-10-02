import type { Metadata } from "next";
import { RewardOrdersClient, RewardsStoreClient } from "@/components/sql-quest/RewardsClient";

export const metadata: Metadata = { title: "Loja de recompensas · SENAI Quest" };
export const dynamic = "force-dynamic";

export default function StorePage() {
  return <><RewardsStoreClient /><div id="pedidos"><RewardOrdersClient /></div></>;
}
