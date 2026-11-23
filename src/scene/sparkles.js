import * as THREE from "three";

const MAX = 480;

const vertexShader = /* glsl */ `
  attribute vec2 aVel;
  attribute float aBirth;
  attribute float aLife;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uDpr;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float age = uTime - aBirth;
    vSeed = aSeed;
    if (age < 0.0 || age > aLife) {
      gl_PointSize = 0.0;
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      vAlpha = 0.0;
      return;
    }
    float t = age / aLife;
    vec2 p = position.xy + aVel * age + vec2(sin(uTime * 3.2 + aSeed * 20.0) * 7.0 * t, -28.0 * age * age);
    float twinkle = 0.72 + 0.28 * sin(uTime * (10.0 + aSeed * 8.0) + aSeed * 40.0);
    float pop = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(0.48, 1.0, t));
    vAlpha = pop * twinkle;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
    gl_PointSize = aSize * uDpr * (0.55 + 0.75 * pop);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float ang = vSeed * 6.2832 + uTime * (0.55 + vSeed * 1.1);
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
    float glow = exp(-r * r * 28.0);
    float core = exp(-r * r * 165.0);
    float star = pow(max(0.0, 1.0 - (abs(q.x) + abs(q.y)) * 2.45), 3.0);
    float rays = pow(max(0.0, 1.0 - abs(abs(q.x) - abs(q.y)) * 7.2), 8.0) * (1.0 - smoothstep(0.08, 0.5, r));
    float a = glow * 0.65 + core * 1.45 + star * 1.15 + rays * 0.65;
    vec3 gold = vec3(1.0, 0.85, 0.48);
    vec3 cream = vec3(1.0, 0.95, 0.82);
    vec3 sky = vec3(0.68, 0.86, 1.0);
    vec3 rose = vec3(1.0, 0.52, 0.68);
    float sNorm = fract(vSeed);
    vec3 tint = vSeed > 1.0
      ? mix(rose, gold, sNorm * 0.45)
      : (sNorm < 0.22 ? sky : (sNorm < 0.5 ? cream : gold));
    vec3 col = mix(vSeed > 1.0 ? rose : gold, tint, 0.65);
    col = mix(col, vec3(1.0), core * 0.85);
    float alpha = a * vAlpha * 0.88;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

export class Sparkles {
  constructor(renderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, -10, 10);
    this.time = 0;
    this.next = 0;
    this.height = 1;
    this.needsUpload = false;

    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(MAX * 3);
    this.vel = new Float32Array(MAX * 2);
    this.birth = new Float32Array(MAX).fill(-100);
    this.life = new Float32Array(MAX).fill(1);
    this.size = new Float32Array(MAX);
    this.seed = new Float32Array(MAX);

    g.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute("aVel", new THREE.BufferAttribute(this.vel, 2));
    g.setAttribute("aBirth", new THREE.BufferAttribute(this.birth, 1));
    g.setAttribute("aLife", new THREE.BufferAttribute(this.life, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(this.size, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(this.seed, 1));

    this.geometry = g;
    this.material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uDpr: { value: 1 } },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
  }

  resize(w, h, dpr) {
    this.height = h;
    this.camera.right = w;
    this.camera.top = h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms.uDpr.value = dpr;
  }

  emit(clientX, clientY, vx, vy, size, life, rose = false) {
    const i = this.next;
    this.next = (this.next + 1) % MAX;
    this.pos[i * 3] = clientX;
    this.pos[i * 3 + 1] = this.height - clientY;
    this.pos[i * 3 + 2] = 0;
    this.vel[i * 2] = vx;
    this.vel[i * 2 + 1] = vy;
    this.birth[i] = this.time;
    this.life[i] = life;
    this.size[i] = size;
    this.seed[i] = rose ? 1.05 + Math.random() * 0.9 : Math.random();
    this.needsUpload = true;
  }

  trail(clientX, clientY) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 10 + Math.random() * 24;
    this.emit(
      clientX + (Math.random() - 0.5) * 8,
      clientY + (Math.random() - 0.5) * 8,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed + 10,
      9 + Math.random() * 10,
      0.55 + Math.random() * 0.4,
    );
  }

  burst(clientX, clientY, count = 16, power = 1) {
    for (let k = 0; k < count; k += 1) {
      const angle = (k / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const speed = (38 + Math.random() * 92) * power;
      this.emit(
        clientX + (Math.random() - 0.5) * 6,
        clientY + (Math.random() - 0.5) * 6,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed + 22 * power,
        11 + Math.random() * 14,
        0.65 + Math.random() * 0.55,
      );
    }
  }

  render(t) {
    this.time = t;
    this.material.uniforms.uTime.value = t;
    if (this.needsUpload) {
      for (const name of ["position", "aVel", "aBirth", "aLife", "aSize", "aSeed"]) {
        this.geometry.attributes[name].needsUpdate = true;
      }
      this.needsUpload = false;
    }
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
