import { FileStructure } from "../types/types";

// ファイルパス
const data: Record<string, FileStructure> = {
  NagoyaUnimall: {
    rootPath: "./NagoyaUnimall/",
    centeringFile: "UniMall_B1_Floor.geojson",
    geoFile: [
      "UniMall_B1_Build_Connect.geojson",
      "UniMall_B1_Building.geojson",
      "UniMall_B1_Drawing.geojson",
      "UniMall_B1_Facility.geojson",
      "UniMall_B1_Fixture.geojson",
      "UniMall_B1_Floor_Connect.geojson",
      "UniMall_B1_Floor.geojson",
      "UniMall_B1_Link.geojson",
      "UniMall_B1_Node.geojson",
      "UniMall_B1_Opening.geojson",
      "UniMall_B1_Site.geojson",
      "UniMall_B1_Space.geojson",
      "UniMall_B1_TWSI_Line.geojson",
      "UniMall_B1_TWSI_Point.geojson",
    ],
  },
  ShinjukuTerminal: {
    rootPath: "./ShinjukuTerminal/",
    centeringFile: "ShinjukuTerminal_B3_Space.geojson",
    networkFiles: {
      node: "Shinjuku_node.geojson",
      link: "Shinjuku_link.geojson",
    },
    terrainFiles: "ShinjukuTerminal_Terrain.geojson",
    geoFile: [
      "ShinjukuTerminal_B3_Space.geojson",
      "ShinjukuTerminal_B2_Space.geojson",
      "ShinjukuTerminal_B1_Space.geojson",
      "ShinjukuTerminal_0_Space.geojson",
      "ShinjukuTerminal_1_Space.geojson",
      "ShinjukuTerminal_2_Space.geojson",
      "ShinjukuTerminal_2out_Space.geojson",
      "ShinjukuTerminal_3_Space.geojson",
      "ShinjukuTerminal_3out_Space.geojson",
      "ShinjukuTerminal_4_Space.geojson",
      "ShinjukuTerminal_4out_Space.geojson",
      "ShinjukuTerminal_B3_Floor.geojson",
      "ShinjukuTerminal_B2_Floor.geojson",
      "ShinjukuTerminal_B1_Floor.geojson",
      "ShinjukuTerminal_0_Floor.geojson",
      "ShinjukuTerminal_1_Floor.geojson",
      "ShinjukuTerminal_2_Floor.geojson",
      "ShinjukuTerminal_2out_Floor.geojson",
      "ShinjukuTerminal_3_Floor.geojson",
      "ShinjukuTerminal_3out_Floor.geojson",
      "ShinjukuTerminal_4_Floor.geojson",
      "ShinjukuTerminal_4out_Floor.geojson",
      "ShinjukuTerminal_B3_Fixture.geojson",
      "ShinjukuTerminal_B2_Fixture.geojson",
      "ShinjukuTerminal_B1_Fixture.geojson",
      "ShinjukuTerminal_0_Fixture.geojson",
      "ShinjukuTerminal_2_Fixture.geojson",
      "ShinjukuTerminal_2out_Fixture.geojson",
      "ShinjukuTerminal_3_Fixture.geojson",
      "ShinjukuTerminal_3out_Fixture.geojson",
      "ShinjukuTerminal_4_Fixture.geojson",
      "ShinjukuTerminal_4out_Fixture.geojson",
    ],
  },
};

export const selected = "NagoyaUnimall";
export const rootPath = data[selected].rootPath;
export const centeringFile = rootPath + data[selected].centeringFile;
export const networkFiles = data[selected].networkFiles
  ? {
      node: rootPath + data[selected].networkFiles.node,
      link: rootPath + data[selected].networkFiles.link,
    }
  : undefined;
export const terrainFiles = data[selected].terrainFiles
  ? rootPath + data[selected].terrainFiles
  : undefined;
export const geoFile = data[selected].geoFile.map((f) => rootPath + f);

export const groupList: number[] = [4, 3, 2, 1, 0, -1, -2, -3];
export const layers = ["4F", "3F", "2F", "1F", "0", "B1", "B2", "B3"];
export const verticalOffset = 30;
