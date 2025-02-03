import * as THREE from "three";

/**
 * 与えられた座標からExtrudeGeometryを作成
 *
 * @param {number[][][]} coordinates
 * @param {number} depth
 * @param {number[]} center
 * @return {*}  {THREE.ExtrudeGeometry}
 */
export const createExtrudedGeometry = (
  coordinates: number[][][],
  depth: number,
  center: number[]
): THREE.ExtrudeGeometry => {
  const shape = new THREE.Shape();
  coordinates[0].forEach((point: number[], index: number) => {
    const [x, y] = point.map((coord, idx) => coord - center[idx]);
    if (index === 0) {
      shape.moveTo(x, y);
    } else if (index + 1 === coordinates[0].length) {
      shape.closePath();
    } else {
      shape.lineTo(x, y);
    }
  });
  return new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: depth,
    bevelEnabled: false,
  });
};
