"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const METRICS = [
  { value: 30, suffix: "+", label: "Years of Experience" },
  { value: 900, suffix: " m³", label: "Reactor Capacity" },
  { value: 2, suffix: "", label: "Manufacturing Sites" },
  { value: 50, suffix: "+", label: "Process Chemists" },
  { value: 15, suffix: "+", label: "Global Customers" },
  { value: 20, suffix: "+", label: "Countries Served" },
];

export default function Segment4AboutNumbers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState(METRICS.map(() => 0));
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        onEnter: () => {
          METRICS.forEach((metric, i) => {
            gsap.to({ val: 0 }, {
              val: metric.value,
              duration: 2,
              delay: i * 0.12,
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
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="segment-4"
      className="relative w-full min-h-screen flex items-center bg-white"
      style={{ padding: "10rem 0" }}
    >
      <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20">
        <div className="grid lg:grid-cols-[45%_55%] gap-20 items-start">
          {/* LEFT: About CMCD */}
          <div className="space-y-8">
            <span className="t-label">About CMCD</span>
            
            <h2 className="t-heading leading-tight">
              Chemistry Built on Capability,<br />
              Partnership Built on Trust.
            </h2>

            <div className="w-16 h-px" style={{ background: "var(--color-blue)" }} />

            <div className="space-y-6 t-body-large">
              <p>
                CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and 
                Specialty Chemicals sectors, providing end-to-end capabilities across development, 
                scale-up and commercial manufacturing.
              </p>
              <p>
                At our integrated Berigai facility near Bengaluru, R&D, pilot and commercial 
                manufacturing capabilities are co-located, enabling a seamless transition from 
                development to scale.
              </p>
              <p>
                With 900 m³ of reactor capacity and expertise in handling a wide range of hazardous 
                chemistries, we combine technical capability with the operational discipline required 
                for reliable commercial supply.
              </p>
            </div>

            <div className="pt-8 space-y-5">
              <Bullet text="Integrated facility with co-located capabilities" />
              <Bullet text="Advanced hazardous chemistry expertise" />
              <Bullet text="End-to-end development to commercial scale" />
              <Bullet text="Proven safety and sustainability record" />
            </div>
          </div>

          {/* RIGHT: Our Story in Numbers */}
          <div className="space-y-8">
            <span className="t-label">Our Story in Numbers</span>

            <div className="grid grid-cols-2 gap-6">
              {METRICS.map((metric, i) => (
                <div
                  key={i}
                  className="relative p-8 rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: hoveredMetric === i ? "rgba(37,99,235,0.04)" : "transparent",
                    border: `2px solid ${hoveredMetric === i ? "var(--color-blue)" : "rgba(0,0,0,0.08)"}`,
                    transform: hoveredMetric === i ? "translateY(-4px)" : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredMetric(i)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div
                    className="text-6xl font-extralight mb-3 transition-colors"
                    style={{ color: hoveredMetric === i ? "var(--color-blue)" : "var(--color-black)" }}
                  >
                    {counts[i]}
                    <span className="text-4xl">{metric.suffix}</span>
                  </div>
                  <div className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                    {metric.label}
                  </div>

                  {hoveredMetric === i && (
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        boxShadow: "0 20px 60px rgba(37,99,235,0.15)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Subtle background pattern */}
            <div className="mt-12 opacity-10">
              <svg width="100%" height="200" viewBox="0 0 400 200">
                <circle cx="50" cy="100" r="3" fill="var(--color-blue)" />
                <circle cx="150" cy="80" r="3" fill="var(--color-lavender)" />
                <circle cx="250" cy="120" r="3" fill="var(--color-coral)" />
                <circle cx="350" cy="90" r="3" fill="var(--color-green)" />
                <line x1="50" y1="100" x2="150" y2="80" stroke="var(--color-blue)" strokeWidth="1" />
                <line x1="150" y1="80" x2="250" y2="120" stroke="var(--color-lavender)" strokeWidth="1" />
                <line x1="250" y1="120" x2="350" y2="90" stroke="var(--color-coral)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "var(--color-blue)" }}
      />
      <p className="text-base" style={{ color: "var(--color-dark)" }}>
        {text}
      </p>
    </div>
  );
}
