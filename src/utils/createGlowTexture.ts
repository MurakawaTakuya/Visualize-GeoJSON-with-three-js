import * as THREE from "three";

/**
 * ドットの周りにぼんやり光るエフェクトを生成する
 *
 * @return {*}  {THREE.Texture}
 */
const createGlowTexture = (): THREE.Texture => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (context) {
    const center = size / 2;
    const gradient = context.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      center
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }

  return new THREE.CanvasTexture(canvas);
};

export default createGlowTexture;
