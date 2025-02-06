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

export const verticalOffset = 10;
