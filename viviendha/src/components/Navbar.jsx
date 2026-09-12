import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, Phone, MapPin, Lock } from "lucide-react";

const NAV_LINKS = [
  { id: "home", label: "Home", to: "/" },
  { id: "about", label: "About", to: "/about" },
  { id: "projects", label: "Projects", to: "/projects" },
  { id: "team", label: "Team", to: "/team" },
  { id: "contact", label: "Contact", to: "/contact" },
];

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/place/Viviendha+Twins+-+Mukundha+%26+Murari/@17.5318209,78.3463257,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb8d006ea9e8a5:0x5b771ac932e578ab!8m2!3d17.5318209!4d78.3463257!16s%2Fg%2F11ycl4g1lp";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isLinkActive = (to) => {
    if (to === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(to);
  };

  // Detect scroll offset for header glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
      <div className="mx-auto max-w-7xl">
        <nav
          className={`flex items-center justify-between rounded-2xl sm:rounded-full px-5 sm:px-8 py-3.5 transition-all duration-300 border ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md border-slate-200/80 shadow-elevation"
              : "bg-white/85 backdrop-blur-md border-white/60 shadow-subtle"
          }`}
          aria-label="Main Navigation"
        >
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5D54] rounded-lg"
          >
            <img
              src="/logo.png"
              alt="Viviendha Developers"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1">
            {NAV_LINKS.map((item) => {
              const isActive = isLinkActive(item.to);
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`px-4 py-2 rounded-full text-sm lg:text-[15px] font-medium tracking-wide transition-colors duration-150 ${
                    isActive
                      ? "text-[#1E3A34] font-semibold bg-[#E5EDEA]/80"
                      : "text-slate-600 hover:text-[#1E3A34] hover:bg-slate-100/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              to="/admin"
              className="p-2.5 rounded-full text-slate-500 hover:text-[#1E3A34] hover:bg-slate-100 transition-colors duration-200"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <a
              href="tel:+919686696364"
              className="p-2.5 rounded-full text-slate-600 hover:text-[#1E3A34] hover:bg-slate-100 transition-colors duration-200"
              title="Call Viviendha: +91 9686696364"
              aria-label="Call Viviendha"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A34] hover:bg-[#2D5D54] text-white px-5 py-2.5 text-sm font-medium tracking-wide shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E3A34]"
            >
              <span>Visit Site</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="tel:+919686696364"
              className="p-2 rounded-full text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Call Viviendha"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2D5D54]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Viviendha Developers" className="h-10 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="py-6 flex flex-col space-y-1">
            {NAV_LINKS.map((item) => {
              const isActive = isLinkActive(item.to);
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-[#E5EDEA] text-[#1E3A34] font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer actions inside drawer */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A34] text-white px-5 py-3.5 text-sm font-medium shadow-sm hover:bg-[#2D5D54] transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Visit Our Site (Ameenpur, Miyapur)</span>
          </a>
          <a
            href="tel:+919686696364"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 text-slate-700 px-5 py-3.5 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>+91 9686696364</span>
          </a>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-slate-600 px-5 py-3 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Admin Portal Access</span>
          </Link>
          <p className="text-center text-xs text-slate-400 pt-2">
            Viviendha Developers &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;