import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";

const videos = [
  "https://ik.imagekit.io/vxqem8zrj/vidssave.com%20a%20Cinematic%20Fitness%20Video...SONY%20FX6%201080P.mp4?tr=orig",
  "https://ik.imagekit.io/vxqem8zrj/vidssave.com%20Gym%20Promotional%20Video%20_%20Cinematic%20Workout%20Advertisment%201080p.mp4"
];

export default function Hero() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 })
        .fromTo(".hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
        .fromTo(".hero-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 }, "-=0.2")
        .fromTo(videoRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, "-=0.6");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveVideo(p => (p + 1) % videos.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const logoSrc = "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782970725/pixora-uploads/pixora-bg-1782970725175-xdteey.png";

  return (
    <section id="home" ref={containerRef} className="min-h-screen flex items-center bg-forge-black overflow-hidden pt-16 md:pt-20">
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 lg:py-0">
        <div className="order-2 lg:order-1">
          <img src={logoSrc} alt="THE FORGE" className="hero-title h-12 md:h-16 w-auto mb-6" />
          <h1 className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.9] text-white">
            FORGE YOUR<br />
            <span className="text-forge-red">BEST SELF</span>
          </h1>
          <p className="hero-sub font-body text-forge-muted text-base md:text-lg mt-5 max-w-md leading-relaxed">
            Premium equipment, world-class trainers, and a community that pushes you beyond your limits. This is where strength is built.
          </p>
          <div className="hero-cta flex flex-wrap gap-3 md:gap-4 mt-8">
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="font-heading text-xs md:text-sm uppercase tracking-[0.15em] bg-forge-red text-white px-7 py-3 md:px-8 md:py-3.5 rounded hover:bg-red-700 transition-all flex items-center gap-2">
              Start Your Transformation <ArrowRight size={16} />
            </button>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="font-heading text-xs md:text-sm uppercase tracking-[0.15em] border border-white/20 text-white px-7 py-3 md:px-8 md:py-3.5 rounded hover:border-forge-red hover:text-forge-red transition-all">
              Explore More
            </button>
          </div>
        </div>
        <div ref={videoRef} className="relative order-1 lg:order-2">
          <div className="relative rounded-lg overflow-hidden bg-black aspect-[4/3] md:aspect-[4/3]">
            {videos.map((src, i) => (
              <video key={i} autoPlay muted loop playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === activeVideo ? "opacity-100" : "opacity-0"}`}>
                <source src={src} type="video/mp4" />
              </video>
            ))}
            <div className="absolute inset-0 bg-gradient-to-tr from-forge-black/50 via-transparent to-forge-red/5 pointer-events-none z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
