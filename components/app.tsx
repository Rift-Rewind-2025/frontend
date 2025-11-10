"use client";

import { Hero } from "@/components/hero";
import { Leaderboard } from "@/components/leaderboard";
import { RiotIdSearch } from "@/components/riot-id-search";
import { session } from "@/lib/helpers";
import { useEffect, useState } from "react";

export default function App() {
  const [selected, setSelected] = useState<{
    puuid: string;
    game_name: string;
    tag_line: string;
  } | null>(null);

  useEffect(() => {
    const s = session.getSelected();
    if (s) setSelected(s);
  }, []);
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-3">
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
    </>
  );
}
