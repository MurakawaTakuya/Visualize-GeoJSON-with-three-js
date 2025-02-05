import { FileStructure } from "../types/types";
import { NagoyaCentralPark } from "./NagoyaCentralPark";
import { NagoyaUnimall } from "./NagoyaUnimall";
import { NaritaAirport } from "./NaritaAirport";
import { NissanStd } from "./NissanStd";
import { ShinjukuTerminal } from "./ShinjukuTerminal";
import { ShinyokohamaStation } from "./ShinyokohamaStation";
import { TokyoStation } from "./TokyoStation";

// ファイルパス
export const data: Record<string, FileStructure> = {
  ...NagoyaUnimall,
  ...ShinjukuTerminal,
  ...NaritaAirport,
  ...NagoyaCentralPark,
  ...TokyoStation,
  ...ShinyokohamaStation,
  ...NissanStd,
};

// TODO: 動的に生成
export const groupList: number[] = [7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3];
export const layers = [
  "7F",
  "6F",
  "5F",
  "4F",
  "3F",
  "2F",
  "1F",
  "0",
  "B1",
  "B2",
  "B3",
];
// TODO: データごとに調節を検討
export const verticalOffset = 10;
