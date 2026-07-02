import { useEffect, useRef } from "react";
import Lenis from "lenis";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../sections/Hero.jsx";
import Features from "../sections/Features.jsx";
import Gallery from "../sections/Gallery.jsx";
import Pricing from "../sections/Pricing.jsx";
import Testimonials from "../sections/Testimonials.jsx";
import Contact from "../sections/Contact.jsx";
import MarqueeStrip from "../sections/MarqueeStrip.jsx";

export default function LandingPage() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <Features />
        <Gallery />
        <Pricing />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
