import { useEffect, useRef } from 'react';

// 与站点调色板保持一致的粒子颜色
const LIGHT_COLORS = [
  '#E11D48', // primary rose
  '#F97316', // secondary orange
  '#4F46E5', // accent indigo
  '#0EA5E9', // sky
  '#10B981', // mint
  '#F59E0B', // amber
  '#EC4899', // pink
  '#8B5CF6', // violet
];

const DARK_COLORS = [
  '#FB7185', // rose lighter
  '#FDBA74', // orange lighter
  '#818CF8', // indigo lighter
  '#38BDF8', // sky lighter
  '#34D399', // mint lighter
  '#FCD34D', // amber lighter
  '#F9A8D4', // pink lighter
  '#C4B5FD', // violet lighter
];

const SPAWN_RATE = 3;
const THROTTLE_MS = 16; // ~60fps

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawStar(ctx, x, y, r, rotation) {
  const points = 5;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points + rotation;
    const radius = i % 2 === 0 ? r : r * 0.4;
    if (i === 0) ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    else ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  }
  ctx.closePath();
}

function drawSparkle(ctx, x, y, r) {
  const arms = 4;
  ctx.beginPath();
  for (let i = 0; i < arms; i++) {
    const angle = (i * Math.PI * 2) / arms;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -200, y: -200 });
  const lastSpawnRef = useRef(0);
  const rafRef = useRef(null);
  const isDarkRef = useRef(false);

  useEffect(() => {
    // 检测 prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 自适应尺寸
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 监测暗色模式
    const darkObserver = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains('dark');
    });
    darkObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    isDarkRef.current = document.documentElement.classList.contains('dark');

    // 鼠标追踪（节流）
    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastSpawnRef.current < THROTTLE_MS) return;
      lastSpawnRef.current = now;

      const colors = isDarkRef.current ? DARK_COLORS : LIGHT_COLORS;
      for (let i = 0; i < SPAWN_RATE; i++) {
        const shape = randomOf(['circle', 'star', 'sparkle']);
        particlesRef.current.push({
          x: e.clientX + randomBetween(-6, 6),
          y: e.clientY + randomBetween(-6, 6),
          vx: randomBetween(-1.2, 1.2),
          vy: randomBetween(-2.0, -0.3), // 向上飘
          life: 0,
          maxLife: randomBetween(0.55, 1),
          shape,
          color: randomOf(colors),
          size: shape === 'circle' ? randomBetween(3, 7) : randomBetween(5, 10),
          rotation: randomBetween(0, Math.PI * 2),
          rotSpeed: randomBetween(-0.08, 0.08),
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      for (const p of particlesRef.current) {
        p.life += 0.022;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.rotation += p.rotSpeed;

        // ease-out 透明度与缩放
        const t = p.life / p.maxLife;
        const opacity = (1 - t) * (1 - t) * 0.85 + 0.05;
        const scale = 1 - t * 0.5;

        ctx.save();
        ctx.globalAlpha = opacity;

        if (p.shape === 'circle') {
          // 柔光晕圈
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * scale * 1.5);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, p.color + '00');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * scale * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * scale * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.size * scale, p.rotation);
          ctx.fillStyle = p.color;
          ctx.fill();
          // 轻微发光
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        } else {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5 * scale;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          drawSparkle(ctx, p.x, p.y, p.size * scale);
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      darkObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
