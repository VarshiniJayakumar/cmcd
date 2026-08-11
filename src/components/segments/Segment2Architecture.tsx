"use client";

import { useEffect, useRef } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export default function Segment2Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    // Get all paths for animation
    const paths = svg.querySelectorAll("path, line, rect, circle, ellipse");

    // Set up path animations
    paths.forEach((path) => {
      if (path instanceof SVGPathElement || path instanceof SVGLineElement) {
        const length = path.getTotalLength?.() || 0;
        if (length > 0) {
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        }
      } else if (path instanceof SVGRectElement || path instanceof SVGCircleElement || path instanceof SVGEllipseElement) {
        gsap.set(path, { opacity: 0 });
      }
    });

    // Scroll timeline - STATE BY STATE
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: ".segment2-content",
      },
    });

    const allPaths = Array.from(paths);

    // STATE 1: Title appears (0-0.12)
    tl.fromTo(".seg2-state1-title", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.08 })
      .to(".seg2-state1-title", { opacity: 1, duration: 0.04 });

    // STATE 2: First point (0.12-0.24)
    tl.to(".seg2-state1-title", { opacity: 0, y: -40, duration: 0.06 }, 0.12)
      .fromTo(".seg2-state2-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.08 }, 0.14)
      .to(".seg2-state2-text", { opacity: 1, duration: 0.04 });

    // STATE 3: Second point (0.24-0.36)
    tl.to(".seg2-state2-text", { opacity: 0, y: -40, duration: 0.06 }, 0.24)
      .fromTo(".seg2-state3-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.08 }, 0.26)
      .to(".seg2-state3-text", { opacity: 1, duration: 0.04 });

    // STATE 4: Facility sketch begins (0.36-1.0)
    tl.to(".seg2-state3-text", { opacity: 0.4, scale: 0.9, x: -100, duration: 0.08 }, 0.36)
      .to(".seg2-facility-label", { opacity: 1, duration: 0.06 }, 0.38);

    // PHASE 1: Construction grid (0.40-0.44) - Always slightly visible
    tl.to(".construction-grid", {
      opacity: 0.15,
      duration: 0.04,
    }, 0.40);

    // PHASE 2: Ground/site outline (0.44-0.50)
    tl.to(".site-outline", {
      strokeDashoffset: 0,
      duration: 0.06,
      stagger: 0.01,
    }, 0.44);

    // PHASE 3: Major building outlines (0.50-0.62)
    tl.to(".building-main", {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.10,
      stagger: 0.015,
    }, 0.50)
      .to(".building-fill", { opacity: 0.03, duration: 0.02 }, 0.58);

    // PHASE 4: Process towers (0.62-0.72)
    tl.to(".tower-structure", {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.08,
      stagger: 0.012,
    }, 0.62)
      .to(".tower-detail", { opacity: 1, duration: 0.02 }, 0.68);

    // PHASE 5: Tanks and equipment (0.72-0.80)
    tl.to(".tank-structure", {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.06,
      stagger: 0.01,
    }, 0.72);

    // PHASE 6: Pipe networks (0.80-0.88)
    tl.to(".pipe-network", {
      strokeDashoffset: 0,
      duration: 0.06,
      stagger: 0.008,
    }, 0.80);

    // PHASE 7: Supporting structures (0.88-0.94)
    tl.to(".support-building", {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.04,
      stagger: 0.008,
    }, 0.88);

    // PHASE 8: Labels and emphasis (0.94-1.0)
    tl.to(".label-rnd", { opacity: 1, scale: 1, duration: 0.02 }, 0.94)
      .to(".label-pilot", { opacity: 1, scale: 1, duration: 0.02 }, 0.96)
      .to(".label-mfg", { opacity: 1, scale: 1, duration: 0.02 }, 0.98);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative w-full bg-white"
      style={{ height: "350vh" }}
    >
      <div className="segment2-content sticky top-0 w-full h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20">
          <div className="grid lg:grid-cols-[45%_55%] gap-16 items-center">
            {/* LEFT: Progressive text states */}
            <div className="relative" style={{ minHeight: "400px" }}>
              {/* STATE 1 */}
              <div className="seg2-state1-title absolute inset-0 flex flex-col justify-center">
                <h2 className="t-heading leading-tight">
                  From Molecule<br />
                  to Market.
                </h2>
              </div>

              {/* STATE 2 */}
              <div className="seg2-state2-text absolute inset-0 flex flex-col justify-center opacity-0">
                <h3 className="t-subheading mb-6">
                  World-class manufacturing,<br />
                  safe and sustainable by design.
                </h3>
                <div className="w-16 h-px" style={{ background: "var(--color-lavender)" }} />
              </div>

              {/* STATE 3 */}
              <div className="seg2-state3-text absolute inset-0 flex flex-col justify-center opacity-0">
                <h3 className="t-subheading mb-8">
                  Deep expertise in complex<br />
                  and hazardous chemistry.
                </h3>
                <p className="t-body max-w-lg">
                  CMCD partners with global innovators in Agrochemicals, Pharmaceuticals and 
                  Specialty Chemicals, providing end-to-end capabilities across development, 
                  scale-up and commercial manufacturing.
                </p>
              </div>
            </div>

            {/* RIGHT: Facility sketch */}
            <div className="relative">
              <div className="seg2-facility-label mb-8 opacity-0">
                <span className="t-label">INTEGRATED FACILITY · BERIGAI</span>
              </div>

              <svg
                ref={svgRef}
                viewBox="0 0 1200 800"
                className="w-full h-auto"
                style={{ filter: "drop-shadow(0 10px 40px rgba(37,99,235,0.06))" }}
              >
                {/* CONSTRUCTION GRID - Always slightly visible */}
                <g className="construction-grid" opacity="0.05">
                  <line x1="0" y1="200" x2="1200" y2="200" stroke="rgba(37,99,235,0.3)" strokeWidth="0.5" />
                  <line x1="0" y1="400" x2="1200" y2="400" stroke="rgba(37,99,235,0.3)" strokeWidth="0.5" />
                  <line x1="0" y1="600" x2="1200" y2="600" stroke="rgba(37,99,235,0.3)" strokeWidth="0.5" />
                  <line x1="300" y1="0" x2="300" y2="800" stroke="rgba(37,99,235,0.3)" strokeWidth="0.5" />
                  <line x1="600" y1="0" x2="600" y2="800" stroke="rgba(37,99,235,0.3)" strokeWidth="0.5" />
                  <line x1="900" y1="0" x2="900" y2="800" stroke="rgba(37,99,235,0.3)" strokeWidth="0.5" />
                </g>

                {/* SITE OUTLINE / GROUND */}
                <g className="site-outline">
                  <polyline points="50,750 1150,750" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <polyline points="50,755 1150,755" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.3" />
                  <polyline points="100,750 100,100" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="1" />
                  <polyline points="1100,750 1100,100" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="1" />
                </g>

                {/* MAIN CENTRAL PROCESS BUILDING - Large multi-story structure */}
                <g className="building-main">
                  {/* Central reactor building */}
                  <polyline points="450,300 750,300 750,720 450,720 450,300" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <rect className="building-fill" x="450" y="300" width="300" height="420" fill="var(--color-blue)" opacity="0" />
                  
                  {/* Floor divisions */}
                  <polyline points="450,380 750,380" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.5" />
                  <polyline points="450,460 750,460" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.5" />
                  <polyline points="450,540 750,540" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.5" />
                  <polyline points="450,620 750,620" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.5" />
                  
                {/* Vertical structure divisions */}
                  <polyline points="550,300 550,720" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.5" />
                  <polyline points="650,300 650,720" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.5" />
                  
                  {/* Internal equipment indicators */}
                  <circle cx="500" cy="400" r="20" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="600" cy="430" r="22" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="700" cy="420" r="20" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="550" cy="580" r="25" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="650" cy="590" r="24" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                </g>

                {/* TALL PROCESS TOWERS - Based on reference image */}
                <g className="tower-structure">
                  {/* Left R&D Tower Cluster */}
                  <polyline points="220,150 280,150 280,720 220,720 220,150" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <rect className="building-fill" x="220" y="150" width="60" height="570" fill="var(--color-blue)" opacity="0" />
                  <ellipse cx="250" cy="150" rx="30" ry="10" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline points="235,180 235,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="265,180 265,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  
                  <polyline points="300,180 360,180 360,720 300,720 300,180" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <rect className="building-fill" x="300" y="180" width="60" height="540" fill="var(--color-blue)" opacity="0" />
                  <ellipse cx="330" cy="180" rx="30" ry="10" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline points="315,210 315,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="345,210 345,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />

                  {/* Center Pilot/Scale-Up Tower Cluster */}
                  <polyline points="380,120 450,120 450,720 380,720 380,120" fill="none" stroke="var(--color-lavender)" strokeWidth="2.5" />
                  <rect className="building-fill" x="380" y="120" width="70" height="600" fill="var(--color-lavender)" opacity="0" />
                  <ellipse cx="415" cy="120" rx="35" ry="12" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                  <polyline points="397,155 397,700" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="433,155 433,700" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" opacity="0.4" />

                  {/* Right Manufacturing Tower Cluster */}
                  <polyline points="770,100 850,100 850,720 770,720 770,100" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" />
                  <rect className="building-fill" x="770" y="100" width="80" height="620" fill="var(--color-coral)" opacity="0" />
                  <ellipse cx="810" cy="100" rx="40" ry="14" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <polyline points="790,140 790,700" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="830,140 830,700" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                  
                  <polyline points="870,140 940,140 940,720 870,720 870,140" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" />
                  <rect className="building-fill" x="870" y="140" width="70" height="580" fill="var(--color-coral)" opacity="0" />
                  <ellipse cx="905" cy="140" rx="35" ry="12" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <polyline points="887,175 887,700" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="923,175 923,700" fill="none" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                </g>

                {/* TOWER DETAILS - Platforms and equipment */}
                <g className="tower-detail" opacity="0">
                  <polyline points="220,350 280,350" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.6" />
                  <polyline points="220,500 280,500" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.6" />
                  <polyline points="300,380 360,380" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.6" />
                  <polyline points="300,530 360,530" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.6" />
                  
                  <polyline points="380,320 450,320" fill="none" stroke="var(--color-lavender)" strokeWidth="0.5" opacity="0.6" />
                  <polyline points="380,470 450,470" fill="none" stroke="var(--color-lavender)" strokeWidth="0.5" opacity="0.6" />
                  
                  <polyline points="770,300 850,300" fill="none" stroke="var(--color-coral)" strokeWidth="0.5" opacity="0.6" />
                  <polyline points="770,450 850,450" fill="none" stroke="var(--color-coral)" strokeWidth="0.5" opacity="0.6" />
                  <polyline points="870,340 940,340" fill="none" stroke="var(--color-coral)" strokeWidth="0.5" opacity="0.6" />
                  <polyline points="870,490 940,490" fill="none" stroke="var(--color-coral)" strokeWidth="0.5" opacity="0.6" />
                </g>

                {/* STORAGE TANKS */}
                <g className="tank-structure">
                  {/* Left tank farm */}
                  <circle cx="150" cy="600" r="50" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <circle cx="150" cy="600" r="50" fill="rgba(37,99,235,0.02)" opacity="0" />
                  <polyline points="150,550 150,520" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  
                  <circle cx="130" cy="520" r="35" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <circle cx="130" cy="520" r="35" fill="rgba(37,99,235,0.02)" opacity="0" />
                  <polyline points="130,485 130,460" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  
                  <circle cx="180" cy="510" r="40" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <circle cx="180" cy="510" r="40" fill="rgba(37,99,235,0.02)" opacity="0" />
                  <polyline points="180,470 180,445" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />

                  {/* Right tank farm */}
                  <circle cx="1000" cy="590" r="55" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <circle cx="1000" cy="590" r="55" fill="rgba(37,99,235,0.02)" opacity="0" />
                  <polyline points="1000,535 1000,505" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  
                  <circle cx="1070" cy="610" r="45" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <circle cx="1070" cy="610" r="45" fill="rgba(37,99,235,0.02)" opacity="0" />
                  <polyline points="1070,565 1070,540" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                </g>

                {/* PIPE NETWORKS - Connecting infrastructure */}
                <g className="pipe-network">
                  {/* Horizontal main pipes */}
                  <polyline points="280,400 380,380" fill="none" stroke="var(--color-lavender)" strokeWidth="4" strokeLinecap="round" />
                  <polyline points="450,420 540,400" fill="none" stroke="var(--color-lavender)" strokeWidth="4" strokeLinecap="round" />
                  <polyline points="660,410 770,390" fill="none" stroke="var(--color-coral)" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Vertical connections */}
                  <polyline points="500,300 500,250 600,250 600,300" fill="none" stroke="var(--color-blue)" strokeWidth="3" strokeLinecap="round" />
                  <polyline points="700,300 700,270 780,270" fill="none" stroke="var(--color-coral)" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Secondary connections */}
                  <polyline points="180,510 280,480" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" opacity="0.6" />
                  <polyline points="360,550 450,520" fill="none" stroke="var(--color-lavender)" strokeWidth="2.5" opacity="0.6" />
                  <polyline points="750,600 870,580" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" opacity="0.6" />
                  <polyline points="940,550 1000,580" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" opacity="0.6" />
                  
                  {/* Pipe rack structure */}
                  <polyline points="200,680 1000,680" fill="none" stroke="rgba(37,99,235,0.3)" strokeWidth="1.5" />
                  <polyline points="200,690 1000,690" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="1" />
                  
                  {/* Flow indicators */}
                  <circle cx="330" cy="390" r="5" fill="var(--color-lavender)" opacity="0.8" />
                  <circle cx="495" cy="410" r="5" fill="var(--color-lavender)" opacity="0.8" />
                  <circle cx="715" cy="400" r="5" fill="var(--color-coral)" opacity="0.8" />
                </g>

                {/* SUPPORTING BUILDINGS */}
                <g className="support-building">
                  {/* Admin/Office buildings */}
                  <polyline points="100,600 200,600 200,720 100,720 100,600" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.5" />
                  <rect className="building-fill" x="100" y="600" width="100" height="120" fill="var(--color-blue)" opacity="0" />
                  <polyline points="100,640 200,640" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                  <polyline points="100,680 200,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                  
                  {/* Warehouse with blue roof */}
                  <polyline points="960,600 1100,600 1100,720 960,720 960,600" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.5" />
                  <rect className="building-fill" x="960" y="600" width="140" height="120" fill="var(--color-blue)" opacity="0" />
                  <polygon points="960,600 1030,570 1100,600" fill="rgba(37,99,235,0.15)" stroke="var(--color-blue)" strokeWidth="1" opacity="0.5" />
                  <polyline points="960,660 1100,660" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                  
                  {/* Utility structures */}
                  <polyline points="100,520 180,520 180,590 100,590 100,520" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.4" />
                  <polyline points="1020,500 1080,500 1080,580 1020,580 1020,500" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.4" />
                  
                  {/* Electrical tower */}
                  <polyline points="1100,350 1120,350 1120,720" fill="none" stroke="rgba(37,99,235,0.4)" strokeWidth="1.5" />
                  <polyline points="1100,450 1140,450" fill="none" stroke="rgba(37,99,235,0.4)" strokeWidth="1" />
                  <polyline points="1100,550 1140,550" fill="none" stroke="rgba(37,99,235,0.4)" strokeWidth="1" />
                </g>

                {/* ZONE LABELS */}
                <g className="label-rnd" opacity="0" transform="scale(0.95)" style={{ transformOrigin: "280px 80px" }}>
                  <rect x="200" y="60" width="160" height="40" fill="white" stroke="var(--color-blue)" strokeWidth="2" rx="4" />
                  <text x="280" y="87" textAnchor="middle" fill="var(--color-blue)" fontSize="16" fontWeight="700">
                    R&D
                  </text>
                </g>

                <g className="label-pilot" opacity="0" transform="scale(0.95)" style={{ transformOrigin: "600px 50px" }}>
                  <rect x="480" y="30" width="240" height="40" fill="white" stroke="var(--color-lavender)" strokeWidth="2" rx="4" />
                  <text x="600" y="57" textAnchor="middle" fill="var(--color-lavender)" fontSize="16" fontWeight="700">
                    PILOT / SCALE-UP
                  </text>
                </g>

                <g className="label-mfg" opacity="0" transform="scale(0.95)" style={{ transformOrigin: "860px 40px" }}>
                  <rect x="740" y="20" width="240" height="40" fill="white" stroke="var(--color-coral)" strokeWidth="2" rx="4" />
                  <text x="860" y="47" textAnchor="middle" fill="var(--color-coral)" fontSize="16" fontWeight="700">
                    MANUFACTURING
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
