"use client";

import { useState } from "react";

const CAPABILITIES = [
  { id: "agro", label: "Agrochemicals", x: 25, y: 30, color: "var(--color-green)" },
  { id: "pharma", label: "Pharmaceuticals", x: 75, y: 35, color: "var(--color-lavender)" },
  { id: "specialty", label: "Specialty Chemicals", x: 50, y: 70, color: "var(--color-coral)" },
];

const PROCESSES = [
  { id: "rnd", label: "R&D", x: 30, y: 50, size: 60 },
  { id: "dev", label: "Process Development", x: 50, y: 45, size: 70 },
  { id: "scale", label: "Scale-Up", x: 60, y: 55, size: 65 },
  { id: "mfg", label: "Manufacturing", x: 70, y: 50, size: 75 },
  { id: "quality", label: "Quality", x: 45, y: 60, size: 50 },
  { id: "safety", label: "Safety", x: 55, y: 65, size: 55 },
];

export default function CapabilityWorld() {
  const [activeCapability, setActiveCapability] = useState<string | null>(null);

  return (
    <section
      id="capability-world"
      className="relative w-full min-h-screen flex items-center"
      style={{ background: "var(--color-cream)", padding: "8rem 0" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-20">
        <div className="text-center mb-20">
          <span className="t-label">Capability Ecosystem</span>
          <h2 className="t-heading mt-6">
            End-to-End Chemical Manufacturing
          </h2>
        </div>

        {/* Interactive capability map */}
        <div className="relative w-full" style={{ height: "600px" }}>
          <svg className="absolute inset-0 w-full h-full">
            {/* Connection lines */}
            {PROCESSES.map((proc) => (
              <line
                key={`line-${proc.id}`}
                x1="50%"
                y1="50%"
                x2={`${proc.x}%`}
                y2={`${proc.y}%`}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}

            {CAPABILITIES.map((cap) => (
              <line
                key={`cap-line-${cap.id}`}
                x1="50%"
                y1="50%"
                x2={`${cap.x}%`}
                y2={`${cap.y}%`}
                stroke={activeCapability === cap.id ? cap.color : "rgba(0,0,0,0.08)"}
                strokeWidth={activeCapability === cap.id ? "3" : "2"}
                className="transition-all duration-300"
              />
            ))}
          </svg>

          {/* Center: CMCD */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: "white",
                border: "3px solid var(--color-blue)",
                boxShadow: "0 20px 60px rgba(37,99,235,0.2)",
              }}
            >
              <span className="font-bold text-2xl" style={{ color: "var(--color-blue)" }}>
                CMCD
              </span>
            </div>
          </div>

          {/* Capabilities */}
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.id}
              className="absolute cursor-pointer group transition-all duration-300"
              style={{
                left: `${cap.x}%`,
                top: `${cap.y}%`,
                transform: `translate(-50%, -50%) ${activeCapability === cap.id ? "scale(1.1)" : "scale(1)"}`,
              }}
              onMouseEnter={() => setActiveCapability(cap.id)}
              onMouseLeave={() => setActiveCapability(null)}
            >
              <div
                className="px-8 py-4 rounded-full text-center whitespace-nowrap"
                style={{
                  background: activeCapability === cap.id ? cap.color : "white",
                  border: `2px solid ${cap.color}`,
                  boxShadow: activeCapability === cap.id ? `0 12px 40px ${cap.color}44` : "0 4px 20px rgba(0,0,0,0.08)",
                  color: activeCapability === cap.id ? "white" : cap.color,
                }}
              >
                <span className="font-semibold text-sm">{cap.label}</span>
              </div>
            </div>
          ))}

          {/* Processes */}
          {PROCESSES.map((proc) => (
            <div
              key={proc.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${proc.x}%`,
                top: `${proc.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="rounded-lg px-5 py-3 text-center transition-all duration-300 hover:scale-105"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <span className="text-xs font-medium" style={{ color: "var(--color-dark)" }}>
                  {proc.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
