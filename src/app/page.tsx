/**
 * CMCD — 5 Distinct Cinematic Segments
 */
import Navigation from "@/components/navigation/Navigation";
import Segment1Molecule from "@/components/segments/Segment1Molecule";
import Segment2Architecture from "@/components/segments/Segment2Architecture";
import Segment3IntegratedFacility from "@/components/segments/Segment3IntegratedFacility";
import Segment4AboutNumbers from "@/components/segments/Segment4AboutNumbers";
import Segment5Contact from "@/components/segments/Segment5Contact";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="relative w-full">
        <Segment1Molecule />
        <Segment2Architecture />
        <Segment3IntegratedFacility />
        <Segment4AboutNumbers />
        <Segment5Contact />
      </main>
    </>
  );
}
