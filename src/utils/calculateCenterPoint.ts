import * as d3 from "d3";
import { Feature, Position } from "geojson";

/**
 * 中心点を計算する
 *
 * @param {string[]} geoFiles
 * @return {*}  {Promise<[number, number]>}
 */
export const calculateCenterPoint = async (
  geoFiles: string[]
): Promise<[number, number]> => {
  const polygons: [number, number][] = [];

  for (const file of geoFiles) {
    const response = await fetch(file);
    const data = await response.json();

    data.features.forEach((feature: Feature) => {
      const geometry = feature.geometry;

      if (!geometry) {
        return;
      }

      if (geometry.type === "Polygon") {
        geometry.coordinates.forEach((coordinates: Position[]) => {
          const validCoordinates = coordinates.map(
            (coord) => [coord[0], coord[1]] as [number, number]
          );
          const center = d3.polygonCentroid(validCoordinates);
          polygons.push(center);
        });
      } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon: Position[][]) => {
          polygon.forEach((coordinates: Position[]) => {
            const validCoordinates = coordinates.map(
              (coord) => [coord[0], coord[1]] as [number, number]
            );
            const center = d3.polygonCentroid(validCoordinates);
            polygons.push(center);
          });
        });
      }
    });
  }

  const avgX = d3.mean(polygons, (d) => d[0]);
  const avgY = d3.mean(polygons, (d) => d[1]);

  return [avgX ?? 0, avgY ?? 0];
};
