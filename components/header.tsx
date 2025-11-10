"use client";
import { session } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
  const [selected, setSelected] = useState<{
    puuid: string;
    game_name: string;
    tag_line: string;
  } | null>(null);

  useEffect(() => {
    const s = session.getSelected();
    if (s) setSelected(s);
  }, []);

  const clear = () => {
    session.clearSelected();
    setSelected(null);
  };
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f12]/70 border-b border-[rgba(214,176,93,.18)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -8 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <Trophy className="h-6 w-6 text-[#15b1a7]" />
            </motion.div>
            <Link href={"/"} className="font-bold font-heading">
              Rift <span className="text-lol-gold">Rewind</span>
            </Link>
          </div>
          <Link href={"/gold-game"}>Gold Game</Link>
        </div>
        <div className="text-sm text-white/80 flex items-center gap-2">
          {selected ? (
            <>
              <span>
                <Users className="h-4 w-4 text-[#15b1a7]" />
                <span className="font-medium">{selected.game_name}</span>
                <span className="text-xs">#{selected.tag_line}</span>
              </span>
              <Button size="sm" variant="ghost" onClick={clear}>
                Clear
              </Button>
            </>
          ) : (
            <span>No player entered</span>
          )}
        </div>
      </div>
    </header>
  );
}
