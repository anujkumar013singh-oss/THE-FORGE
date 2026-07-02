import { motion } from "framer-motion";

const words = ["STRENGTH", "DISCIPLINE", "POWER", "TRANSFORM", "GRIND", "FOCUS"];

export default function MarqueeStrip() {
  return (
    <div className="py-4 border-t border-b border-white/5 overflow-hidden bg-forge-black">
      <motion.div
        className="flex gap-10 md:gap-14 whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
      >
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i} className="font-heading text-xl md:text-3xl font-bold text-white/[0.04] tracking-widest select-none uppercase">
            {w} <span className="text-forge-red/[0.12]">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
