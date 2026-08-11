"use client";

import { useEffect, useRef } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export default function Segment1Molecule() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    // Molecular nodes with purposeful positioning
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      connections: number[];
      stage: number; // 0=molecule, 1=R&D, 2=scale-up, 3=mfg
    }

    const nodes: Node[] = [];
    for (let i = 0; i < 60; i++) {
      const stage = i % 4;
      const stageX = stage * (W / 4) + W / 8;
      const angle = (i / 15) * Math.PI * 2 + Math.random() * 0.4;
      const radius = 60 + Math.random() * 50;
      nodes.push({
        x: stageX + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 2.5 + Math.random() * 2,
        connections: [],
        stage,
      });
    }

    nodes.forEach((node, i) => {
      const nearby = nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - node.x, n.y - node.y) }))
        .filter(({ j, d }) => j !== i && d < 120)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      nearby.forEach(({ j }) => node.connections.push(j));
    });

    let mouseX = 0.5, mouseY = 0.5;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / W;
      mouseY = (e.clientY - rect.top) / H;
    };
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", setSize);

    // Initial page load entrance (NOT scroll-based)
    const entranceTl = gsap.timeline({ delay: 0.3 });
    entranceTl.fromTo(".seg1-main-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .fromTo(".seg1-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .fromTo(".seg1-process-flow", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");

    // Scroll animation - transition out
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: ".segment1-content",
      },
    });

    // Hero stays visible (0-0.3), then transitions out (0.3-0.5)
    tl.to({}, { duration: 0.3 })
      .to(".seg1-main-title", { opacity: 0, y: -60, duration: 0.2 })
      .to(".seg1-subtitle", { opacity: 0, y: -40, duration: 0.2 }, "-=0.15")
      .to(".seg1-process-flow", { opacity: 0, y: -30, duration: 0.15 }, "-=0.15");

    // Canvas animation loop
    let frame = 0;
    let rafId: number;
    const draw = () => {
      frame++;
      const time = frame * 0.008;

      ctx.clearRect(0, 0, W, H);

      // Update nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Gentle mouse attraction
        const dx = mouseX * W - node.x;
        const dy = mouseY * H - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 200) {
          const force = (1 - dist / 200) * 0.18;
          node.x += dx * force * 0.012;
          node.y += dy * force * 0.012;
        }

        // Boundaries
        const margin = 100;
        if (node.x < margin) node.vx += 0.025;
        if (node.x > W - margin) node.vx -= 0.025;
        if (node.y < margin) node.vy += 0.025;
        if (node.y > H - margin) node.vy -= 0.025;
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Draw connections
        node.connections.forEach((targetIdx) => {
          const target = nodes[targetIdx];
          const d = Math.hypot(target.x - node.x, target.y - node.y);
          const alpha = Math.max(0, 1 - d / 150) * 0.15;
          
          // Color by stage
          const colors = [
            "37,99,235",    // blue - molecule
            "37,99,235",    // blue - R&D
            "167,139,250",  // lavender - scale-up
            "251,113,133",  // coral - mfg
          ];
          const color = colors[node.stage] || colors[0];
          
          ctx.strokeStyle = `rgba(${color},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });

        // Draw node
        const pulse = Math.sin(time + node.x * 0.01) * 0.5 + 0.5;
        const r = node.r * (0.85 + pulse * 0.2);

        // Glow
        const colors = [
          "37,99,235",    // blue
          "37,99,235",
          "167,139,250",  // lavender
          "251,113,133",  // coral
        ];
        const color = colors[node.stage] || colors[0];

        const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
        glowGrad.addColorStop(0, `rgba(${color},${0.3 + pulse * 0.15})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(${color},0.9)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.arc(node.x - r*0.35, node.y - r*0.35, r*0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", setSize);
      tl.scrollTrigger?.kill();
      tl.kill();
      entranceTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full bg-white"
      style={{ height: "150vh" }}
    >
      <div className="segment1-content sticky top-0 w-full h-screen flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="relative z-10 text-center px-8 pointer-events-none max-w-7xl mx-auto">
          <div className="seg1-main-title space-y-6">
            <span className="t-label block">CMCD · Chemplast Sanmar</span>
            <h1 className="t-display leading-tight">
              FROM MOLECULE<br />
              TO MARKET.
            </h1>
            <div className="w-24 h-px mx-auto" style={{ background: "var(--color-blue)" }} />
          </div>
          
          <p className="seg1-subtitle t-body-large mt-10 max-w-3xl mx-auto">
            World-class chemical manufacturing powered by safe, sustainable innovation.<br />
            From R&D to commercial production.
          </p>

          <div className="seg1-process-flow mt-16 flex items-center justify-center gap-4 text-sm font-medium"
               style={{ color: "var(--color-muted)" }}>
            <span style={{ color: "var(--color-blue)" }}>MOLECULE</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ color: "var(--color-blue)" }}>R&D</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ color: "var(--color-lavender)" }}>SCALE-UP</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ color: "var(--color-coral)" }}>MANUFACTURING</span>
          </div>

          {/* Scroll indicator */}
          <div className="seg1-process-flow mt-20 flex flex-col items-center gap-2" style={{ color: "var(--color-muted)" }}>
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
              <path d="M10 5v20m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
