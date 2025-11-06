import { resolveRiotId, session } from "@/lib/helpers";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function RiotIdSearch({ onResolved }: { onResolved: (p: { puuid: string; game_name: string; tag_line: string }) => void }) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleResolve = async () => {
    setError(null)
    setLoading(true)
    try {
      const p = await resolveRiotId(value)
      session.setSelected(p)
      onResolved(p)
    } catch (e) {
      setError(e?.message || "Failed to resolve player")
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleResolve()
  }

  return (
    <Card className="w-full bg-[#10161a]/90 border border-[rgba(214,176,93,.18)] shadow-[0_0_0_1px_rgba(214,176,93,.25),0_10px_30px_rgba(0,0,0,.45)]">
      <CardHeader className="text-white">
        <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5"/>Find a Player</CardTitle>
        <CardDescription className="text-white/70">Enter Riot ID as <span className="font-mono">GameName#TagLine</span> (e.g., <span className="font-mono">WotterMelown#NA1</span>).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
          className="text-white"
            placeholder="GameName#TagLine"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Button onClick={handleResolve} className="border border-[rgba(214,176,93,.25)] hover-" disabled={loading || !value.includes("#")}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Search"}
          </Button>
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        <p className="text-xs text-white/70 mt-2">We’ll pin this player in the leaderboard and use them in the Gold Game.</p>
      </CardContent>
    </Card>
  )
}