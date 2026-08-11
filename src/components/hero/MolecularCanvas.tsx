"use client";

import { useEffect, useRef } from "react";
import { initGSAP, ScrollTrigger } from "@/lib/gsap";

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  connections: number[];
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  pathIndex: number;
}

interface Props {
  sectionRef: React.RefObject<HTMLElement | null>;
}

export default function MolecularCanvas({ sectionRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let W = 0;
    let H = 0;

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

    // Create molecular network
    const nodes: Node[] = [];
    const nodeCount = 40;
    const centerX = W / 2;
    const centerY = H / 2;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 100 + Math.random() * 180;
      const cluster = Math.floor(Math.random() * 4);
      const clusterOffset = cluster * Math.PI * 0.5;
      
      nodes.push({
        id: i,
        x: centerX + Math.cos(angle + clusterOffset) * radius + (Math.random() - 0.5) * 60,
        y: centerY + Math.sin(angle + clusterOffset) * radius + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 3 + Math.random() * 3,
        connections: [],
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const distances = nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - node.x, n.y - node.y) }))
        .filter(({ j }) => j !== i && j > i)
        .sort((a, b) => a.d - b.d);

      const maxConnections = 2 + Math.floor(Math.random() * 2);
      for (let k = 0; k < Math.min(maxConnections, distances.length); k++) {
        if (distances[k].d < 150) {
          node.connections.push(distances[k].j);
        }
      }
    });

    // Particles
    const particles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      const nodeA = nodes[Math.floor(Math.random() * nodes.length)];
      if (nodeA.connections.length > 0) {
        const connIdx = Math.floor(Math.random() * nodeA.connections.length);
        const nodeB = nodes[nodeA.connections[connIdx]];
        particles.push({
          x: nodeA.x,
          y: nodeA.y,
          targetX: nodeB.x,
          targetY: nodeB.y,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.005,
          pathIndex: nodeA.id * 1000 + nodeA.connections[connIdx],
        });
      }
    }

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Scroll tracking
    initGSAP();
    if (sectionRef.current) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    }

    window.addEventListener("resize", setSize);

    // Animation loop
    let frame = 0;
    const draw = () => {
      frame++;
      const time = frame * 0.01;
      const scrollProgress = progressRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, W, H);

      // Update node positions
      nodes.forEach((node) => {
        // Organic drift
        node.x += node.vx * (1 - scrollProgress * 0.7);
        node.y += node.vy * (1 - scrollProgress * 0.7);

        // Mouse attraction
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            const force = (1 - dist / 150) * 0.5;
            node.x += dx * force * 0.02;
            node.y += dy * force * 0.02;
          }
        }

        // Boundary constraints
        const margin = 50;
        if (node.x < margin) node.vx += 0.05;
        if (node.x > W - margin) node.vx -= 0.05;
        if (node.y < margin) node.vy += 0.05;
        if (node.y > H - margin) node.vy -= 0.05;

        node.vx *= 0.98;
        node.vy *= 0.98;
      });

      // Draw connections
      nodes.forEach((node) => {
        node.connections.forEach((targetId) => {
          const target = nodes[targetId];
          if (!target) return;

          const dist = Math.hypot(target.x - node.x, target.y - node.y);
          const alpha = Math.max(0, Math.min(1, 1 - dist / 200)) * 0.3;

          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 1 + scrollProgress * 0.5;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time + node.id) * 0.5 + 0.5;
        const baseR = node.r * (0.9 + pulse * 0.2);

        // Glow
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, baseR * 4);
        grad.addColorStop(0, `rgba(37, 99, 235, ${0.2 + pulse * 0.2})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, baseR * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(37, 99, 235, ${0.8 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, baseR, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        const highlightGrad = ctx.createRadialGradient(
          node.x - baseR * 0.3,
          node.y - baseR * 0.3,
          0,
          node.x,
          node.y,
          baseR
        );
        highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
        highlightGrad.addColorStop(1, "transparent");
        ctx.fillStyle = highlightGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, baseR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw particles
      particles.forEach((p) => {
        p.progress += p.speed;

        if (p.progress >= 1) {
          // Find new path
          const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
          if (sourceNode.connections.length > 0) {
            const connIdx = Math.floor(Math.random() * sourceNode.connections.length);
            const targetNode = nodes[sourceNode.connections[connIdx]];
            p.x = sourceNode.x;
            p.y = sourceNode.y;
            p.targetX = targetNode.x;
            p.targetY = targetNode.y;
            p.progress = 0;
          }
        }

        // Interpolate position
        const t = p.progress;
        const currentX = p.x + (p.targetX - p.x) * t;
        const currentY = p.y + (p.targetY - p.y) * t;

        // Draw particle
        const alpha = Math.sin(t * Math.PI) * 0.8;
        ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Trail
        if (t > 0.05) {
          const prevT = Math.max(0, t - 0.05);
          const prevX = p.x + (p.targetX - p.x) * prevT;
          const prevY = p.y + (p.targetY - p.y) * prevT;
          
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        }
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", setSize);
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
