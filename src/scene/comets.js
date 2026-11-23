import * as THREE from "three";

const COUNT = 8;
const DUST = 28;
const LIFE = 1.45;

const STREAK_VERT = /* glsl */ `
  attribute float aBirth;
  attribute vec2 aStart;
  attribute vec2 aDir;
  attribute float aLen;
  attribute float aSpeed;
  attribute float aSeed;
  uniform float uTime;
  varying float vAlong;
  varying float vAcross;
  varying float vAge;
  varying float vSeed;
  void main() {
    float age = (uTime - aBirth) / ${LIFE.toFixed(2)};
    vAge = age;
    vSeed = aSeed;
    vAlong = (position.x + 0.5) * 1.18;
    vAcross = position.y;
    vec2 dir = normalize(aDir);
    vec2 across = vec2(-dir.y, dir.x);
    vec2 head = aStart + dir * aSpeed * clamp(age, 0.0, 1.0);
    vec2 p = head - dir * (1.0 - vAlong) * aLen + across * vAcross * aLen * 0.26;
    if (age < 0.0 || age > 1.0) p = vec2(-999.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, -1.72, 1.0);
  }
`;

const STREAK_FRAG = /* glsl */ `
  precision highp float;
  varying float vAlong;
  varying float vAcross;
  varying float vAge;
  varying float vSeed;
  void main() {
    if (vAge < 0.0 || vAge > 1.0) discard;
    float along = clamp(vAlong, 0.0, 1.0);
    float width = mix(0.045, 0.24, pow(along, 1.6));
    float body = exp(-(vAcross * vAcross) / (width * width * 0.5)) * pow(along, 2.3) * (1.0 - smoothstep(0.98, 1.06, vAlong));
    float d = length(vec2((vAlong - 1.0) * 1.6, vAcross * 1.9));
    float core = exp(-d * d * 120.0);
    float halo = exp(-d * d * 13.0) * 0.78;
    float glint = pow(max(0.0, sin(along * 56.0 + vSeed * 20.0 + vAge * 12.0)), 12.0) * pow(along, 3.0) * exp(-(vAcross * vAcross) * 210.0) * 0.55;
    float win = smoothstep(0.5, 0.3, abs(vAcross)) * smoothstep(0.0, 0.05, vAlong) * smoothstep(1.18, 1.08, vAlong);
    float fade = smoothstep(0.0, 0.08, vAge) * (1.0 - smoothstep(0.58, 1.0, vAge)) * win;
    vec3 tail = mix(vec3(1.0, 0.74, 0.34), vec3(1.0, 0.96, 0.84), along);
    vec3 col = tail * (body * 1.15 + glint) + vec3(1.0, 0.98, 0.93) * (core * 1.65 + halo);
    float a = clamp(body * 0.85 + core + halo * 0.8 + glint, 0.0, 1.0) * fade;
    gl_FragColor = vec4(col * fade, a);
  }
`;

const DUST_VERT = /* glsl */ `
  attribute float aBirth;
  attribute vec2 aStart;
  attribute vec2 aDir;
  attribute float aLen;
  attribute float aSpeed;
  attribute float aOffset;
  attribute vec2 aDrift;
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uDpr;
  varying float vLife;
  varying float vPhase;
  void main() {
    float age = (uTime - aBirth) / ${LIFE.toFixed(2)};
    vec2 dir = normalize(aDir);
    vec2 across = vec2(-dir.y, dir.x);
    vec2 head = aStart + dir * aSpeed * clamp(age, 0.0, 1.0);
    float shed = clamp(age - aOffset * 0.35, 0.0, 1.0);
    vec2 p = head - dir * aOffset * aLen + across * aDrift.x * aLen * 0.24 + aDrift * shed * 0.32 + vec2(0.0, -0.22) * shed * shed;
    vLife = (age < 0.0 || age > 1.0) ? -1.0 : age;
    vPhase = aPhase;
    if (vLife < 0.0) p = vec2(-999.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, -1.7, 1.0);
    float twinkle = 0.7 + 0.45 * sin(uTime * 10.0 + aPhase * 6.28);
    gl_PointSize = aSize * uDpr * (1.0 - 0.45 * age) * twinkle;
  }
`;

