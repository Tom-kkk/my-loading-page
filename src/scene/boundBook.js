import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { themes } from "../data/content.js";

const BOARD_W = 0.92;
const BOARD_H = 1.28;
const BOARD_T = 0.03;
const BLOCK_D = 0.086;
const SQUARE = 0.03;
const SPINE_T = 0.042;

const BOOK_PROFILES = {
  about: { scaleY: 1.0, scaleZ: 1.04, tiltZ: -0.012 },
  projects: { scaleY: 1.04, scaleZ: 1.12, tiltZ: 0.008 },
  craft: { scaleY: 0.96, scaleZ: 0.94, tiltZ: -0.006 },
  contact: { scaleY: 0.99, scaleZ: 1.0, tiltZ: 0.014 },
};

export function bookProfile(id) {
  return BOOK_PROFILES[id] || { scaleY: 1, scaleZ: 1, tiltZ: 0 };
}

function canvasTex(draw, w, h, colorSpace = THREE.SRGBColorSpace) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = colorSpace;
  tex.anisotropy = 8;
  return tex;
}

const EDITION_META = {
  about: { vol: "VOL. I", num: "01", code: "FIG. 01 // ASTROLABE · LLM", roman: "I", deep: "#0c1328", mid: "#172346" },
  projects: { vol: "VOL. II", num: "02", code: "FIG. 02 // ORBITAL · SHIPPED", roman: "II", deep: "#2c0f1e", mid: "#562039" },
  craft: { vol: "VOL. III", num: "03", code: "FIG. 03 // NEURAL · MATRIX", roman: "III", deep: "#092322", mid: "#124642" },
  contact: { vol: "VOL. IV", num: "04", code: "FIG. 04 // 23°21'N · 116°40'E", roman: "IV", deep: "#331b0e", mid: "#62371e" },
};

function drawStar4(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.28;
    const a = (i * Math.PI) / 4;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fill();
}

function drawCrosshair(g, x, y, size) {
  g.beginPath();
  g.moveTo(x - size, y);
  g.lineTo(x + size, y);
  g.moveTo(x, y - size);
  g.lineTo(x, y + size);
  g.stroke();
}

function drawTickRing(g, cx, cy, r, count, lenMajor, lenMinor) {
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2;
    const len = i % 4 === 0 ? lenMajor : lenMinor;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * (r - len), cy + Math.sin(a) * (r - len));
    g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    g.stroke();
  }
}

