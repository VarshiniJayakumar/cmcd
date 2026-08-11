"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

type Stage = "certifications" | "safety" | "sustainability" | "proof";

const CERTIFICATIONS = [
  { name: "ISO 14001", desc: "Environmental Management", color: "var(--color-green)" },
  { name: "ISO 9001", desc: "Quality Management", color: "var(--color-blue)" },
  { name: "ISO 22001", desc: "Food Safety Management", color: "var(--color-blue)" },
  { name: "ISO 45001", desc: "Occupational Health & Safety", color: "var(--color-coral)" },
  { name: "Together for Sustainability", desc: "Chemical Industry Initiative", color: "var(--color-green)" },
  { name: "Responsible Care", desc: "Chemical Industry Commitment", color: "var(--color-blue)" },
  { name: "British Safety Council", desc: "Five Star Occupational H&S", color: "var(--color-coral)" },
  { name: "EcoVadis", desc: "Sustainability Rating", color: "var(--color-green)" },
];

const PROOF_POINTS = [
  { metric: "Zero", label: "Lost Time Incidents", subtitle: "2023 Performance", color: "var(--color-green)" },
  { metric: "98%", label: "Waste Recycled", subtitle: "Circular Economy", color: "var(--color-green)" },
  { metric: "ISO", label: "Certified Systems", subtitle: "Multiple Standards", color: "var(--color-blue)" },
];

