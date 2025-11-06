export interface User {
  id: number;
  puuid: string;
  game_name: string;
  tag_line: string;
  power_level: number;
  real_rank_tier: string;
  real_rank_division: string;
  tier?: string | null;
}
