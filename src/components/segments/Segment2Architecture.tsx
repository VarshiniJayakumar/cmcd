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
    const paths = svg.querySelectorAll("path, line, rect, circle");

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
      } else if (path instanceof SVGRectElement || path instanceof SVGCircleElement) {
        gsap.set(path, { opacity: 0 });
      }
    });

    // Scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: ".segment2-content",
      },
    });

    // Text animation
    tl.fromTo(".seg2-text", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.2 })
      .to(".seg2-text", { opacity: 1, duration: 0.3 })
      .to(".seg2-text", { opacity: 0, x: -40, duration: 0.2 }, 0.9);

    // Building animation sequence
    const allPaths = Array.from(paths);
    
    // Foundation lines (0.1-0.2)
    tl.to(allPaths.filter((_, i) => i < 2), {
      strokeDashoffset: 0,
      duration: 0.1,
    }, 0.1);

    // Main structure (0.2-0.4)
    tl.to(allPaths.filter((_, i) => i >= 2 && i < 8), {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.2,
      stagger: 0.02,
    }, 0.2);

    // Reactors and tanks (0.4-0.6)
    tl.to(allPaths.filter((_, i) => i >= 8 && i < 15), {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.2,
      stagger: 0.015,
    }, 0.4);

    // Pipes and connections (0.6-0.8)
    tl.to(allPaths.filter((_, i) => i >= 15 && i < 22), {
      strokeDashoffset: 0,
      duration: 0.15,
      stagger: 0.01,
    }, 0.6);

    // Final details (0.8-0.95)
    tl.to(allPaths.filter((_, i) => i >= 22), {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 0.15,
    }, 0.8);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="segment-2"
      className="relative w-full bg-white"
      style={{ height: "250vh" }}
    >
      <div className="segment2-content sticky top-0 w-full h-screen flex items-center">
        <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20">
          <div className="grid lg:grid-cols-[40%_60%] gap-16 items-center">
            {/* LEFT: Text */}
            <div className="seg2-text space-y-8">
              <span className="t-label">Segment 02</span>
              <h2 className="t-heading">
                Chemistry Built on Capability,<br />
                Partnership Built on Trust.
              </h2>
              <div className="w-16 h-px bg-lavender-500" style={{ background: "var(--color-lavender)" }} />
              <p className="t-body">
                CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and 
                Specialty Chemicals sectors, providing end-to-end capabilities across development, 
                scale-up and commercial manufacturing.
              </p>
              <p className="t-body">
                At our integrated Berigai facility near Bengaluru, R&D, pilot and commercial 
                manufacturing capabilities are co-located, enabling a seamless transition from 
                development to scale.
              </p>
              <p className="t-body">
                With 900 m³ of reactor capacity and expertise in handling a wide range of hazardous 
                chemistries, we combine technical capability with the operational discipline required 
                for reliable commercial supply.
              </p>
            </div>

            {/* RIGHT: Architectural Facility Sketch */}
            <div className="relative">
              <svg
                ref={svgRef}
                viewBox="0 0 800 600"
                className="w-full h-auto"
                style={{ filter: "drop-shadow(0 4px 20px rgba(167,139,250,0.1))" }}
              >
                {/* Foundation / Ground */}
                <line x1="50" y1="550" x2="750" y2="550" stroke="var(--color-lavender)" strokeWidth="2" />
                <line x1="50" y1="555" x2="750" y2="555" stroke="var(--color-lavender)" strokeWidth="1" opacity="0.5" />

                {/* Main Building Structure */}
                <rect x="150" y="350" width="500" height="200" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                <rect x="150" y="350" width="500" height="200" fill="rgba(167,139,250,0.03)" />
                
                {/* Building Grid Lines */}
                <line x1="150" y1="400" x2="650" y2="400" stroke="var(--color-lavender)" strokeWidth="0.5" opacity="0.5" />
                <line x1="150" y1="450" x2="650" y2="450" stroke="var(--color-lavender)" strokeWidth="0.5" opacity="0.5" />
                <line x1="150" y1="500" x2="650" y2="500" stroke="var(--color-lavender)" strokeWidth="0.5" opacity="0.5" />
                <line x1="300" y1="350" x2="300" y2="550" stroke="var(--color-lavender)" strokeWidth="0.5" opacity="0.5" />
                <line x1="500" y1="350" x2="500" y2="550" stroke="var(--color-lavender)" strokeWidth="0.5" opacity="0.5" />

                {/* Reactor Tower 1 (R&D) */}
                <rect x="200" y="200" width="80" height="150" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                <rect x="200" y="200" width="80" height="150" fill="rgba(37,99,235,0.05)" />
                <ellipse cx="240" cy="200" rx="40" ry="15" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                <circle cx="240" cy="250" r="8" fill="var(--color-blue)" opacity="0.3" />
                <text x="240" y="390" textAnchor="middle" fill="var(--color-blue)" fontSize="12" fontWeight="600">R&D</text>

                {/* Reactor Tower 2 (Pilot) */}
                <rect x="360" y="180" width="90" height="170" fill="none" stroke="var(--color-lavender)" strokeWidth="2.5" />
                <rect x="360" y="180" width="90" height="170" fill="rgba(167,139,250,0.05)" />
                <ellipse cx="405" cy="180" rx="45" ry="18" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                <circle cx="405" cy="240" r="10" fill="var(--color-lavender)" opacity="0.3" />
                <text x="405" y="390" textAnchor="middle" fill="var(--color-lavender)" fontSize="12" fontWeight="600">PILOT</text>

                {/* Reactor Tower 3 (Manufacturing) */}
                <rect x="520" y="160" width="100" height="190" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" />
                <rect x="520" y="160" width="100" height="190" fill="rgba(251,113,133,0.05)" />
                <ellipse cx="570" cy="160" rx="50" ry="20" fill="none" stroke="var(--color-coral)" strokeWidth="2" />
                <circle cx="570" cy="230" r="12" fill="var(--color-coral)" opacity="0.3" />
                <text x="570" y="390" textAnchor="middle" fill="var(--color-coral)" fontSize="12" fontWeight="600">MFG</text>

                {/* Storage Tanks */}
                <circle cx="100" cy="480" r="35" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                <circle cx="100" cy="480" r="35" fill="rgba(167,139,250,0.03)" />
                <circle cx="700" cy="470" r="40" fill="none" stroke="var(--color-lavender)" strokeWidth="2" />
                <circle cx="700" cy="470" r="40" fill="rgba(167,139,250,0.03)" />

                {/* Connecting Pipes - Horizontal */}
                <path d="M 280 270 L 360 270" stroke="var(--color-lavender)" strokeWidth="3" fill="none" />
                <path d="M 450 265 L 520 265" stroke="var(--color-lavender)" strokeWidth="3" fill="none" />
                <path d="M 280 290 L 360 290" stroke="var(--color-lavender)" strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M 450 285 L 520 285" stroke="var(--color-lavender)" strokeWidth="2" fill="none" opacity="0.6" />

                {/* Connecting Pipes - Vertical */}
                <path d="M 240 350 L 240 380" stroke="var(--color-blue)" strokeWidth="2.5" fill="none" />
                <path d="M 405 350 L 405 380" stroke="var(--color-lavender)" strokeWidth="2.5" fill="none" />
                <path d="M 570 350 L 570 380" stroke="var(--color-coral)" strokeWidth="2.5" fill="none" />

                {/* Process Flow Indicators */}
                <circle cx="320" cy="270" r="4" fill="var(--color-lavender)" />
                <circle cx="485" cy="265" r="4" fill="var(--color-lavender)" />

                {/* Utility Buildings */}
                <rect x="50" y="420" width="70" height="130" fill="none" stroke="var(--color-lavender)" strokeWidth="1.5" opacity="0.5" />
                <rect x="680" y="410" width="70" height="140" fill="none" stroke="var(--color-lavender)" strokeWidth="1.5" opacity="0.5" />

                {/* Structural Frames */}
                <line x1="150" y1="350" x2="100" y2="320" stroke="var(--color-lavender)" strokeWidth="1" opacity="0.4" />
                <line x1="650" y1="350" x2="700" y2="320" stroke="var(--color-lavender)" strokeWidth="1" opacity="0.4" />

                {/* Detail annotations */}
                <line x1="180" y1="200" x2="160" y2="180" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.6" />
                <line x1="160" y1="180" x2="140" y2="180" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
