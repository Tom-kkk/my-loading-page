import * as THREE from "three";

function felt(color) {
  const ink = new THREE.Color(color);
  return new THREE.MeshPhysicalMaterial({
    color: ink,
    roughness: 0.9,
    metalness: 0,
    sheen: 0.86,
    sheenRoughness: 0.48,
    sheenColor: ink.clone().lerp(new THREE.Color(0xfff7ea), 0.42),
    envMapIntensity: 0.6,
  });
}

function glossy(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.22,
    metalness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
    envMapIntensity: 0.9,
  });
}

function wood() {
  return new THREE.MeshStandardMaterial({ color: 0x8a5a32, roughness: 0.62, metalness: 0.04 });
}

function sphere(radius, material) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 20), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function add(group, mesh, x, y, z) {
  mesh.position.set(x, y, z);
  group.add(mesh);
  return mesh;
}

function lamp() {
  const group = new THREE.Group();
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.04, 20), wood()), 0, 0.02, 0);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.2, 12), glossy(0xd2a85c)), 0, 0.14, 0);
  const shadeMat = felt(0xffd7a1);
  shadeMat.side = THREE.DoubleSide;
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.11, 24, 1, true), shadeMat);
  shade.position.y = 0.28;
  shade.castShadow = true;
  group.add(shade);
  const bulb = sphere(0.03, new THREE.MeshStandardMaterial({
    color: 0xfff1c8,
    emissive: 0xffb15e,
    emissiveIntensity: 0.8,
    roughness: 0.4,
  }));
  bulb.position.y = 0.24;
  group.add(bulb);
  return group;
}

function owl() {
  const group = new THREE.Group();
  const body = sphere(0.13, felt(0x8a5a36));
  body.scale.set(1, 1.15, 0.9);
  body.position.y = 0.16;
  group.add(body);
  add(group, sphere(0.08, felt(0xe9cfa4)), 0, 0.14, 0.07).scale.set(1, 1.1, 0.45);
  const head = new THREE.Group();
  head.position.y = 0.32;
  group.add(head);
  head.add(sphere(0.1, felt(0x8a5a36)));
  add(head, sphere(0.035, felt(0x8a5a36)), -0.07, 0.08, 0);
  add(head, sphere(0.035, felt(0x8a5a36)), 0.07, 0.08, 0);
  add(head, sphere(0.028, glossy(0xf7f1dc)), -0.038, 0.02, 0.08);
  add(head, sphere(0.028, glossy(0xf7f1dc)), 0.038, 0.02, 0.08);
  add(head, sphere(0.012, glossy(0x24180f)), -0.038, 0.02, 0.1);
  add(head, sphere(0.012, glossy(0x24180f)), 0.038, 0.02, 0.1);
  add(head, sphere(0.018, glossy(0xc9843a)), 0, -0.02, 0.09);
  return group;
}

function moon() {
  const group = new THREE.Group();
  const ball = sphere(0.16, new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xffe2a0,
    emissiveIntensity: 0.35,
    roughness: 0.62,
  }));
  ball.position.y = 0.2;
  group.add(ball);
  return group;
}

function rocket() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.16, 6, 16), felt(0xf2f4f8));
  body.position.y = 0.2;
  body.castShadow = true;
  group.add(body);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 20), felt(0xe25b4a));
  nose.position.y = 0.36;
  nose.castShadow = true;
  group.add(nose);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.02), felt(0x3f6fb5));
  fin.position.y = 0.1;
  fin.castShadow = true;
  group.add(fin);
  return group;
}

function cat() {
  const group = new THREE.Group();
  const body = sphere(0.12, felt(0x3b3550));
  body.scale.set(1.15, 0.86, 0.9);
  body.position.y = 0.12;
  group.add(body);
  const head = new THREE.Group();
  head.position.y = 0.26;
  group.add(head);
  head.add(sphere(0.09, felt(0x3b3550)));
  add(head, sphere(0.035, felt(0x3b3550)), -0.06, 0.07, 0).scale.set(0.7, 1.1, 0.4);
  add(head, sphere(0.035, felt(0x3b3550)), 0.06, 0.07, 0).scale.set(0.7, 1.1, 0.4);
  add(head, sphere(0.018, glossy(0xf4e7b0)), -0.03, 0.015, 0.075);
  add(head, sphere(0.018, glossy(0xf4e7b0)), 0.03, 0.015, 0.075);
  add(head, sphere(0.012, felt(0xf0a0b0)), 0, -0.015, 0.08);
  return group;
}

function rose() {
  const group = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.28, 8), felt(0x3f7a4b));
  stem.position.y = 0.14;
  stem.castShadow = true;
  group.add(stem);
  add(group, sphere(0.07, felt(0xd24b5a)), 0, 0.32, 0);
  add(group, sphere(0.045, felt(0xff8ea0)), 0.03, 0.34, 0.03);
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), felt(0x2f5c3a));
  leaf.scale.set(1.4, 0.45, 0.7);
  leaf.position.set(0.05, 0.16, 0);
  leaf.rotation.z = -0.6;
  group.add(leaf);
  return group;
}

const builders = { lamp, owl, moon, rocket, cat, rose };

export function ornamentKind(file) {
  if (file.startsWith("lamp")) return "lamp";
  if (file.startsWith("owl")) return "owl";
  if (file.startsWith("moon")) return "moon";
  if (file.startsWith("rocket")) return "rocket";
  if (file.startsWith("cat")) return "cat";
  return "rose";
}

export function feltOrnament(kind) {
  return (builders[kind] || rose)();
}

export function dressSurface(object) {
  object.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    node.castShadow = true;
    node.receiveShadow = true;
    const list = Array.isArray(node.material) ? node.material : [node.material];
    list.forEach((material, index) => {
      if (!material || material.transparent || material.opacity < 1 || material.transmission > 0) return;
      if ((material.metalness || 0) >= 0.45) {
        material.envMapIntensity = 1;
        material.needsUpdate = true;
        return;
      }
      const next = new THREE.MeshPhysicalMaterial({
        map: material.map || null,
        normalMap: material.normalMap || null,
        roughnessMap: material.roughnessMap || null,
        color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
        roughness: Math.max(material.roughness ?? 0.7, 0.58),
        metalness: material.metalness || 0,
        emissive: material.emissive ? material.emissive.clone() : new THREE.Color(0x000000),
        emissiveMap: material.emissiveMap || null,
        emissiveIntensity: material.emissiveIntensity ?? 1,
        sheen: 0.48,
        sheenRoughness: 0.55,
        sheenColor: new THREE.Color(0xffe6c8),
        envMapIntensity: 0.7,
      });
      if (Array.isArray(node.material)) node.material[index] = next;
      else node.material = next;
    });
  });
}
