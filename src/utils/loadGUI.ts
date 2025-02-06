import { groupList, layers } from "@/const/const";
import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export const loadGUI = (gui: GUI, scene: THREE.Scene) => {
  // GUI設定と階層グループ作成
  if (window.innerWidth < 768) {
    gui.close();
  }
  // Polygon
  groupList.forEach((num, i) => {
    const group = new THREE.Group();
    group.name = `group${num}`;
    scene.add(group);
    gui
      .add({ [`group${num}`]: true }, `group${num}`)
      .onChange((isVisible: boolean) => {
        const obj = scene.getObjectByName(`group${num}`);
        if (obj) {
          obj.visible = isVisible;
        }
      })
      .name(layers[i]);
  });

  const lineStringGroup = new THREE.Group();
  lineStringGroup.name = "LineString";
  scene.add(lineStringGroup);
  // LineString
  gui
    .add({ lineString: true }, "lineString")
    .onChange((isVisible: boolean) => {
      const obj = scene.getObjectByName("LineString");
      if (obj) {
        obj.visible = isVisible;
      }
    })
    .name("LineString");

  const pointGroup = new THREE.Group();
  pointGroup.name = "Point";
  scene.add(pointGroup);
  // Point
  gui
    .add({ point: true }, "point")
    .onChange((isVisible: boolean) => {
      const obj = scene.getObjectByName("Point");
      if (obj) {
        obj.visible = isVisible;
      }
    })
    .name("設備");
};
