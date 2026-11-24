import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { buildBoundBook, contactShadowTexture, coverFoilMaps, coverTexture, spineTexture } from "./boundBook.js";
import { CometSky } from "./comets.js";
import { createLiveCat } from "./liveCat.js";
import { NightSky } from "./nightSky.js";
import { dressSurface, feltOrnament, ornamentKind } from "./ornaments.js";
import { RosePetals } from "./rosePetals.js";
import { addShelfFurniture } from "./shelfFurniture.js";
import { SoundKit } from "./soundKit.js";
import { Sparkles } from "./sparkles.js";

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

function glide(data, target, dt) {
  data.hoverV += (target - data.hover) * 58 * dt;
  data.hoverV *= Math.exp(-15 * dt);
  data.hover += data.hoverV * dt;
}

export async function mountShelf(canvas, { onOpen, onLampToggle, onHoverChange, onProgress, books }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    stencil: false,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#070b16");
  scene.fog = new THREE.Fog("#10162e", 16, 32);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 40);
  const sparkles = new Sparkles(renderer);
  const sound = new SoundKit();
  const nightSky = new NightSky(scene);
  const cometSky = new CometSky(scene);
  const rosePetals = new RosePetals(scene);

  const camTarget = new THREE.Vector3(0, 1.02, 0);
  let folioOpen = false;
  const home = { y: 1.12, z: 6.4 };
  let panX = 0;
  let panV = 0;
  let maxPanX = 0;
  const BOOK_W = 0.92;
  const BOOK_H = 1.28;
  const gap = 1.08;

  function resize() {
    const dpr = Math.min(devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight);
    sparkles.resize(innerWidth, innerHeight, dpr);
    nightSky.setDpr(dpr);
    cometSky.setDpr(dpr);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  const look = { y: 1.02 };
  function fitView() {
    const span = (books.length - 1) * gap + BOOK_W + 0.9;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const tanV = Math.tan(vFov / 2);
    const portrait = camera.aspect < 0.85;
    if (portrait) {
      // 仅竖屏模式：按约 2 本书宽近景取景，支持单指左右滑动浏览完整书架与两侧书档
      const viewSpan = 2.55;
      const hFov = 2 * Math.atan(tanV * Math.max(camera.aspect, 0.42));
      const distW = (viewSpan / 2) / Math.tan(hFov / 2);
      const distH = (2.38 - look.y) / (0.56 * tanV);
      home.z = Math.max(distW, distH, 5.4);
      home.y = look.y + 0.08;
      const visibleHalfW = home.z * Math.tan(hFov / 2);
      maxPanX = Math.max(0, span / 2 - visibleHalfW + 0.35);
      panX = THREE.MathUtils.clamp(panX, -maxPanX, maxPanX);
    } else {
      const hFov = 2 * Math.atan(tanV * Math.max(camera.aspect, 0.75));
      const distW = (span / 2) / Math.tan(hFov / 2);
      // 顶上的摆件要留在页眉下面，宽屏与手机横屏都要完整收进上下两层。
      const toyTop = 2.35;
      const compactLandscape = innerHeight <= 520 && innerWidth > innerHeight;
      const distH = (toyTop - look.y) / ((compactLandscape ? 0.54 : 0.58) * tanV);
      home.z = Math.max(distW, distH, 4.4);
      home.y = look.y + 0.06;
      maxPanX = 0;
      panX = 0;
      panV = 0;
    }
    if (!folioOpen) camTarget.set(panX, look.y, 0);
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("resize", fitView);

  scene.add(new THREE.AmbientLight("#9eb0e4", 0.22));
  const moonLight = new THREE.DirectionalLight("#d5e4ff", 0.7);
  moonLight.position.set(-3.4, 5.6, 2.2);
  scene.add(moonLight);
  const key = new THREE.DirectionalLight("#ffe0b4", 2.35);
  key.intensity = 1.55;
  key.position.set(2.2, 4.6, 4.4);
  key.castShadow = true;
  const shadowRes = Math.min(innerWidth, innerHeight) <= 768 ? 1024 : 2048;
  key.shadow.mapSize.set(shadowRes, shadowRes);
  key.shadow.camera.near = 0.4;
  key.shadow.camera.far = 16;
  key.shadow.camera.left = -4.5;
  key.shadow.camera.right = 4.5;
  key.shadow.camera.top = 3.4;
  key.shadow.camera.bottom = -1.4;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const fill = new THREE.PointLight(0xffe6c4, 3.2, 8, 2);
  fill.position.set(0.2, 1.25, 3.1);
  scene.add(fill);

  const textureLoader = new THREE.TextureLoader();
  const modelLoader = new GLTFLoader();
  modelLoader.setMeshoptDecoder(MeshoptDecoder);
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
  const loadModel = async (file) => {
    const url = `${ASSET}/models/toys/${file}`;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const gltf = await modelLoader.loadAsync(url);
        return gltf.scene;
      } catch {
        if (attempt === 0) await new Promise((r) => setTimeout(r, 600));
      }
    }
    return null;
  };
  const toyLayout = [
    ["lamp.d0317b4ebce8705c.glb", -1.85, 0.56],
    ["owl.64076cdcda2a772a.glb", -0.95, 0.48],
    ["moon.8bfb8215fd3bb484.glb", -0.1, 0.44],
    ["rocket.3dcb42ac8ccfee2a.glb", 0.8, 0.52],
    ["cat.d16becc9eadb9302.glb", 1.55, 0.44],
    ["rose.1f7caba56f9befc9.glb", 2.2, 0.4],
  ];

  // 不阻塞首屏：先用程序化底纹立即呈现书架，小贴图和 3D 摆件分阶段后台渐进加载
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
  const woodMat = new THREE.MeshPhysicalMaterial({
    map: wood,
    normalMap: null,
    normalScale: new THREE.Vector2(0.7, 0.7),
    color: 0xf4d2a4,
    roughness: 0.4,
    metalness: 0.04,
    clearcoat: 0.16,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.48,
  });
  const trimMat = new THREE.MeshStandardMaterial({ map: wood, color: 0xa86b38, roughness: 0.58 });

  const brassBracketMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a055,
    metalness: 0.84,
    roughness: 0.34,
    clearcoat: 0.25,
    clearcoatRoughness: 0.3,
    envMapIntensity: 1.0,
  });
  const plank = (w, h, d, x, y, z, mat, radius = 0.012) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, radius), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  };
  plank(5.44, 0.084, 0.52, 0, 0, 0, woodMat, 0.016);
  plank(5.44, 0.036, 0.03, 0, 0.032, 0.25, trimMat, 0.008);
  plank(5.44, 0.058, 0.44, 0, 1.58, -0.28, woodMat, 0.012);
  plank(5.44, 0.026, 0.028, 0, 1.6, -0.075, trimMat, 0.007);
  // 金属装饰细条嵌入层板前缘
  plank(5.36, 0.007, 0.008, 0, 0.0, 0.262, brassBracketMat, 0.002);
  plank(5.36, 0.006, 0.008, 0, 1.58, -0.058, brassBracketMat, 0.002);
  for (const x of [-1.85, 0, 1.85]) {
    plank(0.044, 0.23, 0.044, x, -0.125, -0.16, brassBracketMat, 0.008);
    const brace = new THREE.Mesh(new RoundedBoxGeometry(0.034, 0.034, 0.3, 2, 0.006), brassBracketMat);
    brace.position.set(x, -0.068, 0.02);
    brace.rotation.x = -0.68;
    brace.castShadow = true;
    brace.receiveShadow = true;
    scene.add(brace);
  }
  for (const x of [-1.85, 1.85]) {
    plank(0.036, 0.16, 0.036, x, 1.48, -0.38, brassBracketMat, 0.006);
    const topBrace = new THREE.Mesh(new RoundedBoxGeometry(0.028, 0.028, 0.22, 2, 0.005), brassBracketMat);
    topBrace.position.set(x, 1.515, -0.25);
    topBrace.rotation.x = -0.62;
    topBrace.castShadow = true;
    topBrace.receiveShadow = true;
    scene.add(topBrace);
  }

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
  const shadowMap = contactShadowTexture();
  const furniture = addShelfFurniture(scene, shadowMap);
  const footShadow = (width, depth) => {
    const material = new THREE.MeshBasicMaterial({
      map: shadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.42,
    });
    material.polygonOffset = true;
    material.polygonOffsetFactor = -2;
    material.polygonOffsetUnits = -2;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = 1;
    return mesh;
  };
  const retire = (object) => {
    scene.remove(object);
    if (object.userData.shadow) scene.remove(object.userData.shadow);
    const index = toys.indexOf(object);
    if (index >= 0) toys.splice(index, 1);
    for (let i = pickables.length - 1; i >= 0; i -= 1) {
      let node = pickables[i];
      while (node) {
        if (node === object) {
          pickables.splice(i, 1);
          break;
        }
        node = node.parent;
      }
    }
  };
  const liveCat = createLiveCat(shadowMap);
  scene.add(liveCat, liveCat.userData.shadow);
  pickables.push(liveCat.userData.hit);
  let catOrnament = null;

  const projectScreen = (worldPos) => {
    const v = worldPos.clone().project(camera);
    return {
      x: (v.x * 0.5 + 0.5) * innerWidth,
      y: (-v.y * 0.5 + 0.5) * innerHeight,
    };
  };

  const setCatOrnamentVisible = (visible) => {
    if (!catOrnament) return;
    catOrnament.visible = visible;
    if (catOrnament.userData.shadow) catOrnament.userData.shadow.visible = visible;
  };

  const recallCat = (playSound = false) => {
    if (!liveCat.userData.isActive() || liveCat.userData.isBusy()) return;
    if (playSound) sound.catMeow(false);
    const p = projectScreen(liveCat.position);
    sparkles.burst(p.x, p.y, 16, 0.9);
    liveCat.userData.returnHome({
      onArriveUpper: () => {
        setCatOrnamentVisible(true);
        if (catOrnament) {
          const up = projectScreen(catOrnament.position);
          sparkles.burst(up.x, up.y, 18, 0.9);
        }
      },
    });
  };

  const placeToy = (model, x, height, index, painted, kind) => {
    if (!alive || !model) return null;
    if (painted) dressSurface(model);
    const object = stand(model, height);
    const foot = object.position.y;
    object.position.set(x, foot + 1.64, -0.22);
    object.rotation.y = index % 2 ? 0.35 : -0.2;
    object.userData.ornament = true;
    object.userData.kind = kind;
    object.userData.baseX = x;
    object.userData.baseY = object.position.y;
    object.userData.baseZ = object.position.z;
    object.userData.baseRotY = object.rotation.y;
    object.userData.baseScale = object.scale.clone();
    object.userData.spawn = 0.01;
    object.scale.multiplyScalar(0.01);
    object.userData.hover = 0;
    object.userData.hoverV = 0;
    object.userData.flight = null;
    object.updateMatrixWorld(true);
    const fitted = new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3());
    const shadow = footShadow(Math.max(fitted.x, 0.18) * 0.9, Math.max(fitted.z, 0.14) * 0.8);
    shadow.position.set(x, 1.612, -0.22);
    object.userData.shadow = shadow;
    scene.add(object, shadow);
    addHitProxy(object);
    toys.push(object);
    if (kind === "cat") {
      catOrnament = object;
      if (liveCat.userData.isActive()) setCatOrnamentVisible(false);
    }
    return object;
  };
  const lampGlow = new THREE.PointLight("#ffb15e", 6, 3.6, 1.75);
  lampGlow.position.set(-1.7, 1.95, 0.15);
  scene.add(lampGlow);
  let lampOn = true;
  let lampLevel = 1;

  // 跟随鼠标的柔和暖金微光，划过书封时实时扫亮烫金与黄铜细节
  const cursorLight = new THREE.PointLight("#ffe6b8", 0, 2.8, 1.85);
  cursorLight.position.set(0, 1.0, 0.78);
  scene.add(cursorLight);
  let pointerInside = false;
  const cursorLightGoal = new THREE.Vector3(0, 1.0, 0.78);

  // 火箭点火与反推降落时的橙金尾焰光源
  const rocketLight = new THREE.PointLight("#ff8c38", 0, 2.6, 1.7);
  rocketLight.position.set(0.8, 1.7, -0.1);
  scene.add(rocketLight);
  // 玫瑰绽放时的柔和粉金微光
  const roseLight = new THREE.PointLight("#ff7ca6", 0, 2.2, 1.8);
  roseLight.position.set(2.2, 1.9, -0.1);
  scene.add(roseLight);
  const nozzleWorld = new THREE.Vector3();

  const readGemMat = new THREE.MeshPhysicalMaterial({
    color: 0xffdf80,
    emissive: 0xffb84d,
    emissiveIntensity: 0.75,
    metalness: 0.85,
    roughness: 0.2,
  });
  const readGemGeo = new THREE.OctahedronGeometry(0.036, 0);
  const bookAssets = { cloth: null, edges: null, paperNormal: null };
  const shelfBooks = books.map((meta, i) => {
    const built = buildBoundBook(meta, bookAssets);
    const { group } = built;
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.35, 1.7),
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
    glow.position.set(0, 0.02, -0.16);
    group.add(glow);
    const x = (i - (books.length - 1) / 2) * gap;
    const lean = -0.045;
    group.position.set(x, 0.042 + (built.height / 2) * Math.cos(lean), 0.05);
    group.rotation.set(lean, 0.045, built.profile.tiltZ);
    const shadow = footShadow(BOOK_W * 0.92, 0.22);
    shadow.position.set(x, 0.046, 0.08);
    scene.add(shadow);

    // 读完该卷后在书架前缘点亮的金色星钻徽记
    const readGem = new THREE.Mesh(readGemGeo, readGemMat);
    readGem.position.set(x, 0.085, 0.255);
    readGem.scale.setScalar(0.001);
    readGem.visible = false;
    scene.add(readGem);

    group.userData = {
      meta,
      index: i,
      baseX: x,
      baseY: group.position.y,
      baseZ: group.position.z,
      baseTiltZ: built.profile.tiltZ,
      hover: 0,
      hoverV: 0,
      pull: 0,
      pullV: 0,
      read: false,
      readScale: 0,
      readGem,
      frontPivot: built.frontPivot,
      ribbon: built.ribbon,
      ribbonBase: built.ribbonBase,
      glow,
      cover: built.cover,
      spine: built.spine,
      board: built.board,
      innerPage: built.innerPage,
      shadow,
    };
    scene.add(group);
    pickables.push(built.hit);
    return group;
  });

  // 并行加载 4 张轻贴图与 6 个已压缩至 ~1MB 的高精度摆件，实时汇报加载进度
  // 全部加载完毕后再进入主画面（同时设置 7 秒兜底上限，避免极端弱网无限等待）
  const totalItems = 4 + toyLayout.length;
  let loadedItems = 0;
  const tickProgress = () => {
    loadedItems += 1;
    onProgress?.(Math.min(1, loadedItems / totalItems));
  };
  onProgress?.(0.06);

  await MeshoptDecoder.ready;

  const texturePromises = [
    loadMap(`${ASSET}/textures/wood-planks.66ff16da40318ed3.webp`, { repeat: [3.2, 1] }).then((tex) => {
      tickProgress();
      if (!alive || !tex) return;
      woodMat.map = tex;
      woodMat.color.setHex(0xf2d2a6);
      woodMat.needsUpdate = true;
      trimMat.map = tex;
      trimMat.color.setHex(0xb98a5a);
      trimMat.needsUpdate = true;
    }),
    loadMap(`${ASSET}/textures/wood-planks-normal.254001ca88b9a14b.webp`, { color: false, repeat: [3.2, 1] }).then((tex) => {
      tickProgress();
      if (!alive || !tex) return;
      woodMat.normalMap = tex;
      woodMat.needsUpdate = true;
    }),
    loadMap(`${ASSET}/textures/cloth-neutral.bd2714a238f7ee4b.jpg`, { repeat: [3, 4] }).then((tex) => {
      tickProgress();
      if (!alive || !tex) return;
      for (const b of shelfBooks) {
        b.userData.board.map = tex;
        b.userData.board.needsUpdate = true;
      }
    }),
    loadMap(`${ASSET}/textures/paper-normal.556c3bfed32a1880.webp`, { color: false }).then((tex) => {
      tickProgress();
      if (!alive || !tex) return;
      for (const b of shelfBooks) {
        b.userData.cover.normalMap = tex;
        b.userData.cover.needsUpdate = true;
        b.userData.innerPage.normalMap = tex;
        b.userData.innerPage.needsUpdate = true;
      }
    }),
  ];

  const modelPromises = toyLayout.map(([file, x, height], index) => {
    const kind = ornamentKind(file);
    return loadModel(file).then((model) => {
      tickProgress();
      if (!alive) return;
      if (model) placeToy(model, x, height, index, true, kind);
      else placeToy(feltOrnament(kind), x, height, index, false, kind);
    });
  });

  await Promise.race([
    Promise.allSettled([...texturePromises, ...modelPromises]),
    new Promise((resolve) => window.setTimeout(resolve, 7000)),
  ]);
  onProgress?.(1);
  let activeBookId = null;
  const repaintCovers = () => {
    if (!alive) return;
    for (const book of shelfBooks) {
      const nextCover = coverTexture(book.userData.meta);
      const nextFoil = coverFoilMaps(book.userData.meta);
      const nextSpine = spineTexture(book.userData.meta);
      book.userData.cover.map?.dispose();
      book.userData.cover.metalnessMap?.dispose();
      book.userData.cover.roughnessMap?.dispose();
      book.userData.spine.map?.dispose();
      book.userData.cover.map = nextCover;
      book.userData.cover.metalnessMap = nextFoil.metalnessMap;
      book.userData.cover.roughnessMap = nextFoil.roughnessMap;
      book.userData.spine.map = nextSpine;
      book.userData.cover.needsUpdate = true;
      book.userData.spine.needsUpdate = true;
    }
  };
  if (document.fonts.status !== "loaded") {
    document.fonts.ready.then(repaintCovers);
  }

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

  let lastTrailAt = 0;
  let openTimer = 0;
  const drag = { active: false, pointerId: null, startX: 0, startY: 0, lastX: 0, moved: false };
  let suppressClick = false;

  const setPointerFromEvent = (event) => {
    pointer.x = (event.clientX / innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  };

  const onPointerDown = (event) => {
    if (folioOpen) return;
    setPointerFromEvent(event);
    pointerInside = true;
    drag.active = true;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.lastX = event.clientX;
    drag.moved = false;
    panV = 0;
  };

  const onMove = (event) => {
    pointerInside = true;
    setPointerFromEvent(event);
    if (drag.active && event.pointerId === drag.pointerId && !folioOpen && maxPanX > 0.05) {
      const dxTotal = event.clientX - drag.startX;
      const dyTotal = event.clientY - drag.startY;
      if (Math.hypot(dxTotal, dyTotal) > 8) drag.moved = true;
      if (drag.moved) {
        const dx = event.clientX - drag.lastX;
        const worldPerPx = (home.z * 0.62) / Math.max(innerWidth, 320);
        const shift = -dx * worldPerPx;
        panX = THREE.MathUtils.clamp(panX + shift, -maxPanX, maxPanX);
        panV = shift * 36;
      }
      drag.lastX = event.clientX;
    }
    const now = performance.now();
    if (!folioOpen && now - lastTrailAt > 42) {
      lastTrailAt = now;
      sparkles.trail(event.clientX, event.clientY);
    }
  };

  const onPointerUp = (event) => {
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    if (drag.moved) suppressClick = true;
    drag.active = false;
    drag.pointerId = null;
  };

  const onLeave = () => {
    pointerInside = false;
    drag.active = false;
    pointer.set(-9, -9);
  };
  const describeHover = (node) => {
    if (!node) return null;
    if (node.userData.liveCat) return { type: "liveCat" };
    if (node.userData.meta) {
      return { type: "book", id: node.userData.meta.id, title: node.userData.meta.title };
    }
    if (node.userData.ornament) {
      return { type: "ornament", kind: node.userData.kind };
    }
    return null;
  };
  const ownerOf = (object) => {
    let node = object;
    while (node && !node.userData.meta && !node.userData.ornament && !node.userData.liveCat) node = node.parent;
    return node;
  };
  const pick = () => {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    for (const h of hits) {
      const owner = ownerOf(h.object);
      if (owner && owner.visible) return owner;
    }
    return null;
  };
  const openBook = (meta) => {
    recallCat(false);
    activeBookId = meta.id;
    folioOpen = true;
    camTarget.set(0, 0.86, 0.25);
  };
  const onClick = (event) => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (folioOpen) return;
    // 触屏首次轻点无前置 pointermove，实时更新射线坐标保证一戳即中
    setPointerFromEvent(event);
    const hit = pick();
    if (!hit) {
      sparkles.burst(event.clientX, event.clientY, 8, 0.65);
      return;
    }
    if (hit.userData.liveCat) {
      recallCat(true);
      return;
    }
    if (hit.userData.ornament) {
      const kind = hit.userData.kind;
      if (kind === "cat") {
        if (!liveCat.userData.isActive()) {
          setCatOrnamentVisible(false);
          sparkles.burst(event.clientX, event.clientY, 24, 1.1);
          sound.catMeow(true);
          liveCat.userData.wake(hit.position, {
            onLandLower: () => {
              sound.paper(0.06, 0.14);
              const lp = projectScreen(liveCat.position);
              sparkles.burst(lp.x, lp.y, 12, 0.7);
            },
          });
        }
        return;
      }
      if (kind === "rocket") {
        if (!hit.userData.flight) {
          hit.userData.flight = { age: 0, landedSound: false, sparkTimer: 0 };
          sparkles.burst(event.clientX, event.clientY, 18, 0.95);
          sound.clickOrnament("rocket");
        }
        return;
      }
      if (kind === "owl") {
        if (!hit.userData.owlFlight) {
          hit.userData.owlFlight = { age: 0, sparkTimer: 0 };
          sparkles.burst(event.clientX, event.clientY, 14, 0.85);
          sound.clickOrnament("owl");
        }
        return;
      }
      if (kind === "rose") {
        if (!hit.userData.roseBloom) {
          hit.userData.roseBloom = { age: 0, petalTimer: 0 };
          rosePetals.burst(new THREE.Vector3(hit.position.x, hit.position.y + 0.24, hit.position.z), 18);
          for (let k = 0; k < 14; k += 1) {
            const a = (k / 14) * Math.PI * 2;
            const sp = 24 + Math.random() * 52;
            sparkles.emit(event.clientX, event.clientY, Math.cos(a) * sp, Math.sin(a) * sp + 22, 11 + Math.random() * 9, 0.85 + Math.random() * 0.45, true);
          }
          sound.clickOrnament("rose");
        }
        return;
      }
      hit.userData.hoverV += 4.2;
      sparkles.burst(event.clientX, event.clientY, kind === "moon" ? 22 : 14, kind === "moon" ? 1.15 : 0.85);
      if (kind === "lamp") {
        lampOn = !lampOn;
        sound.clickLamp(lampOn);
        onLampToggle?.(lampOn);
      } else if (kind === "moon") {
        sound.clickMoon();
        cometSky.launch(true);
      } else {
        sound.clickOrnament(kind);
      }
      return;
    }
    if (!hit.userData.meta) return;
    sparkles.burst(event.clientX, event.clientY, 20, 1.05);
    sound.openBook();
    openBook(hit.userData.meta);
    window.clearTimeout(openTimer);
    openTimer = window.setTimeout(() => {
      if (alive && folioOpen && activeBookId === hit.userData.meta.id) {
        onOpen(hit.userData.meta);
      }
    }, 240);
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  document.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);
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
    const targetLamp = lampOn ? 1 : 0.04;
    lampLevel += (targetLamp - lampLevel) * (1 - Math.exp(-5.5 * dt));
    const flicker = 1 + Math.sin(t * 2.1) * 0.045 + Math.sin(t * 5.3) * 0.018;
    lampGlow.intensity = 6.2 * lampLevel * flicker;
    fill.intensity = (1.35 + 1.85 * lampLevel) * (lampOn ? flicker : 1);
    key.intensity = 0.88 + 0.68 * lampLevel;
    moonLight.intensity = 0.7 + (1 - lampLevel) * 0.55;

    cometSky.update(t, dt);

    const hit = folioOpen ? null : pick();
    if (hit !== hovered) {
      hovered = hit;
      if (hovered?.userData.meta) sound.hoverBook(hovered.userData.index);
      onHoverChange?.(describeHover(hovered));
    }
    if (!document.documentElement.classList.contains("has-custom-cursor")) {
      document.body.style.cursor = hovered ? "pointer" : "default";
    }
    const cursorActive = pointerInside && !folioOpen;
    if (cursorActive) {
      cursorLightGoal.set(
        THREE.MathUtils.clamp(pointer.x * 2.85, -2.9, 2.9),
        THREE.MathUtils.clamp(look.y + pointer.y * 1.45, 0.12, 2.35),
        hovered?.userData.ornament ? 0.42 : 0.78,
      );
      cursorLight.position.lerp(cursorLightGoal, 1 - Math.exp(-12 * dt));
    }
    const targetCursorLight = cursorActive ? (hovered ? 3.1 : 2.1) : 0;
    cursorLight.intensity += (targetCursorLight - cursorLight.intensity) * (1 - Math.exp(-8 * dt));
    for (const book of shelfBooks) {
      const isSelected = folioOpen && book.userData.meta.id === activeBookId;
      glide(book.userData, book === hovered ? 1 : 0, dt);
      book.userData.pullV += ((isSelected ? 1 : 0) - book.userData.pull) * 42 * dt;
      book.userData.pullV *= Math.exp(-12 * dt);
      book.userData.pull += book.userData.pullV * dt;
      const lift = book.userData.hover;
      const pull = Math.max(0, book.userData.pull);
      const idle = 1 - Math.min(1, Math.abs(lift) + pull);
      book.position.x = THREE.MathUtils.lerp(book.userData.baseX, 0, pull * 0.45);
      book.position.y = book.userData.baseY + Math.sin(t * 1.15 + book.userData.baseX) * 0.008 * idle + lift * 0.12 + pull * 0.18;
      book.position.z = book.userData.baseZ + lift * 0.16 + pull * 1.15;
      book.rotation.x = THREE.MathUtils.lerp(-0.045 + lift * 0.07, 0.02, pull);
      book.rotation.y = THREE.MathUtils.lerp(0.045 * (1 - lift), -0.06, pull);
      book.rotation.z = THREE.MathUtils.lerp(book.userData.baseTiltZ + lift * -0.035, 0, pull);
      // 3D 前封板绕书脊铰链物理掀开
      if (book.userData.frontPivot) {
        book.userData.frontPivot.rotation.y = -2.05 * Math.min(1, pull * 1.05);
      }
      // 悬停时丝带书签向上探起并向右滑出微摆
      if (book.userData.ribbon) {
        const rb = book.userData.ribbonBase;
        const markLift = Math.max(0, lift) * (1 - Math.min(1, pull));
        book.userData.ribbon.position.x = rb.x + markLift * 0.17;
        book.userData.ribbon.position.y = rb.y + markLift * 0.065;
        book.userData.ribbon.rotation.z = -markLift * 0.24 + Math.sin(t * 4.4 + book.userData.index) * 0.045 * markLift;
      }
      // 阅读进度星钻徽记
      const gem = book.userData.readGem;
      if (gem) {
        const targetGem = book.userData.read && !folioOpen ? 1 : 0;
        book.userData.readScale += (targetGem - book.userData.readScale) * (1 - Math.exp(-8 * dt));
        gem.visible = book.userData.readScale > 0.02;
        if (gem.visible) {
          const s = book.userData.readScale * (1 + Math.sin(t * 2.6 + book.userData.index) * 0.08);
          gem.scale.set(s, s * 1.25, s);
          gem.position.y = 0.086 + Math.sin(t * 2.2 + book.userData.index) * 0.008;
          gem.rotation.y = t * 0.9 + book.userData.index;
        }
      }
      book.userData.glow.material.opacity = Math.min(0.85, Math.max(0, lift) * 0.7 + pull * 0.65);
      book.userData.shadow.material.opacity = 0.46 * Math.max(0, 1 - lift * 0.8 - pull * 0.95);
    }
    let rocketFlameIntensity = 0;
    let roseGlowIntensity = 0;
    for (let i = 0; i < toys.length; i++) {
      const item = toys[i];
      const owlFlight = item.userData.owlFlight;
      if (owlFlight) {
        owlFlight.age += dt;
        owlFlight.sparkTimer += dt;
        const age = owlFlight.age;
        const bx = item.userData.baseX;
        const by = item.userData.baseY;
        const bz = item.userData.baseZ;
        if (age < 0.35) {
          // 1. 歪头卖萌 + 轻蹲蓄力
          const p = age / 0.35;
          item.position.set(bx, by - Math.sin(p * Math.PI) * 0.028, bz);
          item.rotation.set(0, item.userData.baseRotY, Math.sin(p * Math.PI * 2) * 0.24);
          item.scale.copy(item.userData.baseScale).multiply(new THREE.Vector3(1 + p * 0.05, 1 - p * 0.06, 1 + p * 0.05));
        } else if (age < 2.15) {
          // 2. 振翅盘旋飞一圈 + 飘落暖白星尘
          const p = (age - 0.35) / 1.8;
          const ease = p * p * (3 - 2 * p);
          const loopAngle = ease * Math.PI * 2;
          const liftArc = Math.sin(ease * Math.PI);
          const flap = Math.sin(t * 24) * 0.022 * liftArc;
          item.position.set(
            bx + Math.sin(loopAngle) * 0.38,
            by + liftArc * 0.62 + flap,
            bz + (1 - Math.cos(loopAngle)) * 0.22,
          );
          item.rotation.set(
            0.12 * liftArc,
            item.userData.baseRotY + loopAngle,
            -Math.cos(loopAngle) * 0.22 * liftArc,
          );
          item.scale.copy(item.userData.baseScale).multiplyScalar(1 + liftArc * 0.08);
          if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36 * (1 - liftArc * 0.85);
          if (owlFlight.sparkTimer > 0.065) {
            owlFlight.sparkTimer = 0;
            const sp = projectScreen(item.position);
            sparkles.emit(
              sp.x + (Math.random() - 0.5) * 18,
              sp.y + 8,
              (Math.random() - 0.5) * 26,
              -22 - Math.random() * 24,
              10 + Math.random() * 8,
              0.75 + Math.random() * 0.45,
            );
          }
        } else if (age < 2.55) {
          // 3. 轻盈回落缓冲
          const p = (age - 2.15) / 0.4;
          const bounce = Math.sin(p * Math.PI * 2) * Math.exp(-p * 4.5);
          item.position.set(bx, by + Math.max(0, bounce) * 0.035, bz);
          item.rotation.set(0, item.userData.baseRotY, bounce * 0.09);
          item.scale.copy(item.userData.baseScale).multiply(new THREE.Vector3(1 - bounce * 0.06, 1 + bounce * 0.08, 1 - bounce * 0.06));
          if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36;
        } else {
          item.position.set(bx, by, bz);
          item.rotation.set(0, item.userData.baseRotY, 0);
          item.scale.copy(item.userData.baseScale);
          if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36;
          item.userData.owlFlight = null;
        }
        continue;
      }

      const roseBloom = item.userData.roseBloom;
      if (roseBloom) {
        roseBloom.age += dt;
        roseBloom.petalTimer += dt;
        const p = Math.min(1, roseBloom.age / 2.4);
        const bx = item.userData.baseX;
        const by = item.userData.baseY;
        const bz = item.userData.baseZ;
        const swell = Math.sin(p * Math.PI);
        const spin = p * p * (3 - 2 * p) * Math.PI * 2;
        item.position.set(bx, by + swell * 0.13, bz + swell * 0.08);
        item.rotation.set(0, item.userData.baseRotY + spin, Math.sin(p * Math.PI * 2) * 0.1);
        item.scale.copy(item.userData.baseScale).multiplyScalar(1 + swell * 0.14);
        roseGlowIntensity = swell * 4.8;
        roseLight.position.set(item.position.x, item.position.y + 0.18, item.position.z + 0.16);
        if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36 * (1 - swell * 0.55);
        if (p < 0.85 && roseBloom.petalTimer > 0.11) {
          roseBloom.petalTimer = 0;
          const bloomPos = new THREE.Vector3(item.position.x, item.position.y + 0.24, item.position.z);
          rosePetals.spawnOne(bloomPos, 0.72);
          const sp = projectScreen(bloomPos);
          sparkles.emit(
            sp.x + (Math.random() - 0.5) * 24,
            sp.y + (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 32,
            16 + Math.random() * 20,
            10 + Math.random() * 8,
            0.85 + Math.random() * 0.45,
            true,
          );
        }
        if (p >= 1) {
          item.position.set(bx, by, bz);
          item.rotation.set(0, item.userData.baseRotY, 0);
          item.scale.copy(item.userData.baseScale);
          if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36;
          item.userData.roseBloom = null;
        }
        continue;
      }

      const flight = item.userData.flight;
      if (flight) {
        flight.age += dt;
        flight.sparkTimer += dt;
        const age = flight.age;
        const bx = item.userData.baseX;
        const by = item.userData.baseY;
        const bz = item.userData.baseZ;
        const emitNozzle = (spread = 28, speedY = -110, size = 12) => {
          nozzleWorld.set(item.position.x, item.position.y + 0.04, item.position.z);
          nozzleWorld.project(camera);
          if (nozzleWorld.x >= -1.15 && nozzleWorld.x <= 1.15 && nozzleWorld.y >= -1.15 && nozzleWorld.y <= 1.15) {
            const sx = (nozzleWorld.x * 0.5 + 0.5) * innerWidth;
            const sy = (-nozzleWorld.y * 0.5 + 0.5) * innerHeight;
            sparkles.emit(
              sx + (Math.random() - 0.5) * 10,
              sy + 6,
              (Math.random() - 0.5) * spread,
              speedY - Math.random() * 45,
              size + Math.random() * 8,
              0.38 + Math.random() * 0.28,
            );
          }
        };

        if (age < 0.45) {
          // 1. 点火蓄力抖动
          const p = age / 0.45;
          const shake = Math.sin(t * 72) * 0.022 * p;
          item.position.set(bx + shake, by - 0.025 * p, bz + Math.cos(t * 64) * 0.012 * p);
          item.rotation.set(0, item.userData.baseRotY, shake * 2.2);
          item.scale.copy(item.userData.baseScale).multiply(new THREE.Vector3(1 + 0.06 * p, 1 - 0.08 * p, 1 + 0.06 * p));
          rocketFlameIntensity = 4.5 * p * (0.85 + Math.sin(t * 50) * 0.15);
          if (flight.sparkTimer > 0.025) {
            flight.sparkTimer = 0;
            emitNozzle(70, -60, 11);
          }
        } else if (age < 1.55) {
          // 2. 呼啸加速升空冲出画面
          const p = (age - 0.45) / 1.1;
          const climb = Math.pow(p, 2.15);
          const arcX = Math.sin(p * Math.PI * 0.85) * 0.36;
          item.position.set(bx + arcX, by + climb * 4.6, bz + p * 0.25);
          item.rotation.set(-0.08 * p, item.userData.baseRotY + p * Math.PI * 1.4, -0.16 * Math.sin(p * Math.PI));
          item.scale.copy(item.userData.baseScale).multiply(new THREE.Vector3(0.95, 1.12, 0.95));
          rocketFlameIntensity = Math.max(0, (1 - p * 0.7) * 6.5);
          if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36 * Math.max(0, 1 - p * 3.2);
          if (flight.sparkTimer > 0.018) {
            flight.sparkTimer = 0;
            emitNozzle(42, -145, 14);
          }
        } else if (age < 3.15) {
          // 3. 高空回返 & 反推减速精准降落
          const p = (age - 1.55) / 1.6;
          const descend = Math.pow(1 - p, 2.75);
          const swayX = Math.sin((1 - p) * Math.PI) * -0.22;
          item.position.set(bx + swayX, by + descend * 4.6, bz + descend * 0.18);
          item.rotation.set(0, item.userData.baseRotY + descend * Math.PI * 0.8, 0.12 * Math.sin((1 - p) * Math.PI));
          item.scale.copy(item.userData.baseScale);
          if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36 * Math.pow(p, 2.4);
          if (p > 0.55) {
            const burn = (p - 0.55) / 0.45;
            rocketFlameIntensity = Math.sin(burn * Math.PI) * 5.2;
            if (flight.sparkTimer > 0.024) {
              flight.sparkTimer = 0;
              emitNozzle(65, -95, 11);
            }
          }
        } else if (age < 3.62) {
          // 4. 落地微弹缓冲
          const p = (age - 3.15) / 0.47;
          if (!flight.landedSound) {
            flight.landedSound = true;
            sound.rocketLand();
            for (let k = 0; k < 10; k += 1) emitNozzle(110, -25, 10);
          }
          const bounce = Math.sin(p * Math.PI * 2) * Math.exp(-p * 4.5);
          item.position.set(bx, by + Math.max(0, bounce) * 0.045, bz);
          item.rotation.set(0, item.userData.baseRotY, bounce * 0.06);
          item.scale.copy(item.userData.baseScale).multiply(new THREE.Vector3(1 - bounce * 0.08, 1 + bounce * 0.11, 1 - bounce * 0.08));
          if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36;
        } else {
          item.position.set(bx, by, bz);
          item.rotation.set(0, item.userData.baseRotY, 0);
          item.scale.copy(item.userData.baseScale);
          if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36;
          item.userData.flight = null;
        }
        rocketLight.position.set(item.position.x, item.position.y - 0.05, item.position.z + 0.14);
        continue;
      }

      glide(item.userData, item === hovered ? 1 : 0, dt);
      if (item.userData.spawn < 1) {
        item.userData.spawn = Math.min(1, item.userData.spawn + dt * 3.4);
      }
      const spawnEase = 1 - Math.pow(1 - item.userData.spawn, 3);
      const lift = item.userData.hover;
      const idle = 1 - Math.min(1, Math.abs(lift));
      item.position.x = item.userData.baseX;
      item.position.y = item.userData.baseY + Math.sin(t * 1.05 + i) * 0.008 * idle + lift * 0.11;
      item.position.z = item.userData.baseZ + lift * 0.16;
      item.rotation.x = 0;
      item.rotation.y = item.userData.baseRotY + lift * 0.08;
      item.rotation.z = lift * -0.045;
      item.scale.copy(item.userData.baseScale).multiplyScalar(spawnEase * (1 + lift * 0.06));
      if (item.userData.shadow) item.userData.shadow.material.opacity = 0.36 * spawnEase * (1 - lift * 0.75);
    }
    rocketLight.intensity += (rocketFlameIntensity - rocketLight.intensity) * (1 - Math.exp(-16 * dt));
    roseLight.intensity += (roseGlowIntensity - roseLight.intensity) * (1 - Math.exp(-8 * dt));
    rosePetals.update(t, dt);
    liveCat.userData.update(t, dt, pointerInside ? pointer : null, hovered);
    nightSky.update(t, lampLevel);
    dust.rotation.y = t * 0.04;
    if (!drag.active && maxPanX > 0.05 && !folioOpen) {
      panX += panV * dt;
      panV *= Math.exp(-6.5 * dt);
      if (panX < -maxPanX) { panX = -maxPanX; panV = 0; }
      else if (panX > maxPanX) { panX = maxPanX; panV = 0; }
    }
    const targetCamX = folioOpen ? 0 : (maxPanX > 0.05 ? panX : pointer.x * 0.1);
    const targetLookX = folioOpen ? 0 : panX;
    camTarget.x += (targetLookX - camTarget.x) * (1 - Math.exp(-8 * dt));
    goal.set(targetCamX, folioOpen ? home.y - 0.06 : home.y + (maxPanX > 0.05 ? 0 : pointer.y * 0.03), folioOpen ? home.z * 0.84 : home.z);
    camera.position.lerp(goal, 1 - Math.exp(-3.2 * dt));
    camera.lookAt(camTarget);

    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    sparkles.render(t);
  };
  const onVisibility = () => {
    if (!alive) return;
    if (document.hidden) {
      renderer.setAnimationLoop(null);
    } else {
      previous = clock.getElapsedTime();
      renderer.setAnimationLoop(frame);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);
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
    selectBook(id) {
      window.clearTimeout(openTimer);
      if (!id) {
        if (folioOpen) sound.closeBook();
        activeBookId = null;
        folioOpen = false;
        camTarget.set(0, look.y, 0);
        return;
      }
      if (folioOpen && activeBookId && activeBookId !== id) {
        sound.turnPage();
      }
      activeBookId = id;
      folioOpen = true;
      camTarget.set(0, 0.86, 0.25);
    },
    setReadBooks(ids) {
      const set = new Set(ids);
      for (const group of shelfBooks) {
        group.userData.read = set.has(group.userData.meta.id);
      }
    },
    setSoundEnabled(on) {
      sound.setEnabled(on);
      if (on) sound.chime(79, { volume: 0.07, decay: 0.5 });
    },
    celebrate() {
      sound.celebrate();
      cometSky.shower(6);
      sparkles.burst(innerWidth * 0.5, innerHeight * 0.42, 42, 1.5);
    },
    toggleLamp() {
      lampOn = !lampOn;
      sound.clickLamp(lampOn);
      onLampToggle?.(lampOn);
      return lampOn;
    },
    close() {
      window.clearTimeout(openTimer);
      if (folioOpen) sound.closeBook();
      activeBookId = null;
      folioOpen = false;
      camTarget.set(panX, look.y, 0);
    },
    dispose() {
      alive = false;
      window.clearTimeout(openTimer);
      renderer.setAnimationLoop(null);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", fitView);
      canvas.removeEventListener("click", onClick);
      nightSky.dispose();
      cometSky.dispose();
      rosePetals.dispose();
      furniture.dispose();
      sparkles.dispose();
      sound.dispose();
      renderer.dispose();
    },
  };
}
