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

    // Get all animatable elements
    const paths = svg.querySelectorAll("path, line, rect, circle, ellipse, polygon, polyline");

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
      } else {
        gsap.set(path, { opacity: 0 });
      }
    });

    // Scroll timeline with extended states
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: ".segment2-content",
      },
    });

    // STATE 1: Section intro (0-0.08)
    tl.fromTo(".seg2-label", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.05 })
      .to(".seg2-label", { opacity: 1, duration: 0.03 });

    // STATE 2: Site/Foundation (0.08-0.18)
    tl.to(".site-boundary", { strokeDashoffset: 0, duration: 0.04 }, 0.08)
      .to(".site-roads", { strokeDashoffset: 0, duration: 0.04, stagger: 0.01 }, 0.10)
      .to(".site-grid", { strokeDashoffset: 0, opacity: 0.3, duration: 0.04 }, 0.12);

    // STATE 3: Support buildings (0.18-0.28)
    tl.to(".building-support", { strokeDashoffset: 0, opacity: 1, duration: 0.06, stagger: 0.015 }, 0.18)
      .to(".building-support-fill", { opacity: 0.03, duration: 0.04 }, 0.22);

    // STATE 4: Utility structures (0.28-0.36)
    tl.to(".utility-building", { strokeDashoffset: 0, opacity: 1, duration: 0.05, stagger: 0.01 }, 0.28)
      .to(".utility-fill", { opacity: 0.04, duration: 0.03 }, 0.31);

    // STATE 5: Main reactor building (0.36-0.48)
    tl.to(".main-reactor-outline", { strokeDashoffset: 0, duration: 0.06 }, 0.36)
      .to(".main-reactor-structure", { strokeDashoffset: 0, opacity: 1, duration: 0.04, stagger: 0.01 }, 0.40)
      .to(".main-reactor-fill", { opacity: 0.05, duration: 0.02 }, 0.44);

    // STATE 6: Process towers (0.48-0.58)
    tl.to(".tower-structure", { strokeDashoffset: 0, opacity: 1, duration: 0.06, stagger: 0.015 }, 0.48)
      .to(".tower-top", { opacity: 1, duration: 0.04 }, 0.52);

    // STATE 7: Tanks and vessels (0.58-0.66)
    tl.to(".tank-outline", { strokeDashoffset: 0, opacity: 1, duration: 0.05, stagger: 0.01 }, 0.58)
      .to(".tank-fill", { opacity: 0.04, duration: 0.03 }, 0.62);

    // STATE 8: Pipe networks (0.66-0.76)
    tl.to(".pipe-main", { strokeDashoffset: 0, duration: 0.06, stagger: 0.01 }, 0.66)
      .to(".pipe-connect", { strokeDashoffset: 0, duration: 0.04, stagger: 0.008 }, 0.70);

    // STATE 9: R&D highlight (0.76-0.82)
    tl.to(".label-rnd", { opacity: 1, scale: 1, duration: 0.03 }, 0.76)
      .to(".zone-rnd", { opacity: 0.15, duration: 0.03 }, 0.78);

    // STATE 10: Pilot/Scale-up highlight (0.82-0.88)
    tl.to(".zone-rnd", { opacity: 0.06, duration: 0.02 }, 0.82)
      .to(".label-pilot", { opacity: 1, scale: 1, duration: 0.03 }, 0.82)
      .to(".zone-pilot", { opacity: 0.15, duration: 0.03 }, 0.84);

    // STATE 11: Manufacturing highlight (0.88-0.94)
    tl.to(".zone-pilot", { opacity: 0.06, duration: 0.02 }, 0.88)
      .to(".label-mfg", { opacity: 1, scale: 1, duration: 0.03 }, 0.88)
      .to(".zone-mfg", { opacity: 0.15, duration: 0.03 }, 0.90);

    // STATE 12: Complete facility (0.94-1.0)
    tl.to(".final-label", { opacity: 1, y: 0, duration: 0.04 }, 0.94)
      .to(".zone-mfg", { opacity: 0.08, duration: 0.02 }, 0.96);

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
      style={{ height: "500vh" }}
    >
      <div className="segment2-content sticky top-0 w-full h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-[1900px] mx-auto px-8 lg:px-16">
          
          {/* Section label */}
          <div className="seg2-label absolute top-24 left-8 lg:left-16 z-10">
            <span className="t-label">CMCD FACILITY · BERIGAI</span>
          </div>

          {/* Final message */}
          <div className="final-label absolute bottom-24 left-8 lg:left-16 z-10 opacity-0 transform translate-y-8">
            <h3 className="t-subheading" style={{ color: "var(--color-dark)" }}>
              One Integrated Facility.<br />
              From Development to Delivery.
            </h3>
          </div>

          {/* Main facility SVG - Large scale */}
          <div className="w-full flex justify-center items-center">
            <svg
              ref={svgRef}
              viewBox="0 0 1400 900"
              className="w-full h-auto"
              style={{ maxHeight: "85vh", filter: "drop-shadow(0 10px 40px rgba(37,99,235,0.06))" }}
            >
              {/* SITE BOUNDARY & ROADS */}
              <g className="site-boundary">
                <rect x="50" y="100" width="1300" height="750" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
              </g>
              
              <g className="site-roads">
                <line x1="50" y1="850" x2="1350" y2="850" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />
                <line x1="250" y1="100" x2="250" y2="850" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
                <line x1="700" y1="100" x2="700" y2="850" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
                <line x1="1100" y1="100" x2="1100" y2="850" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
              </g>

              <g className="site-grid">
                <line x1="50" y1="400" x2="1350" y2="400" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
                <line x1="50" y1="600" x2="1350" y2="600" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
                <line x1="450" y1="100" x2="450" y2="850" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
                <line x1="900" y1="100" x2="900" y2="850" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
              </g>

              {/* SUPPORT BUILDINGS - Based on reference (white/light buildings) */}
              <g className="building-support">
                {/* Left side admin/support building */}
                <rect x="80" y="650" width="140" height="180" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                <rect className="building-support-fill" x="80" y="650" width="140" height="180" fill="var(--color-blue)" opacity="0" />
                <line x1="80" y1="700" x2="220" y2="700" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.5" />
                <line x1="80" y1="750" x2="220" y2="750" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.5" />
                <line x1="80" y1="800" x2="220" y2="800" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.5" />
                
                {/* Right side support building */}
                <rect x="1180" y="680" width="150" height="150" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
                <rect className="building-support-fill" x="1180" y="680" width="150" height="150" fill="var(--color-blue)" opacity="0" />
                <line x1="1180" y1="730" x2="1330" y2="730" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.5" />
                <line x1="1180" y1="780" x2="1330" y2="780" stroke="var(--color-blue)" strokeWidth="0.5" opacity="0.5" />
              </g>

              {/* UTILITY STRUCTURES */}
              <g className="utility-building">
                {/* Small utility boxes */}
                <rect x="80" y="550" width="80" height="80" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.7" />
                <rect className="utility-fill" x="80" y="550" width="80" height="80" fill="var(--color-blue)" opacity="0" />
                
                <rect x="1240" y="560" width="70" height="90" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.7" />
                <rect className="utility-fill" x="1240" y="560" width="70" height="90" fill="var(--color-blue)" opacity="0" />
              </g>

              {/* MAIN REACTOR BUILDING - Center massive structure from reference */}
              <g className="main-reactor-outline">
                <rect x="520" y="320" width="360" height="500" fill="none" stroke="var(--color-blue)" strokeWidth="3" />
                <rect className="main-reactor-fill" x="520" y="320" width="360" height="500" fill="var(--color-blue)" opacity="0" />
              </g>

              <g className="main-reactor-structure">
                {/* Main reactor grid structure - mimicking reference framework */}
                <line x1="520" y1="400" x2="880" y2="400" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                <line x1="520" y1="480" x2="880" y2="480" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                <line x1="520" y1="560" x2="880" y2="560" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                <line x1="520" y1="640" x2="880" y2="640" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                <line x1="520" y1="720" x2="880" y2="720" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                
                <line x1="620" y1="320" x2="620" y2="820" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                <line x1="700" y1="320" x2="700" y2="820" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                <line x1="780" y1="320" x2="780" y2="820" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.6" />
                
                {/* Internal reactor vessels */}
                <circle cx="620" cy="500" r="35" fill="none" stroke="var(--color-blue)" strokeWidth="2" opacity="0.8" />
                <circle cx="700" cy="480" r="40" fill="none" stroke="var(--color-blue)" strokeWidth="2" opacity="0.8" />
                <circle cx="780" cy="520" r="38" fill="none" stroke="var(--color-blue)" strokeWidth="2" opacity="0.8" />
                <circle cx="660" cy="640" r="42" fill="none" stroke="var(--color-blue)" strokeWidth="2" opacity="0.8" />
                <circle cx="760" cy="660" r="40" fill="none" stroke="var(--color-blue)" strokeWidth="2" opacity="0.8" />
              </g>

              {/* PROCESS TOWERS - Tall structures from reference */}
              <g className="tower-structure">
                {/* Left tower cluster */}
                <rect x="300" y="200" width="70" height="600" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                <rect x="300" y="200" width="70" height="600" fill="rgba(37,99,235,0.02)" opacity="0" />
                <line x1="320" y1="250" x2="320" y2="780" stroke="var(--color-blue)" strokeWidth="1" opacity="0.4" />
                <line x1="350" y1="250" x2="350" y2="780" stroke="var(--color-blue)" strokeWidth="1" opacity="0.4" />
                
                <rect x="390" y="240" width="80" height="560" fill="none" stroke="var(--color-lavender)" strokeWidth="2.5" />
                <rect x="390" y="240" width="80" height="560" fill="rgba(167,139,250,0.02)" opacity="0" />
                <line x1="415" y1="280" x2="415" y2="780" stroke="var(--color-lavender)" strokeWidth="1" opacity="0.4" />
                <line x1="445" y1="280" x2="445" y2="780" stroke="var(--color-lavender)" strokeWidth="1" opacity="0.4" />

                {/* Right tower cluster */}
                <rect x="920" y="220" width="75" height="580" fill="none" stroke="var(--color-lavender)" strokeWidth="2.5" />
                <rect x="920" y="220" width="75" height="580" fill="rgba(167,139,250,0.02)" opacity="0" />
                <line x1="945" y1="260" x2="945" y2="780" stroke="var(--color-lavender)" strokeWidth="1" opacity="0.4" />
                <line x1="970" y1="260" x2="970" y2="780" stroke="var(--color-lavender)" strokeWidth="1" opacity="0.4" />

                <rect x="1010" y="180" width="85" height="620" fill="none" stroke="var(--color-coral)" strokeWidth="2.5" />
                <rect x="1010" y="180" width="85" height="620" fill="rgba(251,113,133,0.02)" opacity="0" />
                <line x1="1040" y1="220" x2="1040" y2="780" stroke="var(--color-coral)" strokeWidth="1" opacity="0.4" />
                <line x1="1070" y1="220" x2="1070" y2="780" stroke="var(--color-coral)" strokeWidth="1" opacity="0.4" />
              </g>

              <g className="tower-top">
                {/* Tower tops/caps */}
                <ellipse cx="335" cy="200" rx="35" ry="12" fill="none" stroke="var(--color-blue)" strokeWidth="2" opacity="0" />
                <ellipse cx="430" cy="240" rx="40" ry="14" fill="none" stroke="var(--color-lavender)" strokeWidth="2" opacity="0" />
                <ellipse cx="957" cy="220" rx="37" ry="13" fill="none" stroke="var(--color-lavender)" strokeWidth="2" opacity="0" />
                <ellipse cx="1052" cy="180" rx="42" ry="15" fill="none" stroke="var(--color-coral)" strokeWidth="2" opacity="0" />
              </g>

              {/* STORAGE TANKS - Cylindrical structures */}
              <g className="tank-outline">
                {/* Left tank farm */}
                <circle cx="140" cy="450" r="50" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                <circle className="tank-fill" cx="140" cy="450" r="50" fill="var(--color-blue)" opacity="0" />
                <line x1="140" y1="400" x2="140" y2="380" stroke="var(--color-blue)" strokeWidth="2" />
                
                <circle cx="100" cy="350" r="40" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                <circle className="tank-fill" cx="100" cy="350" r="40" fill="var(--color-blue)" opacity="0" />
                <line x1="100" y1="310" x2="100" y2="290" stroke="var(--color-blue)" strokeWidth="1.5" />

                <circle cx="190" cy="370" r="45" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                <circle className="tank-fill" cx="190" cy="370" r="45" fill="var(--color-blue)" opacity="0" />
                <line x1="190" y1="325" x2="190" y2="305" stroke="var(--color-blue)" strokeWidth="1.5" />

                {/* Right tank farm */}
                <circle cx="1180" cy="430" r="55" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" />
                <circle className="tank-fill" cx="1180" cy="430" r="55" fill="var(--color-blue)" opacity="0" />
                <line x1="1180" y1="375" x2="1180" y2="355" stroke="var(--color-blue)" strokeWidth="2" />

                <circle cx="1260" cy="470" r="48" fill="none" stroke="var(--color-blue)" strokeWidth="2" />
                <circle className="tank-fill" cx="1260" cy="470" r="48" fill="var(--color-blue)" opacity="0" />
                <line x1="1260" y1="422" x2="1260" y2="402" stroke="var(--color-blue)" strokeWidth="1.5" />
              </g>

              {/* PIPE NETWORKS - Connecting infrastructure */}
              <g className="pipe-main">
                {/* Horizontal main pipes */}
                <polyline points="370,500 520,480" fill="none" stroke="var(--color-lavender)" strokeWidth="5" strokeLinecap="round" />
                <polyline points="880,520 920,510" fill="none" stroke="var(--color-lavender)" strokeWidth="5" strokeLinecap="round" />
                <polyline points="880,600 1010,580" fill="none" stroke="var(--color-coral)" strokeWidth="5" strokeLinecap="round" />
                
                {/* Vertical connections */}
                <polyline points="620,320 620,280 700,280 700,320" fill="none" stroke="var(--color-blue)" strokeWidth="4" strokeLinecap="round" />
                <polyline points="780,320 780,300 860,300" fill="none" stroke="var(--color-blue)" strokeWidth="4" strokeLinecap="round" />
              </g>

              <g className="pipe-connect">
                {/* Secondary pipe connections */}
                <polyline points="190,370 300,420" fill="none" stroke="var(--color-blue)" strokeWidth="3" opacity="0.6" />
                <polyline points="470,400 520,450" fill="none" stroke="var(--color-lavender)" strokeWidth="3" opacity="0.6" />
                <polyline points="880,700 1010,720" fill="none" stroke="var(--color-coral)" strokeWidth="3" opacity="0.6" />
                <polyline points="1095,600 1180,550" fill="none" stroke="var(--color-blue)" strokeWidth="3" opacity="0.6" />
                
                {/* Small connection indicators */}
                <circle cx="450" cy="500" r="6" fill="var(--color-lavender)" opacity="0.8" />
                <circle cx="900" cy="515" r="6" fill="var(--color-lavender)" opacity="0.8" />
                <circle cx="945" cy="590" r="6" fill="var(--color-coral)" opacity="0.8" />
              </g>

              {/* ZONE HIGHLIGHTS - R&D, Pilot, Manufacturing */}
              <g className="zone-rnd">
                <rect x="270" y="180" width="230" height="650" fill="var(--color-blue)" opacity="0" />
              </g>

              <g className="zone-pilot">
                <rect x="500" y="200" width="420" height="650" fill="var(--color-lavender)" opacity="0" />
              </g>

              <g className="zone-mfg">
                <rect x="900" y="160" width="220" height="670" fill="var(--color-coral)" opacity="0" />
              </g>

              {/* ZONE LABELS */}
              <g className="label-rnd" opacity="0" transform="scale(0.9)" style={{ transformOrigin: "385px 150px" }}>
                <rect x="300" y="130" width="170" height="40" fill="white" stroke="var(--color-blue)" strokeWidth="2" rx="4" />
                <text x="385" y="157" textAnchor="middle" fill="var(--color-blue)" fontSize="18" fontWeight="700">
                  R&amp;D
                </text>
              </g>

              <g className="label-pilot" opacity="0" transform="scale(0.9)" style={{ transformOrigin: "700px 150px" }}>
                <rect x="580" y="130" width="240" height="40" fill="white" stroke="var(--color-lavender)" strokeWidth="2" rx="4" />
                <text x="700" y="157" textAnchor="middle" fill="var(--color-lavender)" fontSize="18" fontWeight="700">
                  PILOT / SCALE-UP
                </text>
              </g>

              <g className="label-mfg" opacity="0" transform="scale(0.9)" style={{ transformOrigin: "1010px 130px" }}>
                <rect x="880" y="100" width="260" height="40" fill="white" stroke="var(--color-coral)" strokeWidth="2" rx="4" />
                <text x="1010" y="127" textAnchor="middle" fill="var(--color-coral)" fontSize="18" fontWeight="700">
                  MANUFACTURING
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
