"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

interface WorldState {
  progress: number;
  stage: number;
  mouseX: number;
  mouseY: number;
}

export default function CMCDWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<WorldState>({
    progress: 0,
    stage: 0,
    mouseX: 0.5,
    mouseY: 0.5,
  });
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  useEffect(() => {
    initGSAP();
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let rafId: number;

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    // Molecular network data
    interface Node {
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      connections: number[];
      type: string;
    }

    interface Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      nodeA: number;
      nodeB: number;
    }

    const nodes: Node[] = [];
    const particles: Particle[] = [];
    const nodeCount = 60;

    // Create molecular network
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.5;
      const ring = Math.floor(i / 15);
      const radius = 150 + ring * 120 + Math.random() * 60;
      
      nodes.push({
        id: i,
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 2 + Math.random() * 4,
        connections: [],
        type: i % 5 === 0 ? "primary" : "secondary",
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const nearby = nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - node.x, n.y - node.y) }))
        .filter(({ j, d }) => j !== i && d < 180)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);

      nearby.forEach(({ j }) => {
        if (!node.connections.includes(j) && !nodes[j].connections.includes(i)) {
          node.connections.push(j);
        }
      });
    });

    // Create particles
    for (let i = 0; i < 40; i++) {
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      if (node.connections.length > 0) {
        const targetId = node.connections[Math.floor(Math.random() * node.connections.length)];
        const target = nodes[targetId];
        particles.push({
          x: node.x,
          y: node.y,
          targetX: target.x,
          targetY: target.y,
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.004,
          nodeA: node.id,
          nodeB: targetId,
        });
      }
    }

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouseX = (e.clientX - rect.left) / W;
      stateRef.current.mouseY = (e.clientY - rect.top) / H;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", setSize);

    // Master scroll timeline
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        stateRef.current.progress = self.progress;
        stateRef.current.stage = Math.min(6, Math.floor(self.progress * 7));
      },
    });

    // Animation loop
    let frame = 0;
    const draw = () => {
      frame++;
      const time = frame * 0.008;
      const { progress, stage, mouseX, mouseY } = stateRef.current;

      ctx.clearRect(0, 0, W, H);

      // Background gradient based on stage
      let bgColor1 = "rgba(255,255,255,0)";
      let bgColor2 = "rgba(255,255,255,0)";
      
      if (stage === 0) {
        bgColor1 = "rgba(37,99,235,0.02)";
        bgColor2 = "rgba(59,130,246,0.05)";
      } else if (stage === 1 || stage === 2) {
        bgColor1 = "rgba(167,139,250,0.03)";
        bgColor2 = "rgba(139,92,246,0.06)";
      } else if (stage >= 3) {
        bgColor1 = "rgba(251,113,133,0.02)";
        bgColor2 = "rgba(249,115,22,0.04)";
      }

      const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) / 1.5);
      grad.addColorStop(0, bgColor1);
      grad.addColorStop(1, bgColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Transform molecular network based on progress
      const organizationFactor = Math.min(1, progress * 1.5);
      const scaleFactor = 1 + progress * 2;

      nodes.forEach((node, i) => {
        // Organic drift decreases as we organize
        if (progress < 0.7) {
          node.x += node.vx * (1 - organizationFactor);
          node.y += node.vy * (1 - organizationFactor);

          // Mouse attraction
          const dx = mouseX * W - node.x;
          const dy = mouseY * H - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 200) {
            const force = (1 - dist / 200) * 0.3;
            node.x += dx * force * 0.02;
            node.y += dy * force * 0.02;
          }

          // Boundaries
          const margin = 100;
          if (node.x < margin) node.vx += 0.05;
          if (node.x > W - margin) node.vx -= 0.05;
          if (node.y < margin) node.vy += 0.05;
          if (node.y > H - margin) node.vy -= 0.05;

          node.vx *= 0.98;
          node.vy *= 0.98;
        }

        // Draw connections
        node.connections.forEach((targetId) => {
          const target = nodes[targetId];
          if (!target) return;

          const dist = Math.hypot(target.x - node.x, target.y - node.y);
          let alpha = Math.max(0, 1 - dist / 250) * 0.3;

          // Connection color based on stage
          let color = "37,99,235"; // blue
          if (stage === 1 || stage === 2) color = "167,139,250"; // lavender
          if (stage >= 3) color = "251,113,133"; // coral

          // Thicker connections as we progress
          ctx.strokeStyle = `rgba(${color},${alpha})`;
          ctx.lineWidth = 0.5 + progress * 1.5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time + node.id * 0.3) * 0.5 + 0.5;
        const baseR = node.r * (0.9 + pulse * 0.2) * scaleFactor;

        // Color based on stage
        let nodeColor = "37,99,235";
        if (stage === 1 || stage === 2) nodeColor = "167,139,250";
        if (stage >= 3) nodeColor = "251,113,133";

        // Glow
        const glowSize = node.type === "primary" ? baseR * 5 : baseR * 3;
        const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
        glowGrad.addColorStop(0, `rgba(${nodeColor},${0.3 + pulse * 0.2})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(${nodeColor},${0.9})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, baseR, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        const highlightGrad = ctx.createRadialGradient(
          node.x - baseR * 0.4,
          node.y - baseR * 0.4,
          0,
          node.x,
          node.y,
          baseR
        );
        highlightGrad.addColorStop(0, "rgba(255,255,255,0.8)");
        highlightGrad.addColorStop(1, "transparent");
        ctx.fillStyle = highlightGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, baseR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.progress += p.speed;

        if (p.progress >= 1) {
          // Find new path
          const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
          if (sourceNode.connections.length > 0) {
            const targetId = sourceNode.connections[Math.floor(Math.random() * sourceNode.connections.length)];
            const targetNode = nodes[targetId];
            p.x = sourceNode.x;
            p.y = sourceNode.y;
            p.targetX = targetNode.x;
            p.targetY = targetNode.y;
            p.progress = 0;
            p.nodeA = sourceNode.id;
            p.nodeB = targetId;
          }
        }

        const t = p.progress;
        const currentX = p.x + (p.targetX - p.x) * t;
        const currentY = p.y + (p.targetY - p.y) * t;

        const alpha = Math.sin(t * Math.PI) * 0.9;
        
        let pColor = "37,99,235";
        if (stage === 1 || stage === 2) pColor = "167,139,250";
        if (stage >= 3) pColor = "251,113,133";

        // Particle glow
        const pGlow = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
        pGlow.addColorStop(0, `rgba(${pColor},${alpha})`);
        pGlow.addColorStop(1, "transparent");
        ctx.fillStyle = pGlow;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Particle core
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw facility elements at later stages
      if (progress > 0.5) {
        drawFacilityElements(ctx, W, H, progress, stage);
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="cmcd-world-container relative w-full"
      style={{ height: "700vh" }}
    >
      {/* Canvas world */}
      <div className="sticky top-0 w-full h-screen">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Text overlays */}
        <CMCDWorldText />

        {/* Facility hotspots */}
        <FacilityHotspots onHover={setHoveredArea} hoveredArea={hoveredArea} />
      </div>
    </div>
  );
}

function drawFacilityElements(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
  stage: number
) {
  const facilityProgress = Math.max(0, (progress - 0.5) * 2);

  // Draw industrial structures
  const structures = [
    { x: 0.2, y: 0.6, width: 60, height: 180, label: "R&D" },
    { x: 0.4, y: 0.55, width: 80, height: 220, label: "Pilot" },
    { x: 0.6, y: 0.5, width: 100, height: 280, label: "Mfg" },
    { x: 0.8, y: 0.58, width: 70, height: 200, label: "Quality" },
  ];

  structures.forEach((str, i) => {
    const delay = i * 0.1;
    const p = Math.max(0, Math.min(1, (facilityProgress - delay) * 2));

    if (p > 0) {
      const x = w * str.x;
      const baseY = h * 0.85;
      const structW = str.width * p;
      const structH = str.height * p;

      // Structure body
      ctx.fillStyle = `rgba(251,113,133,${p * 0.12})`;
      ctx.strokeStyle = `rgba(251,113,133,${p * 0.7})`;
      ctx.lineWidth = 2;
      ctx.fillRect(x - structW / 2, baseY - structH, structW, structH);
      ctx.strokeRect(x - structW / 2, baseY - structH, structW, structH);

      // Windows/details
      if (p > 0.5) {
        const floors = Math.floor(structH / 30);
        ctx.fillStyle = `rgba(251,113,133,${(p - 0.5) * 2 * 0.3})`;
        for (let f = 0; f < floors; f++) {
          const fy = baseY - structH + f * 30 + 10;
          ctx.fillRect(x - structW / 2 + 10, fy, structW - 20, 8);
        }
      }
    }
  });

  // Connecting pipes
  if (facilityProgress > 0.4) {
    ctx.strokeStyle = `rgba(251,113,133,${(facilityProgress - 0.4) * 1.5 * 0.5})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.7);
    ctx.lineTo(w * 0.4, h * 0.68);
    ctx.lineTo(w * 0.6, h * 0.65);
    ctx.lineTo(w * 0.8, h * 0.7);
    ctx.stroke();
  }
}

function CMCDWorldText() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    initGSAP();

    // Animate text based on scroll stages
    const stages = [
      { start: 0, end: 0.15, title: "FROM MOLECULE\nTO MARKET.", subtitle: "Advanced chemistry, developed with precision and delivered at scale.", label: "Stage 01 · Molecule" },
      { start: 0.15, end: 0.3, title: "RESEARCH &\nDEVELOPMENT", subtitle: "Laboratory synthesis and process optimization.", label: "Stage 02 · R&D" },
      { start: 0.3, end: 0.5, title: "SCALE-UP", subtitle: "From laboratory chemistry to repeatable production.", label: "Stage 03 · Pilot" },
      { start: 0.5, end: 0.7, title: "COMMERCIAL\nMANUFACTURING", subtitle: "Industrial-scale production with consistent quality.", label: "Stage 04 · Manufacturing" },
      { start: 0.7, end: 0.85, title: "ONE INTEGRATED\nFACILITY", subtitle: "From development to delivery.", label: "Stage 05 · Facility" },
    ];

    stages.forEach((stage, i) => {
      const el = textRefs.current[i];
      if (!el) return;

      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: ".cmcd-world-container",
            start: `${stage.start * 100}% top`,
            end: `${stage.end * 100}% top`,
            scrub: 1,
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  const stages = [
    { title: "FROM MOLECULE\nTO MARKET.", subtitle: "Advanced chemistry, developed with precision and delivered at scale.", label: "Stage 01 · Molecule" },
    { title: "RESEARCH &\nDEVELOPMENT", subtitle: "Laboratory synthesis and process optimization.", label: "Stage 02 · R&D" },
    { title: "SCALE-UP", subtitle: "From laboratory chemistry to repeatable production.", label: "Stage 03 · Pilot" },
    { title: "COMMERCIAL\nMANUFACTURING", subtitle: "Industrial-scale production with consistent quality.", label: "Stage 04 · Manufacturing" },
    { title: "ONE INTEGRATED\nFACILITY", subtitle: "From development to delivery.", label: "Stage 05 · Facility" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stages.map((stage, i) => (
        <div
          key={i}
          ref={(el) => { textRefs.current[i] = el; }}
          className="absolute top-32 left-12 lg:left-20 opacity-0"
        >
          <span className="t-label block mb-4">{stage.label}</span>
          <h1 className="t-display max-w-2xl whitespace-pre-line">
            {stage.title}
          </h1>
          <p className="t-body-large mt-6 max-w-lg">
            {stage.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}

interface HotspotsProps {
  onHover: (area: string | null) => void;
  hoveredArea: string | null;
}

function FacilityHotspots({ onHover, hoveredArea }: HotspotsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none facility-hotspots opacity-0">
      {/* Hotspots will become active at facility stage */}
      <div 
        className="absolute pointer-events-auto cursor-pointer"
        style={{ left: "20%", top: "60%", width: "80px", height: "120px" }}
        onMouseEnter={() => onHover("rnd")}
        onMouseLeave={() => onHover(null)}
      >
        {hoveredArea === "rnd" && (
          <div className="absolute -top-16 left-0 bg-white border border-gray-200 rounded-lg p-4 shadow-xl whitespace-nowrap">
            <div className="font-semibold text-sm">R&D Laboratory</div>
            <div className="text-xs text-gray-600 mt-1">Process development & synthesis</div>
          </div>
        )}
      </div>
    </div>
  );
}
