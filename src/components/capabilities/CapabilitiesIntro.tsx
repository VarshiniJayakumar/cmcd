"use client";

import { useEffect, useRef } from "react";
import { initGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const CAPABILITY_ITEMS = [
  {
    index: "01",
    title: "Discovery Chemistry",
    body: "From target identification to candidate synthesis — we compress the front end of the development cycle without sacrificing rigour.",
    tag: "Molecular Design",
  },
  {
    index: "02",
    title: "Process Development",
    body: "Green chemistry principles, route optimisation, and cost-of-goods analysis working in parallel from day one.",
    tag: "R&D",
  },
  {
    index: "03",
    title: "Scale-Up & Transfer",
    body: "Pilot to commercial — our engineers speak both lab and plant. No translation loss between scales.",
    tag: "Engineering",
  },
  {
    index: "04",
    title: "Regulatory & Safety",
    body: "ICH-compliant documentation, impurity profiling, and safety-by-design built into every programme.",
    tag: "Compliance",
  },
] as const;

export default function CapabilitiesIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const elements = [
        labelRef.current,
        headRef.current,
        bodyRef.current,
        ruleRef.current,
      ].filter(Boolean);

      /* Headline block entrance */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.1,
            }
          );
        },
        once: true,
      });

      /* Grid items stagger in */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 55%",
        onEnter: () => {
          gsap.fromTo(
            itemRefs.current.filter(Boolean),
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: "expo.out",
              stagger: 0.12,
            }
          );
        },
        once: true,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      aria-labelledby="capabilities-heading"
      style={{
        background: "var(--color-midnight)",
        padding: "clamp(5rem,12vh,10rem) clamp(1.5rem,5vw,5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background texture */}
      <BackgroundTexture />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* ── Section header ──────────────────────────────── */}
        <div style={{ marginBottom: "clamp(3rem,7vh,5.5rem)" }}>
          <div
            ref={labelRef}
            className="t-label"
            style={{
              color: "var(--color-cyan)",
              marginBottom: "1.5rem",
              opacity: 0,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "1.5rem",
                height: "1px",
                background: "var(--color-cyan)",
                opacity: 0.5,
                flexShrink: 0,
              }}
            />
            Capabilities
          </div>

          <h2
            id="capabilities-heading"
            ref={headRef}
            className="t-heading"
            style={{
              fontWeight: 200,
              color: "var(--color-white)",
              maxWidth: "min(640px, 90vw)",
              opacity: 0,
            }}
          >
            Chemistry at every
            <br />
            stage of the journey.
          </h2>

          <div
            ref={ruleRef}
            style={{
              width: "3rem",
              height: "1px",
              background:
                "linear-gradient(90deg, var(--color-cyan), transparent)",
              margin: "2rem 0",
              opacity: 0,
            }}
          />

          <p
            ref={bodyRef}
            className="t-body"
            style={{
              color: "var(--color-muted)",
              maxWidth: "min(520px, 90vw)",
              opacity: 0,
            }}
          >
            From first synthesis to full commercial manufacture, CMCD provides
            integrated chemistry capabilities that move programmes forward with
            precision and speed.
          </p>
        </div>

        {/* ── Capabilities grid ──────────────────────────── */}
        <div
          role="list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: "1px",
            border: "1px solid var(--color-border)",
          }}
        >
          {CAPABILITY_ITEMS.map(({ index, title, body, tag }, i) => (
            <CapabilityCard
              key={title}
              index={index}
              title={title}
              body={body}
              tag={tag}
              ref={(el) => { itemRefs.current[i] = el; }}
            />
          ))}
        </div>

        {/* ── Teaser: more coming ─────────────────────────── */}
        <div
          className="t-label"
          style={{
            marginTop: "3rem",
            color: "var(--color-muted)",
            opacity: 0.5,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span>Explore all capabilities</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ── Single capability card ──────────────────────────────────── */
import { forwardRef } from "react";

interface CardProps {
  index: string;
  title: string;
  body: string;
  tag: string;
}

const CapabilityCard = forwardRef<HTMLDivElement, CardProps>(
  function CapabilityCard({ index, title, body, tag }, ref) {
    return (
      <div
        ref={ref}
        role="listitem"
        style={{
          padding: "clamp(1.75rem,4vw,2.75rem)",
          background: "var(--color-charcoal)",
          opacity: 0,
          position: "relative",
          cursor: "default",
          transition: "background 0.3s ease",
          borderRight: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = "var(--color-surface)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = "var(--color-charcoal)";
        }}
      >
        {/* Hover accent top bar */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, var(--color-cyan), transparent)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
          className="card-accent"
        />

        {/* Index + tag row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <span
            className="t-label"
            style={{
              color: "var(--color-cyan)",
              opacity: 0.5,
              fontSize: "0.625rem",
            }}
          >
            {index}
          </span>
          <span
            className="t-label"
            style={{
              color: "var(--color-muted)",
              fontSize: "0.5625rem",
              padding: "0.25rem 0.625rem",
              border: "1px solid var(--color-border)",
              borderRadius: "1px",
            }}
          >
            {tag}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "clamp(1.0625rem,1.75vw,1.25rem)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "var(--color-white)",
            marginBottom: "1rem",
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>

        {/* Rule */}
        <div
          aria-hidden="true"
          style={{
            width: "1.5rem",
            height: "1px",
            background: "var(--color-cyan)",
            opacity: 0.3,
            marginBottom: "1rem",
          }}
        />

        {/* Body */}
        <p
          className="t-body"
          style={{
            color: "var(--color-muted)",
            fontSize: "0.9rem",
            lineHeight: 1.65,
          }}
        >
          {body}
        </p>
      </div>
    );
  }
);

/* ── Background technical texture ──────────────────────────── */
function BackgroundTexture() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.025,
      }}
    >
      <defs>
        <pattern
          id="cap-grid"
          x="0"
          y="0"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="rgba(79,195,247,1)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cap-grid)" />
    </svg>
  );
}
