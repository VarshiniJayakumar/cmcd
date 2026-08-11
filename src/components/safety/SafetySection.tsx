"use client";

import { useEffect, useRef } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const CERTIFICATIONS = [
  { name: "ISO 9001", desc: "Quality Management" },
  { name: "ISO 14001", desc: "Environmental" },
  { name: "ISO 45001", desc: "Health & Safety" },
  { name: "FSSC 22000", desc: "Food Safety" },
];

export default function SafetySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    initGSAP();
    
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelectorAll(".cert-card"),
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 30%",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="safety"
      className="relative min-h-screen flex items-center"
      style={{ background: "var(--color-off-white)" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-20 py-32">
        <div className="text-center mb-20">
          <span className="t-label">Safety & Sustainability</span>
          <h2 className="t-heading mt-6">
            Built to Perform.<br />
            Designed to Protect.
          </h2>
          <p className="t-body mt-6 mx-auto" style={{ maxWidth: "600px" }}>
            Committed to the highest standards of safety, quality, and environmental responsibility.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.name}
              className="cert-card group relative p-8 rounded-xl transition-all hover:-translate-y-2 cursor-pointer"
              style={{
                background: "var(--color-white)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  boxShadow: "0 20px 60px rgba(37, 99, 235, 0.15)",
                }}
              />
              
              <div className="relative z-10">
                <div
                  className="w-16 h-16 mb-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--color-gray-50)",
                    border: "2px solid var(--color-blue)",
                  }}
                >
                  <span style={{ color: "var(--color-blue)", fontSize: "1.5rem", fontWeight: "600" }}>
                    ✓
                  </span>
                </div>
                
                <h3
                  className="font-semibold mb-2"
                  style={{ color: "var(--color-black)", fontSize: "1.125rem" }}
                >
                  {cert.name}
                </h3>
                
                <p className="t-body" style={{ fontSize: "0.875rem" }}>
                  {cert.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
