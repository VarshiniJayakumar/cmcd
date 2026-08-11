"use client";

import { useEffect, useRef } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export default function Segment1Molecule() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    // Get all drawable paths
    const paths = svg.querySelectorAll("path, line, polyline");

    // Set up path animations - START WITH FAINT CONSTRUCTION LINES VISIBLE
    paths.forEach((path) => {
      if (path instanceof SVGPathElement || path instanceof SVGLineElement || path instanceof SVGPolylineElement) {
        const length = path.getTotalLength?.() || 0;
        if (length > 0) {
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length * 0.85, // Start 15% visible as faint construction lines
          });
        }
      }
    });

    // Set shapes to start very faint
    gsap.set(".facility-fill", { opacity: 0 });

    // Initial page load entrance for text (NOT scroll-based)
    const entranceTl = gsap.timeline({ delay: 0.3 });
    entranceTl.fromTo(".seg1-label", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
      .fromTo(".seg1-main-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
      .fromTo(".seg1-content-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");

    // Scroll-driven facility drawing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: ".segment1-content",
      },
    });

    // PHASE 1: Site boundary and roads (0-0.12)
    tl.to(".site-boundary", { strokeDashoffset: 0, duration: 0.08 }, 0)
      .to(".road-network", { strokeDashoffset: 0, duration: 0.04, stagger: 0.005 }, 0.08);

    // PHASE 2: Main large buildings (0.12-0.35)
    tl.to(".main-building", { strokeDashoffset: 0, duration: 0.12, stagger: 0.01 }, 0.12)
      .to(".building-detail", { strokeDashoffset: 0, duration: 0.08, stagger: 0.008 }, 0.22);

    // PHASE 3: Process towers and tall structures (0.35-0.55)
    tl.to(".process-tower", { strokeDashoffset: 0, duration: 0.12, stagger: 0.008 }, 0.35)
      .to(".tower-detail", { strokeDashoffset: 0, duration: 0.06 }, 0.45);

    // PHASE 4: Storage tanks (0.55-0.68)
    tl.to(".storage-tank", { strokeDashoffset: 0, duration: 0.08, stagger: 0.006 }, 0.55);

    // PHASE 5: Pipe networks and connections (0.68-0.82)
    tl.to(".pipe-network", { strokeDashoffset: 0, duration: 0.10, stagger: 0.006 }, 0.68);

    // PHASE 6: Supporting structures and utilities (0.82-0.92)
    tl.to(".utility-structure", { strokeDashoffset: 0, duration: 0.08, stagger: 0.005 }, 0.82);

    // PHASE 7: Blue roof accents and fills (0.92-1.0)
    tl.to(".blue-roof-fill", { opacity: 0.15, duration: 0.05 }, 0.92)
      .to(".facility-fill", { opacity: 0.08, duration: 0.05 }, 0.95);

    return () => {
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
      style={{ height: "200vh" }}
    >
      <div className="segment1-content sticky top-0 w-full h-screen flex items-center">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-20">
          <div className="grid lg:grid-cols-[45%_55%] gap-8 lg:gap-16 items-center">
            
            {/* LEFT: Content */}
            <div className="relative z-10 space-y-4 sm:space-y-6" style={{ paddingTop: "clamp(80px, 15vh, 120px)" }}>
              <span className="seg1-label t-label">What does CMCD offer clients?</span>
              
              <div className="seg1-main-title space-y-2 sm:space-y-3">
                <h1 style={{
                  fontSize: "clamp(2rem, 8vw, 4.5rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  color: "var(--color-black)",
                }}>
                  FROM MOLECULE<br />
                  TO MARKET.
                </h1>
                <h2 style={{
                  fontSize: "clamp(2rem, 8vw, 4.5rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  background: "linear-gradient(135deg, var(--color-blue) 0%, var(--color-lavender) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  MADE POSSIBLE.
                </h2>
              </div>

              <div className="seg1-content-text space-y-3 sm:space-y-4 max-w-xl" style={{ paddingTop: "8px" }}>
                <p className="t-body-large text-sm sm:text-base">
                  World-class manufacturing, safe and sustainable by design, built to support 
                  your innovation lifecycle.
                </p>
                <p className="t-body-large text-sm sm:text-base">
                  Deep expertise in complex and hazardous chemistry, backed by a proven safety record.
                </p>
              </div>
            </div>

            {/* RIGHT: Berigai Facility Sketch */}
            <div className="relative w-full max-w-full">
              <svg
                ref={svgRef}
                viewBox="0 0 1200 900"
                className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] lg:max-h-none"
                preserveAspectRatio="xMidYMid meet"
                style={{ filter: "drop-shadow(0 10px 40px rgba(37,99,235,0.04))" }}
              >
                {/* Faint construction grid */}
                <g opacity="0.03">
                  <line x1="0" y1="225" x2="1200" y2="225" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="0" y1="450" x2="1200" y2="450" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="0" y1="675" x2="1200" y2="675" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="300" y1="0" x2="300" y2="900" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="600" y1="0" x2="600" y2="900" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="900" y1="0" x2="900" y2="900" stroke="var(--color-blue)" strokeWidth="0.5" />
                </g>

                {/* SITE BOUNDARY & ROADS */}
                <g>
                  {/* Perimeter boundary */}
                  <polyline className="site-boundary" points="80,800 1120,800" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                  <polyline className="site-boundary" points="80,800 80,150" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                  <polyline className="site-boundary" points="1120,800 1120,150" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                  
                  {/* Main road network */}
                  <polyline className="road-network" points="100,780 400,720" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="10" strokeLinecap="round" />
                  <polyline className="road-network" points="400,720 800,720" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="12" strokeLinecap="round" />
                  <polyline className="road-network" points="800,720 1100,780" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="10" strokeLinecap="round" />
                  <polyline className="road-network" points="600,720 600,500" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="8" strokeLinecap="round" />
                </g>

                {/* MAIN CENTRAL REACTOR BUILDING (Large white multi-story structure) */}
                <g>
                  <polyline className="main-building" points="450,280 750,280 750,700 450,700 450,280" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <rect className="facility-fill" x="450" y="280" width="300" height="420" fill="rgba(0,0,0,0.02)" opacity="0" />
                  
                  {/* Floor lines */}
                  <polyline className="building-detail" points="450,330 750,330" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-detail" points="450,380 750,380" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-detail" points="450,430 750,430" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-detail" points="450,480 750,480" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-detail" points="450,530 750,530" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-detail" points="450,580 750,580" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-detail" points="450,630 750,630" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  
                  {/* Vertical divisions */}
                  <polyline className="building-detail" points="530,280 530,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-detail" points="600,280 600,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline className="building-detail" points="670,280 670,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                </g>

                {/* LEFT SIDE PROCESSING AREA - Multiple structures and towers */}
                <g>
                  {/* Left tower cluster */}
                  <polyline className="process-tower" points="180,200 280,200 280,700 180,700 180,200" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline className="tower-detail" points="200,220 200,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="230,220 230,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="260,220 260,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Tall left process tower */}
                  <polyline className="process-tower" points="300,150 380,150 380,700 300,700 300,150" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <polyline className="tower-detail" points="320,170 320,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="360,170 360,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Left support building */}
                  <polyline className="main-building" points="140,450 240,450 240,700 140,700 140,450" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <polyline className="building-detail" points="140,520 240,520" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="building-detail" points="140,590 240,590" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                </g>

                {/* BLUE ROOF BUILDINGS (Based on reference image) */}
                <g>
                  {/* Front left blue roof building */}
                  <polyline className="main-building" points="280,480 420,480 420,700 280,700 280,480" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <path className="blue-roof-fill" d="M 280,480 L 350,440 L 420,480 Z" fill="var(--color-blue)" opacity="0" />
                  <polyline className="building-detail" points="280,480 350,440 420,480" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <polyline className="building-detail" points="280,550 420,550" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="building-detail" points="280,620 420,620" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Right side blue roof building */}
                  <polyline className="main-building" points="780,420 960,420 960,700 780,700 780,420" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <path className="blue-roof-fill" d="M 780,420 L 870,380 L 960,420 Z" fill="var(--color-blue)" opacity="0" />
                  <polyline className="building-detail" points="780,420 870,380 960,420" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <polyline className="building-detail" points="780,500 960,500" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="building-detail" points="780,580 960,580" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="building-detail" points="830,420 830,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="building-detail" points="900,420 900,700" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Far right blue roof structure */}
                  <polyline className="main-building" points="980,520 1080,520 1080,700 980,700 980,520" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <path className="blue-roof-fill" d="M 980,520 L 1030,490 L 1080,520 Z" fill="var(--color-blue)" opacity="0" />
                  <polyline className="building-detail" points="980,520 1030,490 1080,520" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" />
                </g>

                {/* TALL CENTRAL PROCESS TOWERS (Behind main building) */}
                <g>
                  {/* Central tall tower 1 */}
                  <polyline className="process-tower" points="520,120 620,120 620,700 520,700 520,120" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <polyline className="tower-detail" points="545,140 545,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="570,140 570,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="595,140 595,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Central tall tower 2 */}
                  <polyline className="process-tower" points="640,140 720,140 720,700 640,700 640,140" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                  <polyline className="tower-detail" points="660,160 660,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline className="tower-detail" points="700,160 700,680" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                </g>

                {/* STORAGE TANKS */}
                <g>
                  {/* Large front-left tank */}
                  <circle className="storage-tank" cx="200" cy="620" r="50" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline className="storage-tank" points="200,570 200,550" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <circle className="facility-fill" cx="200" cy="620" r="50" fill="rgba(37,99,235,0.05)" opacity="0" />
                  
                  {/* Right side tank cluster */}
                  <circle className="storage-tank" cx="880" cy="650" r="40" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline className="storage-tank" points="880,610 880,590" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  
                  <circle className="storage-tank" cx="950" cy="640" r="35" fill="none" stroke="var(--color-blue)" strokeWidth="1.8" />
                  <polyline className="storage-tank" points="950,605 950,585" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  
                  {/* Back tanks */}
                  <circle className="storage-tank" cx="380" cy="350" r="30" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <circle className="storage-tank" cx="820" cy="340" r="30" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                </g>

                {/* PIPE NETWORKS - Complex interconnections */}
                <g>
                  {/* Horizontal pipes */}
                  <polyline className="pipe-network" points="280,300 450,290" fill="none" stroke="var(--color-blue)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                  <polyline className="pipe-network" points="750,310 900,300" fill="none" stroke="var(--color-blue)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                  <polyline className="pipe-network" points="420,500 600,480" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                  <polyline className="pipe-network" points="600,480 780,500" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                  
                  {/* Overhead pipe network */}
                  <polyline className="pipe-network" points="380,150 520,120" fill="none" stroke="var(--color-blue)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                  <polyline className="pipe-network" points="720,140 880,160" fill="none" stroke="var(--color-blue)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                  
                  {/* Vertical risers */}
                  <polyline className="pipe-network" points="340,250 340,150" fill="none" stroke="var(--color-blue)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                  <polyline className="pipe-network" points="860,260 860,160" fill="none" stroke="var(--color-blue)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </g>

                {/* UTILITY & SUPPORT STRUCTURES */}
                <g>
                  {/* Control room / admin building */}
                  <polyline className="utility-structure" points="120,580 220,580 220,700 120,700 120,580" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.5" />
                  <polyline className="utility-structure" points="120,640 220,640" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Warehouse */}
                  <polyline className="utility-structure" points="1020,600 1100,600 1100,700 1020,700 1020,600" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.5" />
                  <polyline className="utility-structure" points="1020,650 1100,650" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  
                  {/* Utility shed */}
                  <polyline className="utility-structure" points="750,650 820,650 820,700 750,700 750,650" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" opacity="0.5" />
                  
                  {/* Equipment shelters */}
                  <polyline className="utility-structure" points="360,650 420,650 420,700 360,700 360,650" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" opacity="0.5" />
                </g>

                {/* GREEN AREAS (Simplified as light fills) */}
                <g opacity="0.15">
                  <rect className="facility-fill" x="100" y="720" width="150" height="60" fill="rgba(0,150,0,0.1)" opacity="0" />
                  <rect className="facility-fill" x="950" y="720" width="150" height="60" fill="rgba(0,150,0,0.1)" opacity="0" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