function drawEmblem(g, id, cx, cy, R, primary, faint) {
  if (id === "about") {
    // 古典月相星盘 × 开发者经纬刻度
    g.strokeStyle = primary;
    g.lineWidth = 3.2;
    g.beginPath();
    g.arc(cx, cy, R, 0, Math.PI * 2);
    g.stroke();

    g.lineWidth = 1.6;
    g.beginPath();
    g.arc(cx, cy, R * 0.86, 0, Math.PI * 2);
    g.stroke();
    drawTickRing(g, cx, cy, R, 72, 16, 7);

    // 倾斜星轨椭圆
    g.strokeStyle = faint;
    g.lineWidth = 1.8;
    for (const tilt of [-0.46, 0.46]) {
      g.save();
      g.translate(cx, cy);
      g.rotate(tilt);
      g.beginPath();
      g.ellipse(0, 0, R * 1.1, R * 0.36, 0, 0, Math.PI * 2);
      g.stroke();
      g.restore();
    }

    // 十字校准线
    g.strokeStyle = faint;
    g.lineWidth = 1.4;
    drawCrosshair(g, cx, cy, R * 1.14);

    // 中央新月与星芒
    g.strokeStyle = primary;
    g.lineWidth = 2.6;
    g.beginPath();
    g.arc(cx, cy, R * 0.44, 0, Math.PI * 2);
    g.stroke();

    g.fillStyle = primary;
    g.beginPath();
    g.arc(cx - 10, cy, R * 0.28, 0.45, Math.PI * 2 - 0.45);
    g.arc(cx + 18, cy - 6, R * 0.24, Math.PI * 2 - 0.82, 0.82, true);
    g.closePath();
    g.fill();

    drawStar4(g, cx + R * 0.24, cy - R * 0.12, 16);
    drawStar4(g, cx, cy - R * 0.93, 12);
    drawStar4(g, cx, cy + R * 0.93, 12);
    drawStar4(g, cx - R * 0.93, cy, 10);
    drawStar4(g, cx + R * 0.93, cy, 10);

    // 外圈四个轨道小节点
    for (let i = 0; i < 4; i += 1) {
      const a = Math.PI / 4 + (i * Math.PI) / 2;
      g.beginPath();
      g.arc(cx + Math.cos(a) * R * 0.86, cy + Math.sin(a) * R * 0.86, 5.5, 0, Math.PI * 2);
      g.fill();
    }
    return;
  }

  if (id === "projects") {
    // 轨道星图 × 三体产品节点架构
    g.strokeStyle = primary;
    g.lineWidth = 2.8;
    g.beginPath();
    g.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
    g.stroke();

    g.strokeStyle = faint;
    g.lineWidth = 1.6;
    g.setLineDash([7, 7]);
    g.beginPath();
    g.arc(cx, cy, R * 0.68, 0, Math.PI * 2);
    g.stroke();
    g.setLineDash([]);

    // 三条交错轨道
    g.strokeStyle = primary;
    g.lineWidth = 2;
    for (const rot of [-0.52, 0.52, 1.57]) {
      g.save();
      g.translate(cx, cy);
      g.rotate(rot);
      g.beginPath();
      g.ellipse(0, 0, R * 0.96, R * 0.34, 0, 0, Math.PI * 2);
      g.stroke();
      g.restore();
    }

    const nodes = [
      { x: cx - R * 0.58, y: cy + R * 0.34, r: 15, tag: "01" },
      { x: cx + R * 0.6, y: cy + R * 0.24, r: 13, tag: "02" },
      { x: cx + R * 0.04, y: cy - R * 0.64, r: 17, tag: "03" },
    ];
    // 节点星图连线
    g.strokeStyle = primary;
    g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(nodes[0].x, nodes[0].y);
    g.lineTo(nodes[1].x, nodes[1].y);
    g.lineTo(nodes[2].x, nodes[2].y);
    g.closePath();
    g.stroke();

    // 中央星核
    g.fillStyle = primary;
    drawStar4(g, cx, cy, 22);

    // 绘制产品节点 + 工程引线标注
    g.font = '600 17px "Consolas", "Courier New", monospace';
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (const n of nodes) {
      g.strokeStyle = primary;
      g.lineWidth = 2.6;
      g.beginPath();
      g.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = primary;
      g.beginPath();
      g.arc(n.x, n.y, n.r * 0.52, 0, Math.PI * 2);
      g.fill();
      g.fillText(n.tag, n.x, n.y - n.r - 19);
    }
    return;
  }

  if (id === "craft") {
    // 黄金比例圆 × 神经网络星阵
    g.strokeStyle = primary;
    g.lineWidth = 2.8;
    g.beginPath();
    g.arc(cx, cy, R * 0.98, 0, Math.PI * 2);
    g.stroke();
    drawTickRing(g, cx, cy, R * 0.98, 48, 12, 5);

    // 外接正六边形 + 内接菱形（神圣几何）
    g.strokeStyle = faint;
    g.lineWidth = 1.8;
    g.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const a = -Math.PI / 2 + (i * Math.PI) / 3;
      const px = cx + Math.cos(a) * R * 0.84;
      const py = cy + Math.sin(a) * R * 0.84;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.closePath();
    g.stroke();

    g.beginPath();
    g.arc(cx, cy, R * 0.56, 0, Math.PI * 2);
    g.stroke();

    // 三层神经网络拓扑（3 -> 4 -> 3）
    const cols = [
      { x: cx - R * 0.52, ys: [-0.36, 0, 0.36] },
      { x: cx, ys: [-0.52, -0.18, 0.18, 0.52] },
      { x: cx + R * 0.52, ys: [-0.36, 0, 0.36] },
    ];
    g.strokeStyle = faint;
    g.lineWidth = 1.6;
    for (let c = 0; c < cols.length - 1; c += 1) {
      for (const y1 of cols[c].ys) {
        for (const y2 of cols[c + 1].ys) {
          g.beginPath();
          g.moveTo(cols[c].x, cy + y1 * R);
          g.lineTo(cols[c + 1].x, cy + y2 * R);
          g.stroke();
        }
      }
    }
    for (const col of cols) {
      for (const y of col.ys) {
        const ny = cy + y * R;
        g.strokeStyle = primary;
        g.lineWidth = 2.6;
        g.beginPath();
        g.arc(col.x, ny, 10, 0, Math.PI * 2);
        g.stroke();
        g.fillStyle = primary;
        g.beginPath();
        g.arc(col.x, ny, 4.5, 0, Math.PI * 2);
        g.fill();
      }
    }
    g.fillStyle = primary;
    drawStar4(g, cx, cy - R * 0.84, 13);
    drawStar4(g, cx, cy + R * 0.84, 13);
    return;
  }

  // contact: 古典经纬邮戳 × 信号弧 × 火漆徽章
  g.strokeStyle = primary;
  g.lineWidth = 3;
  g.beginPath();
  g.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
  g.stroke();
  drawTickRing(g, cx, cy, R * 0.96, 60, 14, 6);

  // 地球经纬投影线
  g.strokeStyle = faint;
  g.lineWidth = 1.6;
  for (const rx of [0.28, 0.56, 0.82]) {
    g.beginPath();
    g.ellipse(cx, cy, R * rx, R * 0.82, 0, 0, Math.PI * 2);
    g.stroke();
  }
  for (const yOff of [-0.42, 0, 0.42]) {
    const halfW = Math.sqrt(Math.max(0, 1 - (yOff / 0.82) ** 2)) * R * 0.82;
    g.beginPath();
    g.moveTo(cx - halfW, cy + yOff * R);
    g.lineTo(cx + halfW, cy + yOff * R);
    g.stroke();
  }

  // 右上角信号波弧
  g.strokeStyle = primary;
  g.lineWidth = 2;
  for (let i = 1; i <= 3; i += 1) {
    g.beginPath();
    g.arc(cx, cy, R * (0.34 + i * 0.14), -0.9, -0.15);
    g.stroke();
  }

  // 中央火漆菱形徽章 + Monogram "A"
  g.strokeStyle = primary;
  g.lineWidth = 3;
  g.beginPath();
  g.arc(cx, cy, R * 0.34, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 1.6;
  g.beginPath();
  g.arc(cx, cy, R * 0.27, 0, Math.PI * 2);
  g.stroke();

  g.fillStyle = primary;
  g.font = '700 66px "Noto Serif SC", Georgia, serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("A", cx, cy + 3);
  drawStar4(g, cx, cy - R * 0.86, 12);
  drawStar4(g, cx, cy + R * 0.86, 12);
}

function drawCoverFoilLayer(g, book, primary, faint) {
  const W = 768;
  const H = 1040;
  const meta = EDITION_META[book.id] || EDITION_META.about;

  // 外层古典双线烫金框
  g.strokeStyle = primary;
  g.lineWidth = 4.5;
  g.strokeRect(30, 30, W - 60, H - 60);
  g.strokeStyle = faint;
  g.lineWidth = 1.8;
  g.strokeRect(46, 46, W - 92, H - 92);

  // 四角工程校准十字 + 古典角饰
  g.strokeStyle = primary;
  g.lineWidth = 2.4;
  const corners = [
    [66, 66],
    [W - 66, 66],
    [66, H - 66],
    [W - 66, H - 66],
  ];
  for (const [cx, cy] of corners) {
    const sx = cx < W / 2 ? 1 : -1;
    const sy = cy < H / 2 ? 1 : -1;
    drawCrosshair(g, cx, cy, 10);
    g.beginPath();
    g.arc(cx, cy, 5.5, 0, Math.PI * 2);
    g.stroke();
    // 精致星轨内弧角花
    g.beginPath();
    g.moveTo(cx + sx * 16, cy);
    g.quadraticCurveTo(cx + sx * 16, cy + sy * 16, cx, cy + sy * 16);
    g.stroke();
    g.fillStyle = primary;
    drawStar4(g, cx + sx * 22, cy + sy * 22, 6);
  }

  // 顶部蓝图编号眉标
  g.fillStyle = primary;
  g.font = '600 20px "Consolas", "Courier New", monospace';
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.fillText(`${meta.vol}  //  ${meta.num}`, 94, 88);
  g.textAlign = "right";
  g.fillText("AMICO ARCHIVE", W - 94, 88);

  g.strokeStyle = faint;
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(64, 118);
  g.lineTo(W - 64, 118);
  g.stroke();

  // 中央专属星图 × 工程蓝图烫金徽章
  drawEmblem(g, book.id, W / 2, 424, 218, primary, faint);

  // 底部标题分割线 + 星标
  g.strokeStyle = primary;
  g.lineWidth = 2.4;
  g.beginPath();
  g.moveTo(76, 704);
  g.lineTo(W / 2 - 26, 704);
  g.moveTo(W / 2 + 26, 704);
  g.lineTo(W - 76, 704);
  g.stroke();
  g.fillStyle = primary;
  drawStar4(g, W / 2, 704, 13);

  // 书名（烫金主标题）
  g.fillStyle = primary;
  g.textAlign = "center";
  g.textBaseline = "middle";
  let titleSize = 74;
  g.font = `700 ${titleSize}px "Noto Serif SC", "Baloo 2", "LXGW WenKai", serif`;
  while (titleSize > 38 && g.measureText(book.title).width > W * 0.74) {
    titleSize -= 4;
    g.font = `700 ${titleSize}px "Noto Serif SC", "Baloo 2", "LXGW WenKai", serif`;
  }
  g.fillText(book.title, W / 2, 796);

  // 副标题
  g.fillStyle = faint;
  let kickerSize = 25;
  g.font = `500 ${kickerSize}px "LXGW WenKai", "Fredoka", "Noto Serif SC", sans-serif`;
  while (kickerSize > 16 && g.measureText(book.kicker).width > W * 0.74) {
    kickerSize -= 2;
    g.font = `500 ${kickerSize}px "LXGW WenKai", "Fredoka", "Noto Serif SC", sans-serif`;
  }
  g.fillText(book.kicker, W / 2, 864);

  // 底部工程图注行
  g.strokeStyle = faint;
  g.lineWidth = 1.4;
  g.beginPath();
  g.moveTo(110, 914);
  g.lineTo(W - 110, 914);
  g.stroke();
  g.fillStyle = faint;
  g.font = '600 17px "Consolas", "Courier New", monospace';
  g.fillText(meta.code, W / 2, 950);
}

export function coverFoilMaps(book) {
  const metalnessMap = canvasTex((g, w, h) => {
    g.fillStyle = "#080808";
    g.fillRect(0, 0, w, h);
    g.save();
    g.scale(w / 768, h / 1040);
    drawCoverFoilLayer(g, book, "#f2f2f2", "#a8a8a8");
    g.restore();
  }, 384, 520, THREE.NoColorSpace);

  const roughnessMap = canvasTex((g, w, h) => {
    g.fillStyle = "#d4d4d4";
    g.fillRect(0, 0, w, h);
    g.save();
    g.scale(w / 768, h / 1040);
    drawCoverFoilLayer(g, book, "#242424", "#484848");
    g.restore();
  }, 384, 520, THREE.NoColorSpace);

  return { metalnessMap, roughnessMap };
}

export function coverTexture(book) {
  return canvasTex((g, w, h) => {
    const meta = EDITION_META[book.id] || EDITION_META.about;
    // 深邃复古皮面/亚麻底色 + 四周微暗角
    const base = g.createRadialGradient(w * 0.5, h * 0.38, w * 0.08, w * 0.5, h * 0.5, h * 0.72);
    base.addColorStop(0, meta.mid);
    base.addColorStop(1, meta.deep);
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);

    // 极淡工程蓝图网格底纹
    g.strokeStyle = "rgba(244, 218, 152, 0.045)";
    g.lineWidth = 1;
    for (let x = 48; x < w; x += 48) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.stroke();
    }
    for (let y = 48; y < h; y += 48) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }

    // 细腻纸布颗粒纹理
    for (let i = 0; i < 1200; i += 1) {
      const bright = i % 3 === 0;
      g.fillStyle = bright ? "rgba(255, 240, 200, 0.035)" : "rgba(0, 0, 0, 0.07)";
      g.fillRect((i * 73) % w, (i * 41) % h, 2, 1.5);
    }

    // 渐变烫金主色
    const goldGrad = g.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, "#fae19c");
    goldGrad.addColorStop(0.45, "#d8a84e");
    goldGrad.addColorStop(0.75, "#f5d78c");
    goldGrad.addColorStop(1, "#c8963e");
    const faintGold = "rgba(238, 204, 128, 0.72)";

    g.save();
    g.scale(w / 768, h / 1040);
    drawCoverFoilLayer(g, book, goldGrad, faintGold);
    g.restore();
  }, 768, 1040);
}

