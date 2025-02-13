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
  ...NissanStd,
  ...TokyoStation,
  ...ShinjukuTerminal,
  ...NagoyaCentralPark,
  ...NagoyaUnimall,
  ...NaritaAirport,
  ...ShinyokohamaStation,
};

export const verticalOffset = 10; // 階の間の幅
export const prefectureZoomScale =
  typeof window !== "undefined" && window.innerWidth <= 767 ? 10 : 20; // 日本地図のズーム率
