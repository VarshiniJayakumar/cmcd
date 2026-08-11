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

    // Molecular nodes
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      connections: number[];
    }

    const nodes: Node[] = [];
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2 + Math.random() * 0.3;
      const ring = Math.floor(i / 20);
      const radius = 100 + ring * 90 + Math.random() * 40;
      nodes.push({
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 2 + Math.random() * 2.5,
        connections: [],
      });
    }

    nodes.forEach((node, i) => {
      const nearby = nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - node.x, n.y - node.y) }))
        .filter(({ j, d }) => j !== i && d < 150)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
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

    // Scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: ".segment1-content",
      },
    });

    // Animate text
    tl.fromTo(".seg1-title", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.3 })
      .fromTo(".seg1-subtitle", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1")
      .to(".seg1-title", { opacity: 0, y: -40, duration: 0.3 }, 0.7)
      .to(".seg1-subtitle", { opacity: 0, y: -40, duration: 0.3 }, 0.7);

    // Canvas animation loop
    let frame = 0;
    let rafId: number;
    const draw = () => {
      frame++;
      const time = frame * 0.008;

      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)/2);
      grad.addColorStop(0, "rgba(37,99,235,0.04)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Update nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Mouse attraction
        const dx = mouseX * W - node.x;
        const dy = mouseY * H - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          const force = (1 - dist / 180) * 0.25;
          node.x += dx * force * 0.015;
          node.y += dy * force * 0.015;
        }

        // Boundaries
        const margin = 80;
        if (node.x < margin) node.vx += 0.03;
        if (node.x > W - margin) node.vx -= 0.03;
        if (node.y < margin) node.vy += 0.03;
        if (node.y > H - margin) node.vy -= 0.03;
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Draw connections
        node.connections.forEach((targetIdx) => {
          const target = nodes[targetIdx];
          const d = Math.hypot(target.x - node.x, target.y - node.y);
          const alpha = Math.max(0, 1 - d / 180) * 0.2;
          ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });

        // Draw node
        const pulse = Math.sin(time + node.x * 0.01) * 0.5 + 0.5;
        const r = node.r * (0.9 + pulse * 0.15);

        // Glow
        const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3.5);
        glowGrad.addColorStop(0, `rgba(37,99,235,${0.25 + pulse * 0.15})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = "rgba(37,99,235,0.85)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(node.x - r*0.3, node.y - r*0.3, r*0.5, 0, Math.PI * 2);
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
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="segment-1"
      className="relative w-full bg-white"
      style={{ height: "200vh" }}
    >
      <div className="segment1-content sticky top-0 w-full h-screen flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="relative z-10 text-center px-8 pointer-events-none">
          <div className="seg1-title">
            <span className="t-label block mb-6">Segment 01</span>
            <h1 className="t-display">
              FROM MOLECULE<br />
              TO MARKET.
            </h1>
          </div>
          <p className="seg1-subtitle t-body-large mt-8 max-w-2xl mx-auto">
            Made possible through world-class manufacturing, safe and sustainable by design.
          </p>
        </div>
      </div>
    </section>
  );
}
