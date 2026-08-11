"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const METRICS = [
  { value: 30, suffix: "+", label: "Years of Experience", subtext: "Established expertise since 1993", color: "var(--color-blue)" },
  { value: 900, suffix: "m³", label: "Reactor Capacity", subtext: "State-of-the-art processing capability", color: "var(--color-blue)" },
  { value: 2, suffix: "", label: "Manufacturing Sites", subtext: "Integrated facilities at Berigai", color: "var(--color-lavender)" },
  { value: 50, suffix: "+", label: "Process Chemists", subtext: "Dedicated team of experts", color: "var(--color-coral)" },
  { value: 15, suffix: "+", label: "Global Customers", subtext: "Trusted partnerships worldwide", color: "var(--color-green)" },
  { value: 20, suffix: "+", label: "Countries Served", subtext: "International reach and impact", color: "var(--color-green)" },
];

export default function Segment4AboutNumbers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);

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
        pin: ".segment4-content",
        onUpdate: (self) => {
          const progress = self.progress;
          
          if (progress < 0.15) {
            setCurrentMetric(-1); // Initial state showing intro
          } else {
            // Distribute 6 metrics across 0.15-1.0 range
            const metricProgress = (progress - 0.15) / 0.85;
            const metricIndex = Math.floor(metricProgress * METRICS.length);
            setCurrentMetric(Math.min(metricIndex, METRICS.length - 1));
          }
        },
      },
    });

    // About Us section - visible from start
    tl.fromTo(".about-section", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08 }, 0);

    // Technical background visual
    tl.fromTo(".tech-visual", { opacity: 0 }, { opacity: 0.08, duration: 0.10 }, 0.05);

    // Numbers title
    tl.fromTo(".numbers-label", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.06 }, 0.10);

    // Metric animations - each gets its own entrance
    METRICS.forEach((_, i) => {
      const startTime = 0.15 + (i * 0.85 / METRICS.length);
      tl.fromTo(`.metric-${i}`,
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08 },
        startTime
      );
      
      // Previous metrics fade but remain visible
      if (i > 0) {
        tl.to(`.metric-${i - 1}`, { opacity: 0.25, scale: 0.95, duration: 0.05 }, startTime);
      }
      
      // Animate technical elements for each metric
      tl.fromTo(`.tech-element-${i}`,
        { strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 0.10 },
        startTime + 0.02
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Animate current metric value with counting effect
  useEffect(() => {
    if (currentMetric >= 0 && currentMetric < METRICS.length) {
      const target = METRICS[currentMetric].value;
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: function() {
          setDisplayValue(Math.floor((this.targets()[0] as any).val));
        },
      });
    }
  }, [currentMetric]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full"
      style={{ height: "550vh", background: "linear-gradient(180deg, #ffffff 0%, #fafaf9 100%)" }}
    >
      <div className="segment4-content sticky top-0 w-full h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20">
          <div className="grid lg:grid-cols-[42%_58%] gap-24 items-center">
            
            {/* LEFT: About CMCD - Visible from start */}
            <div className="about-section space-y-8 opacity-0">
              <div className="space-y-4">
                <span className="t-label">About Us</span>
                
                <h2 className="t-heading leading-tight">
                  Chemistry Built on Capability,<br />
                  Partnership Built on Trust.
                </h2>
              </div>

              <div 
                className="w-20 h-px" 
                style={{ background: "linear-gradient(90deg, var(--color-blue) 0%, transparent 100%)" }} 
              />

              <div className="space-y-5 max-w-lg">
                <p className="t-body-large">
                  CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and 
                  Specialty Chemicals sectors, providing end-to-end capabilities across development, 
                  scale-up and commercial manufacturing.
                </p>
                <p className="t-body-large">
                  At our integrated Berigai facility near Bengaluru, R&D, pilot and commercial 
                  manufacturing capabilities are co-located, enabling a seamless transition from 
                  development to scale.
                </p>
                <p className="t-body-large">
                  With 900 m³ of reactor capacity and expertise in handling a wide range of hazardous 
                  chemistries, we combine technical capability with the operational discipline required 
                  for reliable commercial supply.
                </p>
              </div>

              {/* Subtle technical visual accent */}
              <div className="pt-6">
                <svg width="200" height="80" viewBox="0 0 200 80" className="opacity-10">
                  <line x1="0" y1="40" x2="60" y2="40" stroke="var(--color-blue)" strokeWidth="1" />
                  <circle cx="60" cy="40" r="4" fill="var(--color-blue)" />
                  <line x1="60" y1="40" x2="100" y2="20" stroke="var(--color-blue)" strokeWidth="1" />
                  <line x1="60" y1="40" x2="100" y2="60" stroke="var(--color-lavender)" strokeWidth="1" />
                  <circle cx="100" cy="20" r="4" fill="var(--color-blue)" />
                  <circle cx="100" cy="60" r="4" fill="var(--color-lavender)" />
                  <line x1="100" y1="20" x2="140" y2="40" stroke="var(--color-blue)" strokeWidth="1" />
                  <line x1="100" y1="60" x2="140" y2="40" stroke="var(--color-lavender)" strokeWidth="1" />
                  <circle cx="140" cy="40" r="4" fill="var(--color-coral)" />
                  <line x1="140" y1="40" x2="200" y2="40" stroke="var(--color-coral)" strokeWidth="1" />
                </svg>
              </div>
            </div>

            {/* RIGHT: Our Story in Numbers - Sequential Reveal */}
            <div className="relative flex flex-col justify-center" style={{ minHeight: "600px" }}>
              {/* Background technical visualization */}
              <svg 
                className="tech-visual absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                viewBox="0 0 600 600"
                style={{ opacity: 0 }}
              >
                {/* Technical grid */}
                <g opacity="0.15">
                  <line x1="0" y1="150" x2="600" y2="150" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="0" y1="300" x2="600" y2="300" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="0" y1="450" x2="600" y2="450" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="150" y1="0" x2="150" y2="600" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="300" y1="0" x2="300" y2="600" stroke="var(--color-blue)" strokeWidth="0.5" />
                  <line x1="450" y1="0" x2="450" y2="600" stroke="var(--color-blue)" strokeWidth="0.5" />
                </g>

                {/* Technical elements for each metric */}
                {METRICS.map((metric, i) => (
                  <g key={i} opacity={currentMetric === i ? "0.4" : "0.1"}>
                    <path
                      className={`tech-element-${i}`}
                      d={`M ${100 + i * 80} 100 L ${100 + i * 80} 500`}
                      stroke={metric.color}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="200"
                      strokeDashoffset="200"
                    />
                    <circle
                      cx={100 + i * 80}
                      cy={300}
                      r="6"
                      fill={metric.color}
                      opacity={currentMetric === i ? "0.6" : "0.2"}
                    />
                  </g>
                ))}
              </svg>

              {/* Numbers label */}
              <div className="numbers-label mb-12 opacity-0">
                <span className="t-label">Our Story in Numbers</span>
              </div>

              {/* Metrics stack - all rendered, visibility controlled */}
              <div className="relative">
                {METRICS.map((metric, i) => (
                  <div
                    key={i}
                    className={`metric-${i} absolute inset-0 flex items-center justify-center`}
                    style={{
                      opacity: 0,
                      pointerEvents: currentMetric === i ? "auto" : "none",
                    }}
                  >
                    <div className="text-center space-y-6 max-w-md">
                      <div
                        className="text-8xl lg:text-9xl font-extralight leading-none tracking-tight"
                        style={{ color: metric.color }}
                      >
                        {currentMetric === i ? displayValue : metric.value}
                        <span className="text-6xl lg:text-7xl">{metric.suffix}</span>
                      </div>
                      
                      <h3 className="t-subheading" style={{ color: "var(--color-dark)" }}>
                        {metric.label}
                      </h3>
                      
                      <p className="t-body" style={{ color: "var(--color-muted)" }}>
                        {metric.subtext}
                      </p>

                      {/* Metric-specific visual accent */}
                      <div className="flex justify-center pt-4">
                        <div 
                          className="w-16 h-1 rounded-full"
                          style={{ background: metric.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress indicator */}
              {currentMetric >= 0 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-3">
                  {METRICS.map((metric, i) => (
                    <div
                      key={i}
                      className="transition-all duration-500"
                      style={{
                        width: i === currentMetric ? "32px" : "8px",
                        height: "8px",
                        borderRadius: "4px",
                        background: i <= currentMetric ? metric.color : "rgba(0,0,0,0.1)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

