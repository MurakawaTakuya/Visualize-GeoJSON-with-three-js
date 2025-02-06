import { verticalOffset } from "@/const/const";
import { Feature, FeatureCollection } from "geojson";
import * as THREE from "three";
import { createExtrudedGeometry } from "./createExtrudedGeometry";

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
  depth: number,
  loader: THREE.FileLoader,
  scene: THREE.Scene
): void => {
  loader.load(geojson, (data: unknown) => {
    const geoData = data as FeatureCollection<
      GeoJSON.Geometry,
      Record<string, unknown>
    >;
    geoData.features
      .filter(
        (feature: Feature<GeoJSON.Geometry, Record<string, unknown>>) =>
          feature.geometry !== null
      )
      .forEach(
        (feature: Feature<GeoJSON.Geometry, Record<string, unknown>>) => {
          switch (feature.geometry.type) {
            case "Point": {
              const [longitude, latitude] = feature.geometry.coordinates;
              // 球体で点を表現
              const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32);
              const pointMaterial = new THREE.MeshBasicMaterial({
                color: "rgb(255, 0, 0)",
              });
              // 球体の中心を(longitude - center[0], latitude - center[1])へ平行移動
              pointGeometry.translate(
                longitude - center[0],
                latitude - center[1],
                0
              );
              // -90度回転
              const matrix = new THREE.Matrix4().makeRotationX(Math.PI / -2);
              pointGeometry.applyMatrix4(matrix);
              // マテリアルとメッシュ生成
              const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
              pointMesh.position.y += floorNumber * verticalOffset - 1;

              const group = scene.getObjectByName("Point");
              if (group) {
                group.add(pointMesh);
              }
              break;
            }
            case "LineString": {
              // 線を作成
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(
                feature.geometry.coordinates.map(([longitude, latitude]) => {
                  return new THREE.Vector3(
                    longitude - center[0],
                    latitude - center[1],
                    0
                  );
                })
              );
              const lineMaterial = new THREE.LineBasicMaterial({
                color: "rgb(98, 232, 255)",
              });
              // -90度回転
              const matrix = new THREE.Matrix4().makeRotationX(Math.PI / -2);
              lineGeometry.applyMatrix4(matrix);
              const line = new THREE.Line(lineGeometry, lineMaterial);
              line.position.y += floorNumber * verticalOffset - 1;

              const group = scene.getObjectByName("LineString");
              if (group) {
                group.add(line);
              }
              break;
            }
            case "Polygon": {
              // ポリゴンを作成
              const geometry = createExtrudedGeometry(
                feature.geometry.coordinates,
                depth,
                center
              );
              const lineMaterial = new THREE.LineBasicMaterial({
                color: "rgb(255, 255, 255)",
                transparent: true,
                opacity: 0.9,
              });
              // -90度回転
              const matrix = new THREE.Matrix4().makeRotationX(Math.PI / -2);
              geometry.applyMatrix4(matrix);
              // エッジ抽出してLineを作成
              const edges = new THREE.EdgesGeometry(geometry);
              const line = new THREE.LineSegments(edges, lineMaterial);
              line.position.y += floorNumber * verticalOffset - 1;

              const group = scene.getObjectByName(`group${floorNumber}`);
              if (group) {
                group.add(line);
              }
              break;
            }
          }
        }
      );
  });
};