export function spineTexture(book) {
  return canvasTex((g, w, h) => {
    const meta = EDITION_META[book.id] || EDITION_META.about;
    const bg = g.createLinearGradient(0, 0, w, 0);
    bg.addColorStop(0, meta.deep);
    bg.addColorStop(0.5, meta.mid);
    bg.addColorStop(1, meta.deep);
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    // 顶部与底部精细烫金细线
    g.fillStyle = "#e8c474";
    g.fillRect(16, 46, w - 32, 3);
    g.fillRect(16, 56, w - 32, 1.5);
    g.fillRect(16, h - 58, w - 32, 1.5);
    g.fillRect(16, h - 49, w - 32, 3);

    // 卷号罗马数字
    g.fillStyle = "#f2d488";
    g.font = '700 32px "Noto Serif SC", Georgia, serif';
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(meta.roman, w / 2, 102);

    // 垂直书名
    const chars = [...book.title];
    const latin = /^[\u0000-\u007F]+$/.test(book.title);
    const step = latin ? 54 : 74;
    g.fillStyle = "#fae6b2";
    g.font = `700 ${latin ? 38 : 50}px "Noto Serif SC", "LXGW WenKai", serif`;
    const top = h / 2 - ((chars.length - 1) * step) / 2;
    chars.forEach((ch, i) => g.fillText(ch, w / 2, top + i * step));

    // 底部星芒徽记
    drawStar4(g, w / 2, h - 102, 15);
  }, 180, 1040);
}