export default function Segment3IntegratedFacility() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStage, setCurrentStage] = useState<Stage>("certifications");
  const [activeCard, setActiveCard] = useState(0);

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
        pin: ".segment3-sticky",
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.25) {
            setCurrentStage("certifications");
          } else if (progress < 0.5) {
            setCurrentStage("safety");
          } else if (progress < 0.75) {
            setCurrentStage("sustainability");
          } else {
            setCurrentStage("proof");
          }
          
          // Update active card based on scroll
          const cardIndex = Math.floor(progress * 3);
          setActiveCard(Math.min(cardIndex, 2));
        },
      },
    });

    // Heading entrance
    tl.fromTo(".seg3-heading", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.1 }, 
      0
    );

    // STAGE 1: Certifications reveal (0-0.25)
    CERTIFICATIONS.forEach((_, i) => {
      tl.fromTo(`.cert-badge-${i}`,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.03 },
        0.05 + (i * 0.02)
      );
    });

    // STAGE 2: Safety focus (0.25-0.5)
    tl.to(".cert-grid", { opacity: 0.3, duration: 0.05 }, 0.25)
      .to(".dashboard-safety", { opacity: 1, x: 0, duration: 0.1 }, 0.28)
      .to(".safety-metric", { opacity: 1, scale: 1, duration: 0.08, stagger: 0.02 }, 0.32);

    // STAGE 3: Sustainability focus (0.5-0.75)
    tl.to(".dashboard-safety", { opacity: 0, duration: 0.05 }, 0.5)
      .to(".dashboard-sustainability", { opacity: 1, x: 0, duration: 0.1 }, 0.53)
      .to(".sustainability-metric", { opacity: 1, scale: 1, duration: 0.08, stagger: 0.02 }, 0.57);

    // STAGE 4: Proof points & photo carousel (0.75-1.0)
    tl.to(".dashboard-sustainability", { opacity: 0, duration: 0.05 }, 0.75)
      .to(".cert-grid", { opacity: 0, duration: 0.05 }, 0.75)
      .to(".dashboard-proof", { opacity: 1, scale: 1, duration: 0.1 }, 0.78)
      .to(".proof-card", { opacity: 1, y: 0, duration: 0.08, stagger: 0.03 }, 0.82)
      .to(".photo-carousel", { opacity: 1, duration: 0.08 }, 0.88);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="safety-sustainability"
      className="relative w-full bg-white"
      style={{ height: "450vh" }}
    >
      <div className="segment3-sticky sticky top-0 w-full h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20">
          <div className="grid lg:grid-cols-[40%_60%] gap-16 items-start">
            
            {/* LEFT: Certifications & Heading */}
            <div className="relative space-y-8 pt-24">
              <div className="seg3-heading space-y-3">
                <span className="t-label">Safety & Sustainability</span>
                <h2 className="t-heading leading-tight">
                  Built to Perform.<br />
                  Designed to Protect.
                </h2>
              </div>

              {/* Certification Badges Grid */}
              <div className="cert-grid grid grid-cols-2 gap-4">
                {CERTIFICATIONS.map((cert, i) => (
                  <div
                    key={i}
                    className={`cert-badge-${i} p-4 border rounded-lg transition-all duration-300`}
                    style={{
                      borderColor: currentStage === "certifications" ? cert.color : "rgba(0,0,0,0.1)",
                      background: currentStage === "certifications" ? `${cert.color}05` : "transparent",
                      opacity: 0,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                        style={{ background: cert.color }}
                      />
                      <div>
                        <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--color-black)" }}>
                          {cert.name}
                        </h4>
                        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                          {cert.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Interactive Dashboard Area */}
            <div className="relative h-[600px] flex items-center justify-center">
              
              {/* SAFETY DASHBOARD */}
              <div 
                className="dashboard-safety absolute inset-0 flex items-center justify-center"
                style={{ opacity: 0, transform: "translateX(30px)" }}
              >
                <div className="w-full max-w-[600px] space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-light mb-2" style={{ color: "var(--color-coral)" }}>
                      Safety Performance
                    </h3>
                    <p className="t-body">Commitment to zero harm and operational excellence</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div 
                      className="safety-metric p-6 rounded-xl border-2"
                      style={{ 
                        borderColor: "var(--color-coral)",
                        background: "rgba(251,113,133,0.03)",
                        opacity: 0,
                        transform: "scale(0.9)",
                      }}
                    >
                      <div className="text-5xl font-light mb-2" style={{ color: "var(--color-coral)" }}>
                        0
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                        Lost Time Incidents
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        2023 Annual Performance
                      </div>
                    </div>

                    <div 
                      className="safety-metric p-6 rounded-xl border-2"
                      style={{ 
                        borderColor: "var(--color-coral)",
                        background: "rgba(251,113,133,0.03)",
                        opacity: 0,
                        transform: "scale(0.9)",
                      }}
                    >
                      <div className="text-5xl font-light mb-2" style={{ color: "var(--color-coral)" }}>
                        5★
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                        British Safety Council
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        Five Star Occupational H&S
                      </div>
                    </div>

                    <div 
                      className="safety-metric p-6 rounded-xl border-2"
                      style={{ 
                        borderColor: "var(--color-coral)",
                        background: "rgba(251,113,133,0.03)",
                        opacity: 0,
                        transform: "scale(0.9)",
                      }}
                    >
                      <div className="text-4xl font-light mb-2" style={{ color: "var(--color-coral)" }}>
                        ISO 45001
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                        Certified
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        Occupational Health & Safety
                      </div>
                    </div>

                    <div 
                      className="safety-metric p-6 rounded-xl border-2"
                      style={{ 
                        borderColor: "var(--color-coral)",
                        background: "rgba(251,113,133,0.03)",
                        opacity: 0,
                        transform: "scale(0.9)",
                      }}
                    >
                      <div className="text-4xl font-light mb-2" style={{ color: "var(--color-coral)" }}>
                        24/7
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                        Safety Monitoring
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        Real-time oversight
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUSTAINABILITY DASHBOARD */}
              <div 
                className="dashboard-sustainability absolute inset-0 flex items-center justify-center"
                style={{ opacity: 0, transform: "translateX(30px)" }}
              >
                <div className="w-full max-w-[600px] space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-light mb-2" style={{ color: "var(--color-green)" }}>
                      Sustainability Commitment
                    </h3>
                    <p className="t-body">Minimizing environmental impact through responsible operations</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div 
                      className="sustainability-metric p-6 rounded-xl border-2"
                      style={{ 
                        borderColor: "var(--color-green)",
                        background: "rgba(16,185,129,0.03)",
                        opacity: 0,
                        transform: "scale(0.9)",
                      }}
                    >
                      <div className="text-5xl font-light mb-2" style={{ color: "var(--color-green)" }}>
                        98%
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                        Waste Recycled
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        Circular economy principles
                      </div>
                    </div>

                    <div 
                      className="sustainability-metric p-6 rounded-xl border-2"
                      style={{ 
                        borderColor: "var(--color-green)",
                        background: "rgba(16,185,129,0.03)",
                        opacity: 0,
                        transform: "scale(0.9)",
                      }}
                    >
                      <div className="text-4xl font-light mb-2" style={{ color: "var(--color-green)" }}>
                        ISO 14001
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                        Certified
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        Environmental Management
                      </div>
                    </div>

                    <div 
                      className="sustainability-metric p-6 rounded-xl border-2"
                      style={{ 
                        borderColor: "var(--color-green)",
                        background: "rgba(16,185,129,0.03)",
                        opacity: 0,
                        transform: "scale(0.9)",
                      }}
                    >
                      <div className="text-4xl font-light mb-2" style={{ color: "var(--color-green)" }}>
                        EcoVadis
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                        Rated
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        Sustainability assessment
                      </div>
                    </div>

                    <div 
                      className="sustainability-metric p-6 rounded-xl border-2"
                      style={{ 
                        borderColor: "var(--color-green)",
                        background: "rgba(16,185,129,0.03)",
                        opacity: 0,
                        transform: "scale(0.9)",
                      }}
                    >
                      <div className="text-3xl font-light mb-2" style={{ color: "var(--color-green)" }}>
                        TfS
                      </div>
                      <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                        Together for Sustainability
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                        Industry initiative member
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROOF POINTS & PHOTO CAROUSEL */}
              <div 
                className="dashboard-proof absolute inset-0 flex items-center justify-center"
                style={{ opacity: 0, transform: "scale(0.95)" }}
              >
                <div className="w-full max-w-[650px] space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-light mb-2" style={{ color: "var(--color-blue)" }}>
                      Proven Excellence
                    </h3>
                    <p className="t-body">Verified performance across safety, quality, and sustainability</p>
                  </div>

                  {/* Proof Cards */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {PROOF_POINTS.map((point, i) => (
                      <div
                        key={i}
                        className={`proof-card p-6 rounded-xl border-2 text-center transition-all duration-500`}
                        style={{
                          borderColor: activeCard === i ? point.color : "rgba(0,0,0,0.1)",
                          background: activeCard === i ? `${point.color}08` : "rgba(0,0,0,0.02)",
                          opacity: 0,
                          transform: "translateY(20px)",
                        }}
                      >
                        <div 
                          className="text-5xl font-light mb-3"
                          style={{ color: activeCard === i ? point.color : "var(--color-muted)" }}
                        >
                          {point.metric}
                        </div>
                        <div className="text-sm font-semibold mb-1" style={{ color: "var(--color-black)" }}>
                          {point.label}
                        </div>
                        <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                          {point.subtitle}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Photo Carousel Placeholder */}
                  <div 
                    className="photo-carousel relative h-[200px] rounded-xl overflow-hidden"
                    style={{ 
                      opacity: 0,
                      background: "linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(16,185,129,0.05) 100%)",
                      border: "2px solid rgba(37,99,235,0.1)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div 
                          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                          style={{ background: "var(--color-blue)", opacity: 0.1 }}
                        >
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue)" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: "var(--color-blue)" }}>
                          Facility Excellence
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                          Safety & Sustainability in Action
                        </p>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full transition-all duration-300"
                          style={{
                            background: activeCard === i ? "var(--color-blue)" : "rgba(0,0,0,0.2)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
