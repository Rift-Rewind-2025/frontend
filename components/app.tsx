"use client"

import { Hero } from "@/components/hero";
import { Leaderboard } from "@/components/leaderboard";
import { RiotIdSearch } from "@/components/riot-id-search";
import { Button } from "@/components/ui/button";
import { session } from "@/lib/helpers";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [selected, setSelected] = useState<{
    puuid: string;
    game_name: string;
    tag_line: string;
  } | null>(null);

  useEffect(() => {
    const s = session.getSelected();
    if (s) setSelected(s);
  }, [setSelected]);

  const clear = () => {
    session.clearSelected();
    setSelected(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0f12] text-white">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(214,176,93,.08)_1px,transparent_1px),radial-gradient(rgba(21,177,167,.06)_1px,transparent_1px)] [background-size:20px_20px] [background-position:0_0,10px_10px] opacity-40" />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(1200px_600px_at_50%_-10%,rgba(21,177,167,.12),transparent_40%),radial-gradient(900px_500px_at_100%_0%,rgba(214,176,93,.12),transparent_40%)]" />
      <div className="relative z-10">
        <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f12]/70 border-b border-[rgba(214,176,93,.18)]">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -8 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <Trophy className="h-6 w-6 text-[#15b1a7]" />
              </motion.div>
              <span className="font-bold font-heading">
                Rift <span className="text-[#d6b05d]">Rewind</span>
              </span>
            </div>
            <div className="text-sm text-white/80 flex items-center gap-2">
              {selected ? (
                <>
                  <span>
                    Selected:{" "}
                    <span className="font-medium">{selected.game_name}</span>
                    <span className="text-xs">#{selected.tag_line}</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={clear}>
                    Clear
                  </Button>
                </>
              ) : (
                <span>No player selected</span>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4 lg:col-span-2">
              <Hero />
              <RiotIdSearch onResolved={setSelected} />
            </div>
            <div className="order-first lg:order-last">
              {/* <QuickExplainer /> */}
            </div>
          </section>

          <section>
            <Leaderboard selected={selected} />
          </section>

          <section>{/* <GoldGame selected={selected} /> */}</section>
        </main>

        <footer className="border-t border-[rgba(214,176,93,.18)] mt-10">
          <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-white/70 flex flex-wrap items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Rift Rewind</span>
            <span>Not affiliated with Riot Games.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
