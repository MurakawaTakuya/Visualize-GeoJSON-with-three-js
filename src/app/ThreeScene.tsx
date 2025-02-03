/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    const canvas = document.createElement("canvas");
    containerRef.current.appendChild(canvas);

    // シーン、カメラ、レンダラーの作成
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100000
    );
    camera.position.set(-190, 280, -350);
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // コントロール設定
    const mapControls = new MapControls(camera, canvas);
    mapControls.enableDamping = true;
    mapControls.enableZoom = false;
    mapControls.maxDistance = 1000;
    const zoomControls = new TrackballControls(camera, canvas);
    zoomControls.noPan = true;
    zoomControls.noRotate = true;
    zoomControls.noZoom = false;
    zoomControls.zoomSpeed = 0.5;

    // ウィンドウリサイズ
    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // GUI 設定と階層グループ作成
    const gui = new GUI({ width: 150 });
    if (window.innerWidth < 768) {
      gui.close();
    }
    const groupList = [4, 3, 2, 1, 0, -1, -2, -3];
    const layers = ["4F", "3F", "2F", "1F", "0", "B1", "B2", "B3"];
    groupList.forEach((num, i) => {
      const group = new THREE.Group();
      group.name = `group${num}`;
      scene.add(group);
      gui
        .add({ [`group${num}`]: true }, `group${num}`)
        .onChange((isVisible: boolean) => {
          const obj = scene.getObjectByName(`group${num}`);
          if (obj) obj.visible = isVisible;
        })
        .name(layers[i]);
    });

    const loader = new THREE.FileLoader().setResponseType("json");
    // ここで座標系の中心を設定
    const center = [-12035.29, -34261.85];

    const getFloorNumber = (geojson: string, type: string): number | null => {
      const regex = new RegExp(`ShinjukuTerminal_([-B\\d]+)(out)?_${type}`);
      const match = geojson.match(regex);
      if (!match) return null;
      const floor = match[1].replace("B", "-");
      return parseInt(
        match[2] === "out" ? floor.replace("out", "") : floor,
        10
      );
    };

    const createExtrudedGeometry = (coordinates: any, depth: number) => {
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

    const verticalOffset = 30;
    const loadAndAddToScene = (
      geojson: string,
      floorNumber: number,
      depth: number
    ) => {
      loader.load(geojson, (data: any) => {
        const lineMaterial = new THREE.LineBasicMaterial({
          color: "rgb(255, 255, 255)",
        });
        data.features
          .filter((feature: any) => feature.geometry)
          .forEach((feature: any) => {
            const geometry = createExtrudedGeometry(
              feature.geometry.coordinates,
              depth
            );
            // 90度回転
            const matrix = new THREE.Matrix4().makeRotationX(Math.PI / -2);
            geometry.applyMatrix4(matrix);
            // エッジ抽出して Line を作成
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(edges, lineMaterial);
            line.position.y += floorNumber * verticalOffset - 1;
            const group = scene.getObjectByName(`group${floorNumber}`);
            if (group) group.add(line);
          });
      });
    };

    // --- geojson ファイルから各オブジェクトの読み込み ---
    const rootPath = "./ShinjukuTerminal/";
    const allFiles = [
      "ShinjukuTerminal_B3_Space.geojson",
      "ShinjukuTerminal_B2_Space.geojson",
      "ShinjukuTerminal_B1_Space.geojson",
      "ShinjukuTerminal_0_Space.geojson",
      "ShinjukuTerminal_1_Space.geojson",
      "ShinjukuTerminal_2_Space.geojson",
      "ShinjukuTerminal_2out_Space.geojson",
      "ShinjukuTerminal_3_Space.geojson",
      "ShinjukuTerminal_3out_Space.geojson",
      "ShinjukuTerminal_4_Space.geojson",
      "ShinjukuTerminal_4out_Space.geojson",
      "ShinjukuTerminal_B3_Floor.geojson",
      "ShinjukuTerminal_B2_Floor.geojson",
      "ShinjukuTerminal_B1_Floor.geojson",
      "ShinjukuTerminal_0_Floor.geojson",
      "ShinjukuTerminal_1_Floor.geojson",
      "ShinjukuTerminal_2_Floor.geojson",
      "ShinjukuTerminal_2out_Floor.geojson",
      "ShinjukuTerminal_3_Floor.geojson",
      "ShinjukuTerminal_3out_Floor.geojson",
      "ShinjukuTerminal_4_Floor.geojson",
      "ShinjukuTerminal_4out_Floor.geojson",
      "ShinjukuTerminal_B3_Fixture.geojson",
      "ShinjukuTerminal_B2_Fixture.geojson",
      "ShinjukuTerminal_B1_Fixture.geojson",
      "ShinjukuTerminal_0_Fixture.geojson",
      "ShinjukuTerminal_2_Fixture.geojson",
      "ShinjukuTerminal_2out_Fixture.geojson",
      "ShinjukuTerminal_3_Fixture.geojson",
      "ShinjukuTerminal_3out_Fixture.geojson",
      "ShinjukuTerminal_4_Fixture.geojson",
      "ShinjukuTerminal_4out_Fixture.geojson",
    ];
    const SpaceLists = allFiles
      .filter((f) => f.endsWith("_Space.geojson"))
      .map((f) => rootPath + f);
    const FloorLists = allFiles
      .filter((f) => f.endsWith("_Floor.geojson"))
      .map((f) => rootPath + f);
    const FixtureLists = allFiles
      .filter((f) => f.endsWith("_Fixture.geojson"))
      .map((f) => rootPath + f);

    SpaceLists.forEach((geojson) => {
      const floorNumber = getFloorNumber(geojson, "Space");
      if (floorNumber !== null) {
        loadAndAddToScene(geojson, floorNumber, 5);
      }
    });

    FloorLists.forEach((geojson) => {
      const floorNumber = getFloorNumber(geojson, "Floor");
      if (floorNumber !== null) {
        loadAndAddToScene(geojson, floorNumber, 0.5);
      }
    });

    FixtureLists.forEach((geojson) => {
      const floorNumber = getFloorNumber(geojson, "Fixture");
      if (floorNumber !== null) {
        loadAndAddToScene(geojson, floorNumber, 5);
      }
    });

    // --- メッシュライン用マテリアルとシェーダー ---
    const linkMaterial = new MeshLineMaterial({
      transparent: true,
      lineWidth: 1,
      color: new THREE.Color("rgb(0, 255, 255)"),
    });
    linkMaterial.onBeforeCompile = (shader: any) => {
      Object.assign(shader.uniforms, linkMaterial.userData.uniforms);
      const keyword2 = "void main() {";
      shader.vertexShader = shader.vertexShader.replace(
        keyword2,
        `\n        varying vec2 vUv;\n        attribute float uDistance;\n        attribute float uDirection;\n        varying float vDistance;\n        varying float vDirection;\n        ${keyword2}`
      );
      const keyword3 = "vUV = uv;";
      shader.vertexShader = shader.vertexShader.replace(
        keyword3,
        `\n        ${keyword3}\n        vUv = uv;\n        vDistance = uDistance;\n        vDirection = uDirection;\n        `
      );
      const keyword1 = "void main() {";
      shader.fragmentShader = shader.fragmentShader.replace(
        keyword1,
        `\n        uniform float uTime;\n        varying float vDirection;\n        varying float vDistance;\n        varying vec2 vUv;\n        ${keyword1}`
      );
      const keyword = "gl_FragColor.a *= step(vCounters, visibility);";
      shader.fragmentShader = shader.fragmentShader.replace(
        keyword,
        `${keyword}\n        vec2 p;\n        p.x = vUv.x * vDistance;\n        p.y = vUv.y * 1.0 - 0.5;\n\n        float centerDistY = p.y;\n        float offset = abs(centerDistY) * 0.5;\n\n        float time = uTime;\n        if(centerDistY < 0.0) {\n            if(vDirection == 1.0){\n                time = -uTime;\n                offset = -offset;\n            } else if(vDirection == 2.0) {\n                offset = offset;\n            }\n        }\n\n        float line = mod(p.x - time + offset, 1.9) < 0.9 ? 1.0 : 0.0;\n        vec3 mainColor;\n        if(vDirection == 1.0) {\n            mainColor = vec3(0.0, 1.0, 1.0);\n        } else if(vDirection == 2.0) {\n            mainColor = vec3(1.0, 1.0, 0.0);\n        }\n        vec3 color = mix(mainColor, mainColor, line);\n\n        gl_FragColor = vec4(color, line * 0.7);\n        `
      );
    };

    // --- 歩行者ネットワークの構築 ---
    const meshLines: THREE.BufferGeometry[] = [];
    const creatingLink = (nodeId: any) => {
      loader.load("./nw/Shinjuku_link.geojson", (data: any) => {
        data.features.forEach((feature: any) => {
          const coordinates = feature.geometry.coordinates;
          const start_id = nodeId.find(
            (node: any) => node.node_id === feature.properties.start_id
          );
          const end_id = nodeId.find(
            (node: any) => node.node_id === feature.properties.end_id
          );
          const points = coordinates.map((point: number[], index: number) => {
            let y: number;
            if (!start_id && !end_id) {
              y = 0;
            } else if (start_id && !end_id) {
              y = start_id.ordinal;
            } else if (!start_id && end_id) {
              y = end_id.ordinal;
            } else {
              if (index === 0) {
                y = start_id.ordinal;
              } else if (index === coordinates.length - 1) {
                y = end_id.ordinal;
              } else if (start_id.ordinal === end_id.ordinal) {
                y = end_id.ordinal;
              } else {
                y = Math.round((start_id.ordinal + end_id.ordinal) / 2);
              }
            }
            return new THREE.Vector3(
              point[0] - center[0],
              y * verticalOffset + 1,
              -(point[1] - center[1])
            );
          });
          points.forEach((point: THREE.Vector3, index: number) => {
            if (index + 1 === points.length) return;
            const geometry = new THREE.BufferGeometry().setFromPoints([
              point,
              points[index + 1],
            ]);
            const line = new MeshLine();
            line.setGeometry(geometry);
            const numVerticesAfter = (
              line.geometry as THREE.BufferGeometry
            ).getAttribute("position").count;
            const distance = point.distanceTo(points[index + 1]);
            const distances = new Float32Array(numVerticesAfter).fill(distance);
            line.setAttribute(
              "uDistance",
              new THREE.BufferAttribute(distances, 1)
            );
            const directions = new Float32Array(numVerticesAfter).fill(
              feature.properties.direction
            );
            line.setAttribute(
              "uDirection",
              new THREE.BufferAttribute(directions, 1)
            );
            Object.assign(linkMaterial.userData, {
              uniforms: {
                uTime: { value: 0 },
              },
            });
            const mesh = new THREE.Mesh(line.geometry, linkMaterial);
            meshLines.push(mesh.geometry);
          });
        });
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(meshLines);
        const linkGeometry = new THREE.Mesh(mergedGeometry, linkMaterial);
        linkGeometry.name = "link";
        scene.add(linkGeometry);
        const loading = document.getElementById("loading");
        if (loading) {
          const animation = loading.animate(
            { opacity: [1, 0] },
            { duration: 300, fill: "forwards" }
          );
          animation.onfinish = () => {
            loading.remove();
          };
        }
      });
    };

    gui
      .add({ hasCheck: true }, "hasCheck")
      .onChange((isV: boolean) => {
        const linkObj = scene.getObjectByName("link");
        if (linkObj) linkObj.visible = isV;
      })
      .name("歩行者ネットワーク");

    loader.load("./nw/Shinjuku_node.geojson", (data: any) => {
      const nodeIds = data.features.map((feature: any) => ({
        node_id: feature.properties.node_id,
        ordinal: feature.properties.ordinal,
      }));
      creatingLink(nodeIds);
    });

    loader.load("./fg.geojson", (data: any) => {
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color("rgb(209, 102, 255)"),
      });
      data.features.forEach((feature: any) => {
        const coordinates = feature.geometry.coordinates;
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
        const line = new THREE.Line(geometry, material);
        const group0 = scene.getObjectByName("group0");
        if (group0) group0.add(line);
      });
    });

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
  }, []);

  return <div ref={containerRef} />;
}
