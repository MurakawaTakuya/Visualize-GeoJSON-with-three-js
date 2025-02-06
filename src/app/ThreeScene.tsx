"use client";
import { data } from "@/const/const";
import { NodeProperties } from "@/types/types";
import { calculateCenterPoint } from "@/utils/calculateCenterPoint";
import { createNetworkLink } from "@/utils/createNetworkLink";
import { getFloorNumber } from "@/utils/getFloorNumber";
import { loadAndAddToScene } from "@/utils/loadAndAddToScene";
import { loadGUI } from "@/utils/loadGUI";
import { resetScene } from "@/utils/resetScene";
import type { Feature, FeatureCollection, Point, Polygon } from "geojson";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MapControls, TrackballControls } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default function ThreeScene({ place }: { place: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const selectedData = data[place];
  const rootPath = selectedData && selectedData.rootPath;
  const networkFiles =
    selectedData && selectedData.networkFiles
      ? {
          node: rootPath + selectedData.networkFiles.node,
          link: rootPath + selectedData.networkFiles.link,
        }
      : undefined;
  const terrainFiles =
    selectedData && selectedData.terrainFiles
      ? rootPath + selectedData.terrainFiles
      : undefined;
  const geoFile = selectedData && selectedData.geoFile.map((f) => rootPath + f);

  const loader = new THREE.FileLoader().setResponseType("json");
  const scene = new THREE.Scene();
  const meshLines: THREE.BufferGeometry[] = [];

  useEffect(() => {
    if (!selectedData) {
      return;
    }
    if (selectedData.center) {
      setCenter(selectedData.center);
      return;
    }
    (async () => {
      const center = await calculateCenterPoint(geoFile);
      setCenter(center);
      console.log("Center is at", center);
    })();
  }, []);

  useEffect(() => {
    if (!selectedData) {
      return;
    }
    if (!containerRef.current) {
      return;
    }
    // centerは更新されていない場合はスキップ
    if (center[0] === 0 && center[1] === 0) {
      return;
    }

    // 画面サイズやカメラの設定
    const sizes = { width: window.innerWidth, height: window.innerHeight };
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.000001,
      1000
    );
    const canvas = document.createElement("canvas");
    const mapControls = new MapControls(camera, canvas);
    const zoomControls = new TrackballControls(camera, canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    containerRef.current.appendChild(canvas);

    // シーン, カメラ, レンダラーの設定
    camera.position.set(200, 200, 200);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
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

    // geojsonファイルの読み込み
    geoFile.forEach((f) => {
      const floorNumber = getFloorNumber(f);
      // 床データはdepthを浅くする
      const depth = f.endsWith("_Floor.geojson") ? 0.5 : 7;
      loadAndAddToScene(f, center, floorNumber ?? 0, depth, loader, scene);
    });

    const gui = new GUI({ width: 150 });
    loadGUI(gui, scene);

    // 歩行者ネットワークの読み込み
    if (networkFiles) {
      gui
        .add({ hasCheck: true }, "hasCheck")
        .onChange((isV: boolean) => {
          const linkObj = scene.getObjectByName("link");
          if (linkObj) {
            linkObj.visible = isV;
          }
        })
        .name("歩行者ネットワーク");

      loader.load(networkFiles.node, (data: unknown) => {
        const nodeData = data as FeatureCollection<Point, NodeProperties>;
        const nodeIds: { node_id: number; ordinal: number }[] =
          nodeData.features.map((feature: Feature<Point, NodeProperties>) => ({
            node_id: feature.properties.node_id,
            ordinal: feature.properties.ordinal,
          }));
        createNetworkLink(
          nodeIds,
          center,
          loader,
          scene,
          meshLines,
          networkFiles
        );
      });
    }

    // 地表データの読み込み
    if (terrainFiles) {
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
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);

      // Three.jsをリセット
      renderer.dispose();
      mapControls.dispose();
      zoomControls.dispose();
      meshLines.forEach((mesh) => mesh.dispose());
      resetScene(scene);
      gui.destroy();
    };
  }, [center]);

  return (
    <>
      <p
        style={{
          position: "absolute",
          top: "0",
          left: "20px",
          color: "white",
        }}
      >
        <Link href="/">トップに戻る</Link>
      </p>
      {selectedData ? (
        <div ref={containerRef} />
      ) : (
        <p style={{ color: "white", textAlign: "center" }}>
          データが見つかりません
        </p>
      )}
    </>
  );
}
