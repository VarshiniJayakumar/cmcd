"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const STAGES = [
  { id: "molecule", label: "MOLECULE", title: "Chemistry at Scale", desc: "Advanced molecular research and chemistry development" },
  { id: "rnd", label: "R&D", title: "Research & Development", desc: "Laboratory-scale synthesis and process optimization" },
  { id: "scaleup", label: "SCALE-UP", title: "Pilot Manufacturing", desc: "Transitioning from lab to commercial production" },
  { id: "manufacturing", label: "MANUFACTURING", title: "Commercial Production", desc: "Full-scale manufacturing with consistent quality" },
  { id: "facility", label: "INTEGRATED FACILITY", title: "End-to-End Capability", desc: "Complete ecosystem from development to delivery" },
];

export default function TransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    initGSAP();
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: ".transformation-canvas-container",
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const stage = Math.min(4, Math.floor(self.progress * 5));
        setCurrentStage(stage);
      },
    });

    window.addEventListener("resize", setSize);

    let rafId: number;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const p = progressRef.current;

      ctx.clearRect(0, 0, w, h);

      // Background gradient based on progress
      const grad = ctx.createLinearGradient(0, 0, w, h);
      if (p < 0.2) {
        grad.addColorStop(0, `rgba(37, 99, 235, ${0.03})`);
        grad.addColorStop(1, "transparent");
      } else if (p < 0.6) {
        grad.addColorStop(0, `rgba(167, 139, 250, ${0.05})`);
        grad.addColorStop(1, `rgba(37, 99, 235, ${0.02})`);
      } else {
        grad.addColorStop(0, `rgba(16, 185, 129, ${0.03})`);
        grad.addColorStop(1, `rgba(37, 99, 235, ${0.03})`);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stage-specific visuals
      if (p < 0.2) {
        drawMolecules(ctx, w, h, p * 5);
      } else if (p < 0.4) {
        drawRnD(ctx, w, h, (p - 0.2) * 5);
      } else if (p < 0.6) {
        drawScaleUp(ctx, w, h, (p - 0.4) * 5);
      } else if (p < 0.8) {
        drawManufacturing(ctx, w, h, (p - 0.6) * 5);
      } else {
        drawIntegratedFacility(ctx, w, h, (p - 0.8) * 5);
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
      className="relative"
      style={{ height: "500vh", background: "var(--color-off-white)" }}
    >
      <div className="transformation-canvas-container sticky top-0 h-screen">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Stage info overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-center px-8" style={{ maxWidth: "800px" }}>
            <div className="t-label mb-4">{STAGES[currentStage].label}</div>
            <h2 className="t-heading mb-6">{STAGES[currentStage].title}</h2>
            <p className="t-body">{STAGES[currentStage].desc}</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === currentStage ? "48px" : "24px",
                background: i === currentStage ? "var(--color-blue)" : "rgba(0,0,0,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function drawMolecules(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  const nodeCount = 20;
  const centerX = w / 2;
  const centerY = h / 2;

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 120 + Math.sin(angle * 3) * 40;
    const x = centerX + Math.cos(angle) * radius * progress;
    const y = centerY + Math.sin(angle) * radius * progress;

    // Connection to center
    ctx.strokeStyle = `rgba(37, 99, 235, ${progress * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Node
    ctx.fillStyle = `rgba(37, 99, 235, ${progress * 0.8})`;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Glow
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 16);
    grad.addColorStop(0, `rgba(37, 99, 235, ${progress * 0.3})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRnD(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // Lab structures
  const structures = [
    { x: 0.3, y: 0.4, size: 80 },
    { x: 0.5, y: 0.3, size: 100 },
    { x: 0.7, y: 0.45, size: 70 },
  ];

  structures.forEach((str, i) => {
    const delay = i * 0.2;
    const p = Math.max(0, Math.min(1, (progress - delay) * 2));
    
    if (p > 0) {
      const x = w * str.x;
      const y = h * str.y;
      const s = str.size * p;

      ctx.strokeStyle = `rgba(167, 139, 250, ${p * 0.6})`;
      ctx.fillStyle = `rgba(167, 139, 250, ${p * 0.1})`;
      ctx.lineWidth = 2;

      // Structure
      ctx.fillRect(x - s/2, y - s/2, s, s);
      ctx.strokeRect(x - s/2, y - s/2, s, s);

      // Internal grid
      ctx.strokeStyle = `rgba(167, 139, 250, ${p * 0.3})`;
      ctx.lineWidth = 1;
      for (let j = 1; j < 3; j++) {
        ctx.beginPath();
        ctx.moveTo(x - s/2 + (s/3) * j, y - s/2);
        ctx.lineTo(x - s/2 + (s/3) * j, y + s/2);
        ctx.stroke();
      }
    }
  });

  // Connecting lines
  if (progress > 0.5) {
    ctx.strokeStyle = `rgba(167, 139, 250, ${(progress - 0.5) * 2 * 0.4})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.4);
    ctx.lineTo(w * 0.5, h * 0.3);
    ctx.lineTo(w * 0.7, h * 0.45);
    ctx.stroke();
  }
}

function drawScaleUp(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // Larger vessels
  const vessels = [
    { x: 0.25, y: 0.5, size: 120 },
    { x: 0.5, y: 0.45, size: 150 },
    { x: 0.75, y: 0.55, size: 130 },
  ];

  vessels.forEach((vessel, i) => {
    const delay = i * 0.15;
    const p = Math.max(0, Math.min(1, (progress - delay) * 1.5));
    
    if (p > 0) {
      const x = w * vessel.x;
      const y = h * vessel.y;
      const s = vessel.size * p;

      // Vessel
      ctx.fillStyle = `rgba(37, 99, 235, ${p * 0.08})`;
      ctx.strokeStyle = `rgba(37, 99, 235, ${p * 0.6})`;
      ctx.lineWidth = 2.5;
      
      ctx.fillRect(x - s/2, y - s/2, s, s * 1.3);
      ctx.strokeRect(x - s/2, y - s/2, s, s * 1.3);

      // Level indicator
      ctx.fillStyle = `rgba(37, 99, 235, ${p * 0.2})`;
      ctx.fillRect(x - s/2, y + s * 0.1, s, s * 0.4);
    }
  });

  // Pipes
  if (progress > 0.4) {
    ctx.strokeStyle = `rgba(37, 99, 235, ${(progress - 0.4) * 1.5 * 0.5})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.25 + 60, h * 0.5);
    ctx.lineTo(w * 0.5 - 75, h * 0.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.5 + 75, h * 0.45);
    ctx.lineTo(w * 0.75 - 65, h * 0.55);
    ctx.stroke();
  }
}

function drawManufacturing(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // Manufacturing units
  const units = [
    { x: 0.2, y: 0.35, w: 100, h: 140 },
    { x: 0.4, y: 0.25, w: 130, h: 180 },
    { x: 0.6, y: 0.3, w: 110, h: 160 },
    { x: 0.8, y: 0.4, w: 95, h: 130 },
  ];

  units.forEach((unit, i) => {
    const delay = i * 0.1;
    const p = Math.max(0, Math.min(1, (progress - delay) * 1.3));
    
    if (p > 0) {
      const x = w * unit.x;
      const y = h * unit.y;
      const uw = unit.w * p;
      const uh = unit.h * p;

      ctx.fillStyle = `rgba(16, 185, 129, ${p * 0.08})`;
      ctx.strokeStyle = `rgba(16, 185, 129, ${p * 0.7})`;
      ctx.lineWidth = 2;
      
      ctx.fillRect(x - uw/2, y + h * 0.5 - uh, uw, uh);
      ctx.strokeRect(x - uw/2, y + h * 0.5 - uh, uw, uh);
    }
  });

  // Infrastructure grid
  if (progress > 0.5) {
    ctx.strokeStyle = `rgba(16, 185, 129, ${(progress - 0.5) * 2 * 0.3})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 10]);
    
    ctx.beginPath();
    ctx.moveTo(0, h * 0.85);
    ctx.lineTo(w, h * 0.85);
    ctx.stroke();
    
    ctx.setLineDash([]);
  }
}

function drawIntegratedFacility(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // Complete facility layout
  const facility = [
    { x: 0.15, y: 0.45, w: 80, h: 120, label: "R&D" },
    { x: 0.35, y: 0.35, w: 100, h: 160, label: "Pilot" },
    { x: 0.55, y: 0.3, w: 120, h: 190, label: "Mfg 1" },
    { x: 0.75, y: 0.4, w: 110, h: 150, label: "Mfg 2" },
  ];

  facility.forEach((bldg, i) => {
    const delay = i * 0.08;
    const p = Math.max(0, Math.min(1, (progress - delay) * 1.2));
    
    if (p > 0) {
      const x = w * bldg.x;
      const baseY = h * 0.8;
      const bw = bldg.w * p;
      const bh = bldg.h * p;

      ctx.fillStyle = `rgba(37, 99, 235, ${p * 0.12})`;
      ctx.strokeStyle = `rgba(37, 99, 235, ${p * 0.8})`;
      ctx.lineWidth = 2.5;
      
      ctx.fillRect(x - bw/2, baseY - bh, bw, bh);
      ctx.strokeRect(x - bw/2, baseY - bh, bw, bh);

      // Label
      if (progress > 0.7) {
        ctx.fillStyle = `rgba(0, 0, 0, ${(progress - 0.7) * 3 * 0.6})`;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(bldg.label, x, baseY - bh - 10);
      }
    }
  });

  // Connecting infrastructure
  if (progress > 0.3) {
    ctx.strokeStyle = `rgba(37, 99, 235, ${(progress - 0.3) * 1.4 * 0.5})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.8);
    ctx.lineTo(w * 0.9, h * 0.8);
    ctx.stroke();
  }
}
