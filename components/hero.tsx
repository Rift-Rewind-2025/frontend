import { Crown, Eye, Swords, Trophy } from "lucide-react";
import { Card, CardDescription, CardTitle } from "./ui/card";

export function Hero() {
  return (
    <Card className="w-full overflow-hidden">
      <div className="p-6 md:p-8">
        <CardTitle className="text-2xl md:text-3xl flex items-center gap-2"><Trophy className="h-6 w-6"/>Your Season, Summarized</CardTitle>
        <CardDescription className="mt-2">Search any Riot ID to pin them in the leaderboard and play the Gold Mini‑Game using one of their matches. No ID? We’ll grab a random player from our database.</CardDescription>
      </div>
      <div className="px-6 md:px-8 pb-6">
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          <li className="flex items-center gap-2"><Crown className="h-4 w-4 text-[#d6b05d]"/> Custom rank tiers by Power Level</li>
          <li className="flex items-center gap-2"><Eye className="h-4 w-4 text-[#6b9ea6]"/> Deep dive metrics: KP, DPM, Vision/M, more</li>
          <li className="flex items-center gap-2"><Swords className="h-4 w-4 text-[#15b1a7]"/> Fast, fun “This or That” gold challenge</li>
        </ul>
      </div>
    </Card>
  )
}