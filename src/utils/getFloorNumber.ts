/**
 * 与えられたgeojsonから階数を取得
 * 以下のパターンを想定
 * - 文字列_数字_文字列
 * - 文字列_数字out_文字列
 * - 文字列_B数字_文字列
 *
 * @param {string} geojson
 * @param {string} type
 * @return {*}  {(number | null)}
 */
export const getFloorNumber = (geojson: string): number | null => {
  const regex = new RegExp(`.*_([-B\\d]+)(out)?_.*`);
  const match = geojson.match(regex);
  if (!match) {
    console.log("Couldn't get floor number in", geojson);
    return null;
  }
  const floor = match[1].replace("B", "-");
  return parseInt(match[2] === "out" ? floor.replace("out", "") : floor, 10);
};
