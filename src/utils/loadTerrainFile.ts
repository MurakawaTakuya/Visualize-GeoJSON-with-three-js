import { Feature, FeatureCollection, Polygon } from "geojson";
import * as THREE from "three";

export const loadTerrainFile = (
  loader: THREE.FileLoader,
  terrainFile: string,
  center: [number, number],
  scene: THREE.Scene
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
        const group0 = scene.getObjectByName("group0");
        if (group0) {
          group0.add(line);
        }
      }
    );
  });
};
