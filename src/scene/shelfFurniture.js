import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

function createCrescentGeometry() {
  const shape = new THREE.Shape();
  const R = 0.145;
  shape.absarc(0, 0, R, 0.42, Math.PI * 2 - 0.42, false);
  shape.absarc(0.056, 0.014, R * 0.8, Math.PI * 2 - 0.72, 0.72, true);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 2,
    curveSegments: 24,
  });
}

function createStar4Geometry(outerR, innerR, depth = 0.014) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 8; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / 4;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2,
  });
}

function createRingGeometry(outerR, innerR, depth = 0.014) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2,
    curveSegments: 28,
  });
}

function createPlaqueTextures() {
  const w = 512;
  const h = 84;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = w;
  colorCanvas.height = h;
  const g = colorCanvas.getContext("2d");

  const brassGrad = g.createLinearGradient(0, 0, w, h);
  brassGrad.addColorStop(0, "#d8b468");
  brassGrad.addColorStop(0.35, "#f0d38c");
  brassGrad.addColorStop(0.68, "#c99e4e");
  brassGrad.addColorStop(1, "#e6c57a");
  g.fillStyle = brassGrad;
  g.fillRect(0, 0, w, h);

  // 细腻拉丝金属横纹
  for (let y = 0; y < h; y += 2) {
    g.fillStyle = y % 4 === 0 ? "rgba(255, 248, 224, 0.08)" : "rgba(60, 38, 12, 0.06)";
    g.fillRect(0, y, w, 1);
  }

  // 阴刻内边框与 AMICO 字样
  g.strokeStyle = "rgba(74, 48, 18, 0.72)";
  g.lineWidth = 2.5;
  g.strokeRect(12, 10, w - 24, h - 20);

  g.fillStyle = "#3c260d";
  g.font = '700 34px "Noto Serif SC", Georgia, serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("A M I C O", w / 2, h / 2 + 1);

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  // 粗糙度与凹凸贴图：拉丝面较亮，刻字槽内偏哑光
  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = w;
  roughCanvas.height = h;
  const rg = roughCanvas.getContext("2d");
  rg.fillStyle = "#484848";
  rg.fillRect(0, 0, w, h);
  rg.strokeStyle = "#b8b8b8";
  rg.lineWidth = 3;
  rg.strokeRect(12, 10, w - 24, h - 20);
  rg.fillStyle = "#c8c8c8";
  rg.font = '700 34px "Noto Serif SC", Georgia, serif';
  rg.textAlign = "center";
  rg.textBaseline = "middle";
  rg.fillText("A M I C O", w / 2, h / 2 + 1);

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.anisotropy = 8;

  return { map, roughnessMap };
}

function buildBookend(side, brassMat, darkBrassMat) {
  // side: -1 左侧新月书档，+1 右侧星芒罗盘书档
  const group = new THREE.Group();

  // L 型底座与立板（贴紧书本外侧）
  const wall = new THREE.Mesh(new RoundedBoxGeometry(0.024, 0.56, 0.25, 3, 0.005), brassMat);
  wall.position.set(0, 0.28, 0);
  wall.castShadow = true;
  wall.receiveShadow = true;

  const foot = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.022, 0.25, 3, 0.005), brassMat);
  foot.position.set(side * 0.11, 0.011, 0);
  foot.castShadow = true;
  foot.receiveShadow = true;

  // 底部加固斜撑
  const gusset = new THREE.Mesh(new RoundedBoxGeometry(0.11, 0.08, 0.026, 2, 0.004), darkBrassMat);
  gusset.position.set(side * 0.05, 0.05, 0);
  gusset.rotation.z = -side * 0.58;
  gusset.castShadow = true;

  // 底座两端小装饰柱脚
  const finialGeo = new THREE.SphereGeometry(0.016, 12, 10);
  for (const fz of [-0.09, 0.09]) {
    const finial = new THREE.Mesh(finialGeo, brassMat);
    finial.position.set(side * 0.21, 0.024, fz);
    group.add(finial);
  }

  group.add(wall, foot, gusset);

  // 星月镂空雕花主饰（朝向正前方与外侧 45° 微斜，正视角非常立体）
  const motif = new THREE.Group();
  motif.position.set(side * 0.125, 0.27, 0.025);
  motif.rotation.y = side * -0.18;

  if (side < 0) {
    const crescent = new THREE.Mesh(createCrescentGeometry(), brassMat);
    crescent.position.set(0.01, 0, -0.008);
    crescent.castShadow = true;
    crescent.receiveShadow = true;
    const star = new THREE.Mesh(createStar4Geometry(0.048, 0.016, 0.012), brassMat);
    star.position.set(0.055, 0.02, -0.006);
    star.castShadow = true;
    motif.add(crescent, star);
  } else {
    const ring = new THREE.Mesh(createRingGeometry(0.14, 0.118, 0.014), brassMat);
    ring.position.z = -0.007;
    ring.castShadow = true;
    ring.receiveShadow = true;
    const majorStar = new THREE.Mesh(createStar4Geometry(0.12, 0.032, 0.016), brassMat);
    majorStar.position.z = -0.008;
    majorStar.castShadow = true;
    const minorStar = new THREE.Mesh(createStar4Geometry(0.072, 0.022, 0.012), darkBrassMat);
    minorStar.position.z = -0.006;
    minorStar.rotation.z = Math.PI / 4;
    motif.add(ring, majorStar, minorStar);
  }

  // 雕花支撑细杆接到立板和底座
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.14, 10), darkBrassMat);
  stem.position.set(side * 0.125, 0.08, 0.025);
  stem.castShadow = true;
  group.add(stem, motif);

  return group;
}

