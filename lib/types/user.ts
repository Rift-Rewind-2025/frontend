import { DefaultEntity } from "./default";

export interface User extends DefaultEntity {
  puuid: string;
  game_name: string;
  tag_line: string;
  power_level: number;
  real_rank_tier: string;
  real_rank_division: string;
  tier?: string | null;
}
