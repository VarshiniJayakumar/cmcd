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

    // Foundation (0.40-0.48)
    tl.to(allPaths.filter((_, i) => i < 2), {
      strokeDashoffset: 0,
      duration: 0.08,
    }, 0.40);

    // Main structure (0.48-0.58)
    tl.to(allPaths.filter((_, i) => i >= 2 && i < 8), {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.10,
      stagger: 0.01,
    }, 0.48);

    // Reactors R&D (0.58-0.66)
    tl.to(allPaths.filter((_, i) => i >= 8 && i < 11), {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.08,
      stagger: 0.01,
    }, 0.58)
      .to(".label-rnd", { opacity: 1, duration: 0.02 }, 0.64);

    // Pilot section (0.66-0.74)
    tl.to(allPaths.filter((_, i) => i >= 11 && i < 14), {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.08,
      stagger: 0.01,
    }, 0.66)
      .to(".label-pilot", { opacity: 1, duration: 0.02 }, 0.72);

    // Manufacturing (0.74-0.82)
    tl.to(allPaths.filter((_, i) => i >= 14 && i < 17), {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.08,
      stagger: 0.01,
    }, 0.74)
      .to(".label-mfg", { opacity: 1, duration: 0.02 }, 0.80);

    // Pipes and connections (0.82-0.90)
    tl.to(allPaths.filter((_, i) => i >= 17 && i < 22), {
      strokeDashoffset: 0,
      duration: 0.08,
      stagger: 0.01,
    }, 0.82);

    // Final details (0.90-1.0)
    tl.to(allPaths.filter((_, i) => i >= 22), {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.10,
    }, 0.90);

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
      style={{ height: "300vh" }}
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
                viewBox="0 0 900 650"
                className="w-full h-auto"
                style={{ filter: "drop-shadow(0 8px 30px rgba(37,99,235,0.08))" }}
              >
                {/* Foundation / Ground */}
                <line x1="50" y1="600" x2="850" y2="600" stroke="var(--color-blue)" strokeWidth="2.5" />
                <line x1="50" y1="605" x2="850" y2="605" stroke="var(--color-blue)" strokeWidth="1" opacity="0.3" />

                {/* Main Building Base */}
                <rect x="180" y="400" width="540" height="200" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                <rect x="180" y="400" width="540" height="200" fill="rgba(37,99,235,0.02)" />
                
                {/* Building Grid */}
                <line x1="180" y1="450" x2="720" y2="450" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.4" />
                <line x1="180" y1="500" x2="720" y2="500" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.4" />
                <line x1="180" y1="550" x2="720" y2="550" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.4" />
                <line x1="350" y1="400" x2="350" y2="600" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.4" />
                <line x1="550" y1="400" x2="550" y2="600" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.4" />

                {/* Reactor Tower 1 (R&D) */}
                <rect x="220" y="220" width="100" height="180" fill="none" stroke="var(--color-blue)" strokeWidth="3" />
                <rect x="220" y="220" width="100" height="180" fill="rgba(37,99,235,0.04)" />
                <ellipse cx="270" cy="220" rx="50" ry="18" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                <circle cx="270" cy="280" r="12" fill="var(--color-blue)" opacity="0.25" />
                <line x1="240" y1="250" x2="240" y2="380" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.5" />
                <line x1="300" y1="250" x2="300" y2="380" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.5" />

                {/* Reactor Tower 2 (Pilot/Scale-Up) */}
                <rect x="400" y="200" width="110" height="200" fill="none" stroke="var(--color-lavender)" strokeWidth="3" />
                <rect x="400" y="200" width="110" height="200" fill="rgba(167,139,250,0.04)" />
                <ellipse cx="455" cy="200" rx="55" ry="20" fill="none" stroke="var(--color-lavender)" strokeWidth="2.5" />
                <circle cx="455" cy="270" r="15" fill="var(--color-lavender)" opacity="0.25" />
                <line x1="420" y1="235" x2="420" y2="380" stroke="var(--color-lavender)" strokeWidth="1.5" opacity="0.5" />
                <line x1="490" y1="235" x2="490" y2="380" stroke="var(--color-lavender)" strokeWidth="1.5" opacity="0.5" />

                {/* Reactor Tower 3 (Manufacturing) */}
                <rect x="580" y="180" width="120" height="220" fill="none" stroke="var(--color-coral)" strokeWidth="3" />
                <rect x="580" y="180" width="120" height="220" fill="rgba(251,113,133,0.04)" />
                <ellipse cx="640" cy="180" rx="60" ry="22" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" />
                <circle cx="640" cy="260" r="18" fill="var(--color-coral)" opacity="0.25" />
                <line x1="600" y1="220" x2="600" y2="380" stroke="var(--color-coral)" strokeWidth="1.5" opacity="0.5" />
                <line x1="680" y1="220" x2="680" y2="380" stroke="var(--color-coral)" strokeWidth="1.5" opacity="0.5" />

                {/* Storage Tanks */}
                <circle cx="120" cy="520" r="45" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                <circle cx="120" cy="520" r="45" fill="rgba(37,99,235,0.02)" />
                <line x1="120" y1="475" x2="120" y2="455" stroke="var(--color-blue)" strokeWidth="2" />
                
                <circle cx="780" cy="510" r="50" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                <circle cx="780" cy="510" r="50" fill="rgba(37,99,235,0.02)" />
                <line x1="780" y1="460" x2="780" y2="440" stroke="var(--color-blue)" strokeWidth="2" />

                {/* Connecting Pipes - Main Process Lines */}
                <path d="M 320 300 L 400 290" stroke="var(--color-lavender)" strokeWidth="4" fill="none" />
                <path d="M 510 300 L 580 290" stroke="var(--color-coral)" strokeWidth="4" fill="none" />
                
                {/* Secondary Process Lines */}
                <path d="M 320 320 L 400 315" stroke="var(--color-lavender)" strokeWidth="2.5" fill="none" opacity="0.5" />
                <path d="M 510 320 L 580 315" stroke="var(--color-coral)" strokeWidth="2.5" fill="none" opacity="0.5" />

                {/* Vertical Connections to Base */}
                <path d="M 270 400 L 270 420" stroke="var(--color-blue)" strokeWidth="3" fill="none" />
                <path d="M 455 400 L 455 420" stroke="var(--color-lavender)" strokeWidth="3" fill="none" />
                <path d="M 640 400 L 640 420" stroke="var(--color-coral)" strokeWidth="3" fill="none" />

                {/* Process Flow Indicators */}
                <circle cx="360" cy="295" r="5" fill="var(--color-lavender)" opacity="0.8" />
                <circle cx="545" cy="295" r="5" fill="var(--color-coral)" opacity="0.8" />

                {/* Utility/Support Buildings */}
                <rect x="50" y="450" width="90" height="150" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.4" />
                <line x1="50" y1="500" x2="140" y2="500" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                <line x1="50" y1="550" x2="140" y2="550" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                
                <rect x="760" y="440" width="90" height="160" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.4" />
                <line x1="760" y1="490" x2="850" y2="490" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />
                <line x1="760" y1="540" x2="850" y2="540" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.3" />

                {/* Structural Framework */}
                <line x1="180" y1="400" x2="140" y2="370" stroke="var(--color-blue)" strokeWidth="1" opacity="0.3" />
                <line x1="720" y1="400" x2="760" y2="370" stroke="var(--color-blue)" strokeWidth="1" opacity="0.3" />

                {/* Detail Lines */}
                <line x1="200" y1="220" x2="170" y2="195" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />
                <line x1="170" y1="195" x2="140" y2="195" stroke="var(--color-blue)" strokeWidth="0.8" opacity="0.4" />

                {/* Labels */}
                <text className="label-rnd" x="270" y="630" textAnchor="middle" fill="var(--color-blue)" fontSize="15" fontWeight="600" opacity="0">
                  R&D
                </text>
                <text className="label-pilot" x="455" y="630" textAnchor="middle" fill="var(--color-lavender)" fontSize="15" fontWeight="600" opacity="0">
                  PILOT / SCALE-UP
                </text>
                <text className="label-mfg" x="640" y="630" textAnchor="middle" fill="var(--color-coral)" fontSize="15" fontWeight="600" opacity="0">
                  MANUFACTURING
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
