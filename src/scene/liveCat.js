import * as THREE from "three";

export function createLiveCat(shadowMap) {
  const root = new THREE.Group();
  root.visible = false;

  const furMat = new THREE.MeshPhysicalMaterial({
    color: 0x171824,
    roughness: 0.86,
    metalness: 0,
    sheen: 0.92,
    sheenRoughness: 0.42,
    sheenColor: new THREE.Color(0x6376b0),
    envMapIntensity: 0.65,
  });
  const earInnerMat = new THREE.MeshStandardMaterial({ color: 0x4b2f3d, roughness: 0.9 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xd98b98, roughness: 0.55 });
  const collarMat = new THREE.MeshStandardMaterial({ color: 0x8f2838, roughness: 0.55 });
  const bellMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4cf72,
    metalness: 0.9,
    roughness: 0.22,
    clearcoat: 0.4,
    envMapIntensity: 1.1,
  });
  const eyeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffc440,
    emissive: 0xffa018,
    emissiveIntensity: 0.72,
    roughness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09080d });
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xfffdf6 });
  const whiskerMat = new THREE.MeshBasicMaterial({ color: 0xd8dff2, transparent: true, opacity: 0.55 });

  // 整体缩放基准：让黑猫站在下层书架前缘比例自然、精致（高约 0.34）
  const actor = new THREE.Group();
  root.add(actor);

  // 身体组（原点在双脚着地处 y = 0，身体朝 +Z）
  const body = new THREE.Group();
  body.position.y = 0.145;
  actor.add(body);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.155, 8, 18), furMat);
  torso.rotation.x = Math.PI / 2;
  torso.scale.set(0.95, 1, 0.92);
  torso.castShadow = true;
  torso.receiveShadow = true;
  body.add(torso);

  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.066, 18, 14), furMat);
  chest.position.set(0, 0.012, 0.082);
  chest.scale.set(0.94, 1.02, 0.96);
  chest.castShadow = true;
  body.add(chest);

  const rump = new THREE.Mesh(new THREE.SphereGeometry(0.072, 18, 14), furMat);
  rump.position.set(0, 0.004, -0.082);
  rump.scale.set(0.96, 1.0, 1.0);
  rump.castShadow = true;
  body.add(rump);

  // 项圈与金色小铃铛
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.009, 10, 24), collarMat);
  collar.position.set(0, 0.056, 0.102);
  collar.rotation.x = Math.PI / 2 - 0.35;
  body.add(collar);

  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.015, 14, 10), bellMat);
  bell.position.set(0, 0.036, 0.152);
  body.add(bell);

  // 头部组
  const head = new THREE.Group();
  head.position.set(0, 0.095, 0.128);
  body.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.072, 22, 18), furMat);
  skull.scale.set(1.06, 0.94, 0.98);
  skull.castShadow = true;
  head.add(skull);

  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.028, 14, 12), furMat);
  muzzle.position.set(0, -0.018, 0.056);
  muzzle.scale.set(1.22, 0.78, 0.85);
  head.add(muzzle);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), noseMat);
  nose.position.set(0, -0.01, 0.077);
  nose.scale.set(1.2, 0.85, 0.7);
  head.add(nose);

  // 尖耳朵（独立支点，支持机灵抖动）
  const makeEar = (side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.044, 0.048, 0.006);
    pivot.rotation.z = -side * 0.24;
    pivot.rotation.x = 0.08;
    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.064, 4), furMat);
    outer.position.y = 0.026;
    outer.rotation.y = Math.PI / 4;
    outer.scale.set(1, 1, 0.55);
    outer.castShadow = true;
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.042, 4), earInnerMat);
    inner.position.set(0, 0.022, 0.009);
    inner.rotation.y = Math.PI / 4;
    inner.scale.set(1, 1, 0.35);
    pivot.add(outer, inner);
    head.add(pivot);
    return pivot;
  };
  const earL = makeEar(-1);
  const earR = makeEar(1);

  // 金琥珀大眼 + 竖瞳 + 高光 + 可眨眼皮
  const makeEye = (side) => {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.03, 0.008, 0.061);
    eyeGroup.rotation.y = side * 0.24;
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.017, 16, 12), eyeMat);
    iris.scale.set(1, 1.06, 0.55);
    const pupil = new THREE.Mesh(new THREE.CapsuleGeometry(0.0038, 0.013, 4, 8), pupilMat);
    pupil.position.set(0, 0, 0.008);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 8, 8), glintMat);
    glint.position.set(side * 0.004, 0.005, 0.011);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.0185, 14, 10), furMat);
    lid.scale.set(1.06, 0.05, 0.62);
    lid.position.set(0, 0.014, 0.002);
    eyeGroup.add(iris, pupil, glint, lid);
    head.add(eyeGroup);
    return lid;
  };
  const lidL = makeEye(-1);
  const lidR = makeEye(1);

  // 胡须
  for (const side of [-1, 1]) {
    for (const row of [-0.01, 0, 0.01]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.0005, 0.055, 5), whiskerMat);
      w.position.set(side * 0.048, -0.016 + row * 0.8, 0.062);
      w.rotation.z = Math.PI / 2 - side * (0.12 - row * 12);
      w.rotation.y = -side * 0.28;
      head.add(w);
    }
  }

  // 四条可动关节腿
  const makeLeg = (x, z) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, -0.022, z);
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.088, 6, 12), furMat);
    upper.position.y = -0.056;
    upper.castShadow = true;
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 10), furMat);
    paw.position.set(0, -0.106, 0.012);
    paw.scale.set(0.95, 0.68, 1.28);
    paw.castShadow = true;
    pivot.add(upper, paw);
    body.add(pivot);
    return pivot;
  };
  const legs = {
    fl: makeLeg(-0.036, 0.078),
    fr: makeLeg(0.036, 0.078),
    bl: makeLeg(-0.038, -0.078),
    br: makeLeg(0.038, -0.078),
  };

  // 四节连锁长尾巴（优雅 S 形摆动）
  const tail = [];
  let tailParent = body;
  for (let i = 0; i < 4; i += 1) {
    const segPivot = new THREE.Group();
    if (i === 0) {
      segPivot.position.set(0, 0.032, -0.132);
      segPivot.rotation.x = -0.75;
    } else {
      segPivot.position.set(0, 0.068, 0);
    }
    const r = 0.014 - i * 0.0018;
    const seg = new THREE.Mesh(new THREE.CapsuleGeometry(r, 0.058, 6, 10), furMat);
    seg.position.y = 0.034;
    seg.castShadow = true;
    segPivot.add(seg);
    tailParent.add(segPivot);
    tail.push(segPivot);
    tailParent = segPivot;
  }

  // 隐形点击碰撞盒
  const hit = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.34, 0.42),
    new THREE.MeshBasicMaterial({ visible: false, depthWrite: false }),
  );
  hit.position.set(0, 0.17, 0.02);
  actor.add(hit);

  // 地面接触阴影
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowMap,
    transparent: true,
    depthWrite: false,
    opacity: 0,
  });
  shadowMat.polygonOffset = true;
  shadowMat.polygonOffsetFactor = -2;
  shadowMat.polygonOffsetUnits = -2;
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.24), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.renderOrder = 1;
  shadow.visible = false;

  // 状态机参数
  const LOWER_Y = 0.044;
  const LOWER_Z = 0.215;
  const state = {
    mode: "hidden", // hidden | awakening | jumpingDown | prowling | jumpingUp
    age: 0,
    home: new THREE.Vector3(1.55, 1.64, -0.22),
    jumpFrom: new THREE.Vector3(),
    jumpTo: new THREE.Vector3(),
    walkDir: -1,
    walkPhase: 0,
    actionTimer: 2.8,
    strolling: true,
    blinkTimer: 2.2,
    earTimer: 1.5,
    onArriveUpper: null,
    onLandLower: null,
  };

  root.userData = {
    liveCat: true,
    hit,
    shadow,
    isActive: () => state.mode !== "hidden",
    isBusy: () => state.mode === "awakening" || state.mode === "jumpingDown" || state.mode === "jumpingUp",
    wake(homePos, { onLandLower } = {}) {
      state.home.copy(homePos);
      state.mode = "awakening";
      state.age = 0;
      state.onLandLower = onLandLower || null;
      state.walkDir = -1;
      state.strolling = true;
      state.actionTimer = 3.2;
      root.position.copy(state.home);
      actor.rotation.set(0, -0.35, 0);
      actor.scale.setScalar(0.01);
      root.visible = true;
      shadow.visible = true;
      shadow.position.set(state.home.x, 1.612, state.home.z);
      shadowMat.opacity = 0;
    },
    returnHome({ onArriveUpper } = {}) {
      if (state.mode === "hidden" || state.mode === "jumpingUp") return;
      state.mode = "jumpingUp";
      state.age = 0;
      state.jumpFrom.copy(root.position);
      state.jumpTo.copy(state.home);
      state.onArriveUpper = onArriveUpper || null;
    },
    update(t, dt, pointer, hovered) {
      if (state.mode === "hidden") return;
      state.age += dt;

      // 呼吸与尾巴 S 形摆动
      const breathe = Math.sin(t * 2.8);
      torso.scale.set(0.95 + breathe * 0.018, 1, 0.92 + breathe * 0.02);

      // 眨眼
      state.blinkTimer -= dt;
      let blink = 0;
      if (state.blinkTimer < 0) {
        if (state.blinkTimer > -0.14) {
          blink = Math.sin(((0.14 + state.blinkTimer) / 0.14) * Math.PI);
        } else {
          state.blinkTimer = 2.4 + Math.random() * 3.2;
        }
      }
      const lidScaleY = 0.05 + blink * 1.02;
      lidL.scale.y = lidScaleY;
      lidR.scale.y = lidScaleY;
      lidL.position.y = 0.014 - blink * 0.014;
      lidR.position.y = 0.014 - blink * 0.014;

      // 耳朵机灵微抖
      state.earTimer -= dt;
      let earTwitch = 0;
      if (state.earTimer < 0) {
        if (state.earTimer > -0.22) {
          earTwitch = Math.sin(((0.22 + state.earTimer) / 0.22) * Math.PI * 2) * 0.24;
        } else {
          state.earTimer = 2.0 + Math.random() * 3.5;
        }
      }
      earL.rotation.z = 0.24 + earTwitch;
      earR.rotation.z = -0.24 - earTwitch * 0.4;

      // 尾巴连锁摇摆
      const tailSpeed = state.mode === "prowling" && !state.strolling ? 2.4 : 4.2;
      tail.forEach((seg, idx) => {
        seg.rotation.z = Math.sin(t * tailSpeed - idx * 0.65) * (0.18 + idx * 0.07);
        if (idx === 0) seg.rotation.x = -0.7 + Math.sin(t * 1.7) * 0.12;
        else seg.rotation.x = 0.22 + Math.sin(t * 2.1 - idx * 0.5) * 0.08;
      });

      if (state.mode === "awakening") {
        const p = Math.min(1, state.age / 0.48);
        const pop = 1 - Math.pow(1 - p, 3);
        const crouch = p > 0.55 ? (p - 0.55) / 0.45 : 0;
        actor.scale.set(pop * (1 + crouch * 0.06), pop * (1 - crouch * 0.14), pop * (1 + crouch * 0.06));
        body.position.y = 0.145 - crouch * 0.032;
        body.rotation.x = crouch * 0.22;
        head.rotation.set(-crouch * 0.18, 0, 0);
        shadowMat.opacity = 0.34 * pop;
        if (p >= 1) {
          state.mode = "jumpingDown";
          state.age = 0;
          state.jumpFrom.copy(state.home);
          state.jumpTo.set(Math.min(1.65, state.home.x), LOWER_Y, LOWER_Z);
        }
        return;
      }

      if (state.mode === "jumpingDown") {
        const p = Math.min(1, state.age / 0.82);
        const ease = p * p * (3 - 2 * p);
        const arc = Math.sin(p * Math.PI) * 0.62;
        root.position.lerpVectors(state.jumpFrom, state.jumpTo, ease);
        root.position.y += arc;
        actor.scale.set(1, 1 + Math.sin(p * Math.PI) * 0.08, 1);
        actor.rotation.y = THREE.MathUtils.lerp(-0.35, -Math.PI / 2, ease);
        // 抛物线切线俯仰 + 四肢伸展
        body.position.y = 0.145;
        body.rotation.x = (p - 0.38) * 0.85;
        legs.fl.rotation.x = -0.65 + p * 0.5;
        legs.fr.rotation.x = -0.58 + p * 0.45;
        legs.bl.rotation.x = 0.68 - p * 0.4;
        legs.br.rotation.x = 0.62 - p * 0.35;
        head.rotation.set(-body.rotation.x * 0.6, 0, 0);
        shadow.position.set(root.position.x, LOWER_Y + 0.004, LOWER_Z);
        shadowMat.opacity = p > 0.65 ? ((p - 0.65) / 0.35) * 0.36 : 0;
        if (p >= 1) {
          state.mode = "prowling";
          state.age = 0;
          root.position.copy(state.jumpTo);
          body.rotation.x = 0;
          actor.scale.set(1.08, 0.88, 1.08);
          state.onLandLower?.();
        }
        return;
      }

      if (state.mode === "jumpingUp") {
        const p = Math.min(1, state.age / 0.82);
        const ease = p * p * (3 - 2 * p);
        const arc = Math.sin(p * Math.PI) * 0.78;
        root.position.lerpVectors(state.jumpFrom, state.jumpTo, ease);
        root.position.y += arc;
        actor.rotation.y = THREE.MathUtils.lerp(actor.rotation.y, -0.25, 1 - Math.exp(-8 * dt));
        body.rotation.x = -(1 - p * 1.4) * 0.55;
        legs.fl.rotation.x = -0.7;
        legs.fr.rotation.x = -0.6;
        legs.bl.rotation.x = 0.7;
        legs.br.rotation.x = 0.6;
        const shrink = p > 0.78 ? 1 - (p - 0.78) / 0.22 : 1;
        actor.scale.setScalar(Math.max(0.01, shrink));
        shadowMat.opacity = 0.36 * Math.max(0, 1 - p * 3);
        if (p >= 1) {
          state.mode = "hidden";
          root.visible = false;
          shadow.visible = false;
          state.onArriveUpper?.();
        }
        return;
      }

      // prowling: 在下层木书架前缘优雅踱步 + 停下歪头看你
      actor.scale.lerp(new THREE.Vector3(1, 1, 1), 1 - Math.exp(-10 * dt));
      const isHovered = hovered === root;
      state.actionTimer -= dt;
      if (state.actionTimer <= 0) {
        state.strolling = !state.strolling;
        state.actionTimer = state.strolling ? 2.6 + Math.random() * 2.8 : 2.0 + Math.random() * 2.2;
      }

      const moving = state.strolling && !isHovered;
      if (moving) {
        const speed = 0.34;
        root.position.x += state.walkDir * speed * dt;
        if (root.position.x < -1.92) {
          root.position.x = -1.92;
          state.walkDir = 1;
          state.strolling = false;
          state.actionTimer = 1.6;
        } else if (root.position.x > 1.92) {
          root.position.x = 1.92;
          state.walkDir = -1;
          state.strolling = false;
          state.actionTimer = 1.6;
        }
        state.walkPhase += dt * 7.6;
        const targetYaw = state.walkDir > 0 ? Math.PI / 2 : -Math.PI / 2;
        actor.rotation.y += (targetYaw - actor.rotation.y) * (1 - Math.exp(-8 * dt));
        // 猫咪优雅对角步态
        const stride = Math.sin(state.walkPhase) * 0.48;
        legs.fl.rotation.x = stride;
        legs.br.rotation.x = stride;
        legs.fr.rotation.x = -stride;
        legs.bl.rotation.x = -stride;
        body.position.y = 0.145 + Math.abs(Math.sin(state.walkPhase)) * 0.012;
        body.rotation.x = Math.sin(state.walkPhase * 2) * 0.03;
        head.rotation.x += (0 - head.rotation.x) * (1 - Math.exp(-6 * dt));
        head.rotation.y += (Math.sin(t * 1.4) * 0.14 - head.rotation.y) * (1 - Math.exp(-6 * dt));
        head.rotation.z += (0 - head.rotation.z) * (1 - Math.exp(-6 * dt));
      } else {
        // 停下看镜头/鼠标，轻微歪头
        const faceCamera = state.walkDir > 0 ? 0.55 : -0.55;
        actor.rotation.y += (faceCamera - actor.rotation.y) * (1 - Math.exp(-4.5 * dt));
        for (const leg of Object.values(legs)) {
          leg.rotation.x += (0 - leg.rotation.x) * (1 - Math.exp(-10 * dt));
        }
        body.position.y += (0.142 - body.position.y) * (1 - Math.exp(-8 * dt));
        body.rotation.x += (0 - body.rotation.x) * (1 - Math.exp(-8 * dt));
        const lookX = THREE.MathUtils.clamp((pointer?.x || 0) * 0.45, -0.45, 0.45);
        const lookY = THREE.MathUtils.clamp((pointer?.y || 0) * 0.25, -0.2, 0.28);
        head.rotation.y += (lookX - head.rotation.y) * (1 - Math.exp(-5 * dt));
        head.rotation.x += (-lookY - head.rotation.x) * (1 - Math.exp(-5 * dt));
        head.rotation.z += ((isHovered ? 0.18 : Math.sin(t * 0.9) * 0.08) - head.rotation.z) * (1 - Math.exp(-5 * dt));
      }

      shadow.position.set(root.position.x, LOWER_Y + 0.004, LOWER_Z);
      shadowMat.opacity = 0.36;
    },
  };

  return root;
}
