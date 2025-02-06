import { NodeProperties } from "@/types/types";
import { Feature, FeatureCollection, Point } from "geojson";
import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { createNetworkLink } from "./createNetworkLink";

/**
 * ネットワークファイルの読み込み
 *
 * @param {GUI} gui
 * @param {THREE.Scene} scene
 * @param {THREE.FileLoader} loader
 * @param {{ node: string; link: string }} networkFile
 * @param {THREE.BufferGeometry[]} meshLines
 * @param {[number, number]} center
 */
export const loadNetworkFile = (
  gui: GUI,
  scene: THREE.Scene,
  loader: THREE.FileLoader,
  networkFile: { node: string; link: string },
  meshLines: THREE.BufferGeometry[],
  center: [number, number]
) => {
  loader.load(networkFile.node, (data: unknown) => {
    const nodeData = data as FeatureCollection<Point, NodeProperties>;
    const nodeIds: { node_id: number; ordinal: number }[] =
      nodeData.features.map((feature: Feature<Point, NodeProperties>) => ({
        node_id: feature.properties.node_id,
        ordinal: feature.properties.ordinal,
      }));
    createNetworkLink(nodeIds, center, loader, scene, meshLines, networkFile);
  });

  gui
    .add({ hasCheck: true }, "hasCheck")
    .onChange((isV: boolean) => {
      const linkObj = scene.getObjectByName("link");
      if (linkObj) {
        linkObj.visible = isV;
      }
    })
    .name("ネットワーク");
};
