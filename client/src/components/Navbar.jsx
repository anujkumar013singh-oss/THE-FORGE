import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext.jsx";

const navLinks = ["Home", "Features", "Gallery", "Pricing", "Testimonials", "Contact Us"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const mobileRef = useRef(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return;
    const ids = navLinks.map(l => l.toLowerCase().replace(/\s+/g, "-"));
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      return new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-45% 0px -50% 0px" }
      );
    });
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && observers[i]) observers[i].observe(el);
    });
    return () => observers.forEach(o => o?.disconnect());
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      gsap.fromTo(mobileRef.current, { x: "100%" }, { x: 0, duration: 0.35, ease: "power3.out" });
    }
  }, [mobileOpen]);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const logoSrc = "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782970725/pixora-uploads/pixora-bg-1782970725175-xdteey.png";

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A0A]/80 backdrop-blur-xl shadow-lg" : "bg-[#0A0A0A]/30 backdrop-blur-sm"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoSrc} alt="THE FORGE" className="h-8 md:h-10 w-auto" />
            <span className="font-heading text-lg md:text-xl font-bold tracking-widest text-white hidden sm:block">
              THE<span className="text-forge-red"> FORGE</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(link => {
              const id = link.toLowerCase().replace(/\s+/g, "-");
              return (
                <button key={link} onClick={() => scrollTo(id)}
                  className={`font-heading text-xs uppercase tracking-[0.15em] transition-colors hover:text-forge-red ${activeSection === id ? "text-forge-red" : "text-forge-muted/80"}`}>
                  {link}
                </button>
              );
            })}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="font-heading text-xs uppercase tracking-[0.15em] text-forge-muted/80 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button onClick={logout}
                  className="font-heading text-xs uppercase tracking-[0.15em] bg-forge-red text-white px-5 py-2 rounded hover:bg-red-700 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth"
                className="font-heading text-xs uppercase tracking-[0.15em] bg-forge-red text-white px-5 py-2.5 rounded hover:bg-red-700 transition-colors">
                Login / Sign Up
              </Link>
            )}
          </div>
          <button className="lg:hidden text-white" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div ref={mobileRef} className="fixed top-0 right-0 h-full w-72 bg-[#0A0A0A]/95 backdrop-blur-xl z-50 flex flex-col p-8 shadow-2xl border-l border-white/5">
          <div className="flex items-center justify-between mb-10">
            <img src={logoSrc} alt="THE FORGE" className="h-8 w-auto" />
            <button className="text-forge-muted hover:text-white transition-colors" onClick={() => setMobileOpen(false)} aria-label="Close">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {navLinks.map(link => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(/\s+/g, "-"))}
                className="font-heading text-base uppercase tracking-[0.15em] text-forge-muted hover:text-forge-red py-3 transition-colors text-left">
                {link}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-8 border-t border-white/5">
            {user ? (
              <>
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="block font-heading text-base uppercase tracking-[0.15em] text-forge-muted hover:text-white py-3 transition-colors"
                  onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full mt-4 font-heading text-xs uppercase tracking-[0.15em] bg-forge-red text-white px-5 py-3 rounded hover:bg-red-700 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}
                className="block w-full text-center font-heading text-xs uppercase tracking-[0.15em] bg-forge-red text-white px-5 py-3 rounded hover:bg-red-700 transition-colors">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