const DUST_FRAG = /* glsl */ `
  precision highp float;
  varying float vLife;
  varying float vPhase;
  void main() {
    if (vLife < 0.0) discard;
    vec2 q = gl_PointCoord - 0.5;
    float r = length(q) * 2.0;
    float mote = exp(-r * r * 6.0);
    float rays = (exp(-abs(q.x) * 18.0) * exp(-abs(q.y) * 3.0) + exp(-abs(q.y) * 18.0) * exp(-abs(q.x) * 3.0)) * 0.55 * (1.0 - r);
    float fade = smoothstep(0.0, 0.1, vLife) * (1.0 - smoothstep(0.45, 1.0, vLife));
    vec3 col = mix(vec3(1.0, 0.84, 0.48), vec3(1.0, 0.98, 0.9), fract(vPhase * 3.0));
    float a = clamp(mote + rays, 0.0, 1.0) * fade * smoothstep(1.0, 0.7, r);
    gl_FragColor = vec4(col * a, a);
  }
`;

export class CometSky {
  constructor(scene) {
    this.time = 0;
    this.cursor = 0;
    this.queue = [];
    this.nextWait = 3.8;

    const base = new THREE.PlaneGeometry(1, 1);
    const streakGeo = new THREE.InstancedBufferGeometry();
    streakGeo.index = base.index;
    streakGeo.attributes.position = base.attributes.position;
    streakGeo.instanceCount = COUNT;

    this.sBirth = new Float32Array(COUNT).fill(-100);
    this.sStart = new Float32Array(COUNT * 2);
    this.sDir = new Float32Array(COUNT * 2);
    this.sLen = new Float32Array(COUNT);
    this.sSpeed = new Float32Array(COUNT);
    this.sSeed = new Float32Array(COUNT);

    streakGeo.setAttribute("aBirth", new THREE.InstancedBufferAttribute(this.sBirth, 1));
    streakGeo.setAttribute("aStart", new THREE.InstancedBufferAttribute(this.sStart, 2));
    streakGeo.setAttribute("aDir", new THREE.InstancedBufferAttribute(this.sDir, 2));
    streakGeo.setAttribute("aLen", new THREE.InstancedBufferAttribute(this.sLen, 1));
    streakGeo.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(this.sSpeed, 1));
    streakGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(this.sSeed, 1));

    this.streakMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: STREAK_VERT,
      fragmentShader: STREAK_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.streaks = new THREE.Mesh(streakGeo, this.streakMat);
    this.streaks.frustumCulled = false;

    const totalDust = COUNT * DUST;
    const dustGeo = new THREE.BufferGeometry();
    this.dPos = new Float32Array(totalDust * 3);
    this.dBirth = new Float32Array(totalDust).fill(-100);
    this.dStart = new Float32Array(totalDust * 2);
    this.dDir = new Float32Array(totalDust * 2);
    this.dLen = new Float32Array(totalDust);
    this.dSpeed = new Float32Array(totalDust);
    this.dOffset = new Float32Array(totalDust);
    this.dDrift = new Float32Array(totalDust * 2);
    this.dPhase = new Float32Array(totalDust);
    this.dSize = new Float32Array(totalDust);

    for (let i = 0; i < totalDust; i += 1) {
      this.dOffset[i] = Math.random();
      this.dDrift[i * 2] = (Math.random() - 0.5) * 1.4;
      this.dDrift[i * 2 + 1] = (Math.random() - 0.5) * 0.9;
      this.dPhase[i] = Math.random();
      this.dSize[i] = 7 + Math.random() * 11;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(this.dPos, 3));
    dustGeo.setAttribute("aBirth", new THREE.BufferAttribute(this.dBirth, 1));
    dustGeo.setAttribute("aStart", new THREE.BufferAttribute(this.dStart, 2));
    dustGeo.setAttribute("aDir", new THREE.BufferAttribute(this.dDir, 2));
    dustGeo.setAttribute("aLen", new THREE.BufferAttribute(this.dLen, 1));
    dustGeo.setAttribute("aSpeed", new THREE.BufferAttribute(this.dSpeed, 1));
    dustGeo.setAttribute("aOffset", new THREE.BufferAttribute(this.dOffset, 1));
    dustGeo.setAttribute("aDrift", new THREE.BufferAttribute(this.dDrift, 2));
    dustGeo.setAttribute("aPhase", new THREE.BufferAttribute(this.dPhase, 1));
    dustGeo.setAttribute("aSize", new THREE.BufferAttribute(this.dSize, 1));

    this.dustMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uDpr: { value: 1 } },
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.dust = new THREE.Points(dustGeo, this.dustMat);
    this.dust.frustumCulled = false;

    this.streakGeo = streakGeo;
    this.dustGeo = dustGeo;
    scene.add(this.streaks, this.dust);
  }

  setDpr(dpr) {
    this.dustMat.uniforms.uDpr.value = dpr;
  }

  launch(bright = false) {
    const slot = this.cursor;
    this.cursor = (this.cursor + 1) % COUNT;
    const sx = -2.2 + Math.random() * 8.2;
    const sy = 2.9 + Math.random() * 1.35;
    const angle = -2.42 + (Math.random() - 0.5) * 0.22;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const len = bright ? 2.55 : 1.65 + Math.random() * 0.55;
    const speed = bright ? 5.2 : 3.7 + Math.random() * 1.1;

    this.sBirth[slot] = this.time;
    this.sStart[slot * 2] = sx;
    this.sStart[slot * 2 + 1] = sy;
    this.sDir[slot * 2] = dx;
    this.sDir[slot * 2 + 1] = dy;
    this.sLen[slot] = len;
    this.sSpeed[slot] = speed;
    this.sSeed[slot] = Math.random();

    for (let k = 0; k < DUST; k += 1) {
      const idx = slot * DUST + k;
      this.dBirth[idx] = this.time;
      this.dStart[idx * 2] = sx;
      this.dStart[idx * 2 + 1] = sy;
      this.dDir[idx * 2] = dx;
      this.dDir[idx * 2 + 1] = dy;
      this.dLen[idx] = len;
      this.dSpeed[idx] = speed;
    }

    for (const name of ["aBirth", "aStart", "aDir", "aLen", "aSpeed", "aSeed"]) {
      this.streakGeo.attributes[name].needsUpdate = true;
    }
    for (const name of ["aBirth", "aStart", "aDir", "aLen", "aSpeed"]) {
      this.dustGeo.attributes[name].needsUpdate = true;
    }
  }

  shower(count = 5) {
    for (let i = 0; i < count; i += 1) {
      this.queue.push({ at: this.time + i * 0.28 + Math.random() * 0.14, bright: i % 2 === 0 });
    }
  }

  update(t, dt) {
    this.time = t;
    this.streakMat.uniforms.uTime.value = t;
    this.dustMat.uniforms.uTime.value = t;

    this.nextWait -= dt;
    if (this.nextWait <= 0) {
      this.launch(Math.random() < 0.25);
      if (Math.random() < 0.24) {
        this.queue.push({ at: t + 0.35 + Math.random() * 0.25, bright: false });
      }
      this.nextWait = 6.5 + Math.random() * 7;
    }
    for (let i = this.queue.length - 1; i >= 0; i -= 1) {
      if (t >= this.queue[i].at) {
        this.launch(this.queue[i].bright);
        this.queue.splice(i, 1);
      }
    }
  }

  dispose() {
    this.streakGeo.dispose();
    this.streakMat.dispose();
    this.dustGeo.dispose();
    this.dustMat.dispose();
  }
}
