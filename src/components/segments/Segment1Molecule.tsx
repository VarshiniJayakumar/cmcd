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
    const paths = svg.querySelectorAll("path, line, rect, circle, ellipse, polyline, polygon");

    // Set up path animations
    paths.forEach((path) => {
      if (path instanceof SVGPathElement || path instanceof SVGLineElement || path instanceof SVGPolylineElement) {
        const length = path.getTotalLength?.() || 0;
        if (length > 0) {
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        }
      } else if (path instanceof SVGRectElement || path instanceof SVGCircleElement || path instanceof SVGEllipseElement || path instanceof SVGPolygonElement) {
        gsap.set(path, { opacity: 0 });
      }
    });

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

    // PHASE 1: Initial construction grid visible, main buildings start (0-0.15)
    tl.to(".construction-grid", { opacity: 0.12, duration: 0.05 }, 0)
      .to(".site-boundary", { strokeDashoffset: 0, duration: 0.10 }, 0.05);

    // PHASE 2: Major building outlines (0.15-0.35)
    tl.to(".building-main", {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.15,
      stagger: 0.015,
    }, 0.15)
      .to(".building-fill", { opacity: 0.02, duration: 0.05 }, 0.28);

    // PHASE 3: Process towers (0.35-0.55)
    tl.to(".tower-structure", {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.15,
      stagger: 0.012,
    }, 0.35)
      .to(".tower-detail", { opacity: 1, duration: 0.05 }, 0.48);

    // PHASE 4: Tanks and equipment (0.55-0.70)
    tl.to(".tank-structure", {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.12,
      stagger: 0.01,
    }, 0.55);

    // PHASE 5: Pipe networks (0.70-0.85)
    tl.to(".pipe-network", {
      strokeDashoffset: 0,
      duration: 0.12,
      stagger: 0.008,
    }, 0.70);

    // PHASE 6: Supporting structures (0.85-0.95)
    tl.to(".support-building", {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.08,
      stagger: 0.008,
    }, 0.85);

    // PHASE 7: Molecular accents (0.95-1.0)
    tl.to(".molecule-accent", {
      opacity: 0.3,
      duration: 0.05,
      stagger: 0.005,
    }, 0.95);

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
        <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20">
          <div className="grid lg:grid-cols-[45%_55%] gap-16 items-center">
            
            {/* LEFT: Content */}
            <div className="relative z-10 space-y-8">
              <span className="seg1-label t-label">What does CMCD offer clients?</span>
              
              <div className="seg1-main-title space-y-4">
                <h1 className="t-display leading-tight">
                  FROM MOLECULE<br />
                  TO MARKET.
                </h1>
                <h2 className="t-display leading-tight" style={{
                  background: "linear-gradient(135deg, var(--color-blue) 0%, var(--color-lavender) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  MADE POSSIBLE.
                </h2>
              </div>

              <div className="seg1-content-text space-y-6 max-w-xl">
                <p className="t-body-large">
                  World-class manufacturing, safe and sustainable by design, built to support 
                  your innovation lifecycle.
                </p>
                <p className="t-body-large">
                  Deep expertise in complex and hazardous chemistry, backed by a proven safety record.
                </p>
              </div>
            </div>

            {/* RIGHT: Berigai Facility Sketch */}
            <div className="relative">
              <svg
                ref={svgRef}
                viewBox="0 0 1000 700"
                className="w-full h-auto"
                style={{ filter: "drop-shadow(0 10px 40px rgba(37,99,235,0.04))" }}
              >
                {/* Construction grid - always slightly visible */}
                <g className="construction-grid" opacity="0.03">
                  <line x1="0" y1="175" x2="1000" y2="175" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="0" y1="350" x2="1000" y2="350" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="0" y1="525" x2="1000" y2="525" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="250" y1="0" x2="250" y2="700" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="500" y1="0" x2="500" y2="700" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="750" y1="0" x2="750" y2="700" stroke="var(--color-blue)" strokeWidth="0.5" />
                </g>

                {/* Site boundary */}
                <g className="site-boundary">
                  <polyline points="50,650 950,650" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline points="80,650 80,100" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth="1" />
                  <polyline points="920,650 920,100" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth="1" />
                </g>

                {/* Main central reactor building */}
                <g className="building-main">
                  <polyline points="400,250 650,250 650,620 400,620 400,250" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <rect className="building-fill" x="400" y="250" width="250" height="370" fill="var(--color-blue)" opacity="0" />
                  <polyline points="400,320 650,320" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="400,390 650,390" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="400,460 650,460" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="400,530 650,530" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="490,250 490,620" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <polyline points="560,250 560,620" fill="none" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                </g>

                {/* Tall process towers */}
                <g className="tower-structure">
                  {/* Left R&D towers */}
                  <polyline points="200,130 250,130 250,620 200,620 200,130" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <ellipse cx="225" cy="130" rx="25" ry="8" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <polyline points="212,150 212,600" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  <polyline points="238,150 238,600" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" opacity="0.3" />
                  
                  <polyline points="270,160 320,160 320,620 270,620 270,160" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <ellipse cx="295" cy="160" rx="25" ry="8" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />

                  {/* Center pilot towers */}
                  <polyline points="340,100 400,100 400,620 340,620 340,100" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                  <ellipse cx="370" cy="100" rx="30" ry="10" fill="none" stroke="var(--color-lavender)" strokeWidth="1.5" />
                  <polyline points="355,125 355,600" fill="none" stroke="var(--color-lavender)" strokeWidth="0.6" opacity="0.3" />
                  <polyline points="385,125 385,600" fill="none" stroke="var(--color-lavender)" strokeWidth="0.6" opacity="0.3" />

                  {/* Right manufacturing towers */}
                  <polyline points="650,90 710,90 710,620 650,620 650,90" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <ellipse cx="680" cy="90" rx="30" ry="10" fill="none" stroke="var(--color-coral)" strokeWidth="1.5" />
                  <polyline points="665,115 665,600" fill="none" stroke="var(--color-coral)" strokeWidth="0.6" opacity="0.3" />
                  <polyline points="695,115 695,600" fill="none" stroke="var(--color-coral)" strokeWidth="0.6" opacity="0.3" />
                  
                  <polyline points="730,120 780,120 780,620 730,620 730,120" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                  <ellipse cx="755" cy="120" rx="25" ry="8" fill="none" stroke="var(--color-coral)" strokeWidth="1.5" />
                </g>

                {/* Tower details */}
                <g className="tower-detail" opacity="0">
                  <polyline points="200,300 250,300" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <polyline points="200,450 250,450" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <polyline points="340,270 400,270" fill="none" stroke="var(--color-lavender)" strokeWidth="0.5" />
                  <polyline points="340,420 400,420" fill="none" stroke="var(--color-lavender)" strokeWidth="0.5" />
                  <polyline points="650,260 710,260" fill="none" stroke="var(--color-coral)" strokeWidth="0.5" />
                  <polyline points="650,410 710,410" fill="none" stroke="var(--color-coral)" strokeWidth="0.5" />
                </g>

                {/* Storage tanks */}
                <g className="tank-structure">
                  <circle cx="140" cy="520" r="40" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline points="140,480 140,460" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  
                  <circle cx="120" cy="450" r="30" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <polyline points="120,420 120,405" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" />
                  
                  <circle cx="830" cy="510" r="45" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                  <polyline points="830,465 830,445" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  
                  <circle cx="880" cy="540" r="35" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                  <polyline points="880,505 880,485" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" />
                </g>

                {/* Pipe networks */}
                <g className="pipe-network">
                  <polyline points="250,350 340,330" fill="none" stroke="var(--color-lavender)" strokeWidth="3" strokeLinecap="round" />
                  <polyline points="400,370 480,360" fill="none" stroke="var(--color-lavender)" strokeWidth="3" strokeLinecap="round" />
                  <polyline points="570,360 650,350" fill="none" stroke="var(--color-coral)" strokeWidth="3" strokeLinecap="round" />
                  <polyline points="450,250 450,220 550,220 550,250" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round" />
                  <polyline points="140,520 200,490" fill="none" stroke="var(--color-blue)" strokeWidth="2" opacity="0.6" />
                  <polyline points="710,500 830,520" fill="none" stroke="var(--color-blue)" strokeWidth="2" opacity="0.6" />
                  <circle cx="295" cy="340" r="4" fill="var(--color-lavender)" opacity="0.8" />
                  <circle cx="440" cy="365" r="4" fill="var(--color-lavender)" opacity="0.8" />
                  <circle cx="610" cy="355" r="4" fill="var(--color-coral)" opacity="0.8" />
                </g>

                {/* Supporting buildings */}
                <g className="support-building">
                  <polyline points="90,540 170,540 170,620 90,620 90,540" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" opacity="0.5" />
                  <polyline points="90,580 170,580" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                  
                  <polyline points="800,540 900,540 900,620 800,620 800,540" fill="none" stroke="var(--color-blue)" strokeWidth="1.2" opacity="0.5" />
                  <polygon points="800,540 850,520 900,540" fill="rgba(37,99,235,0.08)" stroke="var(--color-blue)" strokeWidth="0.8" />
                  <polyline points="800,580 900,580" fill="none" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                </g>

                {/* Molecular accents */}
                <g className="molecule-accent" opacity="0">
                  <circle cx="100" cy="200" r="3" fill="var(--color-blue)" />
                  <circle cx="150" cy="180" r="3" fill="var(--color-blue)" />
                  <circle cx="850" cy="220" r="3" fill="var(--color-coral)" />
                  <circle cx="900" cy="190" r="3" fill="var(--color-coral)" />
                  <line x1="100" y1="200" x2="150" y2="180" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                  <line x1="850" y1="220" x2="900" y2="190" stroke="var(--color-coral)" strokeWidth="0.8" opacity="0.4" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
      </div>
    </section>
  );
}
