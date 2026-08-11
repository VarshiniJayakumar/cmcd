"use client";

import { useEffect, useRef } from "react";
import { initGSAP, gsap } from "@/lib/gsap";

export default function Segment5Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    initGSAP();
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      ".contact-form",
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="segment-5"
      className="relative w-full min-h-screen flex items-center"
      style={{ background: "var(--color-cream)", padding: "10rem 0" }}
    >
      <div className="w-full max-w-[900px] mx-auto px-8">
        <div className="contact-form">
          <div className="text-center mb-16">
            <span className="t-label block mb-6">Segment 05</span>
            <h2 className="t-heading">GET IN TOUCH.</h2>
            <p className="t-body mt-6">
              Ready to discuss your chemistry and manufacturing needs? Let's connect.
            </p>
          </div>

          <form className="space-y-6 bg-white p-12 rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-dark)" }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-dark)" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-dark)" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="+91 123 456 7890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-dark)" }}>
                  Organisation
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-dark)" }}>
                Designation
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Your Role"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-dark)" }}>
                Message *
              </label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Tell us about your requirements..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-8 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl"
              style={{ background: "var(--color-blue)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-royal)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-blue)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Submit Inquiry
            </button>
          </form>

          <div className="mt-12 text-center text-sm" style={{ color: "var(--color-muted)" }}>
            <p>CMCD · Chemplast Sanmar</p>
            <p className="mt-2">Berigai, Bengaluru · India</p>
          </div>
        </div>
      </div>
    </section>
  );
}
