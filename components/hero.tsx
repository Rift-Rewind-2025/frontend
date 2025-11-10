import { Crown, Eye, Swords } from "lucide-react";
import { Card, CardDescription, CardTitle } from "./ui/card";

export function Hero() {
  return (
    <Card className="w-full overflow-hidden text-white border-0 bg-transparent">
      <div className="p-6 md:p-8">
        <CardTitle className="text-6xl md:text-7xl flex items-center gap-2">
          Your Season, Summarized
        </CardTitle>
        <CardDescription className="mt-2 text-xl">
          Estimate your power level and see how you compete with other rifters!
        </CardDescription>
      </div>
      <div className="px-6 md:px-8 pb-6">
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          <li className="flex items-center gap-2 text-lg">
            <Crown className="h-8 w-8 text-lol-gold" /> Custom rank tiers by
            Power Level
          </li>
          <li className="flex items-center gap-2 text-lg">
            <Eye className="h-8 w-8 text-lol-blue" /> Deep dive metrics: KP,
            DPM, Vision/M, more
          </li>
          <li className="flex items-center gap-2 text-lg">
            <Swords className="h-8 w-8 text-[#15b1a7]" /> Fast, fun “This or
            That” gold challenge
          </li>
        </ul>
      </div>
    </Card>
  );
}
