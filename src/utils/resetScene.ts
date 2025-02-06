import { MaterialWithTextures } from "@/types/types";
import * as THREE from "three";

/**
 * シーンをリセット
 *
 * @param {THREE.Scene} scene
 */
export const resetScene = (scene: THREE.Scene) => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      if (object.material.isMaterial) {
        cleanMaterial(object.material);
      } else {
        for (const material of object.material) {
          cleanMaterial(material);
        }
      }
    }
  });

  // シーンから children を削除
  while (scene.children.length > 0) {
    const child = scene.children[0];
    scene.remove(child);
  }
};

function cleanMaterial(material: MaterialWithTextures): void {
  // テクスチャがあれば解放
  for (const key in material) {
    const value = material[key as keyof MaterialWithTextures];
    if (value && (value as THREE.Texture).isTexture) {
      (value as THREE.Texture).dispose();
    }
  }
  material.dispose();
}
