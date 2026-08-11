"use client";

import { useEffect, useRef, useState } from "react";
import { initGSAP, gsap } from "@/lib/gsap";

const NAV_LINKS = [
  { label: "Molecule", href: "#world" },
  { label: "R&D", href: "#world" },
  { label: "Manufacturing", href: "#world" },
  { label: "Facility", href: "#world" },
  { label: "About", href: "#about-story" },
  { label: "Safety", href: "#safety-dashboard" },
] as const;

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── Entrance animation ─────────────────────────────────── */
  useEffect(() => {
    initGSAP();
    const el = navRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.3 }
    );
  }, []);

  /* ── Background on scroll ───────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Smooth-scroll on link click ────────────────────────── */
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          height: "var(--nav-height)",
          background: scrolled
            ? "rgba(255,255,255,0.95)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(120%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(120%)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.08)"
            : "1px solid transparent",
        }}
      >
        <div
          className="mx-auto flex h-full items-center justify-between"
          style={{ maxWidth: "1400px", padding: "0 clamp(1.5rem,4vw,3rem)" }}
        >
          {/* Wordmark */}
          <a
            href="/"
            aria-label="CMCD Home"
            className="flex items-center gap-2.5 group"
          >
            <span
              aria-hidden="true"
              className="flex items-center justify-center rounded-sm"
              style={{
                width: 28,
                height: 28,
                background: "var(--color-blue)",
                flexShrink: 0,
              }}
            >
              {/* Minimal bond icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="4" cy="8" r="2.5" fill="white" />
                <circle cx="12" cy="8" r="2.5" fill="white" />
                <line x1="6.5" y1="8" x2="9.5" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 600,
                letterSpacing: "0.12em",
                fontSize: "0.8125rem",
                color: "var(--color-black)",
              }}
            >
              CMCD
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="t-label transition-colors"
                  style={{
                    color: "var(--color-muted)",
                    fontSize: "0.6875rem",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-black)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-muted)")
                  }
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#contact"
              className="t-label inline-flex items-center gap-2 transition-all duration-300"
              style={{
                fontSize: "0.6875rem",
                padding: "0.5rem 1.25rem",
                border: "1px solid var(--color-blue)",
                borderRadius: "4px",
                color: "var(--color-blue)",
                letterSpacing: "0.14em",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "var(--color-blue)";
                el.style.color = "white";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = "var(--color-blue)";
              }}
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden flex-col justify-center items-center gap-[5px] w-10 h-10"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className="block h-px w-6 transition-all duration-300 origin-center"
              style={{
                background: "var(--color-black)",
                transform: menuOpen
                  ? "translateY(6px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="block h-px w-6 transition-all duration-300"
              style={{
                background: "var(--color-black)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-px w-6 transition-all duration-300 origin-center"
              style={{
                background: "var(--color-black)",
                transform: menuOpen
                  ? "translateY(-6px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed inset-0 z-40 flex flex-col md:hidden transition-all duration-500"
        style={{
          background: "rgba(8,12,20,0.97)",
          backdropFilter: "blur(24px)",
          paddingTop: "var(--nav-height)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <ul
          className="flex flex-col gap-6 p-10"
          role="list"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="t-heading block"
                style={{
                  fontWeight: 300,
                  fontSize: "clamp(1.5rem,6vw,2.25rem)",
                  color: "var(--color-white)",
                  opacity: 0.85,
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-auto p-10 rule-h" />
        <p className="px-10 pb-10 t-label" style={{ color: "var(--color-muted)" }}>
          Advanced Chemistry Engineered for What Comes Next
        </p>
      </div>
    </>
  );
}
