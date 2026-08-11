"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap } from "@/lib/gsap";

const METRICS = [
  { 
    value: 30, 
    suffix: "+", 
    label: "Years of Experience", 
    description: "Established expertise since 1993, serving global innovators.",
    color: "var(--color-blue)" 
  },
  { 
    value: 900, 
    suffix: " m³", 
    label: "Reactor Capacity", 
    description: "Integrated capacity supporting reliable commercial supply.",
    color: "var(--color-blue)" 
  },
  { 
    value: 2, 
    suffix: "", 
    label: "Manufacturing Sites", 
    description: "Integrated manufacturing capability.",
    color: "var(--color-lavender)" 
  },
  { 
    value: 50, 
    suffix: "+", 
    label: "Process Chemists", 
    description: "Specialist chemistry expertise.",
    color: "var(--color-coral)" 
  },
  { 
    value: 15, 
    suffix: "+", 
    label: "Global Customers", 
    description: "Trusted by innovators across sectors.",
    color: "var(--color-green)" 
  },
  { 
    value: 20, 
    suffix: "+", 
    label: "Countries Served", 
    description: "Serving customers across global markets.",
    color: "var(--color-green)" 
  },
];

export default function Segment4AboutNumbers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    if (!section) return;

    // Simple entrance timeline when section enters viewport
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // About Us entrance
    tl.fromTo(".about-heading", 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )
    .fromTo(".about-content", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // Numbers section entrance
    tl.fromTo(".numbers-header",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );

    // Stagger metric cards entrance
    tl.fromTo(".metric-card",
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
      "-=0.2"
    );

    // Animate all numbers counting up once on entrance
    METRICS.forEach((metric, i) => {
      tl.fromTo(numberRefs.current[i],
        { textContent: 0 },
        {
          textContent: metric.value,
          duration: 0.8,
          ease: "power2.out",
          snap: { textContent: 1 },
        },
        "-=0.5"
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Handle click/tap on card
  const handleCardClick = (index: number) => {
    // Toggle: if clicking the active card, close it; otherwise activate new card
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
      // Re-animate number when card is clicked
      const metric = METRICS[index];
      if (numberRefs.current[index]) {
        gsap.fromTo(numberRefs.current[index],
          { textContent: 0 },
          {
            textContent: metric.value,
            duration: 0.6,
            ease: "power2.out",
            snap: { textContent: 1 },
          }
        );
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-16 sm:py-24 lg:py-32"
      style={{ 
        background: "linear-gradient(180deg, #fafaf9 0%, #ffffff 100%)",
      }}
    >
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-start">
          
          {/* ========== LEFT: ABOUT US ========== */}
          <div className="space-y-6 sm:space-y-8">
            <div className="about-heading space-y-3 sm:space-y-4 opacity-0">
              <span className="t-label text-xs sm:text-sm">About Us</span>
              
              <h2 className="t-heading leading-tight text-2xl sm:text-3xl lg:text-4xl">
                Chemistry Built on Capability,<br />
                Partnership Built on Trust.
              </h2>
            </div>

            <div 
              className="w-16 sm:w-20 h-px" 
              style={{ background: "linear-gradient(90deg, var(--color-blue) 0%, transparent 100%)" }} 
            />

            <div className="about-content space-y-4 sm:space-y-5 max-w-xl opacity-0">
              <p className="t-body-large text-sm sm:text-base">
                CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and 
                Specialty Chemicals sectors, providing end-to-end capabilities across development, 
                scale-up and commercial manufacturing.
              </p>
              <p className="t-body-large text-sm sm:text-base">
                At our integrated Berigai facility near Bengaluru, R&D, pilot and commercial 
                manufacturing capabilities are co-located, enabling a seamless transition from 
                development to scale.
              </p>
              <p className="t-body-large text-sm sm:text-base">
                With 900 m³ of reactor capacity and expertise in handling a wide range of hazardous 
                chemistries, we combine technical capability with the operational discipline required 
                for reliable commercial supply.
              </p>
            </div>

            {/* Subtle technical accent */}
            <div className="about-content pt-4 opacity-0 hidden sm:block">
              <svg width="180" height="60" viewBox="0 0 180 60" className="opacity-10">
                <line x1="0" y1="30" x2="50" y2="30" stroke="var(--color-blue)" strokeWidth="1" />
                <circle cx="50" cy="30" r="3" fill="var(--color-blue)" />
                <line x1="50" y1="30" x2="80" y2="15" stroke="var(--color-blue)" strokeWidth="1" />
                <line x1="50" y1="30" x2="80" y2="45" stroke="var(--color-lavender)" strokeWidth="1" />
                <circle cx="80" cy="15" r="3" fill="var(--color-blue)" />
                <circle cx="80" cy="45" r="3" fill="var(--color-lavender)" />
                <line x1="80" y1="15" x2="110" y2="30" stroke="var(--color-blue)" strokeWidth="1" />
                <line x1="80" y1="45" x2="110" y2="30" stroke="var(--color-lavender)" strokeWidth="1" />
                <circle cx="110" cy="30" r="3" fill="var(--color-coral)" />
                <line x1="110" y1="30" x2="180" y2="30" stroke="var(--color-coral)" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* ========== RIGHT: OUR STORY IN NUMBERS - ALL 6 METRICS VISIBLE ========== */}
          <div className="space-y-8 sm:space-y-10">
            
            {/* Header with instructional subtext */}
            <div className="numbers-header opacity-0 text-center lg:text-left">
              <span className="t-label block mb-2 text-xs sm:text-sm">Our Story in Numbers</span>
              <p 
                className="text-xs tracking-wider uppercase font-medium"
                style={{ 
                  color: "var(--color-muted)",
                  opacity: 0.6,
                }}
              >
                Click to explore
              </p>
            </div>

            {/* 2x3 Grid of Metrics - Responsive to single column on smallest screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {METRICS.map((metric, i) => {
                const isActive = activeIndex === i;
                const isOther = activeIndex !== null && activeIndex !== i;
                
                return (
                  <button
                    key={i}
                    type="button"
                    className="metric-card opacity-0 relative p-5 sm:p-6 lg:p-8 rounded-xl border-2 cursor-pointer overflow-hidden text-left w-full"
                    style={{
                      borderColor: isActive ? metric.color : "rgba(0,0,0,0.08)",
                      background: isActive ? `${metric.color}05` : "rgba(255,255,255,0.95)",
                      transform: isActive 
                        ? "translateY(-8px) scale(1.03)" 
                        : "translateY(0) scale(1)",
                      opacity: isOther ? 0.4 : 1,
                      boxShadow: isActive 
                        ? `0 16px 48px -12px ${metric.color}40, 0 0 0 1px ${metric.color}20` 
                        : "0 2px 12px rgba(0,0,0,0.04)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      minHeight: isActive ? "auto" : "140px",
                    }}
                    onClick={() => handleCardClick(i)}
                    aria-pressed={isActive}
                    aria-label={`${metric.value}${metric.suffix} ${metric.label}: ${metric.description}`}
                  >
                    {/* Clickable indicator - top right corner */}
                    <div 
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center justify-center"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: `1.5px solid ${isActive ? metric.color : "rgba(0,0,0,0.15)"}`,
                        background: isActive ? `${metric.color}15` : "transparent",
                        transition: "all 0.4s ease",
                      }}
                    >
                      <svg 
                        width="8" 
                        height="8" 
                        viewBox="0 0 10 10"
                        style={{
                          transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.4s ease",
                        }}
                      >
                        <path 
                          d="M2 3 L5 6 L8 3" 
                          fill="none" 
                          stroke={isActive ? metric.color : "rgba(0,0,0,0.3)"} 
                          strokeWidth="1.5" 
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Metric-specific animated graphic */}
                    <MetricVisual index={i} isActive={isActive} color={metric.color} />

                    {/* Radial gradient pulse on active */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ 
                        background: `radial-gradient(circle at 50% 40%, ${metric.color}12 0%, transparent 70%)`,
                        opacity: isActive ? 1 : 0,
                        transition: "opacity 0.4s ease",
                      }}
                    />

                    <div className="relative z-10 text-center space-y-3 sm:space-y-4">
                      {/* Large Number */}
                      <div
                        className="text-4xl sm:text-5xl lg:text-6xl font-extralight leading-none tracking-tight"
                        style={{ 
                          color: isActive ? metric.color : "var(--color-dark)",
                          transform: isActive ? "scale(1.05)" : "scale(1)",
                          transition: "all 0.4s ease",
                        }}
                      >
                        <span ref={el => { numberRefs.current[i] = el; }}>0</span>
                        <span className="text-3xl sm:text-4xl lg:text-5xl">{metric.suffix}</span>
                      </div>
                      
                      {/* Label */}
                      <h4 
                        className="text-xs sm:text-sm lg:text-base font-semibold tracking-wide leading-tight" 
                        style={{ 
                          color: isActive ? metric.color : "var(--color-dark)",
                          transform: isActive ? "translateY(-4px)" : "translateY(0)",
                          transition: "all 0.4s ease",
                        }}
                      >
                        {metric.label}
                      </h4>

                      {/* Animated accent line */}
                      <div 
                        className="mx-auto"
                        style={{
                          width: isActive ? "60px" : "24px",
                          height: "2px",
                          background: isActive ? metric.color : "rgba(0,0,0,0.1)",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />

                      {/* Supporting description - reveals on active */}
                      <div
                        style={{
                          maxHeight: isActive ? "100px" : "0px",
                          opacity: isActive ? 1 : 0,
                          overflow: "hidden",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <p 
                          className="text-xs lg:text-sm leading-relaxed pt-2"
                          style={{ color: "var(--color-muted)" }}
                        >
                          {metric.description}
                        </p>
                      </div>
                    </div>

                    {/* Corner technical accent */}
                    <svg 
                      className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3"
                      width="16" 
                      height="16" 
                      viewBox="0 0 20 20"
                      style={{
                        opacity: isActive ? 0.4 : 0.1,
                        transition: "opacity 0.4s ease",
                      }}
                    >
                      <line x1="0" y1="20" x2="20" y2="20" stroke={metric.color} strokeWidth="1" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke={metric.color} strokeWidth="1" />
                      <circle cx="0" cy="20" r="2" fill={metric.color} />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Subtle background technical visualization - hidden on mobile */}
            <div className="relative -mt-4 opacity-5 pointer-events-none hidden lg:block">
              <svg width="100%" height="200" viewBox="0 0 600 200">
                <line x1="0" y1="50" x2="600" y2="50" stroke="var(--color-blue)" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="var(--color-blue)" strokeWidth="0.5" />
                <line x1="0" y1="150" x2="600" y2="150" stroke="var(--color-blue)" strokeWidth="0.5" />
                <line x1="150" y1="0" x2="150" y2="200" stroke="var(--color-blue)" strokeWidth="0.5" />
                <line x1="300" y1="0" x2="300" y2="200" stroke="var(--color-blue)" strokeWidth="0.5" />
                <line x1="450" y1="0" x2="450" y2="200" stroke="var(--color-blue)" strokeWidth="0.5" />
                
                <circle cx="150" cy="100" r="4" fill="var(--color-blue)" />
                <circle cx="300" cy="50" r="4" fill="var(--color-lavender)" />
                <circle cx="450" cy="100" r="4" fill="var(--color-coral)" />
                <circle cx="300" cy="150" r="4" fill="var(--color-green)" />
                
                <line x1="150" y1="100" x2="300" y2="50" stroke="var(--color-blue)" strokeWidth="1" />
                <line x1="300" y1="50" x2="450" y2="100" stroke="var(--color-lavender)" strokeWidth="1" />
                <line x1="450" y1="100" x2="300" y2="150" stroke="var(--color-coral)" strokeWidth="1" />
                <line x1="300" y1="150" x2="150" y2="100" stroke="var(--color-green)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== METRIC-SPECIFIC ANIMATED VISUALS ==========

function MetricVisual({ index, isActive, color }: { index: number; isActive: boolean; color: string }) {
  const commonStyle = {
    opacity: isActive ? 0.2 : 0,
    transition: "opacity 0.5s ease",
  };

  // 0: Timeline for Years of Experience
  if (index === 0) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={commonStyle}>
        <line x1="20%" y1="50%" x2="80%" y2="50%" stroke={color} strokeWidth="2">
          <animate attributeName="stroke-dasharray" from="0 300" to="300 0" dur="2s" repeatCount="indefinite" />
        </line>
        <circle cx="20%" cy="50%" r="4" fill={color} />
        <circle cx="50%" cy="50%" r="4" fill={color} />
        <circle cx="80%" cy="50%" r="4" fill={color} />
      </svg>
    );
  }

  // 1: Reactor tank for Reactor Capacity
  if (index === 1) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={commonStyle}>
        <ellipse cx="50%" cy="35%" rx="25%" ry="8%" fill="none" stroke={color} strokeWidth="1.5">
          <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
        <rect x="25%" y="35%" width="50%" height="40%" fill="none" stroke={color} strokeWidth="1.5">
          <animate attributeName="stroke-dasharray" from="0 400" to="400 0" dur="2.5s" repeatCount="indefinite" />
        </rect>
        <line x1="37.5%" y1="40%" x2="37.5%" y2="70%" stroke={color} strokeWidth="0.5" opacity="0.5" />
        <line x1="50%" y1="40%" x2="50%" y2="70%" stroke={color} strokeWidth="0.5" opacity="0.5" />
        <line x1="62.5%" y1="40%" x2="62.5%" y2="70%" stroke={color} strokeWidth="0.5" opacity="0.5" />
      </svg>
    );
  }

  // 2: Two connected sites for Manufacturing Sites
  if (index === 2) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={commonStyle}>
        <rect x="15%" y="40%" width="25%" height="25%" fill="none" stroke={color} strokeWidth="1.5">
          <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="60%" y="40%" width="25%" height="25%" fill="none" stroke={color} strokeWidth="1.5">
          <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </rect>
        <line x1="40%" y1="52.5%" x2="60%" y2="52.5%" stroke={color} strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
        </line>
      </svg>
    );
  }

  // 3: Connected network for Process Chemists
  if (index === 3) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={commonStyle}>
        <circle cx="50%" cy="40%" r="6" fill={color} opacity="0.3" />
        <circle cx="30%" cy="55%" r="4" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="70%" cy="55%" r="4" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="40%" cy="70%" r="4" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="60%" cy="70%" r="4" fill="none" stroke={color} strokeWidth="1" />
        <line x1="50%" y1="40%" x2="30%" y2="55%" stroke={color} strokeWidth="0.5" opacity="0.6">
          <animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="40%" x2="70%" y2="55%" stroke={color} strokeWidth="0.5" opacity="0.6">
          <animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="2s" begin="0.3s" repeatCount="indefinite" />
        </line>
        <line x1="30%" y1="55%" x2="40%" y2="70%" stroke={color} strokeWidth="0.5" opacity="0.6">
          <animate attributeName="stroke-dasharray" from="0 80" to="80 0" dur="2s" begin="0.6s" repeatCount="indefinite" />
        </line>
        <line x1="70%" y1="55%" x2="60%" y2="70%" stroke={color} strokeWidth="0.5" opacity="0.6">
          <animate attributeName="stroke-dasharray" from="0 80" to="80 0" dur="2s" begin="0.9s" repeatCount="indefinite" />
        </line>
      </svg>
    );
  }

  // 4: Hub network for Global Customers
  if (index === 4) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={commonStyle}>
        <circle cx="50%" cy="50%" r="8" fill={color} opacity="0.3" />
        <circle cx="25%" cy="35%" r="3" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="75%" cy="35%" r="3" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="25%" cy="65%" r="3" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="75%" cy="65%" r="3" fill="none" stroke={color} strokeWidth="1" />
        <line x1="50%" y1="50%" x2="25%" y2="35%" stroke={color} strokeWidth="0.5" opacity="0.5">
          <animate attributeName="stroke-dasharray" from="0 120" to="120 0" dur="2.5s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="75%" y2="35%" stroke={color} strokeWidth="0.5" opacity="0.5">
          <animate attributeName="stroke-dasharray" from="0 120" to="120 0" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="25%" y2="65%" stroke={color} strokeWidth="0.5" opacity="0.5">
          <animate attributeName="stroke-dasharray" from="0 120" to="120 0" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="75%" y2="65%" stroke={color} strokeWidth="0.5" opacity="0.5">
          <animate attributeName="stroke-dasharray" from="0 120" to="120 0" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
        </line>
      </svg>
    );
  }

  // 5: World map for Countries Served
  if (index === 5) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={commonStyle}>
        <circle cx="50%" cy="50%" r="30%" fill="none" stroke={color} strokeWidth="1">
          <animate attributeName="stroke-dasharray" from="0 300" to="300 0" dur="3s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="50%" cy="50%" rx="12%" ry="30%" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6" />
        <line x1="20%" y1="50%" x2="80%" y2="50%" stroke={color} strokeWidth="0.5" opacity="0.6" />
        <line x1="50%" y1="20%" x2="50%" y2="80%" stroke={color} strokeWidth="0.5" opacity="0.6" />
        <circle cx="35%" cy="40%" r="2" fill={color} />
        <circle cx="65%" cy="45%" r="2" fill={color} />
        <circle cx="45%" cy="60%" r="2" fill={color} />
      </svg>
    );
  }

  return null;
}

