import * as THREE from "three";

function velvet(color, sheenTint = 0xfff5e4, roughness = 0.86) {
  const ink = new THREE.Color(color);
  return new THREE.MeshPhysicalMaterial({
    color: ink,
    roughness,
    metalness: 0,
    sheen: 0.88,
    sheenRoughness: 0.44,
    sheenColor: ink.clone().lerp(new THREE.Color(sheenTint), 0.45),
    envMapIntensity: 0.65,
  });
}

function brass(color = 0xdcb86a, roughness = 0.28) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.88,
    roughness,
    clearcoat: 0.35,
    clearcoatRoughness: 0.22,
    envMapIntensity: 1.15,
  });
}

function walnut(color = 0x5c371d) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.5,
    metalness: 0.04,
    clearcoat: 0.2,
    clearcoatRoughness: 0.4,
  });
}

function glossy(color, emissive = 0x000000, emissiveIntensity = 0) {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive,
    emissiveIntensity,
    roughness: 0.16,
    metalness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.0,
  });
}

function castAll(group) {
  group.traverse((n) => {
    if (n.isMesh && !n.material?.transparent) {
      n.castShadow = true;
      n.receiveShadow = true;
    }
  });
  return group;
}

function add(parent, mesh, x = 0, y = 0, z = 0) {
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

/** 1. 复古书房黄铜暖光台灯 */
function lamp() {
  const g = new THREE.Group();
  const brassMat = brass();
  const woodMat = walnut(0x633b1e);

  // 阶梯胡桃木与黄铜底座
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.125, 0.032, 28), woodMat), 0, 0.016, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.102, 0.018, 28), brassMat), 0, 0.04, 0);

  // 纤细拉丝黄铜灯柱 + 装饰环
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.019, 0.22, 18), brassMat), 0, 0.155, 0);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 12), brassMat), 0, 0.135, 0).scale.set(1, 0.72, 1);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 10, 20), brassMat), 0, 0.245, 0).rotation.x = Math.PI / 2;

  // 暖杏丝绒灯罩（内外双面发光柔感）+ 上下金边
  const shadeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffe4b8,
    emissive: 0xffa84c,
    emissiveIntensity: 0.32,
    roughness: 0.72,
    sheen: 0.7,
    sheenColor: new THREE.Color(0xfff4da),
    side: THREE.DoubleSide,
  });
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.142, 0.135, 32, 1, true), shadeMat), 0, 0.305, 0);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.005, 10, 32), brassMat), 0, 0.372, 0).rotation.x = Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.0055, 10, 32), brassMat), 0, 0.238, 0).rotation.x = Math.PI / 2;

  // 顶部小黄铜顶珠与内部钨丝暖灯泡
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 10), brassMat), 0, 0.388, 0);
  add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 18, 14),
      new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        emissive: 0xffb85c,
        emissiveIntensity: 1.15,
        roughness: 0.25,
      }),
    ),
    0,
    0.275,
    0,
  );
  return castAll(g);
}

