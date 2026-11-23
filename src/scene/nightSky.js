import * as THREE from "three";

const STAR_COUNT = 360;

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aTint;
  uniform float uTime;
  uniform float uDpr;
  uniform float uBright;
  varying float vAlpha;
  varying float vTint;
  varying float vMajor;
  void main() {
    vTint = aTint;
    vMajor = step(10.5, aSize);
    // 极微弱星穹漂移，营造流动深空感
    vec3 p = position;
    p.x += sin(uTime * 0.045 + aPhase) * 0.035;
    p.y += cos(uTime * 0.038 + aPhase * 1.3) * 0.02;
    float wave = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);
    float twinkle = mix(0.32, 1.0, pow(wave, 1.45));
    vAlpha = twinkle * uBright;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uDpr * (0.86 + 0.22 * wave);
  }
`;

const STAR_FRAG = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  varying float vTint;
  varying float vMajor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv) * 2.0;
    if (r > 1.0) discard;
    float core = exp(-r * r * 14.0);
    float halo = exp(-r * r * 4.2) * 0.38;
    // 仅亮星带极细腻的四向星芒
    float rays = (exp(-abs(uv.x) * 26.0) * exp(-abs(uv.y) * 5.0)
                + exp(-abs(uv.y) * 26.0) * exp(-abs(uv.x) * 5.0)) * 0.42 * (1.0 - r) * vMajor;
    vec3 warm = vec3(1.0, 0.90, 0.72);
    vec3 cool = vec3(0.76, 0.88, 1.0);
    vec3 pure = vec3(0.96, 0.97, 1.0);
    vec3 col = vTint < 0.28 ? warm : (vTint < 0.62 ? cool : pure);
    float a = clamp(core + halo + rays, 0.0, 1.0) * vAlpha * smoothstep(1.0, 0.65, r);
    gl_FragColor = vec4(col * a, a);
  }
`;

function makeCanvasTex(draw, w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function backdropTexture() {
  return makeCanvasTex((g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#040713");
    grad.addColorStop(0.38, "#0a142e");
    grad.addColorStop(0.74, "#13294d");
    grad.addColorStop(1, "#1e173d");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);

    // 极细腻静态远景微星底尘
    let seed = 23;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 420; i += 1) {
      const x = rand() * w;
      const y = rand() * h * 0.92;
      const r = rand() > 0.94 ? 1.1 : 0.55;
      g.fillStyle = `rgba(224, 236, 255, ${0.14 + rand() * 0.28})`;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
  }, 1024, 576);
}

function nebulaTexture() {
  return makeCanvasTex((g, w, h) => {
    g.clearRect(0, 0, w, h);
    const clouds = [
      [w * 0.26, h * 0.34, w * 0.34, "rgba(118, 152, 235, 0.22)"],
      [w * 0.52, h * 0.42, w * 0.38, "rgba(164, 146, 230, 0.16)"],
      [w * 0.74, h * 0.3, w * 0.3, "rgba(130, 178, 240, 0.18)"],
      [w * 0.42, h * 0.56, w * 0.32, "rgba(210, 185, 245, 0.12)"],
    ];
    for (const [cx, cy, r, col] of clouds) {
      const rg = g.createRadialGradient(cx, cy, r * 0.05, cx, cy, r);
      rg.addColorStop(0, col);
      rg.addColorStop(1, "rgba(16, 24, 56, 0)");
      g.fillStyle = rg;
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.fill();
    }
  }, 512, 256);
}

