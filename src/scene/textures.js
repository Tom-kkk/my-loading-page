import * as THREE from "three";

function makeTex(draw, w, h, { color = true, repeat = null } = {}) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = 8;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return tex;
}

export function createOriginalTextures() {
  // 1. 原创暖胡桃木实木纹理（色彩 + 凹凸）
  const woodMap = makeTex((g, w, h) => {
    const base = g.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, "#d8a872");
    base.addColorStop(0.5, "#be864e");
    base.addColorStop(1, "#9c6634");
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);

    let seed = 41;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 160; i += 1) {
      const y = rand() * h;
      const amp = 4 + rand() * 14;
      const dark = i % 3 !== 0;
      g.strokeStyle = dark
        ? `rgba(74, 40, 14, ${0.06 + rand() * 0.11})`
        : `rgba(255, 226, 182, ${0.04 + rand() * 0.06})`;
      g.lineWidth = 0.8 + rand() * 2.2;
      g.beginPath();
      g.moveTo(0, y);
      g.bezierCurveTo(w * 0.3, y + amp, w * 0.7, y - amp * 0.8, w, y + (rand() - 0.5) * 8);
      g.stroke();
    }
    // 细微木孔纤维
    for (let i = 0; i < 650; i += 1) {
      g.fillStyle = `rgba(62, 32, 10, ${0.04 + rand() * 0.06})`;
      g.fillRect(rand() * w, rand() * h, 6 + rand() * 18, 1);
    }
  }, 512, 256, { repeat: [2.4, 1] });

  const woodBump = makeTex((g, w, h) => {
    g.fillStyle = "#808080";
    g.fillRect(0, 0, w, h);
    let seed = 41;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 140; i += 1) {
      const y = rand() * h;
      const amp = 4 + rand() * 14;
      const v = i % 2 === 0 ? 96 : 162;
      g.strokeStyle = `rgba(${v}, ${v}, ${v}, 0.25)`;
      g.lineWidth = 1 + rand() * 2;
      g.beginPath();
      g.moveTo(0, y);
      g.bezierCurveTo(w * 0.3, y + amp, w * 0.7, y - amp * 0.8, w, y);
      g.stroke();
    }
  }, 256, 128, { color: false, repeat: [2.4, 1] });

  // 2. 原创精装书亚麻布编织纹理
  const clothMap = makeTex((g, w, h) => {
    g.fillStyle = "#dcdcdc";
    g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 3) {
      g.fillStyle = y % 6 === 0 ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)";
      g.fillRect(0, y, w, 1.4);
    }
    for (let x = 0; x < w; x += 3) {
      g.fillStyle = x % 6 === 0 ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.1)";
      g.fillRect(x, 0, 1.4, h);
    }
  }, 128, 128, { repeat: [4, 5] });

  // 3. 原创密排书口纸页纹
  const edgeMap = makeTex((g, w, h) => {
    g.fillStyle = "#f4ead4";
    g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 3) {
      const shade = 216 + ((y * 17) % 26);
      g.fillStyle = `rgb(${shade}, ${shade - 12}, ${shade - 32})`;
      g.fillRect(0, y, w, 1.2);
    }
  }, 64, 256, { repeat: [1, 1] });

  // 4. 原创细颗粒手工纸凹凸贴图
  const paperBump = makeTex((g, w, h) => {
    g.fillStyle = "#808080";
    g.fillRect(0, 0, w, h);
    let seed = 73;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 2400; i += 1) {
      const v = rand() > 0.5 ? 160 : 102;
      g.fillStyle = `rgba(${v}, ${v}, ${v}, 0.22)`;
      g.fillRect(rand() * w, rand() * h, 1.5, 1.5);
    }
  }, 256, 256, { color: false, repeat: [2, 2] });

  return {
    woodMap,
    woodBump,
    clothMap,
    edgeMap,
    paperBump,
    dispose() {
      woodMap.dispose();
      woodBump.dispose();
      clothMap.dispose();
      edgeMap.dispose();
      paperBump.dispose();
    },
  };
}
