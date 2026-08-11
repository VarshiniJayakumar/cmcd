"use client";

import { useEffect, useRef } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import MolecularCanvas from "./MolecularCanvas";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    initGSAP();

    // Initial entrance animations
    const tl = gsap.timeline({ delay: 0.5 });
    
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll(".word");
      tl.fromTo(
        words,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.1 }
      );
    }

    if (sublineRef.current) {
      tl.fromTo(
        sublineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.6"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center"
      style={{ background: "var(--color-white)" }}
    >
      <div className="w-full max-w-[1800px] mx-auto px-8 lg:px-20 py-32">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* LEFT: Headline */}
          <div className="lg:col-span-5 z-10">
            <div className="space-y-8">
              <span className="t-label">CMCD · Chemplast Sanmar</span>
              
              <div ref={headlineRef} className="space-y-4">
                <div style={{ overflow: "hidden" }}>
                  <h1 className="word t-display">
                    FROM MOLECULE
                  </h1>
                </div>
                <div style={{ overflow: "hidden" }}>
                  <h1 className="word t-display" style={{
                    background: "linear-gradient(135deg, var(--color-blue) 0%, var(--color-lavender) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    TO MARKET.
                  </h1>
                </div>
              </div>

              <p ref={sublineRef} className="t-body-large" style={{ maxWidth: "480px" }}>
                World-class chemical manufacturing powered by safe, sustainable innovation. 
                From R&D to commercial production.
              </p>

              <div className="flex items-center gap-3 text-sm" style={{ color: "var(--color-muted)" }}>
                <span>Scroll to explore</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* RIGHT: Molecular Canvas */}
          <div className="lg:col-span-7">
            <div
              ref={canvasContainerRef}
              className="relative w-full"
              style={{ height: "70vh", minHeight: "500px" }}
            >
              <MolecularCanvas sectionRef={sectionRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