function clothMaterial(color, weave) {
  const ink = new THREE.Color(color);
  return new THREE.MeshPhysicalMaterial({
    map: weave || null,
    color: ink,
    roughness: 0.74,
    metalness: 0,
    sheen: 0.78,
    sheenRoughness: 0.42,
    sheenColor: ink.clone().lerp(new THREE.Color(0xfff4e2), 0.5),
    envMapIntensity: 0.55,
  });
}

function turnedEdges(source, repeatX, repeatY, turn) {
  if (!source) return null;
  const map = source.clone();
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.center.set(0.5, 0.5);
  map.rotation = turn;
  map.repeat.set(repeatX, repeatY);
  map.needsUpdate = true;
  return map;
}

function foreEdgeMaterial(edges) {
  return new THREE.MeshStandardMaterial({
    map: turnedEdges(edges, 12, 1, Math.PI / 2),
    color: 0xf7f1e4,
    roughness: 0.93,
    metalness: 0,
  });
}

function headEdgeMaterial(edges) {
  return new THREE.MeshStandardMaterial({
    map: turnedEdges(edges, 2, 14, 0),
    color: 0xf7f1e4,
    roughness: 0.93,
    metalness: 0,
  });
}

function paperEdgeMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0xf4ead8, roughness: 0.94, metalness: 0 });
}

