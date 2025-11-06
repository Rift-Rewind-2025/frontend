import { PowerLevel, PowerLevelMetrics, User } from "./types";
// FETCH
const baseUrl = process.env.API_BASE_URL || "";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export async function resolveRiotId(riotId: string) {
  // riotId format: GameName#TagLine
  const encoded = encodeURIComponent(riotId.trim())
  return fetchJSON<{ puuid: string; game_name: string; tag_line: string }>(
    `/api/players/resolve?riot_id=${encoded}`,
  )
}

export async function getUsers(skip: number = 0, limit: number = 20): Promise<User[]> {
  return fetchJSON<User[]>(`/api/users?skip=${skip}&limit=${limit}`)
}

export async function getPowerLevel(puuid: string, skip: number = 0, limit: number = 20): Promise<PowerLevel[]> {
  return fetchJSON<PowerLevel[]>(`/api/power-levels/${puuid}?skip=${skip}&limit=${limit}`)
}

export async function getMetrics(puuid: string, skip: number = 0, limit: number = 20): Promise<PowerLevelMetrics[]> {
  return fetchJSON<PowerLevelMetrics[]>(`/api/power-levels/${puuid}/metrics?skip=${skip}&limit=${limit}`)
}

// export async function getGoldQuestion(puuid?: string): Promise<GoldQuestion> {
//   const url = puuid ? `/api/gold-game?puuid=${encodeURIComponent(puuid)}` : `/api/gold-game`
//   return fetchJSON<GoldQuestion>(url)
// }

// SESSION
export const session = {
  getSelected(): { puuid: string; game_name: string; tag_line: string } | null {
    try {
      const raw = sessionStorage.getItem("selectedPlayer")
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  setSelected(p: { puuid: string; game_name: string; tag_line: string }) {
    sessionStorage.setItem("selectedPlayer", JSON.stringify(p))
  },
  clearSelected() {
    sessionStorage.removeItem("selectedPlayer")
  },
}

// UTILITIES
export function formatPercent(x: number | null | undefined) {
  if (x == null) return "—"
  return `${(x * 100).toFixed(1)}%`
}

export function secondsToClock(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}

export function tierFromPowerLevel(value: number): { name: string; badgeClass: string } {
  // Placeholder tiering – adjust when names are finalized
  if (value >= 8500) return { name: "Mythic", badgeClass: "bg-purple-600" }
  if (value >= 7000) return { name: "Grandmaster", badgeClass: "bg-fuchsia-600" }
  if (value >= 5500) return { name: "Master", badgeClass: "bg-rose-600" }
  if (value >= 4000) return { name: "Diamond", badgeClass: "bg-indigo-600" }
  if (value >= 2500) return { name: "Platinum", badgeClass: "bg-cyan-600" }
  if (value >= 1200) return { name: "Gold", badgeClass: "bg-amber-500" }
  if (value >= 600) return { name: "Silver", badgeClass: "bg-zinc-500" }
  return { name: "Bronze", badgeClass: "bg-stone-500" }
}