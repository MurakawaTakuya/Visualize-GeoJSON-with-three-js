import { Feature, FeatureCollection, Polygon } from "geojson";
import { Dispatch } from "react";
import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

/**
 * 地形ファイルの読み込み
 *
 * @param {THREE.FileLoader} loader
 * @param {string} terrainFile
 * @param {[number, number]} center
 * @param {THREE.Scene} scene
 */
export const loadTerrainFile = (
  loader: THREE.FileLoader,
  terrainFile: string,
  center: [number, number],
  scene: THREE.Scene,
  gui: GUI,
  setLoadFileRemaining: Dispatch<React.SetStateAction<number>>
) => {
  loader.load(terrainFile, (data: unknown) => {
    const fgData = data as FeatureCollection<Polygon, Record<string, unknown>>;
    fgData.features.forEach(
      (feature: Feature<Polygon, Record<string, unknown>>) => {
        const coordinates = feature.geometry!.coordinates;
        const points = coordinates[0].map((point: number[]) => {
          return new THREE.Vector3(
            point[0] - center[0],
            point[1] - center[1],
            0
          );
        });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const matrix = new THREE.Matrix4().makeRotationX(Math.PI / -2);
        geometry.applyMatrix4(matrix);
        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color("rgb(23, 93, 199)"),
        });
        const line = new THREE.Line(geometry, material);
        const group0 = scene.getObjectByName("terrain");
        if (group0) {
          group0.add(line);
        } else {
          const group = new THREE.Group();
          group.name = "terrain";
          group.add(line);
          scene.add(group);

          gui
            .add({ terrain: true }, "terrain")
            .onChange((isVisible: boolean) => {
              const obj = scene.getObjectByName("terrain");
              if (obj) {
                obj.visible = isVisible;
              }
            })
            .name("地形");
        }
      }
    );

    setLoadFileRemaining((prev) => prev - 1);
  });
};
