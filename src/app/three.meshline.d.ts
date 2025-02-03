declare module "three.meshline" {
  import * as THREE from "three";

  export class MeshLine extends THREE.BufferGeometry {
    /**
     * 与えられたジオメトリからメッシュラインを作成
     * @param geometry THREE.BufferGeometryやTHREE.Geometry など
     * @param options
     */
    setGeometry(
      geometry: THREE.BufferGeometry | THREE.Geometry,
      options?: { drawMode?: number }
    ): this;

    setAttribute(name: string, attribute: THREE.BufferAttribute): void;

    geometry: THREE.BufferGeometry;
  }

  export interface MeshLineMaterialParameters
    extends THREE.ShaderMaterialParameters {
    lineWidth?: number;
    sizeAttenuation?: boolean;
    color?: THREE.Color | string | number;
    dashArray?: number;
    dashOffset?: number;
    dashRatio?: number;
    transparent?: boolean;
  }

  export class MeshLineMaterial extends THREE.ShaderMaterial {
    constructor(parameters?: MeshLineMaterialParameters);
  }
}
