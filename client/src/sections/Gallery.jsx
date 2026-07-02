import React from "react";
import { motion } from "framer-motion";
import { AspectRatio } from "../components/ui/aspect-ratio.jsx";
import galleryItems from "../data/gallery.js";

export default function Gallery() {
  const col1 = galleryItems.filter((_, i) => i % 3 === 0);
  const col2 = galleryItems.filter((_, i) => i % 3 === 1);
  const col3 = galleryItems.filter((_, i) => i % 3 === 2);

  const GalleryImage = ({ item }) => {
    const [loaded, setLoaded] = React.useState(false);
    const isPortrait = item.id % 2 === 0;
    const ratio = isPortrait ? 9 / 16 : 16 / 9;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-lg overflow-hidden border border-white/5 group"
      >
        <AspectRatio ratio={ratio}>
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            onLoad={() => setLoaded(true)}
          />
          <div className="absolute inset-0 bg-forge-black/10 group-hover:bg-forge-black/0 transition-colors duration-300" />
        </AspectRatio>
      </motion.div>
    );
  };

  return (
    <section id="gallery" className="section-padding bg-forge-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">
            THE <span className="text-forge-red">FORGE</span> EXPERIENCE
          </h2>
          <p className="font-body text-forge-dim text-sm md:text-base mt-3 max-w-lg mb-10 md:mb-14">
            A glimpse into the culture, energy, and environment that defines us.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4">
            {col1.map(item => <GalleryImage key={item.id} item={item} />)}
          </div>
          <div className="flex flex-col gap-4">
            {col2.map(item => <GalleryImage key={item.id} item={item} />)}
          </div>
          <div className="flex flex-col gap-4">
            {col3.map(item => <GalleryImage key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
