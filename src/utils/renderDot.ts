import { prefectureScale } from "@/const/const";
import * as THREE from "three";

export default function renderDot(
  scene: THREE.Scene,
  center: [number, number],
  lat: number,
  lon: number
) {
  console.log({ lon: lon - center[0], lat: lat - center[1] });
  const circleGeometry = new THREE.CircleGeometry(0.2, 32);
  const circleMaterial = new THREE.MeshBasicMaterial({ color: "red" });
  const centerCircle = new THREE.Mesh(circleGeometry, circleMaterial);
  // latitudeが0.1程度ずれているので補正
  centerCircle.position.set(
    (lon - center[0]) * prefectureScale,
    (lat - center[1] - 0.1) * prefectureScale,
    0
  );
  scene.add(centerCircle);
}
