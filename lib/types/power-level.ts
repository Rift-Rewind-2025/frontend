import { DefaultEntity } from "./default";

export interface PowerLevel extends DefaultEntity{
  total: number;
  combat: number;
}
