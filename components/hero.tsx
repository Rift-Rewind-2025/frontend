import { Crown, Eye, Swords, Trophy } from "lucide-react";
import { Card, CardDescription, CardTitle } from "./ui/card";

export function Hero() {
  return (
    <Card className="w-full overflow-hidden text-white/70 border-0 bg-background">
      <div className="p-6 md:p-8">
        <CardTitle className="text-2xl md:text-4xl flex items-center gap-2">
          Your Season, Summarized
        </CardTitle>
        <CardDescription className="mt-2">
          Search any Riot ID to pin them in the leaderboard and play the Gold
          Mini‑Game using one of their matches.
        </CardDescription>
      </div>
      <div className="px-6 md:px-8 pb-6">
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          <li className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-lol-gold" /> Custom rank tiers by
            Power Level
          </li>
          <li className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-lol-blue" /> Deep dive metrics: KP,
            DPM, Vision/M, more
          </li>
          <li className="flex items-center gap-2">
            <Swords className="h-6 w-6 text-[#15b1a7]" /> Fast, fun “This or
            That” gold challenge
          </li>
        </ul>
      </div>
    </Card>
  );
}