export function contactShadowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d");
  for (let i = 0; i < 28; i += 1) {
    const inset = 10 + (i / 28) * 70;
    g.fillStyle = "rgba(0, 0, 0, 0.07)";
    g.beginPath();
    g.roundRect(inset, inset, size - inset * 2, size - inset * 2, 28 - i * 0.6);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function ribbon(color) {
  const ink = new THREE.Color(color);
  const material = new THREE.MeshPhysicalMaterial({
    color: ink,
    roughness: 0.46,
    metalness: 0,
    sheen: 0.55,
    sheenRoughness: 0.4,
    sheenColor: ink.clone().lerp(new THREE.Color(0xfff8ee), 0.22),
    side: THREE.DoubleSide,
    envMapIntensity: 0.5,
  });
  const group = new THREE.Group();
  const strap = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.16, 0.005), material);
  strap.position.y = 0.08;
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.055, 0.005), material);
  left.position.set(-0.012, 0.01, 0.001);
  left.rotation.z = 0.5;
  const right = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.055, 0.005), material);
  right.position.set(0.012, 0.01, 0.001);
  right.rotation.z = -0.5;
  group.add(strap, left, right);
  group.traverse((node) => {
    if (node.isMesh) node.castShadow = false;
  });
  return group;
}

function endpaperTexture(clothHex) {
  return canvasTex((g, w, h) => {
    g.fillStyle = clothHex;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(244, 214, 140, 0.42)";
    g.strokeStyle = "rgba(244, 214, 140, 0.22)";
    g.lineWidth = 1;
    for (let y = 16; y < h; y += 32) {
      for (let x = 16; x < w; x += 32) {
        const ox = (Math.floor(y / 32) % 2) * 16;
        drawStar4(g, (x + ox) % w, y, 3.8);
      }
    }
    g.strokeRect(12, 12, w - 24, h - 24);
  }, 256, 256);
}