/** 2. 星夜猫头鹰摆件 */
function owl() {
  const g = new THREE.Group();
  const brown = velvet(0x7c4f2d, 0xf2cfa4);
  const darkBrown = velvet(0x52311a, 0xd4a87a);
  const cream = velvet(0xefe0c4, 0xfff8ea);
  const eyeAmber = glossy(0xffc645, 0xff9e18, 0.55);
  const pupil = glossy(0x140d0a);
  const beakMat = brass(0xd6963e, 0.36);

  // 迷你树桩木底座
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.118, 0.042, 22), walnut(0x4f301a)), 0, 0.021, 0);

  // 丰润身体与奶白胸腹
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.118, 24, 18), brown), 0, 0.175, 0).scale.set(0.95, 1.18, 0.88);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.082, 20, 16), cream), 0, 0.165, 0.062).scale.set(0.95, 1.12, 0.45);

  // 左右收拢翅膀
  for (const s of [-1, 1]) {
    const wing = add(g, new THREE.Mesh(new THREE.SphereGeometry(0.072, 18, 14), darkBrown), s * 0.098, 0.17, -0.008);
    wing.scale.set(0.45, 1.32, 0.82);
    wing.rotation.z = s * 0.16;
  }

  // 头部、羽簇耳、金琥珀大眼与小弯喙
  const head = add(g, new THREE.Group(), 0, 0.325, 0.01);
  add(head, new THREE.Mesh(new THREE.SphereGeometry(0.094, 24, 18), brown), 0, 0, 0).scale.set(1.06, 0.92, 0.94);

  for (const s of [-1, 1]) {
    // 眉羽簇耳
    const tuft = add(head, new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.074, 5), darkBrown), s * 0.068, 0.072, 0.006);
    tuft.rotation.z = -s * 0.38;
    // 眼盘
    add(head, new THREE.Mesh(new THREE.SphereGeometry(0.038, 18, 14), cream), s * 0.038, 0.01, 0.068).scale.set(1, 1, 0.42);
    // 发光金眼 + 瞳孔 + 高光
    add(head, new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), eyeAmber), s * 0.038, 0.01, 0.082).scale.set(1, 1, 0.6);
    add(head, new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 10), pupil), s * 0.038, 0.01, 0.092);
    add(head, new THREE.Mesh(new THREE.SphereGeometry(0.004, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })), s * 0.044, 0.016, 0.098);
    // 小爪子
    add(g, new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), beakMat), s * 0.042, 0.048, 0.052).scale.set(1.2, 0.65, 1.35);
  }
  const beak = add(head, new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.042, 4), beakMat), 0, -0.022, 0.092);
  beak.rotation.x = Math.PI * 0.68;

  return castAll(g);
}

/** 3. 黄铜浑天仪星月座 */
function moon() {
  const g = new THREE.Group();
  const brassMat = brass();
  const woodMat = walnut(0x472a17);

  // 阶梯底座 + 细立柱
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.105, 0.03, 24), woodMat), 0, 0.015, 0);
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.022, 0.09, 16), brassMat), 0, 0.07, 0);

  // 浑天仪星环组
  const armillary = add(g, new THREE.Group(), 0, 0.235, 0);
  const ring1 = add(armillary, new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.007, 12, 42), brassMat));
  ring1.rotation.set(0.35, 0.2, 0.25);
  const ring2 = add(armillary, new THREE.Mesh(new THREE.TorusGeometry(0.126, 0.0055, 10, 42), brass(0xc79e4f, 0.34)));
  ring2.rotation.set(-0.55, 0.6, -0.35);
  // 环上小金星珠
  add(armillary, new THREE.Mesh(new THREE.OctahedronGeometry(0.016, 0), brassMat), 0.138, 0.048, 0.02);
  add(armillary, new THREE.Mesh(new THREE.OctahedronGeometry(0.012, 0), brassMat), -0.12, -0.055, 0.04);

  // 中心温润发光月球
  const moonMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff2cc,
    emissive: 0xffd98a,
    emissiveIntensity: 0.45,
    roughness: 0.52,
    metalness: 0.04,
    clearcoat: 0.2,
  });
  add(armillary, new THREE.Mesh(new THREE.SphereGeometry(0.092, 28, 22), moonMat));

  return castAll(g);
}

