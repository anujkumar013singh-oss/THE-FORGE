import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import features from "../data/features.js";

gsap.registerPlugin(ScrollTrigger);

const imgUrls = [
  "https://i0.wp.com/www.harcoindia.in/wp-content/uploads/2024/11/Hm1.jpg",
  "https://plus.unsplash.com/premium_photo-1663050901483-ee8703cc8372?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29uYWwlMjB0cmFpbmVyfGVufDB8fDB8fHww",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJgiD-hGwsj9FsVCV6gpNTmC-uDQmxJgYzOa9-BUTHvieqQERhG7vqlXQV&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6amUKRLrA639hUJ9blUwxIUfoMF0yQ_Rsd-074pNp9_EqRy8C--0G60ze&s=10",
  "https://static.vecteezy.com/system/resources/thumbnails/039/295/261/small/ai-generated-detailed-view-of-a-person-lifting-weights-in-a-gym-muscles-tensing-with-a-backdrop-of-exercise-equipment-and-blurred-movement-nearby-a-plate-of-healthy-food-emphasizing-nutrition-photo.jpeg",
  "https://focusfitnessclub.com/wp-content/uploads/2022/04/7B5A6773.jpg"
];

function FeatureCard({ feature, index, imgSrc }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.x - rect.width / 2) / rect.width);
        mouseY.set((e.clientY - rect.y - rect.height / 2) / rect.height);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      className="group relative rounded-xl overflow-hidden border border-white/5 bg-forge-black hover:border-forge-red/30 transition-all duration-500 cursor-default will-change-transform"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <div className="w-full h-full relative">
          <img src={imgSrc} alt={feature.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-[2deg]" />
          <div className="absolute inset-0 bg-gradient-to-t from-forge-black/80 via-forge-black/20 to-transparent" />
          <div className="absolute inset-0 bg-forge-red/0 group-hover:bg-forge-red/5 transition-all duration-500" />
        </div>
      </div>

      <motion.span
        className="absolute top-4 left-4 font-heading text-4xl md:text-5xl font-black text-white/10 group-hover:text-forge-red/40 transition-colors duration-500 leading-none"
        whileHover={{ scale: 1.2 }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-0">
        <motion.h3
          className="font-heading text-lg md:text-xl font-bold text-white group-hover:text-forge-red transition-colors duration-300"
          whileHover={{ x: 4 }}
        >
          {feature.title}
        </motion.h3>
        <p className="font-body text-forge-dim text-sm mt-1.5 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
          {feature.desc}
        </p>
      </div>

      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/0 group-hover:ring-forge-red/20 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".features-title-line",
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
        }
      );
      gsap.to(marqueeRef.current, {
        x: "-50%",
        duration: 30,
        repeat: -1,
        ease: "none"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="section-padding bg-forge-black relative overflow-hidden">
      {/* Top marquee accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-forge-red/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="features-title-line">
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">
              WHY <span className="text-forge-red">FORGE</span>
            </h2>
          </div>
          <div className="features-title-line">
            <p className="font-body text-forge-dim text-sm md:text-base mt-3 max-w-lg">
              Every detail engineered for one purpose: your transformation.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} imgSrc={imgUrls[i % imgUrls.length]} />
          ))}
        </div>

        {/* Bottom marquee */}
        <div className="mt-14 md:mt-20 overflow-hidden border-t border-b border-white/5 py-4">
          <div ref={marqueeRef} className="flex gap-8 whitespace-nowrap w-[200%]">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex gap-8 items-center">
                {["IRON", "GRIT", "DISCIPLINE", "STRENGTH", "POWER", "FOCUS", "COMMITMENT", "GROWTH"].map((word, i) => (
                  <span key={i} className="font-heading text-xs md:text-sm uppercase tracking-[0.3em] text-white/20 flex items-center gap-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-forge-red/40" />
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
