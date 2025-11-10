import {
  formatPercent,
  getMetrics,
  getUserByPlayerId,
  getUsers,
  secondsToClock,
  tierFromPowerLevel,
} from "@/lib/helpers";
import { PowerLevelMetrics, User } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge, Crown, Loader2, Trophy, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

function PinnedRow({ row }: { row: User }) {
  // const { name, badgeClass } = tierFromPowerLevel(row.power_level_std);
  return (
    <div className="rounded-2xl border border-[rgba(214,176,93,.25)] p-3 bg-[color:rgb(13,27,30)]/60 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Crown className="h-5 w-5 text-lol-gold" />
        <div>
          <div className="text-sm text-white/70">Pinned Player</div>
          <div className="font-semibold">
            {row.game_name}{" "}
            <span className="text-xs text-white/70">#{row.tag_line}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-64">
        <div className="font-bold tabular-nums">
          {Math.floor(row.power_level_std).toLocaleString()}
        </div>
        <Button size="sm" asChild>
          <Link href={`/players/${row.puuid}`}>View metrics</Link>
        </Button>
      </div>
    </div>
  );
}

export function Leaderboard({
  selected,
}: {
  selected: { puuid: string } | null;
}) {
  const [rows, setRows] = useState<User[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getUsers()
      .then((data) => {
        if (!mounted) return;
        setRows(data);
      })
      .catch((e) => setError(e?.message || "Failed to load leaderboard"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selected)
      getUserByPlayerId(selected.puuid).then((data) => {
        setSelectedUser(data);
      });
  }, [selected]);

  const sorted = useMemo(() => {
    if (!rows) return [];
    const copy = [...rows];
    copy.sort((a, b) => b.power_level_std - a.power_level_std);
    return copy;
  }, [rows]);

  return (
    <Card className="w-full bg-[#10161a]/90 border border-[rgba(214,176,93,.18)] shadow-[0_0_0_1px_rgba(214,176,93,.25),0_10px_30px_rgba(0,0,0,.45)]">
      <CardHeader className="text-white">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Trophy className="h-8 w-8 text-[#15b1a7]" />
          Leaderboard
        </CardTitle>
        <CardDescription className="text-white text-md">
          Power Level is a 0–10,000 composite from combat, objectives, vision,
          economy, and clutch metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-white/70">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading leaderboard…
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && rows && (
          <>
            <div className="mb-3">
              {selectedUser && <PinnedRow row={selectedUser} />}
            </div>
            <div className="max-h-[60vh] overflow-x-auto">
              <Table className="w-full text-white rounded-md">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white/70 w-16">#</TableHead>
                    <TableHead className="text-white/70 min-w-[160px]">
                      Player
                    </TableHead>
                    <TableHead className="text-white/70">Power Level</TableHead>
                    <TableHead className="text-white/70 w-28 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((r, idx) => (
                    <TableRow
                      key={r.puuid}
                      className={cn(
                        selected?.puuid === r.puuid ? "bg-white/5" : undefined
                      )}
                    >
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#15b1a7]" />
                          <div>
                            <div className="font-medium">{r.game_name}</div>
                            <div className="text-xs text-white/70">
                              #{r.tag_line}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {Math.floor(r.power_level_std).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="sm"
                          variant="secondary"
                          className="border border-[rgba(214,176,93,.25)]"
                        >
                          <Link href={`/players/${r.puuid}`}>View metrics</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>
                  Click a player to view their recent match metrics.
                </TableCaption>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
