"use client";

import { useState } from "react";

const CERTIFICATIONS = [
  { name: "ISO 9001", desc: "Quality Management System", category: "Quality" },
  { name: "ISO 14001", desc: "Environmental Management", category: "Environment" },
  { name: "ISO 45001", desc: "Health & Safety", category: "Safety" },
  { name: "FSSC 22000", desc: "Food Safety System", category: "Quality" },
];

export default function SafetyDashboard() {
  const [activeCert, setActiveCert] = useState<number | null>(null);

  return (
    <section
      id="safety-dashboard"
      className="relative w-full min-h-screen flex items-center"
      style={{ background: "var(--color-white)", padding: "8rem 0" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-20">
        <div className="text-center mb-20">
          <span className="t-label">Safety & Sustainability</span>
          <h2 className="t-heading mt-6">
            Built to Perform.<br />
            Designed to Protect.
          </h2>
          <p className="t-body mt-6 mx-auto max-w-2xl">
            Committed to the highest standards of safety, quality, and environmental responsibility across every stage of production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={cert.name}
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveCert(i)}
              onMouseLeave={() => setActiveCert(null)}
            >
              <div
                className="relative p-10 rounded-2xl transition-all duration-300"
                style={{
                  background: activeCert === i ? "var(--color-cream)" : "var(--color-white)",
                  border: `2px solid ${activeCert === i ? "var(--color-green)" : "rgba(0,0,0,0.08)"}`,
                  transform: activeCert === i ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: activeCert === i ? "0 24px 60px rgba(16,185,129,0.15)" : "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                {/* Animated ring */}
                <div className="relative mb-8 mx-auto w-24 h-24">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="rgba(0,0,0,0.06)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="var(--color-green)"
                      strokeWidth="4"
                      strokeDasharray="277"
                      strokeDashoffset={activeCert === i ? "0" : "277"}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: activeCert === i ? "var(--color-green)" : "rgba(16,185,129,0.1)",
                      borderRadius: "50%",
                      margin: "8px",
                    }}
                  >
                    <span
                      className="text-3xl font-bold"
                      style={{ color: activeCert === i ? "white" : "var(--color-green)" }}
                    >
                      ✓
                    </span>
                  </div>
                </div>

                <h3
                  className="text-xl font-semibold mb-3 text-center transition-colors"
                  style={{ color: activeCert === i ? "var(--color-green)" : "var(--color-black)" }}
                >
                  {cert.name}
                </h3>
                <p className="text-sm text-center" style={{ color: "var(--color-muted)" }}>
                  {cert.desc}
                </p>

                {/* Category badge */}
                <div className="mt-6 text-center">
                  <span
                    className="inline-block px-4 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: activeCert === i ? "var(--color-green)" : "rgba(16,185,129,0.1)",
                      color: activeCert === i ? "white" : "var(--color-green)",
                    }}
                  >
                    {cert.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sustainability indicators */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <Indicator
            value="100%"
            label="Renewable Energy Target"
            color="var(--color-green)"
          />
          <Indicator
            value="Zero"
            label="Environmental Incidents (2023)"
            color="var(--color-blue)"
          />
          <Indicator
            value="24/7"
            label="Safety Monitoring"
            color="var(--color-coral)"
          />
        </div>
      </div>
    </section>
  );
}

function Indicator({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="text-center">
      <div
        className="text-5xl font-extralight mb-3"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
        {label}
      </div>
    </div>
  );
}
