import * as THREE from "three";
import { MeshLineMaterial } from "three.meshline";

export const linkMaterial = new MeshLineMaterial({
  transparent: true,
  lineWidth: 1,
  color: new THREE.Color("rgb(0, 255, 255)"),
});
