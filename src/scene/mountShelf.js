import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { themes } from "../data/content.js";

const ASSET = "/story-assets/public";
// 镜头要把上层摆件完整收进画面。

function canvasTex(draw, w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function starsOn(g, x, y, w, h, n) {
  for (let i = 0; i < n; i++) {
    const sx = x + ((i * 97 + 13) % w);
    const sy = y + ((i * 53 + 7) % h);
    const big = i % 7 === 0;
    g.fillStyle = big ? "#fff6d4" : "rgba(255,248,230,.92)";
    g.beginPath();
    g.arc(sx, sy, big ? 2.8 : 1.15, 0, Math.PI * 2);
    g.fill();
  }
}

function paintPlate(g, id, w, h) {
  if (id === "about") {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#10183a");
    sky.addColorStop(1, "#35508f");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    starsOn(g, 0, 0, w, h * 0.7, 70);
    g.fillStyle = "#fff3c4";
    g.beginPath();
    g.arc(w * 0.66, h * 0.32, Math.min(w, h) * 0.16, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#1a2748";
    g.beginPath();
    g.arc(w * 0.74, h * 0.28, Math.min(w, h) * 0.13, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#12182f";
    g.beginPath();
    g.moveTo(0, h);
    g.quadraticCurveTo(w * 0.4, h * 0.58, w, h * 0.72);
    g.lineTo(w, h);
    g.fill();
    g.fillStyle = "#ff5d6c";
    g.beginPath();
    g.ellipse(w * 0.28, h * 0.58, w * 0.055, h * 0.07, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(255,240,210,.8)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(w * 0.28, h * 0.65);
    g.quadraticCurveTo(w * 0.36, h * 0.75, w * 0.24, h * 0.86);
    g.stroke();
    return;
  }
  if (id === "projects") {
    const sky = g.createLinearGradient(0, 0, w, h);
    sky.addColorStop(0, "#2a1448");
    sky.addColorStop(0.5, "#6a2a55");
    sky.addColorStop(1, "#c45a3a");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    starsOn(g, 0, 0, w, h, 50);
    ["#ff8ea0", "#7eb6ff", "#7ee0c6"].forEach((color, i) => {
      g.fillStyle = color;
      g.beginPath();
      g.arc(w * (0.22 + i * 0.22), h * (0.62 - i * 0.06), 18 + i * 4, 0, Math.PI * 2);
      g.fill();
    });
    g.strokeStyle = "rgba(255, 230, 170, .95)";
    g.lineWidth = 8;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(w * 0.18, h * 0.42);
    g.quadraticCurveTo(w * 0.45, h * 0.3, w * 0.78, h * 0.18);
    g.stroke();
    g.fillStyle = "#fffaf0";
    g.beginPath();
    g.arc(w * 0.8, h * 0.17, 16, 0, Math.PI * 2);
    g.fill();
    return;
  }
  if (id === "craft") {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#0c2438");
    sky.addColorStop(1, "#148a86");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    starsOn(g, 0, 40, w, h * 0.4, 30);
    for (let i = 0; i < 4; i++) {
      const x = w * (0.18 + i * 0.21);
      g.strokeStyle = "rgba(255, 224, 160, .7)";
      g.beginPath();
      g.moveTo(x, h * 0.18);
      g.lineTo(x, h * 0.38);
      g.stroke();
      g.fillStyle = i % 2 ? "#ffe08a" : "#7ee0c6";
      g.beginPath();
      g.ellipse(x, h * 0.48, 28, 36, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "rgba(255,255,255,.35)";
      g.beginPath();
      g.ellipse(x - 8, h * 0.44, 8, 12, 0, 0, Math.PI * 2);
      g.fill();
    }
    return;
  }
  const desk = g.createLinearGradient(0, 0, 0, h);
  desk.addColorStop(0, "#24160e");
  desk.addColorStop(1, "#8a4e28");
  g.fillStyle = desk;
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#fff6e4";
  roundRect(g, w * 0.16, h * 0.2, w * 0.68, h * 0.5, 12);
  g.fill();
  g.strokeStyle = "#e0c48a";
  g.lineWidth = 4;
  g.stroke();
  g.fillStyle = "#e25b4a";
  g.beginPath();
  g.arc(w * 0.5, h * 0.46, Math.min(w, h) * 0.08, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fff6e4";
  g.font = "700 36px Georgia, serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("A", w * 0.5, h * 0.47);
}

function coverTexture(book) {
  return canvasTex((g, w, h) => {
    paintPlate(g, book.id, w, h);
    const shade = g.createLinearGradient(0, h * 0.62, 0, h);
    shade.addColorStop(0, "rgba(8,10,24,0)");
    shade.addColorStop(1, "rgba(8,10,24,.72)");
    g.fillStyle = shade;
    g.fillRect(0, h * 0.62, w, h * 0.38);
    g.strokeStyle = "rgba(255, 220, 150, .95)";
    g.lineWidth = 10;
    roundRect(g, 18, 18, w - 36, h - 36, 8);
    g.stroke();
    g.strokeStyle = "rgba(255,255,255,.35)";
    g.lineWidth = 2;
    roundRect(g, 32, 32, w - 64, h - 64, 6);
    g.stroke();
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#fff6df";
    let titleSize = 108;
    g.font = `700 ${titleSize}px 'Baloo 2', 'Microsoft YaHei', sans-serif`;
    while (titleSize > 52 && g.measureText(book.title).width > w * 0.78) {
      titleSize -= 6;
      g.font = `700 ${titleSize}px 'Baloo 2', 'Microsoft YaHei', sans-serif`;
    }
    g.fillText(book.title, w / 2, h * 0.8);
    g.fillStyle = "#ffd56a";
    let kickerSize = 28;
    g.font = `600 ${kickerSize}px Fredoka, 'Microsoft YaHei', sans-serif`;
    while (kickerSize > 16 && g.measureText(book.kicker).width > w * 0.8) {
      kickerSize -= 2;
      g.font = `600 ${kickerSize}px Fredoka, 'Microsoft YaHei', sans-serif`;
    }
    g.fillText(book.kicker, w / 2, h * 0.9);
  }, 768, 1040);
}

function spineTexture(book) {
  return canvasTex((g, w, h) => {
    g.fillStyle = themes[book.id].cloth;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(255, 224, 170, .45)";
    g.fillRect(10, 0, 8, h);
    const chars = [...book.title];
    const latin = /^[\u0000-\u007F]+$/.test(book.title);
    const step = latin ? 58 : 78;
    g.fillStyle = "#fff6df";
    g.font = `700 ${latin ? 40 : 54}px 'Microsoft YaHei', sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const top = h / 2 - ((chars.length - 1) * step) / 2;
    chars.forEach((ch, i) => g.fillText(ch, w / 2, top + i * step));
  }, 180, 1040);
}

function glide(data, target, dt) {
  data.hoverV += (target - data.hover) * 58 * dt;
  data.hoverV *= Math.exp(-15 * dt);
  data.hover += data.hoverV * dt;
}

function charmTexture(kind) {
  return canvasTex((g, w, h) => {
    g.clearRect(0, 0, w, h);
    if (kind === "moon") {
      g.fillStyle = "#fff1c4";
      g.beginPath();
      g.arc(w * 0.4, h * 0.5, w * 0.34, 0, Math.PI * 2);
      g.fill();
      g.globalCompositeOperation = "destination-out";
      g.beginPath();
      g.arc(w * 0.58, h * 0.4, w * 0.28, 0, Math.PI * 2);
      g.fill();
      return;
    }
    if (kind === "star") {
      g.fillStyle = "#ffd56a";
      g.shadowColor = "#ffd56a";
      g.shadowBlur = 16;
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? w * 0.44 : w * 0.18;
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const px = w / 2 + Math.cos(a) * r;
        const py = h / 2 + Math.sin(a) * r;
        if (i === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.closePath();
      g.fill();
      return;
    }
    const tail = g.createLinearGradient(w * 0.08, h * 0.72, w * 0.75, h * 0.32);
    tail.addColorStop(0, "rgba(255,214,140,0)");
    tail.addColorStop(1, "rgba(255,246,220,.98)");
    g.strokeStyle = tail;
    g.lineWidth = 22;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(w * 0.1, h * 0.74);
    g.quadraticCurveTo(w * 0.4, h * 0.52, w * 0.72, h * 0.34);
    g.stroke();
    g.fillStyle = "#fffaf0";
    g.beginPath();
    g.arc(w * 0.74, h * 0.32, 26, 0, Math.PI * 2);
    g.fill();
  }, 256, 256);
}

export async function mountShelf(canvas, { onOpen, books }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    stencil: false,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#070b16");
  scene.fog = new THREE.Fog("#10162e", 16, 32);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 40);

  const camTarget = new THREE.Vector3(0, 1.02, 0);
  let folioOpen = false;
  const home = { y: 1.12, z: 6.4 };
  const BOOK_W = 0.92;
  const BOOK_H = 1.28;
  const BOOK_D = 0.18;
  const gap = 1.08;

  function resize() {
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  const look = { y: 1.02 };
  function fitView() {
    const span = (books.length - 1) * gap + BOOK_W + 0.9;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const tanV = Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(tanV * Math.max(camera.aspect, 0.75));
    const distW = (span / 2) / Math.tan(hFov / 2);
    // 顶上的摆件要留在页眉下面，宽屏不能只按书的高度取景。
    const toyTop = 2.35;
    const distH = (toyTop - look.y) / (0.58 * tanV);
    home.z = Math.max(distW, distH, 4.4);
    home.y = look.y + 0.06;
    if (!folioOpen) camTarget.set(0, look.y, 0);
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("resize", fitView);

  scene.add(new THREE.AmbientLight("#9eb0e4", 0.32));
  const moonLight = new THREE.DirectionalLight("#d5e4ff", 0.7);
  moonLight.position.set(-3.4, 5.6, 2.2);
  scene.add(moonLight);
  const key = new THREE.DirectionalLight("#ffe0b4", 2.35);
  key.intensity = 1.55;
  key.position.set(2.2, 4.6, 4.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.4;
  key.shadow.camera.far = 16;
  key.shadow.camera.left = -4.5;
  key.shadow.camera.right = 4.5;
  key.shadow.camera.top = 3.4;
  key.shadow.camera.bottom = -1.4;
  key.shadow.bias = -0.00035;
  scene.add(key);

  const textureLoader = new THREE.TextureLoader();
  const modelLoader = new GLTFLoader();
  const loadMap = (url, options = {}) => new Promise((resolve) => {
    textureLoader.load(url, (tex) => {
      tex.colorSpace = options.color === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      if (options.repeat) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(options.repeat[0], options.repeat[1]);
      }
      resolve(tex);
    }, undefined, () => resolve(null));
  });
  const loadModel = (file) => modelLoader.loadAsync(`${ASSET}/models/toys/${file}`).then((gltf) => gltf.scene).catch(() => null);
  const toyLayout = [
    ["lamp.d0317b4ebce8705c.glb", -1.85, 0.56],
    ["owl.64076cdcda2a772a.glb", -0.95, 0.48],
    ["moon.8bfb8215fd3bb484.glb", -0.1, 0.44],
    ["rocket.3dcb42ac8ccfee2a.glb", 0.8, 0.52],
    ["cat.d16becc9eadb9302.glb", 1.55, 0.44],
    ["rose.1f7caba56f9befc9.glb", 2.2, 0.4],
  ];
  const toyLoads = toyLayout.map(([file]) => loadModel(file));
  const [woodMap, woodNormal, clothMap, edgeMap] = await Promise.all([
    loadMap(`${ASSET}/textures/wood-planks.66ff16da40318ed3.webp`, { repeat: [3.2, 1] }),
    loadMap(`${ASSET}/textures/wood-planks-normal.254001ca88b9a14b.webp`, { color: false, repeat: [3.2, 1] }),
    loadMap(`${ASSET}/textures/cloth-neutral.bd2714a238f7ee4b.jpg`, { repeat: [2, 2] }),
    loadMap(`${ASSET}/textures/page-edges.095c25b3de01500e.webp`, { repeat: [1, 6] }),
  ]);

  const wood = canvasTex((g, w, h) => {
    const wash = g.createLinearGradient(0, 0, 0, h);
    wash.addColorStop(0, "#f3d7aa");
    wash.addColorStop(1, "#c4894e");
    g.fillStyle = wash;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 110; i++) {
      g.strokeStyle = `rgba(92, 48, 16, ${0.05 + (i % 6) * 0.02})`;
      g.lineWidth = 1 + (i % 3);
      const y = (i * 29) % h;
      g.beginPath();
      g.moveTo(0, y);
      g.bezierCurveTo(w * 0.28, y + 22, w * 0.66, y - 16, w, y + 8);
      g.stroke();
    }
  }, 512, 512);
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(2.2, 1);
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodMap || wood,
    normalMap: woodNormal || null,
    normalScale: new THREE.Vector2(0.55, 0.55),
    color: woodMap ? 0xf0cfa0 : 0xf4d2a4,
    roughness: 0.52,
    metalness: 0.02,
  });
  const trimMat = new THREE.MeshStandardMaterial({ map: woodMap || wood, color: woodMap ? 0xb98a5a : 0xa86b38, roughness: 0.58 });

  const nightSky = canvasTex((g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#050814");
    sky.addColorStop(0.42, "#0c1733");
    sky.addColorStop(0.78, "#163056");
    sky.addColorStop(1, "#241848");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    g.save();
    g.translate(w * 0.08, h * 0.02);
    g.rotate(-0.42);
    for (let i = 0; i < 7; i += 1) {
      const band = g.createLinearGradient(0, 0, w * 1.4, h * 0.2);
      band.addColorStop(0, "rgba(190,205,255,0)");
      band.addColorStop(0.42, `rgba(225,230,255,${0.05 + i * 0.012})`);
      band.addColorStop(0.58, `rgba(255,248,255,${0.07 + i * 0.008})`);
      band.addColorStop(1, "rgba(150,160,220,0)");
      g.fillStyle = band;
      g.fillRect(-w * 0.1, h * (0.16 + i * 0.018), w * 1.5, h * (0.2 - i * 0.012));
    }
    g.restore();
    let seed = 11;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 700; i += 1) {
      const x = rand() * w;
      const y = rand() * h * 0.96;
      const mag = rand();
      const radius = mag > 0.992 ? 2.4 : mag > 0.96 ? 1.35 : 0.55;
      g.fillStyle = rand() > 0.86
        ? `rgba(255,228,196,${0.55 + rand() * 0.45})`
        : `rgba(232,240,255,${0.4 + rand() * 0.6})`;
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2);
      g.fill();
    }
    const mx = w * 0.8;
    const my = h * 0.2;
    const mr = Math.min(w, h) * 0.048;
    const halo = g.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 5.5);
    halo.addColorStop(0, "rgba(255,244,220,0.28)");
    halo.addColorStop(1, "rgba(255,244,220,0)");
    g.fillStyle = halo;
    g.beginPath();
    g.arc(mx, my, mr * 5.5, 0, Math.PI * 2);
    g.fill();
    const moon = g.createRadialGradient(mx - mr * 0.35, my - mr * 0.35, mr * 0.15, mx, my, mr);
    moon.addColorStop(0, "#fffaf0");
    moon.addColorStop(0.62, "#f3e6c8");
    moon.addColorStop(1, "#d9c7a2");
    g.fillStyle = moon;
    g.beginPath();
    g.arc(mx, my, mr, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(168,148,118,0.35)";
    for (let i = 0; i < 9; i += 1) {
      g.beginPath();
      g.arc(mx + (rand() - 0.5) * mr * 1.1, my + (rand() - 0.45) * mr, mr * (0.05 + rand() * 0.07), 0, Math.PI * 2);
      g.fill();
    }
  }, 1280, 720);
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(42, 24),
    new THREE.MeshBasicMaterial({ map: nightSky, depthWrite: false }),
  );
  sky.position.set(0, 1.7, -2.4);
  sky.material.fog = false;
  scene.add(sky);

  const starPositions = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 16;
    starPositions[i * 3 + 1] = 1.2 + Math.random() * 4.2;
    starPositions[i * 3 + 2] = -1.6 - Math.random() * 3.2;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starField = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xfff6d8, size: 0.02, transparent: true, opacity: 0.35, depthWrite: false }));
  starField.material.fog = false;
  scene.add(starField);

  const streakMap = canvasTex((g, w, h) => {
    g.clearRect(0, 0, w, h);
    const glow = g.createLinearGradient(0, h / 2, w, h / 2);
    glow.addColorStop(0, "rgba(255,244,214,0)");
    glow.addColorStop(0.55, "rgba(255,214,150,0.15)");
    glow.addColorStop(0.82, "rgba(255,236,210,0.55)");
    glow.addColorStop(0.96, "rgba(255,252,245,1)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    g.strokeStyle = glow;
    g.lineWidth = 22;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(6, h / 2);
    g.lineTo(w - 4, h / 2);
    g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.95)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(w * 0.72, h / 2);
    g.lineTo(w - 10, h / 2);
    g.stroke();
  }, 512, 64);
  const meteors = [];
  for (let i = 0; i < 8; i++) {
    const material = new THREE.MeshBasicMaterial({
      map: streakMap,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.12), material);
    mesh.visible = false;
    mesh.userData.dir = new THREE.Vector3();
    scene.add(mesh);
    meteors.push(mesh);
  }
  let showerWait = 5;
  let showerLeft = 0;
  const launchMeteor = (mesh, bright) => {
    mesh.position.set(-6 + Math.random() * 14, 3.05 + Math.random() * 1.1, -1.7);
    const angle = -2.4 + (Math.random() - 0.5) * 0.16;
    mesh.userData.dir.set(Math.cos(angle), Math.sin(angle), 0);
    mesh.rotation.z = angle;
    const length = bright ? 2.4 : 1.6 + Math.random() * 0.4;
    mesh.scale.set(length, bright ? 1.15 : 0.8, 1);
    mesh.userData.speed = bright ? 1.35 : 0.85 + Math.random() * 0.25;
    mesh.userData.age = 0;
    mesh.material.opacity = 0;
    mesh.visible = true;
  };

  const plank = (w, h, d, x, y, z, mat) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  };
  plank(5.4, 0.08, 0.5, 0, 0, 0, woodMat);
  plank(5.4, 0.04, 0.03, 0, 0.03, 0.24, trimMat);
  plank(5.4, 0.055, 0.42, 0, 1.58, -0.28, woodMat);
  plank(5.4, 0.028, 0.03, 0, 1.6, -0.08, trimMat);
  for (const x of [-1.85, 0, 1.85]) plank(0.07, 0.24, 0.07, x, -0.14, -0.18, trimMat);

  const stand = (object, height) => {
    object.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    if (size.y > 1e-6) object.scale.multiplyScalar(height / size.y);
    object.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(object);
    object.position.y -= box.min.y;
    return object;
  };
  const toys = [];
  const pickables = [];
  let alive = true;
  const addHitProxy = (object) => {
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    object.worldToLocal(center);
    const proxy = new THREE.Mesh(
      new THREE.BoxGeometry(size.x / object.scale.x, size.y / object.scale.y, size.z / object.scale.z),
      new THREE.MeshBasicMaterial({ visible: false, depthWrite: false }),
    );
    proxy.position.copy(center);
    object.add(proxy);
    pickables.push(proxy);
  };
  const placeToy = (model, x, height, index) => {
    if (!alive || !model) return;
    const object = stand(model, height);
    object.position.x = x;
    object.position.z = -0.22;
    object.position.y += 1.64;
    object.rotation.y = index % 2 ? 0.35 : -0.2;
    object.userData.ornament = true;
    object.userData.baseY = object.position.y;
    object.userData.baseZ = object.position.z;
    object.userData.baseRotY = object.rotation.y;
    object.userData.baseScale = object.scale.clone();
    object.userData.hover = 0;
    object.userData.hoverV = 0;
    object.traverse((node) => {
      if (!node.isMesh) return;
      node.castShadow = false;
      node.receiveShadow = true;
    });
    scene.add(object);
    addHitProxy(object);
    toys.push(object);
  };
  toyLoads.forEach((pending, index) => {
    const [, x, height] = toyLayout[index];
    pending.then((model) => placeToy(model, x, height, index));
  });

  const lampGlow = new THREE.PointLight("#ffb15e", 6, 3.2, 1.8);
  lampGlow.position.set(-1.7, 1.95, 0.15);
  scene.add(lampGlow);

  const edgeMat = new THREE.MeshStandardMaterial({ map: edgeMap, color: "#f3e8cf", roughness: 0.92 });
  const weave = clothMap;

  const shelfBooks = books.map((meta, i) => {
    const cover = new THREE.MeshStandardMaterial({ map: coverTexture(meta), roughness: 0.46, metalness: 0.02 });
    const cloth = new THREE.MeshStandardMaterial({ map: weave, color: themes[meta.id].cloth, roughness: 0.68 });
    const spine = new THREE.MeshStandardMaterial({ map: spineTexture(meta), roughness: 0.58 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(BOOK_W, BOOK_H, BOOK_D), [edgeMat, spine, edgeMat, edgeMat, cover, cloth]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const ribbon = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, 0.32),
      new THREE.MeshBasicMaterial({
        map: canvasTex((g, w, h) => {
          g.clearRect(0, 0, w, h);
          g.fillStyle = themes[meta.id].seal;
          g.beginPath();
          g.moveTo(w * 0.32, h);
          g.lineTo(w * 0.68, h);
          g.lineTo(w * 0.68, h * 0.26);
          g.lineTo(w * 0.5, h * 0.05);
          g.lineTo(w * 0.32, h * 0.26);
          g.closePath();
          g.fill();
        }, 64, 180),
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    ribbon.material.fog = false;
    ribbon.position.set(0.18, BOOK_H / 2 + 0.07, 0.02);
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.55, 1.9),
      new THREE.MeshBasicMaterial({
        map: canvasTex((g, w, h) => {
          const rad = g.createRadialGradient(w / 2, h / 2, 8, w / 2, h / 2, w / 2);
          rad.addColorStop(0, "rgba(255, 214, 120, .95)");
          rad.addColorStop(1, "rgba(255, 214, 120, 0)");
          g.fillStyle = rad;
          g.fillRect(0, 0, w, h);
        }, 256, 256),
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    );
    glow.position.set(0, 0.05, -0.2);
    const group = new THREE.Group();
    group.add(mesh, ribbon, glow);
    const x = (i - (books.length - 1) / 2) * gap;
    const lean = -0.03;
    group.position.set(x, 0.05 + (BOOK_H / 2) * Math.cos(lean), 0.04);
    group.rotation.x = lean;
    group.userData = { meta, baseX: x, baseY: group.position.y, baseZ: group.position.z, hover: 0, hoverV: 0, glow, cover, spine };
    scene.add(group);
    pickables.push(mesh);
    return group;
  });
  const repaintCovers = () => {
    if (!alive) return;
    for (const book of shelfBooks) {
      const nextCover = coverTexture(book.userData.meta);
      const nextSpine = spineTexture(book.userData.meta);
      book.userData.cover.map?.dispose();
      book.userData.spine.map?.dispose();
      book.userData.cover.map = nextCover;
      book.userData.spine.map = nextSpine;
      book.userData.cover.needsUpdate = true;
      book.userData.spine.needsUpdate = true;
    }
  };
  document.fonts.ready.then(repaintCovers);

  const dustPos = new Float32Array(70 * 3);
  for (let i = 0; i < 70; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 5.2;
    dustPos[i * 3 + 1] = 0.25 + Math.random() * 1.8;
    dustPos[i * 3 + 2] = 0.35 + Math.random() * 1.1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffe7b8, size: 0.03, transparent: true, opacity: 0.75, depthWrite: false }));
  scene.add(dust);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-9, -9);
  let hovered = null;

  const onMove = (event) => {
    pointer.x = (event.clientX / innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  };
  const ownerOf = (object) => {
    let node = object;
    while (node && !node.userData.meta && !node.userData.ornament) node = node.parent;
    return node;
  };
  const pick = () => {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    return hits.length ? ownerOf(hits[0].object) : null;
  };
  const onClick = () => {
    if (folioOpen) return;
    const hit = pick();
    if (!hit?.userData.meta) return;
    folioOpen = true;
    camTarget.set(0, 0.78, 0);
    onOpen(hit.userData.meta);
  };
  window.addEventListener("pointermove", onMove);
  canvas.addEventListener("click", onClick);

  fitView();
  camera.position.set(0, home.y, home.z);
  const clock = new THREE.Clock();
  let previous = 0;
  const goal = new THREE.Vector3();
  const frame = () => {
    const t = clock.getElapsedTime();
    const dt = Math.min(0.033, Math.max(0, t - previous));
    previous = t;
    showerWait -= dt;
    if (showerWait <= 0) {
      showerLeft = Math.random() < 0.22 ? 2 : 1;
      showerWait = 9 + Math.random() * 8;
    }
    if (showerLeft > 0 && Math.random() < dt * 1.4) {
      const idle = meteors.find((mesh) => !mesh.visible);
      if (idle) {
        launchMeteor(idle, showerLeft === 1 && Math.random() < 0.18);
        showerLeft -= 1;
      }
    }
    for (const mesh of meteors) {
      if (!mesh.visible) continue;
      mesh.userData.age += dt;
      mesh.position.addScaledVector(mesh.userData.dir, mesh.userData.speed * dt);
      const appear = Math.min(1, mesh.userData.age / 0.18);
      const fade = mesh.position.y < 2.2 ? Math.max(0, (mesh.position.y - 1.9) / 0.3) : 1;
      mesh.material.opacity = appear * fade * 0.85;
      if (mesh.position.y < 1.9 || mesh.userData.age > 3.2) mesh.visible = false;
    }
    const hit = folioOpen ? null : pick();
    if (hit !== hovered) hovered = hit;
    document.body.style.cursor = hovered ? "pointer" : "default";
    for (const book of shelfBooks) {
      glide(book.userData, book === hovered ? 1 : 0, dt);
      const lift = book.userData.hover;
      const idle = 1 - Math.min(1, Math.abs(lift));
      book.position.y = book.userData.baseY + Math.sin(t * 1.15 + book.userData.baseX) * 0.008 * idle + lift * 0.12;
      book.position.z = book.userData.baseZ + lift * 0.16;
      book.rotation.z = book.userData.baseX * -0.01 + lift * -0.035;
      book.userData.glow.material.opacity = Math.max(0, lift) * 0.7;
    }
    for (let i = 0; i < toys.length; i++) {
      const item = toys[i];
      glide(item.userData, item === hovered ? 1 : 0, dt);
      const lift = item.userData.hover;
      const idle = 1 - Math.min(1, Math.abs(lift));
      item.position.y = item.userData.baseY + Math.sin(t * 1.05 + i) * 0.008 * idle + lift * 0.11;
      item.position.z = item.userData.baseZ + lift * 0.16;
      item.rotation.y = item.userData.baseRotY + lift * 0.08;
      item.rotation.z = lift * -0.045;
      item.scale.copy(item.userData.baseScale).multiplyScalar(1 + lift * 0.06);
    }
    starField.material.opacity = 0.28 + Math.sin(t * 1.7) * 0.08;
    dust.rotation.y = t * 0.04;
    goal.set(pointer.x * 0.1, folioOpen ? home.y - 0.08 : home.y + pointer.y * 0.03, folioOpen ? home.z * 0.88 : home.z);
    camera.position.lerp(goal, 1 - Math.exp(-2.6 * dt));
    camera.lookAt(camTarget);
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(frame);

  return {
    applyBooks(nextBooks) {
      const byId = new Map(nextBooks.map((item) => [item.id, item]));
      for (const group of shelfBooks) {
        const meta = byId.get(group.userData.meta.id);
        if (meta) group.userData.meta = meta;
      }
      repaintCovers();
    },
    close() {
      folioOpen = false;
      camTarget.set(0, look.y, 0);
    },
    dispose() {
      alive = false;
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", fitView);
      canvas.removeEventListener("click", onClick);
      renderer.dispose();
    },
  };
}