/** 4. 复古锡皮星际火箭 */
function rocket() {
  const g = new THREE.Group();
  const bodyMat = glossy(0xf4eee2);
  const redMat = glossy(0xc8373b);
  const brassMat = brass();
  const glassMat = glossy(0x74b8f0, 0x3b82c4, 0.25);

  // 车削流线机身
  const pts = [
    new THREE.Vector2(0.042, 0.06),
    new THREE.Vector2(0.068, 0.12),
    new THREE.Vector2(0.082, 0.22),
    new THREE.Vector2(0.072, 0.32),
    new THREE.Vector2(0.044, 0.4),
    new THREE.Vector2(0.001, 0.46),
  ];
  add(g, new THREE.Mesh(new THREE.LatheGeometry(pts, 28), bodyMat));

  // 绯红整流罩鼻锥 + 黄铜环箍
  add(g, new THREE.Mesh(new THREE.ConeGeometry(0.046, 0.105, 24), redMat), 0, 0.415, 0);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(0.046, 0.0055, 10, 24), brassMat), 0, 0.365, 0).rotation.x = Math.PI / 2;
  add(g, new THREE.Mesh(new THREE.TorusGeometry(0.074, 0.005, 10, 24), brassMat), 0, 0.145, 0).rotation.x = Math.PI / 2;

  // 黄铜舷窗 + 蓝晶玻璃
  const port = add(g, new THREE.Group(), 0, 0.255, 0.074);
  add(port, new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.0065, 10, 24), brassMat));
  add(port, new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 12), glassMat), 0, 0, -0.004).scale.set(1, 1, 0.45);

  // 底部金属喷口
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.048, 0.055, 20), brass(0x5a5048, 0.42)), 0, 0.036, 0);

  // 三片流线尾翼（120° 均布）
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0.15);
  finShape.quadraticCurveTo(0.075, 0.11, 0.072, 0.0);
  finShape.lineTo(0.032, 0.015);
  finShape.lineTo(0, 0.055);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2 });
  for (let i = 0; i < 3; i += 1) {
    const pivot = new THREE.Group();
    pivot.rotation.y = (i * Math.PI * 2) / 3 + Math.PI / 6;
    const fin = add(pivot, new THREE.Mesh(finGeo, redMat), 0.052, 0.01, -0.006);
    fin.castShadow = true;
    g.add(pivot);
  }

  return castAll(g);
}

/** 5. 午夜黑猫坐像（与跳下书架的活体黑猫同款血统） */
function cat() {
  const g = new THREE.Group();
  const fur = velvet(0x181926, 0x6779b5, 0.85);
  const earIn = velvet(0x4b2f3d, 0x7c5064);
  const noseMat = glossy(0xd98b98);
  const collarMat = velvet(0x8f2838, 0xd6687a, 0.6);
  const bellMat = brass(0xf4cf72, 0.22);
  const eyeMat = glossy(0xffc440, 0xff9e18, 0.65);
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09080d });

  // 优雅坐姿躯干
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.092, 22, 16), fur), 0, 0.095, -0.01).scale.set(0.92, 1.15, 0.96);
  // 前爪并拢
  for (const s of [-1, 1]) {
    add(g, new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.07, 6, 12), fur), s * 0.034, 0.062, 0.058);
    add(g, new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), fur), s * 0.034, 0.018, 0.072).scale.set(0.95, 0.68, 1.25);
  }

  // 红棕项圈 + 金铃铛
  add(g, new THREE.Mesh(new THREE.TorusGeometry(0.056, 0.009, 10, 24), collarMat), 0, 0.178, 0.015).rotation.x = Math.PI / 2 - 0.12;
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 10), bellMat), 0, 0.165, 0.072);

  // 头部、尖耳、金琥珀大眼
  const head = add(g, new THREE.Group(), 0, 0.242, 0.018);
  add(head, new THREE.Mesh(new THREE.SphereGeometry(0.076, 22, 18), fur)).scale.set(1.06, 0.94, 0.96);
  add(head, new THREE.Mesh(new THREE.SphereGeometry(0.01, 10, 8), noseMat), 0, -0.012, 0.074).scale.set(1.2, 0.8, 0.7);
  for (const s of [-1, 1]) {
    const ear = add(head, new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.068, 4), fur), s * 0.048, 0.065, 0.005);
    ear.rotation.set(0.08, Math.PI / 4, -s * 0.24);
    ear.scale.set(1, 1, 0.55);
    const inner = add(head, new THREE.Mesh(new THREE.ConeGeometry(0.017, 0.044, 4), earIn), s * 0.048, 0.061, 0.015);
    inner.rotation.set(0.08, Math.PI / 4, -s * 0.24);
    inner.scale.set(1, 1, 0.35);

    const eye = add(head, new THREE.Group(), s * 0.031, 0.008, 0.062);
    eye.rotation.y = s * 0.24;
    add(eye, new THREE.Mesh(new THREE.SphereGeometry(0.017, 14, 12), eyeMat)).scale.set(1, 1.06, 0.55);
    add(eye, new THREE.Mesh(new THREE.CapsuleGeometry(0.0038, 0.013, 4, 8), pupilMat), 0, 0, 0.008);
    add(eye, new THREE.Mesh(new THREE.SphereGeometry(0.0036, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })), s * 0.004, 0.005, 0.011);
  }

  // 优雅绕身弯曲长尾
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.05, -0.085),
    new THREE.Vector3(0.095, 0.042, -0.04),
    new THREE.Vector3(0.115, 0.032, 0.055),
    new THREE.Vector3(0.072, 0.048, 0.102),
  ]);
  add(g, new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 20, 0.015, 10, false), fur));

  return castAll(g);
}