function moonTexture() {
  return makeCanvasTex((g, w, h) => {
    g.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const r = w * 0.44;

    const disc = g.createRadialGradient(cx - r * 0.28, cy - r * 0.28, r * 0.1, cx, cy, r);
    disc.addColorStop(0, "#fffdf5");
    disc.addColorStop(0.58, "#f3e7cb");
    disc.addColorStop(0.88, "#dcc8a0");
    disc.addColorStop(1, "rgba(210, 190, 150, 0)");
    g.fillStyle = disc;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fill();

    // 柔和月海纹理（剪裁在月盘内）
    g.save();
    g.beginPath();
    g.arc(cx, cy, r * 0.96, 0, Math.PI * 2);
    g.clip();
    const maria = [
      [-0.22, -0.14, 0.24, 0.16],
      [0.16, -0.2, 0.2, 0.14],
      [0.12, 0.16, 0.26, 0.15],
      [-0.14, 0.24, 0.18, 0.12],
      [0.3, 0.02, 0.14, 0.11],
    ];
    for (const [ox, oy, mr, alpha] of maria) {
      const m = g.createRadialGradient(cx + ox * r, cy + oy * r, 2, cx + ox * r, cy + oy * r, mr * r);
      m.addColorStop(0, `rgba(148, 134, 110, ${alpha})`);
      m.addColorStop(1, "rgba(148, 134, 110, 0)");
      g.fillStyle = m;
      g.beginPath();
      g.arc(cx + ox * r, cy + oy * r, mr * r, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }, 256, 256);
}

function moonHaloTexture() {
  return makeCanvasTex((g, w, h) => {
    g.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const rg = g.createRadialGradient(cx, cy, w * 0.04, cx, cy, w * 0.5);
    rg.addColorStop(0, "rgba(255, 246, 224, 0.62)");
    rg.addColorStop(0.28, "rgba(222, 234, 255, 0.24)");
    rg.addColorStop(0.62, "rgba(154, 186, 245, 0.08)");
    rg.addColorStop(1, "rgba(154, 186, 245, 0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, w, h);
  }, 256, 256);
}

export class NightSky {
  constructor(scene) {
    this.group = new THREE.Group();

    // 1. 深空渐变底幕
    const bgTex = backdropTexture();
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTex, depthWrite: false, fog: false });
    this.backdrop = new THREE.Mesh(new THREE.PlaneGeometry(42, 24), bgMat);
    this.backdrop.position.set(0, 1.7, -2.45);
    this.group.add(this.backdrop);

    // 2. 极淡流动星云薄纱
    const nebTex = nebulaTexture();
    this.nebulaMat = new THREE.MeshBasicMaterial({
      map: nebTex,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    this.nebula = new THREE.Mesh(new THREE.PlaneGeometry(14, 7.5), this.nebulaMat);
    this.nebula.position.set(-0.2, 2.05, -2.38);
    this.nebula.rotation.z = -0.22;
    this.group.add(this.nebula);

    // 3. 右上角柔和满月 + 呼吸月晕
    const haloTex = moonHaloTexture();
    this.haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    this.moonHalo = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 2.35), this.haloMat);
    this.moonHalo.position.set(2.82, 2.56, -2.33);
    this.group.add(this.moonHalo);

    const moonTex = moonTexture();
    this.moonMat = new THREE.MeshBasicMaterial({
      map: moonTex,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      fog: false,
    });
    this.moon = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.54), this.moonMat);
    this.moon.position.set(2.82, 2.56, -2.31);
    this.group.add(this.moon);

    // 4. 3 层景深、独立相位异步闪烁星海
    const pos = new Float32Array(STAR_COUNT * 3);
    const size = new Float32Array(STAR_COUNT);
    const phase = new Float32Array(STAR_COUNT);
    const speed = new Float32Array(STAR_COUNT);
    const tint = new Float32Array(STAR_COUNT);

    let seed = 97;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < STAR_COUNT; i += 1) {
      const layer = i % 3; // 0: 远层微星, 1: 中层繁星, 2: 近层亮星
      pos[i * 3] = (rand() - 0.5) * 12.6;
      pos[i * 3 + 1] = -0.3 + rand() * 4.5;
      pos[i * 3 + 2] = -2.28 + layer * 0.24 + (rand() - 0.5) * 0.08;
      const major = layer === 2 && rand() > 0.72;
      size[i] = major ? 11.5 + rand() * 6.5 : (layer === 1 ? 5.2 + rand() * 4.2 : 3.2 + rand() * 2.8);
      phase[i] = rand() * Math.PI * 2;
      speed[i] = 0.75 + rand() * 1.9;
      tint[i] = rand();
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    starGeo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    starGeo.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    starGeo.setAttribute("aTint", new THREE.BufferAttribute(tint, 1));

    this.starMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDpr: { value: 1 },
        uBright: { value: 0.72 },
      },
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.stars = new THREE.Points(starGeo, this.starMat);
    this.stars.frustumCulled = false;
    this.group.add(this.stars);

    this.starGeo = starGeo;
    this.textures = [bgTex, nebTex, haloTex, moonTex];
    scene.add(this.group);
  }

  setDpr(dpr) {
    this.starMat.uniforms.uDpr.value = dpr;
  }

  update(t, lampLevel) {
    this.starMat.uniforms.uTime.value = t;
    // 关灯进入“月色模式”时，星空与月晕自然更清亮通透
    const moonBoost = 1 - lampLevel;
    this.starMat.uniforms.uBright.value = 0.68 + moonBoost * 0.3;

    const breath = 0.5 + 0.5 * Math.sin(t * 0.95);
    const haloScale = 0.96 + breath * 0.1 + moonBoost * 0.12;
    this.moonHalo.scale.setScalar(haloScale);
    this.haloMat.opacity = 0.36 + breath * 0.12 + moonBoost * 0.22;
    this.moonMat.opacity = 0.86 + moonBoost * 0.12;

    this.nebula.position.x = -0.2 + Math.sin(t * 0.12) * 0.35;
    this.nebula.position.y = 2.05 + Math.cos(t * 0.1) * 0.12;
    this.nebulaMat.opacity = 0.34 + breath * 0.08 + moonBoost * 0.14;
  }

  dispose() {
    this.backdrop.geometry.dispose();
    this.backdrop.material.dispose();
    this.nebula.geometry.dispose();
    this.nebulaMat.dispose();
    this.moonHalo.geometry.dispose();
    this.haloMat.dispose();
    this.moon.geometry.dispose();
    this.moonMat.dispose();
    this.starGeo.dispose();
    this.starMat.dispose();
    for (const tex of this.textures) tex.dispose();
  }
}
