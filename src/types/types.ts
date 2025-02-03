import * as THREE from "three";
// GeoJSON用プロパティの型定義
export interface LinkProperties {
  start_id: number;
  end_id: number;
  direction: number;
}

export interface NodeProperties {
  node_id: number;
  ordinal: number;
}

export interface CustomShader {
  uniforms: { [uniform: string]: THREE.IUniform };
  vertexShader: string;
  fragmentShader: string;
}
