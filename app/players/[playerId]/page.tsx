import PlayersDescription from "@/components/players-description";
import { getMetrics, getUserByPlayerId } from "@/lib/helpers";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    playerId: string;
  }>;
};

export default async function PlayersDescriptionPage({ params }: Props) {
  const { playerId } = await params; //puuid
  const player = await getUserByPlayerId(playerId).catch(() => notFound());
  const playerMetrics = await getMetrics(playerId).catch(() => notFound());

  return <PlayersDescription player={player} playerMetrics={playerMetrics} />;
}
