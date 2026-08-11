"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

type Stage = "drawing" | "rnd" | "scaleup" | "manufacturing";

const STAGE_CONTENT = {
  rnd: {
    label: "R&D",
    title: "Research & Development",
    description: "Advanced laboratory synthesis and process development capabilities for complex chemistry.",
    points: [
      "State-of-the-art R&D laboratories",
      "Process chemistry expertise",
      "Analytical and quality control",
      "Safety-first development protocols",
    ],
    color: "var(--color-blue)",
  },
  scaleup: {
    label: "SCALE-UP",
    title: "Pilot & Scale-Up",
    description: "Seamless transition from lab to production with pilot-scale manufacturing and optimization.",
    points: [
      "Pilot plant capabilities",
      "Process optimization",
      "Scale-up risk mitigation",
      "Integrated facility advantage",
    ],
    color: "var(--color-lavender)",
  },
  manufacturing: {
    label: "MANUFACTURING",
    title: "Commercial Manufacturing",
    description: "900 m³ reactor capacity delivering reliable commercial supply at scale.",
    points: [
      "Large-scale production",
      "Hazardous chemistry expertise",
      "Proven operational discipline",
      "Quality and regulatory compliance",
    ],
    color: "var(--color-coral)",
  },
};

export default function Segment2Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentStage, setCurrentStage] = useState<Stage>("drawing");

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    // Get all drawable paths for progressive drawing
    const drawablePaths = svg.querySelectorAll("path, line, polyline");
    drawablePaths.forEach((path) => {
      if (path instanceof SVGPathElement || path instanceof SVGLineElement || path instanceof SVGPolylineElement) {
        const length = path.getTotalLength?.() || 0;
        if (length > 0) {
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        }
      }
    });

    // Set all shapes initially invisible
    gsap.set([".building-shape", ".tank-shape", ".tower-shape"], { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: ".segment2-sticky",
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.25) {
            setCurrentStage("drawing");
          } else if (progress < 0.5) {
            setCurrentStage("rnd");
          } else if (progress < 0.75) {
            setCurrentStage("scaleup");
          } else {
            setCurrentStage("manufacturing");
          }
        },
      },
    });

    // STAGE 1: PROGRESSIVE FACILITY DRAWING (0-0.25)
    // Site boundary and roads
    tl.to(".site-boundary", { strokeDashoffset: 0, duration: 0.03 }, 0)
      .to(".road-network", { strokeDashoffset: 0, duration: 0.04, stagger: 0.005 }, 0.03);

    // Major buildings constructed
    tl.to(".building-main", { strokeDashoffset: 0, duration: 0.05, stagger: 0.008 }, 0.07)
      .to(".building-shape", { opacity: 0.03, duration: 0.02 }, 0.11);

    // Process towers drawn
    tl.to(".tower-main", { strokeDashoffset: 0, duration: 0.04, stagger: 0.006 }, 0.12)
      .to(".tower-detail", { strokeDashoffset: 0, duration: 0.02 }, 0.16)
      .to(".tower-shape", { opacity: 1, duration: 0.01 }, 0.16);

    // Storage tanks
    tl.to(".tank-main", { strokeDashoffset: 0, duration: 0.03, stagger: 0.005 }, 0.18)
      .to(".tank-shape", { opacity: 1, duration: 0.01 }, 0.20);

    // Pipe networks
    tl.to(".pipe-network", { strokeDashoffset: 0, duration: 0.03, stagger: 0.004 }, 0.21);

    // Supporting structures
    tl.to(".support-structure", { strokeDashoffset: 0, duration: 0.02, stagger: 0.003 }, 0.24);

    // STAGE 2: R&D FOCUS (0.25-0.5)
    tl.to(".facility-svg", {
      x: "15%",
      y: "5%",
      scale: 1.15,
      duration: 0.1,
    }, 0.25)
      .to(".zone-rnd-overlay", { opacity: 0.12, duration: 0.05 }, 0.28)
      .to(".rnd-label", { opacity: 1, duration: 0.05 }, 0.30)
      .to(".connecting-path-rnd", { strokeDashoffset: 0, duration: 0.08 }, 0.32);

    // STAGE 3: SCALE-UP FOCUS (0.5-0.75)
    tl.to(".facility-svg", {
      x: "0%",
      y: "3%",
      scale: 1.1,
      duration: 0.1,
    }, 0.5)
      .to(".zone-rnd-overlay", { opacity: 0.04, duration: 0.03 }, 0.50)
      .to(".rnd-label", { opacity: 0.3, duration: 0.03 }, 0.50)
      .to(".zone-scaleup-overlay", { opacity: 0.12, duration: 0.05 }, 0.53)
      .to(".scaleup-label", { opacity: 1, duration: 0.05 }, 0.55)
      .to(".connecting-path-scaleup", { strokeDashoffset: 0, duration: 0.08 }, 0.57);

    // STAGE 4: MANUFACTURING FOCUS (0.75-1.0)
    tl.to(".facility-svg", {
      x: "-15%",
      y: "2%",
      scale: 1.12,
      duration: 0.1,
    }, 0.75)
      .to(".zone-scaleup-overlay", { opacity: 0.04, duration: 0.03 }, 0.75)
      .to(".scaleup-label", { opacity: 0.3, duration: 0.03 }, 0.75)
      .to(".zone-mfg-overlay", { opacity: 0.12, duration: 0.05 }, 0.78)
      .to(".mfg-label", { opacity: 1, duration: 0.05 }, 0.80)
      .to(".connecting-path-mfg", { strokeDashoffset: 0, duration: 0.08 }, 0.82);

    // Final integrated pathway
    tl.to(".integrated-pathway", { strokeDashoffset: 0, duration: 0.10 }, 0.90);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const showContent = currentStage !== "drawing";
  const stage = currentStage !== "drawing" ? STAGE_CONTENT[currentStage] : null;

  return (
    <section
      ref={sectionRef}
      id="facility"
      className="relative w-full bg-white"
      style={{ height: "500vh" }}
    >
      <div className="segment2-sticky sticky top-0 w-full h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20">
          <div className="grid lg:grid-cols-[40%_60%] gap-12 items-center">
            
            {/* LEFT: Content */}
            <div className="relative z-10 space-y-6">
              <div className="space-y-3">
                <span className="t-label" style={{ opacity: showContent ? 1 : 0.5 }}>
                  Animated, Interactive rendering of our facility
                </span>
                <h2 className="t-heading leading-tight">
                  One Integrated Facility.<br />
                  From Development to Delivery.
                </h2>
              </div>

              {/* Dynamic stage content */}
              {showContent && stage && (
                <div className="transition-opacity duration-500 ease-in-out">
                  <div 
                    className="inline-block px-4 py-2 rounded-full mb-4"
                    style={{ 
                      background: `${stage.color}15`,
                      border: `2px solid ${stage.color}`,
                    }}
                  >
                    <span className="font-semibold text-sm" style={{ color: stage.color }}>
                      {stage.label}
                    </span>
                  </div>

                  <h3 className="t-subheading mb-4" style={{ color: stage.color }}>
                    {stage.title}
                  </h3>

                  <p className="t-body mb-6">
                    {stage.description}
                  </p>

                  <div className="space-y-3">
                    {stage.points.map((point, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div 
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: stage.color }}
                        />
                        <p className="text-sm" style={{ color: "var(--color-dark)" }}>
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Architectural Facility Sketch */}
            <div className="relative w-full h-[600px] flex items-center justify-center">
              <svg
                ref={svgRef}
                viewBox="0 0 1200 800"
                className="facility-svg w-full h-full"
                style={{ 
                  filter: "drop-shadow(0 20px 60px rgba(37,99,235,0.08))",
                  transformOrigin: "center center",
                }}
              >
                {/* Construction grid - subtle */}
                <g className="construction-grid" opacity="0.04">
                  <line x1="0" y1="200" x2="1200" y2="200" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="0" y1="400" x2="1200" y2="400" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="0" y1="600" x2="1200" y2="600" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="300" y1="0" x2="300" y2="800" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="600" y1="0" x2="600" y2="800" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="900" y1="0" x2="900" y2="800" stroke="var(--color-blue)" strokeWidth="0.5" />
                </g>

                {/* Site boundary */}
                <g>
                  <polyline className="site-boundary" points="80,720 1120,720" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline className="site-boundary" points="100,720 100,120" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="1" />
                  <polyline className="site-boundary" points="1100,720 1100,120" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="1" />
                </g>

                {/* Road network */}
                <g>
                  <polyline className="road-network" points="100,720 250,640" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="6" strokeLinecap="round" />
                  <polyline className="road-network" points="250,640 600,640" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="8" strokeLinecap="round" />
                  <polyline className="road-network" points="600,640 950,640" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="6" strokeLinecap="round" />
                  <polyline className="road-network" points="950,640 1100,720" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="6" strokeLinecap="round" />
                </g>

                {/* ZONE OVERLAYS (for highlighting) */}
                <rect className="zone-rnd-overlay" x="150" y="200" width="280" height="440" fill="var(--color-blue)" opacity="0" rx="4" />
                <rect className="zone-scaleup-overlay" x="470" y="180" width="300" height="460" fill="var(--color-lavender)" opacity="0" rx="4" />
                <rect className="zone-mfg-overlay" x="810" y="160" width="280" height="480" fill="var(--color-coral)" opacity="0" rx="4" />

                {/* ========== R&D ZONE (LEFT) ========== */}
                <g>
                  {/* R&D Lab Building */}
                  <polyline className="building-main" points="180,380 380,380 380,620 180,620 180,380" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <rect className="building-shape" x="180" y="380" width="200" height="240" fill="var(--color-blue)" opacity="0" />
                  <polyline className="building-main" points="180,440 380,440" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="180,500 380,500" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="180,560 380,560" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="250,380 250,620" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="310,380 310,620" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />

                  {/* R&D Process Tower */}
                  <polyline className="tower-main" points="220,220 300,220 300,620 220,620 220,220" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <ellipse className="tower-main" cx="260" cy="220" rx="40" ry="12" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <polyline className="tower-detail" points="240,240 240,600" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="280,240 280,600" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <ellipse className="tower-shape" cx="260" cy="350" rx="20" ry="30" fill="var(--color-blue)" opacity="0" />

                  {/* R&D Storage Tank */}
                  <circle className="tank-main" cx="350" cy="540" r="50" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline className="tank-main" points="350,490 350,465" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <circle className="tank-shape" cx="350" cy="540" r="50" fill="rgba(37,99,235,0.05)" opacity="0" />

                  {/* R&D Label */}
                  <text className="rnd-label" x="280" y="690" textAnchor="middle" fill="var(--color-blue)" fontSize="16" fontWeight="600" opacity="0">
                    R&D
                  </text>
                </g>

                {/* ========== SCALE-UP ZONE (CENTER) ========== */}
                <g>
                  {/* Pilot Plant Building */}
                  <polyline className="building-main" points="500,320 720,320 720,620 500,620 500,320" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                  <rect className="building-shape" x="500" y="320" width="220" height="300" fill="var(--color-lavender)" opacity="0" />
                  <polyline className="building-main" points="500,380 720,380" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="500,440 720,440" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="500,500 720,500" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="500,560 720,560" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="580,320 580,620" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="640,320 640,620" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" opacity="0.4" />

                  {/* Pilot Reactor Tower */}
                  <polyline className="tower-main" points="540,180 620,180 620,620 540,620 540,180" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                  <ellipse className="tower-main" cx="580" cy="180" rx="40" ry="12" fill="none" stroke="var(--color-lavender)" strokeWidth="1.5" />
                  <polyline className="tower-detail" points="560,200 560,600" fill="none" stroke="var(--color-lavender)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="600,200 600,600" fill="none" stroke="var(--color-lavender)" strokeWidth="0.6" opacity="0.3" />
                  <ellipse className="tower-shape" cx="580" cy="320" rx="22" ry="35" fill="var(--color-lavender)" opacity="0" />

                  {/* Scale-up Process Tower 2 */}
                  <polyline className="tower-main" points="660,200 730,200 730,620 660,620 660,200" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                  <ellipse className="tower-main" cx="695" cy="200" rx="35" ry="10" fill="none" stroke="var(--color-lavender)" strokeWidth="1.5" />
                  <polyline className="tower-detail" points="678,215 678,600" fill="none" stroke="var(--color-lavender)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="712,215 712,600" fill="none" stroke="var(--color-lavender)" strokeWidth="0.6" opacity="0.3" />

                  {/* Scale-up Tanks */}
                  <circle className="tank-main" cx="480" cy="550" r="40" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                  <polyline className="tank-main" points="480,510 480,490" fill="none" stroke="var(--color-lavender)" strokeWidth="1.5" />
                  <circle className="tank-shape" cx="480" cy="550" r="40" fill="rgba(167,139,250,0.05)" opacity="0" />

                  {/* Scale-up Label */}
                  <text className="scaleup-label" x="610" y="690" textAnchor="middle" fill="var(--color-lavender)" fontSize="16" fontWeight="600" opacity="0">
                    SCALE-UP
                  </text>
                </g>

                {/* ========== MANUFACTURING ZONE (RIGHT) ========== */}
                <g>
                  {/* Manufacturing Building 1 */}
                  <polyline className="building-main" points="840,280 1020,280 1020,620 840,620 840,280" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <rect className="building-shape" x="840" y="280" width="180" height="340" fill="var(--color-coral)" opacity="0" />
                  <polyline className="building-main" points="840,340 1020,340" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="840,400 1020,400" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="840,460 1020,460" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="840,520 1020,520" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="905,280 905,620" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-main" points="965,280 965,620" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />

                  {/* Large Manufacturing Tower 1 */}
                  <polyline className="tower-main" points="870,150 950,150 950,620 870,620 870,150" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" />
                  <ellipse className="tower-main" cx="910" cy="150" rx="40" ry="12" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <polyline className="tower-detail" points="890,170 890,600" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.3" />
                  <polyline className="tower-detail" points="930,170 930,600" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.3" />
                  <ellipse className="tower-shape" cx="910" cy="300" rx="25" ry="40" fill="var(--color-coral)" opacity="0" />

                  {/* Large Manufacturing Tower 2 */}
                  <polyline className="tower-main" points="970,170 1040,170 1040,620 970,620 970,170" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" />
                  <ellipse className="tower-main" cx="1005" cy="170" rx="35" ry="10" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <polyline className="tower-detail" points="988,185 988,600" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.3" />
                  <polyline className="tower-detail" points="1022,185 1022,600" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.3" />

                  {/* Manufacturing Storage Tanks */}
                  <circle className="tank-main" cx="1060" cy="500" r="55" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" />
                  <polyline className="tank-main" points="1060,445 1060,420" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <circle className="tank-shape" cx="1060" cy="500" r="55" fill="rgba(251,113,133,0.05)" opacity="0" />

                  <circle className="tank-main" cx="820" cy="540" r="45" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <polyline className="tank-main" points="820,495 820,475" fill="none" stroke="var(--color-coral)" strokeWidth="1.5" />
                  <circle className="tank-shape" cx="820" cy="540" r="45" fill="rgba(251,113,133,0.05)" opacity="0" />

                  {/* Manufacturing Label */}
                  <text className="mfg-label" x="950" y="690" textAnchor="middle" fill="var(--color-coral)" fontSize="16" fontWeight="600" opacity="0">
                    MANUFACTURING
                  </text>
                </g>

                {/* ========== PIPE NETWORKS (CONNECTING ZONES) ========== */}
                <g>
                  {/* R&D to Scale-up pipes */}
                  <polyline className="pipe-network" points="380,450 500,420" fill="none" stroke="var(--color-lavender)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                  <polyline className="pipe-network" points="350,490 480,480" fill="none" stroke="var(--color-blue)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                  
                  {/* Scale-up to Manufacturing pipes */}
                  <polyline className="pipe-network" points="720,400 840,380" fill="none" stroke="var(--color-coral)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                  <polyline className="pipe-network" points="730,500 820,495" fill="none" stroke="var(--color-lavender)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                  
                  {/* Overhead pipes */}
                  <polyline className="pipe-network" points="300,220 540,180" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                  <polyline className="pipe-network" points="620,180 870,150" fill="none" stroke="var(--color-lavender)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                </g>

                {/* ========== SUPPORTING STRUCTURES ========== */}
                <g>
                  {/* Control room */}
                  <polyline className="support-structure" points="140,500 220,500 220,620 140,620 140,500" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" opacity="0.5" />
                  <polyline className="support-structure" points="140,550 220,550" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                  
                  {/* Utility building */}
                  <polyline className="support-structure" points="750,540 820,540 820,620 750,620 750,540" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" opacity="0.5" />
                  <polygon className="support-structure" points="750,540 785,520 820,540" fill="rgba(37,99,235,0.05)" stroke="var(--color-blue)" strokeWidth="0.8" />
                  
                  {/* Warehouse */}
                  <polyline className="support-structure" points="1040,540 1100,540 1100,620 1040,620 1040,540" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" opacity="0.5" />
                  <polyline className="support-structure" points="1040,580 1100,580" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                </g>

                {/* ========== CONNECTING PATHS (Stage-specific) ========== */}
                <g>
                  {/* R&D connection path */}
                  <path 
                    className="connecting-path-rnd"
                    d="M 260,640 L 260,680"
                    fill="none"
                    stroke="var(--color-blue)"
                    strokeWidth="3"
                    strokeDasharray="50"
                    strokeDashoffset="50"
                    opacity="0.8"
                  />
                  
                  {/* Scale-up connection path */}
                  <path 
                    className="connecting-path-scaleup"
                    d="M 580,640 L 580,680"
                    fill="none"
                    stroke="var(--color-lavender)"
                    strokeWidth="3"
                    strokeDasharray="50"
                    strokeDashoffset="50"
                    opacity="0.8"
                  />
                  
                  {/* Manufacturing connection path */}
                  <path 
                    className="connecting-path-mfg"
                    d="M 910,640 L 910,680"
                    fill="none"
                    stroke="var(--color-coral)"
                    strokeWidth="3"
                    strokeDasharray="50"
                    strokeDashoffset="50"
                    opacity="0.8"
                  />
                  
                  {/* Integrated pathway showing full flow */}
                  <path 
                    className="integrated-pathway"
                    d="M 260,700 Q 440,695 580,700 Q 750,705 910,700"
                    fill="none"
                    stroke="url(#gradient-flow)"
                    strokeWidth="4"
                    strokeDasharray="500"
                    strokeDashoffset="500"
                    opacity="0.6"
                  />
                </g>

                {/* Gradient definition for integrated pathway */}
                <defs>
                  <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-blue)" />
                    <stop offset="50%" stopColor="var(--color-lavender)" />
                    <stop offset="100%" stopColor="var(--color-coral)" />
                  </linearGradient>
                </defs>

                {/* Molecular accent decorations */}
                <g opacity="0.3">
                  <circle cx="120" cy="260" r="3" fill="var(--color-blue)" />
                  <circle cx="160" cy="240" r="3" fill="var(--color-blue)" />
                  <line x1="120" y1="260" x2="160" y2="240" stroke="var(--color-blue)" strokeWidth="0.8" />
                  
                  <circle cx="1080" cy="280" r="3" fill="var(--color-coral)" />
                  <circle cx="1120" cy="260" r="3" fill="var(--color-coral)" />
                  <line x1="1080" y1="280" x2="1120" y2="260" stroke="var(--color-coral)" strokeWidth="0.8" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
