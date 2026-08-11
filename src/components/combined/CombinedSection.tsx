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

export default function CombinedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState(METRICS.map(() => 0));
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  useEffect(() => {
    initGSAP();
    
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      onEnter: () => {
        METRICS.forEach((metric, i) => {
          gsap.to(
            { value: 0 },
            {
              value: metric.value,
              duration: 2,
              ease: "power2.out",
              delay: i * 0.1,
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
      id="combined"
      className="relative min-h-screen flex items-center"
      style={{ background: "var(--color-white)" }}
    >
      <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20 py-32">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* LEFT: About Us */}
          <div className="flex flex-col justify-center space-y-8 lg:pr-12 lg:border-r rule-v">
            <span className="t-label">About CMCD</span>
            
            <h2 className="t-heading">
              Chemistry Built on Capability,<br />
              Partnership Built on Trust.
            </h2>

            <div className="rule-h" style={{ width: "4rem" }} />

            <p className="t-body">
              CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and 
              Specialty Chemicals sectors, providing end-to-end capabilities across development, 
              scale-up and commercial manufacturing.
            </p>

            <div className="space-y-4">
              <DetailPoint text="Integrated Berigai facility near Bengaluru" />
              <DetailPoint text="R&D, pilot and commercial manufacturing co-located" />
              <DetailPoint text="900 m³ reactor capacity with hazardous chemistry expertise" />
              <DetailPoint text="Proven safety and sustainability record" />
            </div>
          </div>

          {/* RIGHT: Our Story in Numbers */}
          <div className="flex flex-col justify-center lg:pl-12">
            <span className="t-label mb-8">Our Story in Numbers</span>

            <div className="grid grid-cols-2 gap-6">
              {METRICS.map((metric, i) => (
                <div
                  key={metric.label}
                  className="metric-card relative p-8 rounded-lg transition-all cursor-pointer group"
                  style={{
                    background: hoveredMetric === i ? "var(--color-gray-50)" : "transparent",
                    border: `1px solid ${hoveredMetric === i ? "var(--color-blue)" : "rgba(0,0,0,0.08)"}`,
                    transform: hoveredMetric === i ? "translateY(-4px)" : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredMetric(i)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div
                    className="text-5xl font-light mb-3"
                    style={{ color: hoveredMetric === i ? "var(--color-blue)" : "var(--color-black)" }}
                  >
                    {counts[i]}
                    {metric.suffix}
                  </div>
                  <div className="t-body" style={{ fontSize: "0.875rem" }}>
                    {metric.label}
                  </div>

                  {hoveredMetric === i && (
                    <div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        boxShadow: "0 12px 40px rgba(37, 99, 235, 0.15)",
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

function DetailPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: "var(--color-blue)" }}
      />
      <p className="t-body" style={{ fontSize: "1rem" }}>
        {text}
      </p>
    </div>
  );
}
