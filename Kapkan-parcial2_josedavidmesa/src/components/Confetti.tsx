import { useEffect, useRef, useState } from 'react';
import { getMission } from '../config/missions';
import { useProgress } from '../context/ProgressContext';

const COLORS = ['#ff3d81', '#ff8a3d', '#ffd23d', '#b6ff3d', '#00e0ff', '#b14dff'];

// Lluvia de confeti + "+40 pts" cada vez que se completa una misión
const Confetti: React.FC = () => {
  const { lastCompleted } = useProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pop, setPop] = useState<{ key: number; points: number; title: string } | null>(null);

  useEffect(() => {
    if (!lastCompleted) return;
    const mission = getMission(lastCompleted.id);
    setPop({ key: lastCompleted.at, points: mission.points, title: mission.title });
    const hide = window.setTimeout(() => setPop(null), 2500);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return () => window.clearTimeout(hide);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const W = window.innerWidth;
    const H = window.innerHeight;
    const parts = Array.from({ length: 160 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 80,
      y: H * 0.42,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 15 - 5,
      size: Math.random() * 7 + 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      circle: Math.random() < 0.3,
    }));

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.vy += 0.38;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - t / 2600);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.circle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }
      if (t < 2700) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hide);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [lastCompleted]);

  return (
    <>
      <canvas ref={canvasRef} className="confetti-canvas" />
      {pop && (
        <div className="reward-pop" key={pop.key}>
          <div className="pts">+{pop.points}</div>
          <div className="txt">¡{pop.title} completada!</div>
        </div>
      )}
    </>
  );
};

export default Confetti;
