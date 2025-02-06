import { verticalOffset } from "@/const/const";
import { LinkProperties } from "@/types/types";
import { Feature, FeatureCollection, LineString } from "geojson";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

/**
 * ネットワークの描画
 *
 * @param {{ node_id: number; ordinal: number }[]} nodeId
 */
export const createNetworkLink = (
  nodeId: { node_id: number; ordinal: number }[],
  center: [number, number],
  loader: THREE.FileLoader,
  scene: THREE.Scene,
  meshLines: THREE.BufferGeometry[],
  networkFile?: { link: string; node: string }
): void => {
  if (!networkFile) {
    return;
  }

  const linkMaterial = new MeshLineMaterial({
    color: new THREE.Color("rgb(255, 228, 93)"),
    transparent: true,
    opacity: 0.5,
    lineWidth: 0.3,
  });

  loader.load(networkFile.link, (data: unknown) => {
    const linkData = data as FeatureCollection<LineString, LinkProperties>;
    // リンクの描画
    linkData.features.forEach(
      (feature: Feature<LineString, LinkProperties>) => {
        const coordinates: number[][] = feature.geometry.coordinates;
        const start_id = nodeId.find(
          (node) => node.node_id === feature.properties.start_id
        );
        const end_id = nodeId.find(
          (node) => node.node_id === feature.properties.end_id
        );
        const points = coordinates.map((point: number[], index: number) => {
          let y: number;
          if (!start_id && !end_id) {
            y = 0;
          } else if (start_id && !end_id) {
            y = start_id.ordinal;
          } else if (!start_id && end_id) {
            y = end_id.ordinal;
          } else {
            if (index === 0) {
              y = start_id!.ordinal;
            } else if (index === coordinates.length - 1) {
              y = end_id!.ordinal;
            } else if (start_id!.ordinal === end_id!.ordinal) {
              y = end_id!.ordinal;
            } else {
              y = Math.round((start_id!.ordinal + end_id!.ordinal) / 2);
            }
          }
          return new THREE.Vector3(
            point[0] - center[0],
            y * verticalOffset + 1,
            -(point[1] - center[1])
          );
        });
        points.forEach((point: THREE.Vector3, index: number) => {
          if (index + 1 === points.length) return;
          const geometry = new THREE.BufferGeometry().setFromPoints([
            point,
            points[index + 1],
          ]);
          const line = new MeshLine();
          line.setGeometry(geometry);
          const numVerticesAfter = (
            line.geometry as THREE.BufferGeometry
          ).getAttribute("position").count;
          const distance = point.distanceTo(points[index + 1]);
          const distances = new Float32Array(numVerticesAfter).fill(distance);
          line.setAttribute(
            "uDistance",
            new THREE.BufferAttribute(distances, 1)
          );
          const directions = new Float32Array(numVerticesAfter).fill(
            feature.properties.direction
          );
          line.setAttribute(
            "uDirection",
            new THREE.BufferAttribute(directions, 1)
          );
          Object.assign(linkMaterial.userData, {
            uniforms: {
              uTime: { value: 0 },
            },
          });
          const mesh = new THREE.Mesh(line.geometry, linkMaterial);
          meshLines.push(mesh.geometry);
        });
      }
    );
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(meshLines);
    const linkGeometry = new THREE.Mesh(mergedGeometry, linkMaterial);
    linkGeometry.name = "link";
    scene.add(linkGeometry);
  });
};