export function addShelfFurniture(scene, shadowMap) {
  const group = new THREE.Group();

  const brassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdbb668,
    metalness: 0.88,
    roughness: 0.28,
    clearcoat: 0.32,
    clearcoatRoughness: 0.24,
    envMapIntensity: 1.15,
  });
  const darkBrassMat = new THREE.MeshPhysicalMaterial({
    color: 0xb68d45,
    metalness: 0.84,
    roughness: 0.36,
    clearcoat: 0.22,
    envMapIntensity: 1.0,
  });

  // 左右星月黄铜书档，稳稳夹住下层 4 本书
  const leftEnd = buildBookend(-1, brassMat, darkBrassMat);
  leftEnd.position.set(-2.14, 0.042, 0.05);
  const rightEnd = buildBookend(1, brassMat, darkBrassMat);
  rightEnd.position.set(2.14, 0.042, 0.05);
  group.add(leftEnd, rightEnd);

  if (shadowMap) {
    const sMat = new THREE.MeshBasicMaterial({
      map: shadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.36,
    });
    sMat.polygonOffset = true;
    sMat.polygonOffsetFactor = -2;
    sMat.polygonOffsetUnits = -2;
    for (const sx of [-2.26, 2.26]) {
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.28), sMat);
      sh.rotation.x = -Math.PI / 2;
      sh.position.set(sx, 0.045, 0.05);
      sh.renderOrder = 1;
      group.add(sh);
    }
  }

  // 下层木板正中嵌入式 AMICO 黄铜铭牌
  const plaqueTex = createPlaqueTextures();
  const plaqueFaceMat = new THREE.MeshPhysicalMaterial({
    map: plaqueTex.map,
    roughnessMap: plaqueTex.roughnessMap,
    roughness: 0.88,
    metalness: 0.82,
    clearcoat: 0.25,
    clearcoatRoughness: 0.32,
    envMapIntensity: 1.15,
  });
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.056, 0.012),
    [darkBrassMat, darkBrassMat, darkBrassMat, darkBrassMat, plaqueFaceMat, darkBrassMat],
  );
  plaque.position.set(0, 0.002, 0.264);
  plaque.castShadow = true;
  plaque.receiveShadow = true;
  group.add(plaque);

  // 铭牌左右两枚微型圆头黄铜铆钉
  const rivetGeo = new THREE.SphereGeometry(0.0065, 10, 8);
  for (const rx of [-0.198, 0.198]) {
    const rivet = new THREE.Mesh(rivetGeo, brassMat);
    rivet.position.set(rx, 0.002, 0.27);
    rivet.scale.set(1, 1, 0.55);
    group.add(rivet);
  }

  scene.add(group);
  return {
    group,
    dispose() {
      plaqueTex.map.dispose();
      plaqueTex.roughnessMap.dispose();
      brassMat.dispose();
      darkBrassMat.dispose();
      plaqueFaceMat.dispose();
    },
  };
}
