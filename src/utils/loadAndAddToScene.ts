import { verticalOffset } from "@/const/const";
import { Feature, FeatureCollection, Polygon } from "geojson";
import * as THREE from "three";
import { createExtrudedGeometry } from "./createExtrudedGeometry";
import { loader, scene } from "./geoUtils";

/**
 * GeoJSONデータを読み込んでシーンに追加
 *
 * @param {string} geojson
 * @param {number} floorNumber
 * @param {number} depth
 */
export const loadAndAddToScene = (
  geojson: string,
  center: [number, number],
  floorNumber: number,
  depth: number
): void => {
  loader.load(geojson, (data: unknown) => {
    const geoData = data as FeatureCollection<Polygon, Record<string, unknown>>;
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "rgba(255, 255, 255, 0.75)",
    });
    geoData.features
      .filter(
        (feature: Feature<Polygon, Record<string, unknown>>) =>
          feature.geometry !== null
      )
      .forEach((feature: Feature<Polygon, Record<string, unknown>>) => {
        if (feature.geometry.type !== "Polygon") {
          return;
        }
        // TODO: Point, LineStringの場合の処理を追加

        const geometry = createExtrudedGeometry(
          feature.geometry!.coordinates,
          depth,
          center
        );

        // 90度回転
        const matrix = new THREE.Matrix4().makeRotationX(Math.PI / -2);
        geometry.applyMatrix4(matrix);
        // エッジ抽出して Line を作成
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, lineMaterial);
        line.position.y += floorNumber * verticalOffset - 1;
        const group = scene.getObjectByName(`group${floorNumber}`);
        if (group) {
          group.add(line);
        }
      });
  });
};
