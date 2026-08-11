"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export default function Segment3IntegratedFacility() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [scrollZone, setScrollZone] = useState<string | null>(null);

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: ".segment3-content",
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.33) {
            setScrollZone("rnd");
          } else if (progress < 0.66) {
            setScrollZone("scaleup");
          } else {
            setScrollZone("mfg");
          }
        },
      },
    });

    // Title animation
    tl.fromTo(".seg3-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.15 })
      .to(".seg3-title", { opacity: 1, duration: 0.4 })
      .to(".seg3-title", { opacity: 0, y: -30, duration: 0.15 }, 0.85);

    // Zone activations
    tl.to(".zone-rnd", { opacity: 1, scale: 1, duration: 0.2 }, 0.15)
      .to(".pipe-rnd-scale", { strokeDashoffset: 0, duration: 0.15 }, 0.35)
      .to(".zone-scaleup", { opacity: 1, scale: 1, duration: 0.2 }, 0.35)
      .to(".pipe-scale-mfg", { strokeDashoffset: 0, duration: 0.15 }, 0.55)
      .to(".zone-mfg", { opacity: 1, scale: 1, duration: 0.2 }, 0.55)
      .to(".connection-line", { strokeDashoffset: 0, duration: 0.2 }, 0.75);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const zones = [
    { id: "rnd", label: "R&D", desc: "Laboratory synthesis & process development", x: 150, y: 200, color: "var(--color-blue)" },
    { id: "scaleup", label: "SCALE-UP", desc: "Pilot manufacturing & optimization", x: 400, y: 180, color: "var(--color-lavender)" },
    { id: "mfg", label: "MANUFACTURING", desc: "Commercial production at scale", x: 650, y: 200, color: "var(--color-coral)" },
  ];

  return (
    <section
      ref={sectionRef}
      id="facility"
      className="relative w-full bg-white"
      style={{ height: "400vh" }}
    >
      <div className="segment3-content sticky top-0 w-full h-screen flex items-center justify-center">
        <div className="w-full max-w-[1600px] mx-auto px-8">
          <div className="seg3-title text-center mb-16">
            <span className="t-label block mb-6">Segment 03</span>
            <h2 className="t-heading">
              ONE INTEGRATED FACILITY.<br />
              FROM DEVELOPMENT TO DELIVERY.
            </h2>
          </div>

          {/* Interactive Facility SVG */}
          <svg viewBox="0 0 900 600" className="w-full h-auto">
            {/* Ground */}
            <line x1="50" y1="520" x2="850" y2="520" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />

            {/* Zone: R&D */}
            <g
              className="zone-rnd cursor-pointer"
              style={{ opacity: 0, transform: "scale(0.95)", transformOrigin: "150px 320px" }}
              onMouseEnter={() => setActiveZone("rnd")}
              onMouseLeave={() => setActiveZone(null)}
            >
              <rect
                x="80"
                y="280"
                width="140"
                height="240"
                fill={scrollZone === "rnd" || activeZone === "rnd" ? "rgba(37,99,235,0.08)" : "rgba(37,99,235,0.03)"}
                stroke="var(--color-blue)"
                strokeWidth={scrollZone === "rnd" || activeZone === "rnd" ? "3" : "2"}
              />
              <ellipse cx="150" cy="280" rx="70" ry="25" fill="rgba(37,99,235,0.05)" stroke="var(--color-blue)" strokeWidth="2" />
              <circle cx="150" cy="360" r="15" fill="var(--color-blue)" opacity="0.2" />
              <text x="150" y="545" textAnchor="middle" fill="var(--color-blue)" fontSize="16" fontWeight="600">
                R&D
              </text>
            </g>

            {/* Pipe: R&D to Scale-Up */}
            <path
              className="pipe-rnd-scale"
              d="M 220 380 L 370 360"
              stroke="var(--color-lavender)"
              strokeWidth="5"
              fill="none"
              strokeDasharray="200"
              strokeDashoffset="200"
            />

            {/* Zone: Scale-Up */}
            <g
              className="zone-scaleup cursor-pointer"
              style={{ opacity: 0, transform: "scale(0.95)", transformOrigin: "450px 300px" }}
              onMouseEnter={() => setActiveZone("scaleup")}
              onMouseLeave={() => setActiveZone(null)}
            >
              <rect
                x="370"
                y="250"
                width="160"
                height="270"
                fill={scrollZone === "scaleup" || activeZone === "scaleup" ? "rgba(167,139,250,0.08)" : "rgba(167,139,250,0.03)"}
                stroke="var(--color-lavender)"
                strokeWidth={scrollZone === "scaleup" || activeZone === "scaleup" ? "3" : "2"}
              />
              <ellipse cx="450" cy="250" rx="80" ry="30" fill="rgba(167,139,250,0.05)" stroke="var(--color-lavender)" strokeWidth="2" />
              <circle cx="450" cy="350" r="18" fill="var(--color-lavender)" opacity="0.2" />
              <text x="450" y="545" textAnchor="middle" fill="var(--color-lavender)" fontSize="16" fontWeight="600">
                SCALE-UP
              </text>
            </g>

            {/* Pipe: Scale-Up to Manufacturing */}
            <path
              className="pipe-scale-mfg"
              d="M 530 370 L 650 390"
              stroke="var(--color-coral)"
              strokeWidth="5"
              fill="none"
              strokeDasharray="150"
              strokeDashoffset="150"
            />

            {/* Zone: Manufacturing */}
            <g
              className="zone-mfg cursor-pointer"
              style={{ opacity: 0, transform: "scale(0.95)", transformOrigin: "730px 320px" }}
              onMouseEnter={() => setActiveZone("mfg")}
              onMouseLeave={() => setActiveZone(null)}
            >
              <rect
                x="650"
                y="260"
                width="160"
                height="260"
                fill={scrollZone === "mfg" || activeZone === "mfg" ? "rgba(251,113,133,0.08)" : "rgba(251,113,133,0.03)"}
                stroke="var(--color-coral)"
                strokeWidth={scrollZone === "mfg" || activeZone === "mfg" ? "3" : "2"}
              />
              <ellipse cx="730" cy="260" rx="80" ry="30" fill="rgba(251,113,133,0.05)" stroke="var(--color-coral)" strokeWidth="2" />
              <circle cx="730" cy="360" r="20" fill="var(--color-coral)" opacity="0.2" />
              <text x="730" y="545" textAnchor="middle" fill="var(--color-coral)" fontSize="16" fontWeight="600">
                MANUFACTURING
              </text>
            </g>

            {/* Infrastructure Connection Line */}
            <path
              className="connection-line"
              d="M 150 520 L 450 520 L 730 520"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="680"
              strokeDashoffset="680"
            />

            {/* Flow indicators */}
            <circle className="flow-indicator" cx="300" cy="370" r="5" fill="var(--color-lavender)">
              <animate attributeName="cx" from="220" to="370" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle className="flow-indicator" cx="590" cy="380" r="5" fill="var(--color-coral)">
              <animate attributeName="cx" from="530" to="650" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Zone Information Panel */}
          {activeZone && (
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-white border-2 rounded-xl px-8 py-6 shadow-2xl max-w-md"
                 style={{ borderColor: zones.find(z => z.id === activeZone)?.color }}>
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2"
                    style={{ color: zones.find(z => z.id === activeZone)?.color }}>
                  {zones.find(z => z.id === activeZone)?.label}
                </h3>
                <p className="text-gray-600">
                  {zones.find(z => z.id === activeZone)?.desc}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
