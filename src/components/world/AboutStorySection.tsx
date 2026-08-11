"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const METRICS = [
  { value: 30, suffix: "+", label: "Years of Experience", color: "var(--color-blue)" },
  { value: 900, suffix: " m³", label: "Reactor Capacity", color: "var(--color-lavender)" },
  { value: 2, suffix: "", label: "Manufacturing Sites", color: "var(--color-coral)" },
  { value: 50, suffix: "+", label: "Process Chemists", color: "var(--color-blue)" },
  { value: 15, suffix: "+", label: "Global Customers", color: "var(--color-lavender)" },
  { value: 20, suffix: "+", label: "Countries Served", color: "var(--color-green)" },
];

export default function AboutStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState(METRICS.map(() => 0));
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  useEffect(() => {
    initGSAP();
    
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      onEnter: () => {
        METRICS.forEach((metric, i) => {
          gsap.to(
            { value: 0 },
            {
              value: metric.value,
              duration: 2,
              ease: "power2.out",
              delay: i * 0.08,
              onUpdate: function () {
                setCounts((prev) => {
                  const newCounts = [...prev];
                  newCounts[i] = Math.floor(this.targets()[0].value);
                  return newCounts;
                });
              },
            }
          );
        });
      },
      once: true,
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-story"
      className="relative w-full min-h-screen flex items-center"
      style={{ background: "var(--color-white)", padding: "8rem 0" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-20">
        <div className="grid lg:grid-cols-[45%_55%] gap-20 items-start">
          {/* LEFT: About CMCD */}
          <div className="space-y-8">
            <span className="t-label">About CMCD</span>
            
            <h2 className="t-heading leading-tight">
              Chemistry Built on Capability,<br />
              Partnership Built on Trust.
            </h2>

            <div className="w-16 h-px bg-blue-600" />

            <p className="t-body-large leading-relaxed">
              CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and 
              Specialty Chemicals sectors, providing end-to-end capabilities across development, 
              scale-up and commercial manufacturing.
            </p>

            <div className="space-y-6 mt-12">
              <CapabilityPoint text="Integrated Berigai facility near Bengaluru" />
              <CapabilityPoint text="R&D, pilot and commercial manufacturing co-located" />
              <CapabilityPoint text="900 m³ reactor capacity with hazardous chemistry expertise" />
              <CapabilityPoint text="Proven safety and sustainability leadership" />
            </div>
          </div>

          {/* RIGHT: Our Story in Numbers */}
          <div className="space-y-8">
            <span className="t-label">Our Story in Numbers</span>

            <div className="grid grid-cols-2 gap-6">
              {METRICS.map((metric, i) => (
                <div
                  key={metric.label}
                  className="relative p-8 rounded-xl transition-all duration-300 cursor-pointer group"
                  style={{
                    background: hoveredMetric === i ? "rgba(0,0,0,0.02)" : "transparent",
                    border: `2px solid ${hoveredMetric === i ? metric.color : "rgba(0,0,0,0.06)"}`,
                    transform: hoveredMetric === i ? "translateY(-4px)" : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredMetric(i)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div
                    className="text-6xl font-extralight mb-3 transition-colors"
                    style={{ color: hoveredMetric === i ? metric.color : "var(--color-black)" }}
                  >
                    {counts[i]}
                    <span className="text-4xl">{metric.suffix}</span>
                  </div>
                  <div className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                    {metric.label}
                  </div>

                  {hoveredMetric === i && (
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none transition-opacity"
                      style={{
                        boxShadow: `0 20px 60px ${metric.color}33`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilityPoint({ text }: { text: string }) {
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
