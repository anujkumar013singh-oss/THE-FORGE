import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Sector 45, Gurugram, Haryana 122003",
    href: "https://maps.google.com/?q=Sector+45+Gurugram+Haryana"
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 96546 73316",
    href: "tel:+919654673316"
  },
  {
    icon: Mail,
    label: "Email",
    value: "alonesurvivor03@gmail.com",
    href: "mailto:alonesurvivor03@gmail.com"
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat : 6 AM – 10 PM\nSunday : 7 AM – 8 PM",
    href: null
  }
];

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-el", { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact-us" ref={sectionRef} className="section-padding bg-forge-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">
            FIND <span className="text-forge-red">US</span>
          </h2>
          <p className="font-body text-forge-dim text-sm md:text-base mt-3 max-w-lg mb-10 md:mb-14">
            Where iron meets purpose. Come find your edge at THE FORGE.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          <div className="space-y-8 md:space-y-9">
            <div className="contact-el">
              <blockquote className="font-heading text-lg md:text-xl italic text-forge-muted border-l-2 border-forge-red pl-5 leading-relaxed">
                "The gym is not just a room with weights. It's a laboratory where we test the human 
                spirit — and every workout is an experiment in becoming stronger than yesterday."
              </blockquote>
              <p className="font-body text-xs text-forge-dim mt-3 uppercase tracking-[0.1em]">
                — The Forge Mindset
              </p>
            </div>
            <div className="contact-el grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <div className="group">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="relative">
                        <Icon size={22} className="text-forge-red relative z-10" />
                        <div className="absolute -inset-2 bg-forge-red/10 rounded-full blur-sm group-hover:blur-md transition-all" />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-forge-red/30 to-transparent" />
                    </div>
                    <p className="font-heading text-sm md:text-base font-bold text-white tracking-widest uppercase mb-1">{item.label}</p>
                    <p className="font-body text-base md:text-lg text-forge-dim leading-relaxed whitespace-pre-line">{item.value}</p>
                  </div>
                );
                if (item.href) {
                  return <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">{content}</a>;
                }
                return <div key={i} className="block">{content}</div>;
              })}
            </div>
          </div>
          <div className="contact-el rounded-xl overflow-hidden h-[350px] md:h-[420px] shadow-[0_0_30px_-10px_rgba(225,6,0,0.2)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.810611765871!2d77.0628286!3d28.4420627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1944f5655555%3A0x8d4f0b2f0b2f0b2f!2sSector%2045%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0, filter: "grayscale(1) hue-rotate(0deg) invert(0.1)" }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="THE FORGE — Gurugram"
              className="grayscale invert-[0.85] brightness-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
