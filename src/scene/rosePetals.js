import * as THREE from "three";

const POOL = 36;
const COLORS = [0xc91e46, 0xdf345c, 0xf26486, 0xa81639, 0xee4f72];

function createPetalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.042);
  shape.bezierCurveTo(0.036, -0.028, 0.046, 0.018, 0.024, 0.044);
  shape.bezierCurveTo(0.01, 0.056, 0.004, 0.048, 0, 0.044);
  shape.bezierCurveTo(-0.004, 0.048, -0.01, 0.056, -0.024, 0.044);
  shape.bezierCurveTo(-0.046, 0.018, -0.036, -0.028, 0, -0.042);

  const geo = new THREE.ShapeGeometry(shape, 10);
  const pos = geo.attributes.position;
  // 给花瓣增加真实的杯状内凹与尖端微卷弧度
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const cup = (x * x) * 4.5;
    const tipCurl = y > 0.015 ? -Math.pow(y - 0.015, 2) * 5.2 : 0;
    pos.setZ(i, cup + tipCurl);
  }
  geo.computeVertexNormals();
  return geo;
}

export class RosePetals {
  constructor(scene) {
    this.group = new THREE.Group();
    this.geo = createPetalGeometry();
    this.petals = [];
    this.next = 0;

    for (let i = 0; i < POOL; i += 1) {
      const hex = COLORS[i % COLORS.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: hex,
        roughness: 0.62,
        metalness: 0,
        sheen: 0.9,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color(0xffccd9),
        emissive: new THREE.Color(hex),
        emissiveIntensity: 0.14,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(this.geo, mat);
      mesh.visible = false;
      this.group.add(mesh);
      this.petals.push({
        mesh,
        mat,
        active: false,
        age: 0,
        life: 3.4,
        vel: new THREE.Vector3(),
        spin: new THREE.Vector3(),
        swayFreq: 2,
        swayAmp: 0.25,
        phase: 0,
        baseScale: 1,
      });
    }
    scene.add(this.group);
  }

  spawnOne(origin, power = 1) {
    const p = this.petals[this.next];
    this.next = (this.next + 1) % POOL;

    const angle = Math.random() * Math.PI * 2;
    const horiz = (0.18 + Math.random() * 0.42) * power;
    p.active = true;
    p.age = 0;
    p.life = 2.8 + Math.random() * 1.6;
    p.mesh.position.set(
      origin.x + (Math.random() - 0.5) * 0.12,
      origin.y + (Math.random() - 0.5) * 0.1,
      origin.z + 0.06 + Math.random() * 0.12,
    );
    p.vel.set(
      Math.cos(angle) * horiz - 0.16 * power,
      (0.32 + Math.random() * 0.42) * power,
      (0.18 + Math.random() * 0.36) * power,
    );
    p.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    p.spin.set(
      (Math.random() - 0.5) * 2.8,
      (Math.random() - 0.5) * 3.4,
      (Math.random() - 0.5) * 2.4,
    );
    p.swayFreq = 1.8 + Math.random() * 1.6;
    p.swayAmp = 0.22 + Math.random() * 0.28;
    p.phase = Math.random() * Math.PI * 2;
    p.baseScale = 0.75 + Math.random() * 0.72;
    p.mesh.scale.setScalar(0.01);
    p.mat.opacity = 0;
    p.mesh.visible = true;
  }

  burst(origin, count = 18) {
    for (let i = 0; i < count; i += 1) {
      this.spawnOne(origin, 0.9 + Math.random() * 0.45);
    }
  }

  update(t, dt) {
    for (const p of this.petals) {
      if (!p.active) continue;
      p.age += dt;
      if (p.age >= p.life) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }
      const norm = p.age / p.life;
      // 柔和空气阻力 + 缓慢重力飘落
      p.vel.x *= Math.exp(-1.35 * dt);
      p.vel.z *= Math.exp(-1.35 * dt);
      p.vel.y = Math.max(-0.42, p.vel.y - 0.68 * dt);

      const flutterX = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp;
      const flutterZ = Math.cos(t * (p.swayFreq * 0.85) + p.phase) * p.swayAmp * 0.45;
      p.mesh.position.x += (p.vel.x + flutterX) * dt;
      p.mesh.position.y += p.vel.y * dt;
      p.mesh.position.z += (p.vel.z + flutterZ) * dt;

      p.mesh.rotation.x += (p.spin.x + Math.sin(t * p.swayFreq + p.phase) * 0.9) * dt;
      p.mesh.rotation.y += p.spin.y * dt;
      p.mesh.rotation.z += (p.spin.z + Math.cos(t * p.swayFreq + p.phase) * 1.1) * dt;

      const appear = Math.min(1, p.age / 0.16);
      const fade = norm > 0.7 ? Math.max(0, 1 - (norm - 0.7) / 0.3) : 1;
      p.mesh.scale.setScalar(p.baseScale * (0.35 + 0.65 * appear));
      p.mat.opacity = appear * fade * 0.95;
    }
  }

  dispose() {
    this.geo.dispose();
    for (const p of this.petals) p.mat.dispose();
  }
}
