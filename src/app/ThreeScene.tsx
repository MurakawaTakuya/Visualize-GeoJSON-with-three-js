"use client";
import { data } from "@/const/const";
import { calculateCenterPoint } from "@/utils/calculateCenterPoint";
import { getFloorNumber } from "@/utils/getFloorNumber";
import { loadAndAddToScene } from "@/utils/loadAndAddToScene";
import { loadGUI } from "@/utils/loadGUI";
import { loadNetworkFile } from "@/utils/loadNetworkFile";
import { loadTerrainFile } from "@/utils/loadTerrainFile";
import { resetScene } from "@/utils/resetScene";
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
  const networkFile =
    selectedData && selectedData.networkFile
      ? {
          node: rootPath + selectedData.networkFile.node,
          link: rootPath + selectedData.networkFile.link,
        }
      : undefined;
  const terrainFile =
    selectedData && selectedData.terrainFile
      ? rootPath + selectedData.terrainFile
      : undefined;
  const geoFile = selectedData && selectedData.geoFile.map((f) => rootPath + f);

  const loader = new THREE.FileLoader().setResponseType("json");
  const scene = new THREE.Scene();
  const meshLines: THREE.BufferGeometry[] = [];

  useEffect(() => {
    if (!selectedData) {
      return;
    }
    // centerが指定されている場合
    if (selectedData.center) {
      setCenter(selectedData.center);
      return;
    }
    // centerを計算
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
      3000
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

    // geojsonファイルの読み込み
    geoFile.forEach((f) => {
      const floorNumber = getFloorNumber(f);
      // 床データはdepthを浅くする
      const depth = f.endsWith("_Floor.geojson") ? 0.5 : 7;
      loadAndAddToScene(f, center, floorNumber ?? 0, depth, loader, scene);
    });

    // GUIを表示
    const gui = new GUI({ width: 150 });
    loadGUI(gui, scene);

    // 歩行者ネットワークの読み込み
    if (networkFile) {
      loadNetworkFile(gui, scene, loader, networkFile, meshLines, center);
    }

    // 地表データの読み込み
    if (terrainFile) {
      loadTerrainFile(loader, terrainFile, center, scene);
    }

    // 描画
    const animate = () => {
      requestAnimationFrame(animate);
      const target = mapControls.target;
      mapControls.update();
      zoomControls.target.set(target.x, target.y, target.z);
      zoomControls.update();
      renderer.render(scene, camera);
    };
    animate();

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
