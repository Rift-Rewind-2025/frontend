"use client";
import { PowerLevelMetrics, User } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";
import { formatPercent, getYearlyWrapped, secondsToClock } from "@/lib/helpers";
import Image from "next/image";
import { ChartLine, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Props = {
  player: User;
  playerMetrics: PowerLevelMetrics[];
};

export default function PlayersDescription({ player, playerMetrics }: Props) {
  const [yearlyWrapped, setYearlyWrapped] = useState<{ cards: any[] } | null>(
    null
  );
  const handleGetYearlyWrapped = async () => {
    const wrapped = await getYearlyWrapped(player.puuid);
    setYearlyWrapped(wrapped);
  };
  return (
    <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
      <section className="flex flex-col gap-4">
        <div className="min-h-48 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="text-4xl">{player.game_name}</h1>
              <h1 className="text-white/70">#{player.tag_line}</h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleGetYearlyWrapped()}
                  className="bg-lol-gold hover:cursor-pointer mr-auto"
                >
                  View Yearly {'"Wrapped"'}
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[900px] gap-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold">
                    Yearly {"Wrapped"} Summary
                  </DialogTitle>
                  <DialogDescription className="text-lg">
                    Our personalized AI summarizes the {"player's"} overall
                    match performance throughout the year and gives curated
                    feedback.
                  </DialogDescription>
                </DialogHeader>
                {yearlyWrapped ? (
                  <Tabs defaultValue={yearlyWrapped.cards[0].id}>
                    <TabsList>
                      {yearlyWrapped.cards.map((card) => (
                        <TabsTrigger key={card.id} value={card.id}>
                          {card.emoji} {card.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {yearlyWrapped.cards.map((card) => (
                      <TabsContent key={card.id} value={card.id}>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                              {card.title} {card.emoji}
                            </CardTitle>
                            <CardDescription className="text-xl font-semibold">
                              {card.subtitle}
                            </CardDescription>
                            <CardAction className="self-center italic font-semibold text-lol-gold text-wrap w-[350px]">
                              {card.joke}
                            </CardAction>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col gap-4">
                              <h3 className="text-lg">{card.body}</h3>
                              <h4 className="text-md font-semibold">
                                What was analyzed?
                              </h4>
                              {card.explanations.map((exp) => (
                                <h5 key={exp.metric} className="italic">
                                  {exp.metric} •{" "}
                                  <span className="text-white/70">
                                    {exp.text}
                                  </span>
                                </h5>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="flex items-center gap-2 text-white/70">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading wrapped
                    summary...
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <div className="col-start-3 flex flex-col gap-6  items-center">
            <Image
              src={`/rank_logos/${player.tier?.toLowerCase()}_rank.jpeg`}
              alt={`${player.tier?.toLowerCase()} rank`}
              className="rounded-full"
              width={100}
              height={100}
            />
            <h1 className="text-3xl font-semibold">{player.tier}</h1>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <ChartLine className="h-8 w-8 text-lol-gold" />
          <h2 className="text-4xl font-bold">Metrics</h2>
        </div>
        <div className="overflow-auto border rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match Time</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Lane</TableHead>
                <TableHead>K/D/A</TableHead>
                <TableHead>GPM</TableHead>
                <TableHead>CS/M</TableHead>
                <TableHead>DPM</TableHead>
                <TableHead>KP</TableHead>
                <TableHead>Vision/M</TableHead>
                <TableHead>DMG% / Taken%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playerMetrics.map((metrics) => (
                <TableRow key={metrics.match_id}>
                  <TableCell className="font-mono text-xs">
                    {new Date(metrics.game_start_time).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-medium",
                        metrics.win ? "text-emerald-600" : "text-rose-600"
                      )}
                    >
                      {metrics.win ? "Win" : "Loss"}
                    </span>
                    <div className="text-xs text-white/70">
                      {metrics.champion_name} ·{" "}
                      {secondsToClock(metrics.game_duration)}
                    </div>
                  </TableCell>
                  <TableCell>{metrics.role_position}</TableCell>
                  <TableCell>
                    {metrics.kills}/{metrics.deaths}/{metrics.assists}{" "}
                    <span className="text-xs text-white/70">
                      (KDA {Number.parseFloat(metrics.kda).toFixed(2)})
                    </span>
                  </TableCell>
                  <TableCell>{metrics.gold_per_minute ?? "—"}</TableCell>
                  <TableCell>
                    {metrics.cs_per_minute
                      ? Number.parseFloat(metrics.cs_per_minute).toFixed(2)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {metrics.damage_per_minute
                      ? Number.parseFloat(metrics.damage_per_minute).toFixed(2)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {metrics.kill_participation &&
                      formatPercent(
                        Number.parseFloat(metrics.kill_participation)
                      )}
                  </TableCell>
                  <TableCell>
                    {metrics.vision_score_per_minute ?? "—"}
                  </TableCell>
                  <TableCell>
                    {formatPercent(metrics.team_damage_percentage)} /{" "}
                    {formatPercent(metrics.damage_taken_on_team_percentage)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
