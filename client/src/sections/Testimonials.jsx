import React from "react";
import { motion } from "framer-motion";
import testimonials from "../data/testimonials.js";

function TestimonialColumn({ testimonials, duration, className }) {
  const duplicated = [...testimonials, ...testimonials, ...testimonials];
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{ duration: duration || 15, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-5 pb-5"
      >
        {duplicated.map((t, i) => (
          <div key={`${t.name}-${i}`} className="glass rounded-xl p-5 md:p-6 w-full border border-white/5">
            <p className="font-body text-forge-muted text-sm leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3 mt-4">
              <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-forge-red/20" />
              <div>
                <p className="font-heading text-sm text-white font-semibold">{t.name}</p>
                <p className="font-body text-xs text-forge-dim">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const firstCol = testimonials.slice(0, 3);
  const secondCol = testimonials.slice(3, 6);
  const thirdCol = testimonials.slice(6, 9);

  return (
    <section id="testimonials" className="section-padding bg-forge-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">
            WHAT OUR <span className="text-forge-red">MEMBERS</span> SAY
          </h2>
          <p className="font-body text-forge-dim text-sm md:text-base mt-3 max-w-md mx-auto">
            Real stories from the Forge community.
          </p>
        </motion.div>
      </div>
      <div className="flex justify-center gap-5 px-6 max-h-[680px] overflow-hidden"
        style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
        <TestimonialColumn testimonials={firstCol} duration={12} className="w-full max-w-sm" />
        <TestimonialColumn testimonials={secondCol} duration={16} className="hidden md:block w-full max-w-sm" />
        <TestimonialColumn testimonials={thirdCol} duration={14} className="hidden lg:block w-full max-w-sm" />
      </div>
    </section>
  );
}
