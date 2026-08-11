"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const METRICS = [
  { value: 30, suffix: "+", label: "Years of Experience", subtext: "Established expertise since 1993" },
  { value: 900, suffix: " m³", label: "Reactor Capacity", subtext: "State-of-the-art processing capability" },
  { value: 2, suffix: "", label: "Manufacturing Sites", subtext: "Integrated facilities at Berigai" },
  { value: 50, suffix: "+", label: "Process Chemists", subtext: "Dedicated team of experts" },
  { value: 15, suffix: "+", label: "Global Customers", subtext: "Trusted partnerships worldwide" },
  { value: 20, suffix: "+", label: "Countries Served", subtext: "International reach and impact" },
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
          // Divide scroll into sections for left side (0-0.4) and right side metrics (0.4-1.0)
          
          if (progress < 0.4) {
            // Left side About section progressive reveal
            setCurrentMetric(-1);
          } else {
            // Right side sequential numbers
            const metricProgress = (progress - 0.4) / 0.6;
            const metricIndex = Math.floor(metricProgress * METRICS.length);
            setCurrentMetric(Math.min(metricIndex, METRICS.length - 1));
          }
        },
      },
    });

    // LEFT SIDE: About section progressive states
    tl.fromTo(".about-title", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.08 })
      .to(".about-title", { opacity: 1, duration: 0.04 })
      .fromTo(".about-para1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06 }, 0.12)
      .to(".about-para1", { opacity: 1, duration: 0.04 })
      .fromTo(".about-para2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06 }, 0.22)
      .to(".about-para2", { opacity: 1, duration: 0.04 })
      .fromTo(".about-para3", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06 }, 0.32)
      .to(".about-para3", { opacity: 1, duration: 0.08 });

    // RIGHT SIDE: Numbers title
    tl.fromTo(".numbers-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.06 }, 0.40)
      .to(".numbers-title", { opacity: 1, duration: 0.54 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Animate current metric value
  useEffect(() => {
    if (currentMetric >= 0 && currentMetric < METRICS.length) {
      const target = METRICS[currentMetric].value;
      gsap.to({ val: displayValue }, {
        val: target,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function() {
          setDisplayValue(Math.floor(this.targets()[0].val));
        },
      });
    }
  }, [currentMetric]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-white"
      style={{ height: "600vh" }}
    >
      <div className="segment4-content sticky top-0 w-full h-screen flex items-center">
        <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20">
          <div className="grid lg:grid-cols-[45%_55%] gap-20 items-start">
            
            {/* LEFT: About CMCD - Progressive Reveal */}
            <div className="space-y-8">
              <span className="t-label">About CMCD</span>
              
              <h2 className="about-title t-heading leading-tight opacity-0">
                Chemistry Built on Capability,<br />
                Partnership Built on Trust.
              </h2>

              <div className="w-16 h-px" style={{ background: "var(--color-blue)" }} />

              <div className="space-y-6">
                <p className="about-para1 t-body-large opacity-0">
                  CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and 
                  Specialty Chemicals sectors, providing end-to-end capabilities across development, 
                  scale-up and commercial manufacturing.
                </p>
                <p className="about-para2 t-body-large opacity-0">
                  At our integrated Berigai facility near Bengaluru, R&D, pilot and commercial 
                  manufacturing capabilities are co-located, enabling a seamless transition from 
                  development to scale.
                </p>
                <p className="about-para3 t-body-large opacity-0">
                  With 900 m³ of reactor capacity and expertise in handling a wide range of hazardous 
                  chemistries, we combine technical capability with the operational discipline required 
                  for reliable commercial supply.
                </p>
              </div>

              <div className="about-para3 pt-8 space-y-5 opacity-0">
                <Bullet text="Integrated facility with co-located capabilities" />
                <Bullet text="Advanced hazardous chemistry expertise" />
                <Bullet text="End-to-end development to commercial scale" />
                <Bullet text="Proven safety and sustainability record" />
              </div>
            </div>

            {/* RIGHT: Our Story in Numbers - Sequential Reveal */}
            <div className="relative flex flex-col justify-center" style={{ minHeight: "500px" }}>
              <div className="numbers-title mb-12 opacity-0">
                <span className="t-label">Our Story in Numbers</span>
              </div>

              {/* Single large metric display */}
              <div className="relative">
                {currentMetric >= 0 && (
                  <div key={currentMetric} className="animate-fade-in">
                    <div className="text-center space-y-6">
                      <div
                        className="text-9xl font-extralight leading-none"
                        style={{ color: "var(--color-blue)" }}
                      >
                        {displayValue}
                        <span className="text-7xl">{METRICS[currentMetric].suffix}</span>
                      </div>
                      
                      <h3 className="t-subheading" style={{ color: "var(--color-dark)" }}>
                        {METRICS[currentMetric].label}
                      </h3>
                      
                      <p className="t-body max-w-md mx-auto" style={{ color: "var(--color-muted)" }}>
                        {METRICS[currentMetric].subtext}
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress indicator */}
                {currentMetric >= 0 && (
                  <div className="flex justify-center gap-3 mt-16">
                    {METRICS.map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full transition-all duration-300"
                        style={{
                          background: i <= currentMetric ? "var(--color-blue)" : "rgba(0,0,0,0.1)",
                          transform: i === currentMetric ? "scale(1.5)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Decorative molecular pattern */}
              <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
                <svg width="300" height="300" viewBox="0 0 300 300">
                  <circle cx="50" cy="150" r="4" fill="var(--color-blue)" />
                  <circle cx="150" cy="100" r="4" fill="var(--color-lavender)" />
                  <circle cx="250" cy="150" r="4" fill="var(--color-coral)" />
                  <circle cx="150" cy="200" r="4" fill="var(--color-green)" />
                  <line x1="50" y1="150" x2="150" y2="100" stroke="var(--color-blue)" strokeWidth="1" />
                  <line x1="150" y1="100" x2="250" y2="150" stroke="var(--color-lavender)" strokeWidth="1" />
                  <line x1="250" y1="150" x2="150" y2="200" stroke="var(--color-coral)" strokeWidth="1" />
                  <line x1="150" y1="200" x2="50" y2="150" stroke="var(--color-green)" strokeWidth="1" />
                </svg>
              </div>
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
