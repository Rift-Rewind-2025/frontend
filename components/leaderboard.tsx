import { formatPercent, getMetrics, getUsers, secondsToClock, tierFromPowerLevel } from "@/lib/helpers"
import { PowerLevelMetrics, User } from "@/lib/types"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge, Crown, Info, Loader2, Table, Trophy, Users } from "lucide-react"
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "./ui/dialog"

function PinnedRow({ row, onOpen }: { row: User; onOpen: () => void }) {
  const { name, badgeClass } = tierFromPowerLevel(row.power_level)
  return (
    <div className="rounded-2xl border border-[rgba(214,176,93,.25)] p-3 bg-[color:rgb(13,27,30)]/60 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Crown className="h-5 w-5 text-[#d6b05d]"/>
        <div>
          <div className="text-sm text-white/70">Pinned Player</div>
          <div className="font-semibold">{row.game_name} <span className="text-xs text-white/70">#{row.tag_line}</span></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={cn("text-white border border-[rgba(214,176,93,.35)] bg-gradient-to-br from-[rgba(21,177,167,.15)] to-[rgba(214,176,93,.12)] shadow-[0_0_12px_rgba(21,177,167,.35)]", badgeClass)}>{name}</Badge>
        <div className="font-bold tabular-nums">{row.power_level.toLocaleString()}</div>
        <Button size="sm" onClick={onOpen}>View metrics</Button>
      </div>
    </div>
  )
}

function TierBadge({ value, override }: { value: number; override?: string }) {
  const tier = override ? { name: override, badgeClass: "bg-emerald-600" } : tierFromPowerLevel(value)
  return <Badge className={cn("text-white border border-[rgba(214,176,93,.35)] bg-gradient-to-br from-[rgba(21,177,167,.15)] to-[rgba(214,176,93,.12)] shadow-[0_0_12px_rgba(21,177,167,.35)]", tier.badgeClass)}>{tier.name}</Badge>
}

function MetricsDialog({ puuid, onOpenChange }: { puuid: string | null; onOpenChange: (open: boolean) => void }) {
  const [rows, setRows] = useState<PowerLevelMetrics[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!puuid) return
    setLoading(true)
    setError(null)
    getMetrics(puuid)
      .then(setRows)
      .catch((e) => setError(e?.message || "Failed to load metrics"))
      .finally(() => setLoading(false))
  }, [puuid])

  return (
    <Dialog open={!!puuid} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-[#10161a] text-white border border-[rgba(214,176,93,.25)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-[#6b9ea6]"/>Recent Match Metrics</DialogTitle>
          <DialogDescription>Per-match stats derived from Riot’s postgame data.</DialogDescription>
        </DialogHeader>
        {loading && <div className="flex items-center gap-2 text-white/70"><Loader2 className="h-4 w-4 animate-spin"/> Loading…</div>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && rows && (
          <div className="max-h-[60vh] overflow-auto border rounded-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
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
                {rows.map((r) => (
                  <TableRow key={r.match_id}>
                    <TableCell className="font-mono text-xs">{r.match_id.slice(0, 10)}…</TableCell>
                    <TableCell>
                      <span className={cn("font-medium", r.win ? "text-emerald-600" : "text-rose-600")}>{r.win ? "Win" : "Loss"}</span>
                      <div className="text-xs text-white/70">{r.champion_name} · {secondsToClock(r.game_duration)}</div>
                    </TableCell>
                    <TableCell>{r.role_position}</TableCell>
                    <TableCell>{r.kills}/{r.deaths}/{r.assists} <span className="text-xs text-white/70">(KDA {r.kda.toFixed(2)})</span></TableCell>
                    <TableCell>{r.gold_per_minute ?? "—"}</TableCell>
                    <TableCell>{r.cs_per_minute?.toFixed(2) ?? "—"}</TableCell>
                    <TableCell>{r.damage_per_minute?.toFixed(0) ?? "—"}</TableCell>
                    <TableCell>{formatPercent(r.kill_participation)}</TableCell>
                    <TableCell>{r.vision_score_per_minute ?? "—"}</TableCell>
                    <TableCell>
                      {formatPercent(r.team_damage_percentage)} / {formatPercent(r.damage_taken_on_team_percentage)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function Leaderboard({ selected }: { selected: { puuid: string } | null }) {
  const [rows, setRows] = useState<User[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metricsPuuid, setMetricsPuuid] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getUsers()
      .then((data) => {
        if (!mounted) return
        setRows(data)
      })
      .catch((e) => setError(e?.message || "Failed to load leaderboard"))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const sorted = useMemo(() => {
    if (!rows) return []
    const copy = [...rows]
    copy.sort((a, b) => b.power_level - a.power_level)
    return copy
  }, [rows])

  const pinned = useMemo(() => {
    if (!selected) return null
    return sorted.find((r) => r.puuid === selected.puuid) || null
  }, [sorted, selected])

  return (
    <Card className="w-full bg-[#10161a]/90 border border-[rgba(214,176,93,.18)] shadow-[0_0_0_1px_rgba(214,176,93,.25),0_10px_30px_rgba(0,0,0,.45)]">
      <CardHeader className="text-white">
        <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-[#15b1a7]"/>Leaderboard</CardTitle>
        <CardDescription className="text-white/70">Power Level is a 0–10,000 composite from combat, objectives, vision, economy, and clutch metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-white/70"><Loader2 className="h-4 w-4 animate-spin"/> Loading leaderboard…</div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && rows && (
          <div className="overflow-x-auto">
            {pinned && (
              <div className="mb-3">
                <PinnedRow row={pinned} onOpen={() => setMetricsPuuid(pinned.puuid)} />
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead className="min-w-[160px]">Player</TableHead>
                  <TableHead>Power Level</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((r, idx) => (
                  <TableRow key={r.puuid} className={cn(selected?.puuid===r.puuid ? "bg-white/5" : undefined)}> 
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#15b1a7]"/>
                        <div>
                          <div className="font-medium">{r.game_name}</div>
                          <div className="text-xs text-white/70">#{r.tag_line}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{r.power_level.toLocaleString()}</TableCell>
                    <TableCell>
                      <TierBadge value={r.power_level} override={r.tier || undefined} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary" className="border border-[rgba(214,176,93,.25)]" onClick={() => setMetricsPuuid(r.puuid)}>Metrics</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Click a player to view their recent match metrics.</TableCaption>
            </Table>
          </div>
        )}
        <MetricsDialog puuid={metricsPuuid} onOpenChange={() => setMetricsPuuid(null)} />
      </CardContent>
    </Card>
  )
}
