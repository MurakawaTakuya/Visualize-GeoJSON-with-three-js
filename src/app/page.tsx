"use client";
import GeoFilesLoader from "@/components/GeoFilesLoader";
import { Prefectures } from "@/const/Prefectures";
import { calculateCenterPoint } from "@/utils/calculateCenterPoint";
import { loadAndAddToScene } from "@/utils/loadAndAddToScene";
import { resetScene } from "@/utils/resetScene";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MapControls, TrackballControls } from "three/examples/jsm/Addons.js";
import "./page.module.scss";

export default function Page() {
  const startCoordinate = {
    x: 5.439731219240505,
    y: 2.2781496856300096,
    z: -2.4786368715140426,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const selectedData = Prefectures.Prefectures;
  const rootPath = selectedData && selectedData.rootPath;
  const geoFiles =
    selectedData && selectedData.geoFiles.map((f) => rootPath + f);

  const loader = new THREE.FileLoader().setResponseType("json");
  const scene = new THREE.Scene();
  const meshLines: THREE.BufferGeometry[] = [];

  const [loadFileRemaining, setLoadFileRemaining] = useState(geoFiles.length);

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
      const center = await calculateCenterPoint(geoFiles);
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
      70, // 視野角
      sizes.width / sizes.height, // アスペクト比
      0.000001, // 近づいた時に非表示にする距離
      3000 // 遠ざかった時に非表示にする距離
    );
    const canvas = document.createElement("canvas");
    const mapControls = new MapControls(camera, canvas);
    const zoomControls = new TrackballControls(camera, canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    containerRef.current.appendChild(canvas);

    // シーン, カメラ, レンダラーの設定
    // カメラの場所
    camera.position.set(
      startCoordinate.x,
      startCoordinate.y,
      startCoordinate.z
    );
    const dynamicTarget = new THREE.Vector3(
      startCoordinate.x,
      startCoordinate.y,
      startCoordinate.z
    );
    zoomControls.target.copy(dynamicTarget);
    scene.add(camera);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // コントローラ設定
    mapControls.enableDamping = true;
    mapControls.enableZoom = false;
    mapControls.maxDistance = 2000;
    mapControls.enableRotate = false; // 回転を無効化
    mapControls.enablePan = false;
    zoomControls.noPan = true;
    zoomControls.noRotate = true;
    zoomControls.noZoom = true;

    // geoJSONファイルの読み込み
    geoFiles.map((f) => {
      const depth = 0.001;
      return loadAndAddToScene(
        f,
        center,
        0,
        depth,
        loader,
        scene,
        setLoadFileRemaining
      );
    });

    // 描画
    const animate = () => {
      requestAnimationFrame(animate);
      mapControls.update();
      zoomControls.update();
      renderer.render(scene, camera);

      // console.log("Position:", camera.position);
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
    };
  }, [center]);

  return (
    <>
      <GeoFilesLoader
        loadFileRemaining={loadFileRemaining}
        totalFileCount={geoFiles.length}
      />
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
