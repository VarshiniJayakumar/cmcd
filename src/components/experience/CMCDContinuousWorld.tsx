"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * SEGMENT 1: Molecular Network
 * SEGMENT 2: Architectural Facility Drawing  
 * SEGMENT 3: Integrated Facility with Hotspots
 * SEGMENT 4: About + Numbers (Combined)
 * SEGMENT 5: Contact Form
 */

interface WorldState {
  progress: number;
  segment: number; // 0-4
  mouseX: number;
  mouseY: number;
}

export default function CMCDContinuousWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<WorldState>({ progress: 0, segment: 0, mouseX: 0.5, mouseY: 0.5 });
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]);
  const [hoveredFacilityZone, setHoveredFacilityZone] = useState<string | null>(null);

  useEffect(() => {
    initGSAP();
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, rafId: number;

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

    // Molecular network
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      connections: number[];
    }

    const nodes: Node[] = [];
    for (let i = 0; i < 70; i++) {
      const angle = (i / 70) * Math.PI * 2 + Math.random() * 0.4;
      const ring = Math.floor(i / 18);
      const radius = 120 + ring * 100 + Math.random() * 50;
      nodes.push({
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 2 + Math.random() * 3,
        connections: [],
      });
    }

    nodes.forEach((node, i) => {
      const nearby = nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - node.x, n.y - node.y) }))
        .filter(({ j, d }) => j !== i && d < 160)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      nearby.forEach(({ j }) => node.connections.push(j));
    });

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
        // 5 segments: 0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1.0
        stateRef.current.segment = Math.min(4, Math.floor(self.progress * 5));
      },
    });

    // Animation loop
    let frame = 0;
    const draw = () => {
      frame++;
      const { progress, segment, mouseX, mouseY } = stateRef.current;

      ctx.clearRect(0, 0, W, H);

      // SEGMENT 1: Molecular Network (0-20%)
      if (progress < 0.25) {
        const segProgress = progress / 0.25;
        drawMolecularNetwork(ctx, W, H, nodes, mouseX, mouseY, segProgress, frame);
      }

      // SEGMENT 2: Architectural Drawing (20-40%)
      if (progress >= 0.15 && progress < 0.45) {
        const segProgress = Math.max(0, (progress - 0.2) / 0.2);
        drawArchitecturalFacility(ctx, W, H, segProgress);
      }

      // SEGMENT 3: Integrated Facility (40-60%)
      if (progress >= 0.35 && progress < 0.65) {
        const segProgress = Math.max(0, (progress - 0.4) / 0.2);
        drawIntegratedFacility(ctx, W, H, segProgress, hoveredFacilityZone);
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", setSize);
    };
  }, [hoveredFacilityZone]);

  // Animate numbers in segment 4
  useEffect(() => {
    const metrics = [30, 900, 2, 50, 15, 20];
    
    ScrollTrigger.create({
      trigger: ".segment-4",
      start: "top 70%",
      onEnter: () => {
        metrics.forEach((target, i) => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            delay: i * 0.1,
            ease: "power2.out",
            onUpdate: function() {
              setCounts(prev => {
                const newCounts = [...prev];
                newCounts[i] = Math.floor(this.targets()[0].val);
                return newCounts;
              });
            },
          });
        });
      },
      once: true,
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: "600vh" }}>
      {/* SEGMENTS 1-3: Canvas World */}
      <div className="sticky top-0 w-full h-screen">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-white" />
        <TextOverlays />
        <FacilityHotspots onHover={setHoveredFacilityZone} hoveredZone={hoveredFacilityZone} />
      </div>

      {/* SEGMENT 4: About + Numbers */}
      <AboutAndNumbers counts={counts} />

      {/* SEGMENT 5: Contact */}
      <ContactSegment />
    </div>
  );
}

