"use client";

import { useEffect, useRef } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const facilityRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
    });

    if (textRef.current) {
      tl.fromTo(
        textRef.current.querySelectorAll(".reveal"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 1 }
      );
    }

    if (facilityRef.current) {
      tl.fromTo(
        facilityRef.current.querySelectorAll(".layer"),
        { opacity: 0, x: 60, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.15, duration: 1 },
        0
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen flex items-center"
      style={{ background: "var(--color-midnight)" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-16 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div ref={textRef} className="space-y-8">
            <div className="reveal">
              <span className="t-label" style={{ color: "var(--color-cyan)" }}>
                About Us
              </span>
            </div>
            
            <h2 className="t-heading reveal" style={{ color: "var(--color-white)" }}>
              Chemistry Built on Capability,<br />
              Partnership Built on Trust.
            </h2>

            <div className="rule-h reveal" style={{ width: "4rem" }} />

            <p className="t-body reveal" style={{ color: "var(--color-muted)", maxWidth: "600px" }}>
              CMCD partners with global innovators in the Agrochemicals, Pharmaceuticals and 
              Specialty Chemicals sectors, providing end-to-end capabilities across development, 
              scale-up and commercial manufacturing.
            </p>

            <div className="reveal space-y-4">
              <div className="flex items-start gap-4">
                <div style={{ color: "var(--color-cyan)", fontSize: "1.5rem" }}>●</div>
                <p className="t-body" style={{ color: "var(--color-white)" }}>
                  Integrated Berigai facility near Bengaluru
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div style={{ color: "var(--color-cyan)", fontSize: "1.5rem" }}>●</div>
                <p className="t-body" style={{ color: "var(--color-white)" }}>
                  R&D, pilot and commercial manufacturing co-located
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div style={{ color: "var(--color-cyan)", fontSize: "1.5rem" }}>●</div>
                <p className="t-body" style={{ color: "var(--color-white)" }}>
                  900 m³ reactor capacity with hazardous chemistry expertise
                </p>
              </div>
            </div>
          </div>

          {/* Right: Facility Visual */}
          <div ref={facilityRef} className="relative h-[600px]">
            <FacilityVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function FacilityVisual() {
  return (
    <div className="relative w-full h-full">
      {/* Background layer */}
      <div
        className="layer absolute inset-0 rounded-lg"
        style={{
          background: "linear-gradient(135deg, rgba(79,195,247,0.05) 0%, rgba(30,111,255,0.08) 100%)",
          backdropFilter: "blur(40px)",
        }}
      />

      {/* Industrial grid pattern */}
      <svg
        className="layer absolute inset-0 w-full h-full opacity-20"
        style={{ mixBlendMode: "screen" }}
      >
        <defs>
          <pattern id="facility-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(79,195,247,0.3)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#facility-grid)" />
      </svg>

      {/* Facility layers - simple geometric representation */}
      <div className="layer absolute inset-0 flex items-center justify-center p-12">
        <div className="relative w-full h-full">
          {/* Base structure */}
          <div
            className="absolute bottom-0 left-1/4 right-1/4 h-2/3 rounded-t-lg"
            style={{
              background: "linear-gradient(180deg, rgba(79,195,247,0.15) 0%, rgba(79,195,247,0.25) 100%)",
              border: "1px solid rgba(79,195,247,0.3)",
            }}
          />
          
          {/* R&D tower */}
          <div
            className="layer absolute bottom-0 left-[15%] w-20 h-3/4 rounded-t"
            style={{
              background: "rgba(30,111,255,0.2)",
              border: "1px solid rgba(79,195,247,0.4)",
              boxShadow: "0 0 40px rgba(79,195,247,0.3)",
            }}
          />

          {/* Manufacturing section */}
          <div
            className="layer absolute bottom-0 right-[15%] w-28 h-2/3 rounded-t-lg"
            style={{
              background: "rgba(79,195,247,0.18)",
              border: "1px solid rgba(79,195,247,0.4)",
              boxShadow: "0 0 40px rgba(79,195,247,0.2)",
            }}
          />

          {/* Connecting pipes */}
          <div
            className="layer absolute top-1/3 left-1/4 right-1/4 h-0.5"
            style={{ background: "rgba(79,195,247,0.6)" }}
          />
          <div
            className="layer absolute top-1/2 left-1/4 right-1/4 h-0.5"
            style={{ background: "rgba(79,195,247,0.4)" }}
          />

          {/* Glow effect */}
          <div
            className="layer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(79,195,247,0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
