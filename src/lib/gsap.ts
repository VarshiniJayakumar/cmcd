/**
 * GSAP + ScrollTrigger bootstrap.
 * Import this in Client Components that need ScrollTrigger.
 *
 * Call `initGSAP()` once inside a useEffect to register plugins.
 * Safe to call multiple times — GSAP guards against double-registration.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialised = false;

export function initGSAP(): void {
  if (initialised) return;
  initialised = true;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({ markers: false });
}

export { gsap, ScrollTrigger };
