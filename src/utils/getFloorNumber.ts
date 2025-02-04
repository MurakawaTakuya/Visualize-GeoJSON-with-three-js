/**
 * 与えられたgeojsonから階数を取得
 *
 * @param {string} geojson
 * @param {string} type
 * @return {*}  {(number | null)}
 */
export const getFloorNumber = (geojson: string): number | null => {
  const regex = new RegExp(`.*_([-B\\d]+)(out)?_.*`);
  const match = geojson.match(regex);
  if (!match) return null;
  const floor = match[1].replace("B", "-");
  return parseInt(match[2] === "out" ? floor.replace("out", "") : floor, 10);
};
