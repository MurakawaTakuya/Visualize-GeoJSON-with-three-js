"use client";
import {
  centeringFile,
  geoFile,
  groupList,
  layers,
  networkFiles,
  terrainFiles,
} from "@/const/const";
import {
  fragmentShaderLogic,
  fragmentShaderUniforms,
  vertexShaderUniforms,
} from "@/const/uniforms";
import { CustomShader, NodeProperties } from "@/types/types";
import { creatingLink } from "@/utils/creatingLink";
import { linkMaterial, loader, scene } from "@/utils/geoUtils";
import { getFloorNumber } from "@/utils/getFloorNumber";
import { loadAndAddToScene } from "@/utils/loadAndAddToScene";
import type { Feature, FeatureCollection, Point, Polygon } from "geojson";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MapControls, TrackballControls } from "three/examples/jsm/Addons.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    // 中心点を更新
    // TODO: 中心点の計算方法を修正
    loader.load(centeringFile, (data: unknown) => {
      const fgData = data as FeatureCollection<
        Polygon,
        Record<string, unknown>
      >;
      // GeoJSON全体のバウンディングボックスを計算
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      fgData.features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates[0];
        coordinates.forEach((point: number[]) => {
          const [x, y] = point;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        });
      });

      // 中心点を更新
      setCenter([(minX + maxX) / 2, (minY + maxY) / 2]);
      console.log("Center is at", [(minX + maxX) / 2, (minY + maxY) / 2]);
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    // centerは更新されていない場合はスキップ
    if (center[0] === 0 && center[1] === 0) {
      return;
    }

    // 画面サイズやカメラの設定
    const sizes = { width: window.innerWidth, height: window.innerHeight };
    // 座標系の中心

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100000
    );
    const canvas = document.createElement("canvas");
    const mapControls = new MapControls(camera, canvas);
    const zoomControls = new TrackballControls(camera, canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    containerRef.current.appendChild(canvas);

    // シーン, カメラ, レンダラーの設定
    camera.position.set(-190, 280, -350);
    scene.add(camera);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // コントローラ設定
    mapControls.enableDamping = true;
    mapControls.enableZoom = false;
    mapControls.maxDistance = 1000;
    zoomControls.noPan = true;
    zoomControls.noRotate = true;
    zoomControls.noZoom = false;
    zoomControls.zoomSpeed = 0.5;

    // ウィンドウリサイズ時の処理
    const onResize = () => {
      if (!renderer || !containerRef.current) {
        return;
      }
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // GUI設定と階層グループ作成
    const gui = new GUI({ width: 150 });
    if (window.innerWidth < 768) {
      gui.close();
    }
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

    // geojson ファイルの読み込み
    geoFile.forEach((f) => {
      const floorNumber = getFloorNumber(f);
      // 床データはdepthを浅くする
      const depth = f.endsWith("_Floor.geojson") ? 0.5 : 5;
      loadAndAddToScene(f, center, floorNumber ?? 0, depth);
    });

    // メッシュライン用マテリアルとシェーダー
    linkMaterial.onBeforeCompile = (shader: CustomShader): void => {
      Object.assign(shader.uniforms, linkMaterial.userData.uniforms);
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `${vertexShaderUniforms} void main() {`
      );
      shader.vertexShader = shader.vertexShader.replace(
        "vUV = uv;",
        `vUV = uv; vUv = uv; vDistance = uDistance; vDirection = uDirection;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `${fragmentShaderUniforms} void main() {`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "gl_FragColor.a *= step(vCounters, visibility);",
        `gl_FragColor.a *= step(vCounters, visibility); ${fragmentShaderLogic}`
      );
    };

    gui
      .add({ hasCheck: true }, "hasCheck")
      .onChange((isV: boolean) => {
        const linkObj = scene.getObjectByName("link");
        if (linkObj) {
          linkObj.visible = isV;
        }
      })
      .name("歩行者ネットワーク");

    if (networkFiles) {
      // 歩行者ネットワークの読み込み
      loader.load(networkFiles.node, (data: unknown) => {
        const nodeData = data as FeatureCollection<Point, NodeProperties>;
        const nodeIds: { node_id: number; ordinal: number }[] =
          nodeData.features.map((feature: Feature<Point, NodeProperties>) => ({
            node_id: feature.properties.node_id,
            ordinal: feature.properties.ordinal,
          }));
        creatingLink(nodeIds, center);
      });
    }

    if (terrainFiles) {
      // 地表データの読み込み
      loader.load(terrainFiles, (data: unknown) => {
        const fgData = data as FeatureCollection<
          Polygon,
          Record<string, unknown>
        >;
        fgData.features.forEach(
          (feature: Feature<Polygon, Record<string, unknown>>) => {
            const coordinates = feature.geometry!.coordinates;
            const points = coordinates[0].map((point: number[]) => {
              return new THREE.Vector3(
                point[0] - center[0],
                point[1] - center[1],
                0
              );
            });
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const matrix = new THREE.Matrix4().makeRotationX(Math.PI / -2);
            geometry.applyMatrix4(matrix);
            const material = new THREE.LineBasicMaterial({
              color: new THREE.Color("rgb(23, 93, 199)"),
            });
            const line = new THREE.Line(geometry, material);
            const group0 = scene.getObjectByName("group0");
            if (group0) {
              group0.add(line);
            }
          }
        );
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      const target = mapControls.target;
      mapControls.update();
      zoomControls.target.set(target.x, target.y, target.z);
      zoomControls.update();
      if (linkMaterial.uniforms.uTime) {
        linkMaterial.uniforms.uTime.value += 0.1;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [center]);

  return <div ref={containerRef} />;
}