/**
 * 合上的精装书。封板比书页宽出一圈，书脊包住订口，封面画贴在前封板上并留出布边。
 * 原点在整本书的几何中心，封面朝 +Z。前封板挂载在 frontPivot 铰链上，支持 3D 物理掀开。
 */
export function buildBoundBook(book, assets) {
  const cloth = themes[book.id].cloth;
  const seal = themes[book.id].seal;
  const weave = assets.cloth || null;
  const fore = foreEdgeMaterial(assets.edges);
  const head = headEdgeMaterial(assets.edges);
  const plain = paperEdgeMaterial();
  const boardW = BOARD_W - SPINE_T;
  const boardX = SPINE_T / 2;
  const pageW = boardW - SQUARE * 2;
  const pageH = BOARD_H - SQUARE * 2;
  const innerPageMat = new THREE.MeshStandardMaterial({
    color: 0xf6ebd6,
    normalMap: assets.paperNormal || null,
    normalScale: new THREE.Vector2(0.18, 0.18),
    roughness: 0.9,
    metalness: 0,
  });
  const block = new THREE.Mesh(
    new THREE.BoxGeometry(pageW, pageH, BLOCK_D),
    [fore, plain, head, head, innerPageMat, plain],
  );
  block.position.x = boardX;
  block.castShadow = true;
  block.receiveShadow = true;

  const gilt = new THREE.Mesh(
    new THREE.BoxGeometry(pageW * 0.98, 0.003, BLOCK_D * 0.94),
    new THREE.MeshPhysicalMaterial({
      color: 0xe4c56e,
      metalness: 0.84,
      roughness: 0.26,
      clearcoat: 0.45,
      clearcoatRoughness: 0.22,
      envMapIntensity: 1.05,
    }),
  );
  gilt.position.set(boardX, pageH / 2 + 0.001, 0);

  const boardGeo = new RoundedBoxGeometry(boardW, BOARD_H, BOARD_T, 3, 0.008);
  const boardMat = clothMaterial(cloth, weave);
  const front = new THREE.Mesh(boardGeo, boardMat);
  const back = new THREE.Mesh(boardGeo, boardMat);
  back.position.set(boardX, 0, -(BLOCK_D / 2 + BOARD_T / 2));
  front.castShadow = back.castShadow = true;
  front.receiveShadow = back.receiveShadow = true;

  const spineMat = new THREE.MeshPhysicalMaterial({
    map: spineTexture(book),
    roughness: 0.58,
    metalness: 0,
    sheen: 0.42,
    sheenRoughness: 0.48,
    sheenColor: new THREE.Color(0xfff1d4),
    clearcoat: 0.12,
    clearcoatRoughness: 0.45,
    envMapIntensity: 0.45,
  });
  const spine = new THREE.Mesh(new RoundedBoxGeometry(SPINE_T, BOARD_H, BLOCK_D + BOARD_T * 2, 3, 0.006), spineMat);
  spine.position.x = -BOARD_W / 2 + SPINE_T / 2 + 0.001;
  spine.castShadow = true;
  spine.receiveShadow = true;

  const plateW = BOARD_W * 0.84;
  const plateH = BOARD_H * 0.86;
  const foil = coverFoilMaps(book);
  const coverMat = new THREE.MeshPhysicalMaterial({
    map: coverTexture(book),
    metalnessMap: foil.metalnessMap,
    roughnessMap: foil.roughnessMap,
    normalMap: assets.paperNormal || null,
    normalScale: new THREE.Vector2(0.24, 0.24),
    roughness: 0.78,
    metalness: 0.88,
    clearcoat: 0.26,
    clearcoatRoughness: 0.36,
    sheen: 0.2,
    sheenRoughness: 0.68,
    sheenColor: new THREE.Color(0xfff6e6),
    envMapIntensity: 0.95,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(plateW, plateH, 0.008),
    [plain, plain, plain, plain, coverMat, plain],
  );
  plate.castShadow = false;
  plate.receiveShadow = true;

  const brassMat = new THREE.MeshPhysicalMaterial({
    color: 0xd9b366,
    metalness: 0.86,
    roughness: 0.32,
    clearcoat: 0.35,
    clearcoatRoughness: 0.28,
    envMapIntensity: 1.05,
  });
  // 书脊竹节脊（Raised Bands）
  const spineDepth = BLOCK_D + BOARD_T * 2;
  const raisedBandGeo = new RoundedBoxGeometry(SPINE_T + 0.01, 0.018, spineDepth + 0.008, 2, 0.005);
  const raisedBands = [-0.46, -0.24, 0.24, 0.46].map((y) => {
    const band = new THREE.Mesh(raisedBandGeo, brassMat);
    band.position.set(-BOARD_W / 2 + SPINE_T / 2 + 0.001, y, 0);
    band.castShadow = true;
    band.receiveShadow = true;
    return band;
  });

  // 封面外侧上下黄铜护角
  const cornerGeo = new RoundedBoxGeometry(0.068, 0.068, BOARD_T + 0.01, 2, 0.006);
  const cornerX = boardX + boardW / 2 - 0.028;
  const cornerZ = BLOCK_D / 2 + BOARD_T / 2;
  const cornerTop = new THREE.Mesh(cornerGeo, brassMat);
  const cornerBottom = new THREE.Mesh(cornerGeo, brassMat);

  // 铰链前封板组（绕左侧书脊边缘 3D 掀开，内侧贴星图环衬）
  const hingeX = -BOARD_W / 2 + SPINE_T;
  const hingeZ = BLOCK_D / 2;
  const frontPivot = new THREE.Group();
  frontPivot.position.set(hingeX, 0, hingeZ);
  front.position.set(boardX - hingeX, 0, BOARD_T / 2);
  plate.position.set(boardX - hingeX, 0.012, BOARD_T + 0.005);
  cornerTop.position.set(cornerX - hingeX, BOARD_H / 2 - 0.028, cornerZ - hingeZ);
  cornerBottom.position.set(cornerX - hingeX, -BOARD_H / 2 + 0.028, cornerZ - hingeZ);
  const endpaper = new THREE.Mesh(
    new THREE.PlaneGeometry(boardW - 0.04, BOARD_H - 0.04),
    new THREE.MeshStandardMaterial({ map: endpaperTexture(cloth), roughness: 0.85, metalness: 0.08 }),
  );
  endpaper.position.set(boardX - hingeX, 0, -0.001);
  endpaper.rotation.y = Math.PI;
  frontPivot.add(front, plate, cornerTop, cornerBottom, endpaper);

  const bandMat = new THREE.MeshStandardMaterial({ color: seal, roughness: 0.42, metalness: 0.05 });
  const bandGeo = new THREE.BoxGeometry(0.018, 0.012, BLOCK_D * 0.96);
  const bandTop = new THREE.Mesh(bandGeo, bandMat);
  bandTop.position.set(boardX - pageW / 2 + 0.012, pageH / 2 - 0.001, 0);
  const bandBottom = new THREE.Mesh(bandGeo, bandMat);
  bandBottom.position.set(boardX - pageW / 2 + 0.012, -pageH / 2 + 0.001, 0);

  const mark = ribbon(seal);
  mark.position.set(boardX + 0.12, BOARD_H / 2 - 0.02, 0.012);

  const group = new THREE.Group();
  const core = [block, gilt, frontPivot, back, spine, ...raisedBands, bandTop, bandBottom];
  group.add(...core, mark);
  group.updateMatrixWorld(true);
  const bounds = new THREE.Box3();
  for (const part of core) bounds.expandByObject(part);
  const mid = bounds.getCenter(new THREE.Vector3());
  for (const child of core) child.position.sub(mid);
  mark.position.sub(mid);
  const ribbonBase = { x: mark.position.x, y: mark.position.y, z: mark.position.z };
  const profile = bookProfile(book.id);
  group.scale.set(1, profile.scaleY, profile.scaleZ);
  const size = bounds.getSize(new THREE.Vector3());
  const hit = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  group.add(hit);
  return {
    group,
    hit,
    cover: coverMat,
    spine: spineMat,
    board: boardMat,
    innerPage: innerPageMat,
    frontPivot,
    ribbon: mark,
    ribbonBase,
    profile,
    height: BOARD_H * profile.scaleY,
  };
}