// Helper functions for canvas drawing
function drawMolecularNetwork(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  nodes: any[],
  mouseX: number,
  mouseY: number,
  progress: number,
  frame: number
) {
  const time = frame * 0.01;

  // Background gradient
  const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/2);
  grad.addColorStop(0, `rgba(37,99,235,${0.03 * progress})`);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Update and draw nodes
  nodes.forEach((node, i) => {
    // Organic drift
    node.x += node.vx * (1 - progress * 0.5);
    node.y += node.vy * (1 - progress * 0.5);

    // Mouse attraction
    const dx = mouseX * w - node.x;
    const dy = mouseY * h - node.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 200) {
      const force = (1 - dist / 200) * 0.3;
      node.x += dx * force * 0.015;
      node.y += dy * force * 0.015;
    }

    // Boundaries
    const margin = 100;
    if (node.x < margin) node.vx += 0.04;
    if (node.x > w - margin) node.vx -= 0.04;
    if (node.y < margin) node.vy += 0.04;
    if (node.y > h - margin) node.vy -= 0.04;
    node.vx *= 0.99;
    node.vy *= 0.99;

    // Draw connections
    node.connections.forEach((targetIdx: number) => {
      const target = nodes[targetIdx];
      if (!target) return;
      const d = Math.hypot(target.x - node.x, target.y - node.y);
      const alpha = Math.max(0, 1 - d / 200) * 0.25 * progress;
      ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    });

    // Draw node
    const pulse = Math.sin(time + i * 0.2) * 0.5 + 0.5;
    const r = node.r * (0.9 + pulse * 0.2);

    // Glow
    const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
    glowGrad.addColorStop(0, `rgba(37,99,235,${(0.3 + pulse * 0.2) * progress})`);
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = `rgba(37,99,235,${0.9 * progress})`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = `rgba(255,255,255,${0.6 * progress})`;
    ctx.beginPath();
    ctx.arc(node.x - r*0.3, node.y - r*0.3, r*0.6, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawArchitecturalFacility(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  // Blueprint-style architectural drawing that animates in
  ctx.strokeStyle = `rgba(167,139,250,${progress * 0.7})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);

  const cx = w * 0.5;
  const cy = h * 0.5;
  const scale = Math.min(w, h) * 0.3 * progress;

  // Foundation
  if (progress > 0) {
    ctx.beginPath();
    ctx.moveTo(cx - scale * 1.5, cy + scale * 0.8);
    ctx.lineTo(cx + scale * 1.5, cy + scale * 0.8);
    ctx.stroke();
  }

  // Main structure outline
  if (progress > 0.2) {
    const p = (progress - 0.2) / 0.8;
    ctx.strokeRect(cx - scale, cy - scale * 0.5, scale * 2, scale * 1.3);
  }

  // Reactor towers
  if (progress > 0.4) {
    const p = (progress - 0.4) / 0.6;
    [0.3, 0.7].forEach(xPos => {
      const x = cx - scale + scale * 2 * xPos;
      const h1 = scale * 0.6 * p;
      ctx.strokeRect(x - 20, cy - scale * 0.5 - h1, 40, h1);
      // Top cap
      ctx.beginPath();
      ctx.arc(x, cy - scale * 0.5 - h1, 20, Math.PI, 0);
      ctx.stroke();
    });
  }

  // Connecting pipes
  if (progress > 0.6) {
    const p = (progress - 0.6) / 0.4;
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(167,139,250,${p * 0.5})`;
    ctx.beginPath();
    ctx.moveTo(cx - scale * 0.4, cy - scale * 0.2);
    ctx.lineTo(cx + scale * 0.4, cy - scale * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - scale * 0.4, cy + scale * 0.2);
    ctx.lineTo(cx + scale * 0.4, cy + scale * 0.2);
    ctx.stroke();
  }

  // Detail grid
  if (progress > 0.8) {
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = `rgba(167,139,250,${(progress - 0.8) * 5 * 0.3})`;
    ctx.setLineDash([2, 4]);
    for (let i = 1; i < 4; i++) {
      const y = cy - scale * 0.5 + (scale * 1.3 * i / 4);
      ctx.beginPath();
      ctx.moveTo(cx - scale, y);
      ctx.lineTo(cx + scale, y);
      ctx.stroke();
    }
  }
}

function drawIntegratedFacility(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, hoveredZone: string | null) {
  // Full facility with distinct R&D, Scale-Up, Manufacturing zones
  const zones = [
    { id: "rnd", x: 0.2, y: 0.6, w: 80, h: 150, label: "R&D", color: "37,99,235" },
    { id: "scaleup", x: 0.45, y: 0.55, w: 100, h: 200, label: "Scale-Up", color: "167,139,250" },
    { id: "mfg", x: 0.7, y: 0.5, w: 120, h: 250, label: "Manufacturing", color: "251,113,133" },
  ];

  zones.forEach((zone, i) => {
    const delay = i * 0.15;
    const zp = Math.max(0, Math.min(1, (progress - delay) * 2));
    
    if (zp > 0) {
      const x = w * zone.x;
      const baseY = h * 0.85;
      const zw = zone.w * zp;
      const zh = zone.h * zp;

      const isHovered = hoveredZone === zone.id;
      const alpha = isHovered ? 0.2 : 0.1;

      // Structure
      ctx.fillStyle = `rgba(${zone.color},${alpha * zp})`;
      ctx.strokeStyle = `rgba(${zone.color},${(isHovered ? 0.9 : 0.6) * zp})`;
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.fillRect(x - zw/2, baseY - zh, zw, zh);
      ctx.strokeRect(x - zw/2, baseY - zh, zw, zh);

      // Label
      if (zp > 0.7) {
        ctx.fillStyle = `rgba(${zone.color},${(zp - 0.7) * 3})`;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(zone.label, x, baseY - zh - 15);
      }
    }
  });

  // Connecting infrastructure
  if (progress > 0.5) {
    const ip = (progress - 0.5) * 2;
    ctx.strokeStyle = `rgba(251,113,133,${ip * 0.4})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.75);
    ctx.lineTo(w * 0.45, h * 0.72);
    ctx.lineTo(w * 0.7, h * 0.7);
    ctx.stroke();
  }
}

function TextOverlays() {
  const overlays = [
    { segment: 0, start: "0%", end: "18%", label: "Segment 01", title: "FROM MOLECULE\nTO MARKET.", subtitle: "Made possible." },
    { segment: 1, start: "20%", end: "38%", label: "Segment 02", title: "CHEMISTRY BUILT ON\nCAPABILITY", subtitle: "Partnership built on trust." },
    { segment: 2, start: "40%", end: "58%", label: "Segment 03", title: "ONE INTEGRATED\nFACILITY", subtitle: "From development to delivery." },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {overlays.map((ov, i) => (
        <div
          key={i}
          className="text-overlay absolute top-24 left-8 lg:left-20 opacity-0"
          data-segment={ov.segment}
          style={{
            animation: `fadeInOut 1s ease-in-out ${i * 2}s forwards`,
          }}
        >
          <span className="t-label block mb-4">{ov.label}</span>
          <h1 className="t-display max-w-2xl whitespace-pre-line">{ov.title}</h1>
          <p className="t-body-large mt-6 max-w-lg">{ov.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

interface HotspotsProps {
  onHover: (zone: string | null) => void;
  hoveredZone: string | null;
}

function FacilityHotspots({ onHover, hoveredZone }: HotspotsProps) {
  const zones = [
    { id: "rnd", left: "20%", top: "50%", label: "R&D Laboratory" },
    { id: "scaleup", left: "45%", top: "45%", label: "Pilot Scale-Up" },
    { id: "mfg", left: "70%", top: "40%", label: "Commercial Manufacturing" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none facility-hotspots">
      {zones.map(zone => (
        <div
          key={zone.id}
          className="absolute pointer-events-auto cursor-pointer"
          style={{ left: zone.left, top: zone.top, width: "100px", height: "180px" }}
          onMouseEnter={() => onHover(zone.id)}
          onMouseLeave={() => onHover(null)}
        >
          {hoveredZone === zone.id && (
            <div className="absolute -top-12 left-0 bg-white border border-blue-200 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap z-10">
              <div className="font-semibold text-sm text-black">{zone.label}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AboutAndNumbers({ counts }: { counts: number[] }) {
  const metrics = [
    { val: counts[0], suffix: "+", label: "Years of Experience" },
    { val: counts[1], suffix: " m³", label: "Reactor Capacity" },
    { val: counts[2], suffix: "", label: "Manufacturing Sites" },
    { val: counts[3], suffix: "+", label: "Process Chemists" },
    { val: counts[4], suffix: "+", label: "Global Customers" },
    { val: counts[5], suffix: "+", label: "Countries Served" },
  ];

  return (
    <section className="segment-4 relative w-full min-h-screen flex items-center bg-white" style={{ padding: "8rem 0" }}>
      <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-20">
        <div className="grid lg:grid-cols-[45%_55%] gap-20">
          {/* LEFT: About */}
          <div className="space-y-8">
            <span className="t-label">About CMCD</span>
            <h2 className="t-heading">Chemistry Built on Capability,<br />Partnership Built on Trust.</h2>
            <div className="w-16 h-px bg-blue-600" />
            <p className="t-body-large">
              CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and Specialty Chemicals sectors, 
              providing end-to-end capabilities across development, scale-up and commercial manufacturing.
            </p>
            <div className="space-y-4">
              <Point text="Integrated Berigai facility near Bengaluru" />
              <Point text="R&D, pilot and commercial manufacturing co-located" />
              <Point text="900 m³ reactor capacity with hazardous chemistry expertise" />
            </div>
          </div>

          {/* RIGHT: Numbers */}
          <div className="space-y-8">
            <span className="t-label">Our Story in Numbers</span>
            <div className="grid grid-cols-2 gap-6">
              {metrics.map((m, i) => (
                <div key={i} className="p-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
                  <div className="text-5xl font-extralight text-blue-600 mb-2">{m.val}{m.suffix}</div>
                  <div className="text-sm text-gray-600">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Point({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
      <p className="text-base text-gray-700">{text}</p>
    </div>
  );
}

function ContactSegment() {
  return (
    <section className="segment-5 relative w-full min-h-screen flex items-center bg-gray-50" style={{ padding: "8rem 0" }}>
      <div className="w-full max-w-[800px] mx-auto px-8">
        <div className="text-center mb-12">
          <span className="t-label">Get in Touch</span>
          <h2 className="t-heading mt-6">Let's Connect</h2>
        </div>

        <form className="space-y-6 bg-white p-12 rounded-2xl shadow-lg">
          <div className="grid grid-cols-2 gap-6">
            <input type="text" placeholder="Your Name" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
            <input type="email" placeholder="Email Address" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <input type="tel" placeholder="Phone Number" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
            <input type="text" placeholder="Organisation" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <input type="text" placeholder="Designation" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full" />
          <textarea placeholder="Message" rows={5} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full resize-none" />
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
