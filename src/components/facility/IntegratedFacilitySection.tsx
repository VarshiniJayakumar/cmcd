"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const STAGES = [
  { id: "rnd", label: "R&D", desc: "Research & Development" },
  { id: "scaleup", label: "Scale-Up", desc: "Pilot Manufacturing" },
  { id: "manufacturing", label: "Manufacturing", desc: "Commercial Production" },
];

export default function IntegratedFacilitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Scroll-controlled facility build animation
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const stage = Math.min(2, Math.floor(self.progress * 3));
        setActiveStage(stage);
      },
    });

    // Render loop
    let rafId: number;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const p = progressRef.current;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
      grad.addColorStop(0, `rgba(79,195,247,${0.03 + p * 0.04})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stage 1: Molecules (0-0.33)
      if (p < 0.33) {
        drawMolecules(ctx, w, h, Math.min(1, p * 3));
      }

      // Stage 2: R&D structures (0.25-0.55)
      if (p > 0.25 && p < 0.66) {
        const stageP = Math.max(0, Math.min(1, (p - 0.25) * 3));
        drawRnD(ctx, w, h, stageP);
      }

      // Stage 3: Manufacturing (0.5-1.0)
      if (p > 0.5) {
        const stageP = Math.max(0, Math.min(1, (p - 0.5) * 2));
        drawManufacturing(ctx, w, h, stageP);
      }

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="facility"
      className="relative"
      style={{ height: "300vh", background: "var(--color-midnight)" }}
    >
      <div className="sticky top-0 h-screen flex flex-col">
        {/* Header */}
        <div className="absolute top-24 left-0 right-0 z-10 px-8 lg:px-16">
          <div className="max-w-[1600px] mx-auto">
            <span className="t-label" style={{ color: "var(--color-cyan)" }}>
              Integrated Facility
            </span>
            <h2 className="t-heading mt-4" style={{ color: "var(--color-white)" }}>
              One Integrated Facility.<br />
              From Development to Delivery.
            </h2>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: "transparent" }}
        />

        {/* Stage controls */}
        <div className="absolute bottom-24 left-0 right-0 z-10 px-8 lg:px-16">
          <div className="max-w-[1600px] mx-auto flex justify-center gap-8">
            {STAGES.map((stage, i) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(i)}
                className="group relative px-8 py-4 transition-all"
                style={{
                  background: activeStage === i ? "rgba(79,195,247,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeStage === i ? "rgba(79,195,247,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "8px",
                }}
              >
                <div className="t-label" style={{ color: activeStage === i ? "var(--color-cyan)" : "var(--color-muted)" }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-muted)", marginTop: "4px" }}>
                  {stage.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function drawMolecules(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  const nodeCount = 12;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 150 * progress;
    const x = w / 2 + Math.cos(angle) * radius;
    const y = h / 2 + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(79,195,247,${progress * 0.8})`;
    ctx.fill();

    // Connect to center
    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2);
    ctx.lineTo(x, y);
    ctx.strokeStyle = `rgba(79,195,247,${progress * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawRnD(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // R&D lab structure
  const centerX = w * 0.3;
  const centerY = h * 0.5;
  const size = 100 * progress;

  ctx.strokeStyle = `rgba(79,195,247,${progress * 0.6})`;
  ctx.fillStyle = `rgba(79,195,247,${progress * 0.1})`;
  ctx.lineWidth = 2;

  ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
  ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size);

  // Process lines
  ctx.beginPath();
  ctx.moveTo(centerX + size / 2, centerY);
  ctx.lineTo(w * 0.7, centerY);
  ctx.stroke();
}

function drawManufacturing(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // Manufacturing facility
  const facilities = [
    { x: 0.2, y: 0.4, s: 80 },
    { x: 0.5, y: 0.3, s: 120 },
    { x: 0.8, y: 0.5, s: 100 },
  ];

  facilities.forEach((fac, i) => {
    const delay = i * 0.2;
    const facProgress = Math.max(0, Math.min(1, (progress - delay) / 0.6));
    
    if (facProgress > 0) {
      const x = w * fac.x;
      const y = h * fac.y;
      const s = fac.s * facProgress;

      ctx.fillStyle = `rgba(79,195,247,${facProgress * 0.15})`;
      ctx.strokeStyle = `rgba(79,195,247,${facProgress * 0.7})`;
      ctx.lineWidth = 2;

      ctx.fillRect(x - s / 2, y - s / 2, s, s * 1.2);
      ctx.strokeRect(x - s / 2, y - s / 2, s, s * 1.2);
    }
  });

  // Connecting infrastructure
  if (progress > 0.4) {
    ctx.strokeStyle = `rgba(79,195,247,${(progress - 0.4) * 1.5 * 0.5})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.5);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.lineTo(w * 0.8, h * 0.5);
    ctx.stroke();
  }
}