/** 6. 《小王子》玻璃钟罩永生玫瑰 */
function rose() {
  const g = new THREE.Group();
  const woodMat = walnut(0x4a2c18);
  const brassMat = brass();
  const stemMat = velvet(0x2d613b, 0x6ca876);
  const petalOuter = velvet(0xb81a3f, 0xff8ea6, 0.68);
  const petalInner = velvet(0xe63b63, 0xffc6d4, 0.62);

  // 圆润木底座 + 黄铜饰圈
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.125, 0.036, 28), woodMat), 0, 0.018, 0);
  add(g, new THREE.Mesh(new THREE.TorusGeometry(0.108, 0.005, 10, 32), brassMat), 0, 0.036, 0).rotation.x = Math.PI / 2;

  // 微弯墨绿花茎 + 两片立体绿叶
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.036, 0),
    new THREE.Vector3(-0.01, 0.13, 0.004),
    new THREE.Vector3(0.006, 0.22, -0.004),
    new THREE.Vector3(0, 0.275, 0),
  ]);
  add(g, new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 16, 0.008, 8, false), stemMat));

  const leafGeo = new THREE.SphereGeometry(0.034, 12, 10);
  const leaf1 = add(g, new THREE.Mesh(leafGeo, stemMat), 0.034, 0.145, 0.012);
  leaf1.scale.set(1.45, 0.35, 0.65);
  leaf1.rotation.set(0.2, 0.3, -0.45);
  const leaf2 = add(g, new THREE.Mesh(leafGeo, stemMat), -0.032, 0.185, -0.01);
  leaf2.scale.set(1.25, 0.35, 0.6);
  leaf2.rotation.set(-0.15, -0.25, 0.5);

  // 多层真实立体玫瑰花冠
  const bloom = add(g, new THREE.Group(), 0, 0.285, 0);
  add(bloom, new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 12), petalInner), 0, 0.008, 0);
  const petalGeo = new THREE.SphereGeometry(0.026, 12, 10);
  for (let ring = 0; ring < 2; ring += 1) {
    const count = ring === 0 ? 5 : 7;
    const radius = ring === 0 ? 0.018 : 0.032;
    const tilt = ring === 0 ? 0.38 : 0.72;
    const mat = ring === 0 ? petalInner : petalOuter;
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2 + ring * 0.4;
      const p = add(bloom, new THREE.Mesh(petalGeo, mat), Math.cos(a) * radius, 0.004 - ring * 0.006, Math.sin(a) * radius);
      p.scale.set(0.9, 1.15, 0.32);
      p.rotation.y = -a + Math.PI / 2;
      p.rotation.x = tilt;
    }
  }

  // 半透明玻璃钟罩 + 顶部黄铜提珠
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4f8ff,
    roughness: 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    depthWrite: false,
    envMapIntensity: 1.4,
  });
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.098, 0.27, 28, 1, true), glassMat), 0, 0.17, 0);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.098, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat), 0, 0.305, 0);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.014, 14, 10), brassMat), 0, 0.412, 0);

  return castAll(g);
}

const builders = { lamp, owl, moon, rocket, cat, rose };

export function buildOriginalOrnament(kind) {
  return (builders[kind] || rose)();
}
