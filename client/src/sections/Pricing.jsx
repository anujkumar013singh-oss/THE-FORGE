import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { plans } from "../data/offers.js";
import QRModal from "../components/QRModal.jsx";

function PricingCard({ plan, index, onBuy }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  const accentColors = ["bg-forge-red", "bg-red-600", "bg-forge-red"];
  const accent = accentColors[index % accentColors.length];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        mouseX.set((e.clientX - centerX) / rect.width);
        mouseY.set((e.clientY - centerY) / rect.height);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      className="relative w-full bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 border-white/10 shadow-[5px_5px_0px_0px_rgba(225,6,0,0.3)] hover:shadow-[7px_7px_0px_0px_rgba(225,6,0,0.4)] transition-shadow duration-200 flex flex-col"
    >
      <motion.div
        className={`absolute -top-3 -right-3 w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/20 shadow-[3px_3px_0px_0px_rgba(225,6,0,0.4)] ${accent}`}
        animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 0.9, 1.1, 1], y: [0, -4, 4, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="text-center text-white">
          <div className="text-sm font-black font-heading">{plan.gymTime.replace(" ", "")}</div>
          <div className="text-[8px] font-bold uppercase tracking-wider">session</div>
        </div>
      </motion.div>

      <div className="mb-4">
        <h3 className="text-xl font-black text-white font-heading mb-2">{plan.name}</h3>
        {plan.popular && (
          <motion.span
            className="inline-block px-3 py-1 bg-forge-red text-white font-bold rounded-md text-xs border border-white/20 shadow-[2px_2px_0px_0px_rgba(225,6,0,0.4)]"
            animate={{ y: [0, -3, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            POPULAR
          </motion.span>
        )}
      </div>

      <div className="space-y-2 mb-4 flex-1">
        {plan.features.map((feature, i) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 4, transition: { type: "spring", stiffness: 400 } }}
            className="flex items-center gap-2 p-2.5 bg-white/[0.04] rounded-md border border-white/5 shadow-[1px_1px_0px_0px_rgba(225,6,0,0.15)]"
          >
            <motion.span
              whileHover={{ rotate: 360 }}
              className={`w-5 h-5 rounded-md flex items-center justify-center text-white font-bold text-xs border border-white/20 shadow-[1px_1px_0px_0px_rgba(225,6,0,0.3)] shrink-0 ${accent}`}
            >
              ✓
            </motion.span>
            <span className="text-forge-muted font-body text-sm">{feature}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={() => onBuy(plan)}
        className={`w-full py-3 rounded-lg text-white font-heading font-black text-sm uppercase tracking-wide border-2 border-forge-red shadow-[4px_4px_0px_0px_rgba(225,6,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(225,6,0,0.6)] active:shadow-[2px_2px_0px_0px_rgba(225,6,0,0.5)] transition-all duration-200 ${accent}`}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.97, rotate: [-1, 1, 0] }}
      >
        BUY NOW →
      </motion.button>
    </motion.div>
  );
}

export default function Pricing() {
  const [qrPlan, setQrPlan] = useState(null);

  return (
    <section id="pricing" className="section-padding bg-forge-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }} />
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-forge-red/20 rounded-full"
            style={{ left: `${5 + Math.random() * 90}%`, top: `${5 + Math.random() * 90}%` }}
            animate={{ y: [0, -40, 0], x: [0, Math.random() * 20 - 10, 0], scale: [1, 1.8, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 inline-block w-full"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white font-heading
            px-6 md:px-10 py-4 rounded-xl border-2 border-white/10 bg-white/[0.02]
            shadow-[6px_6px_0px_0px_rgba(225,6,0,0.3)] inline-block">
            CHOOSE YOUR <span className="text-forge-red">EDGE</span>
          </h1>
          <motion.div className="h-1.5 bg-gradient-to-r from-forge-red via-forge-red/50 to-forge-red rounded-full max-w-xs mx-auto mt-2"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          />
          <p className="font-body text-forge-dim text-sm md:text-base mt-4 max-w-md mx-auto">
            Every plan is designed to push you further. Pick your intensity.
          </p>
        </motion.div>

        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} onBuy={setQrPlan} />
          ))}
        </div>
      </div>

      {qrPlan && (
        <QRModal
          plan={qrPlan}
          duration={qrPlan.gymTime}
          amount={qrPlan.price}
          onClose={() => setQrPlan(null)}
        />
      )}
    </section>
  );
}
