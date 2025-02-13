import { prefectureZoomScale } from "@/const/const";
import * as THREE from "three";
import createGlowTexture from "./createGlowTexture";

/**
 * 選択地点のドットを描画する
 *
 * @export
 * @param {THREE.Scene} scene
 * @param {[number, number]} center
 * @param {boolean} isOnFocus
 * @param {number} lat
 * @param {number} lon
 */
export default function renderDot(
  scene: THREE.Scene,
  center: [number, number],
  isOnFocus: boolean,
  lat: number,
  lon: number
) {
  // ドットがさらに大きくなるように baseRadius を変更
  const baseRadius = isOnFocus ? 0.8 : 0.6;

  // スプライト用グローエフェクト追加（createGlowTextureで生成）
  const spriteMaterial = new THREE.SpriteMaterial({
    map: createGlowTexture(),
    color: isOnFocus ? 0xffff00 : 0xff0000,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });
  const spriteGlow = new THREE.Sprite(spriteMaterial);

  if (isOnFocus) {
    spriteGlow.scale.set(baseRadius * 7, baseRadius * 7, 1);
  } else {
    spriteGlow.scale.set(baseRadius * 6, baseRadius * 6, 1);
  }

  const circleGeometry = new THREE.CircleGeometry(baseRadius, 32);
  const circleMaterial = new THREE.MeshBasicMaterial({
    color: isOnFocus ? "yellow" : "red",
  });
  const centerCircle = new THREE.Mesh(circleGeometry, circleMaterial);
  centerCircle.position.set(
    (lon - center[0]) * prefectureZoomScale,
    (lat - center[1] - 0.1) * prefectureZoomScale,
    0.2 // ドットはグローより前面に表示
  );
  spriteGlow.position.copy(centerCircle.position);
  spriteGlow.position.z = 0; // グローは背面

  centerCircle.userData.isDot = true;
  spriteGlow.userData.isDot = true;

  scene.add(spriteGlow);
  scene.add(centerCircle);

  const ringGeometry = new THREE.RingGeometry(
    baseRadius * 1.3,
    baseRadius * 1.5,
    32
  );
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: "black",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  ringMesh.position.copy(centerCircle.position);
  ringMesh.rotation.x = -Math.PI / 2;
  scene.add(ringMesh);
}
