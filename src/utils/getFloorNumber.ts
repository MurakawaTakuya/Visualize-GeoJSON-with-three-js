/**
 * 与えられたgeojsonから階数を取得
 *
 * @param {string} geojson
 * @param {string} type
 * @return {*}  {(number | null)}
 */
export const getFloorNumber = (
  geojson: string,
  type: string
): number | null => {
  const regex = new RegExp(`ShinjukuTerminal_([-B\\d]+)(out)?_${type}`);
  const match = geojson.match(regex);
  if (!match) return null;
  const floor = match[1].replace("B", "-");
  return parseInt(match[2] === "out" ? floor.replace("out", "") : floor, 10);
};
