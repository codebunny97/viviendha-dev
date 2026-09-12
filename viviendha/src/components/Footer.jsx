import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  ChevronUp,
  Lock,
} from "lucide-react";
import { useProjects } from "../context/ProjectsContext";

const getProjectBadge = (status) => {
  const normalized = String(status || "").toLowerCase().trim();
  if (normalized === "completed" || normalized === "ready") {
    return {
      label: "Ready",
      className: "text-emerald-400 bg-emerald-950/60 border-emerald-800",
    };
  }
  if (normalized === "ongoing") {
    return {
      label: "Ongoing",
      className: "text-amber-300 bg-amber-950/60 border-amber-800",
    };
  }
  return {
    label: status || "Upcoming",
    className: "text-sky-300 bg-sky-950/60 border-sky-800",
  };
};

const Footer = () => {
  const { publicProjects } = useProjects();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0B1412] text-slate-300 border-t border-slate-800">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#3B746A] uppercase mb-2">
                Begin Your Journey
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Ready to find your family's next home?
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Schedule a personalized tour of our completed landmark project in Hyderabad or discuss upcoming residential opportunities.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#2D5D54] hover:bg-[#3B746A] text-white px-6 py-3.5 text-sm font-semibold tracking-wide transition-all shadow-sm"
              >
                <span>Schedule a Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-3">
                <img
                  src="/favicon.png"
                  alt="Viviendha Developers"
                  className="h-10 w-10 rounded-xl object-contain shadow-xs"
                />
                <div>
                  <span className="text-xl font-bold tracking-tight text-white block leading-none">
                    Viviendha
                  </span>
                  <span className="text-[10px] tracking-[0.25em] text-[#3B746A] uppercase font-semibold">
                    Developers
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Building better tomorrows through modern architectural design, uncompromised construction standards, and 100% legal transparency across Hyderabad.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#3B746A]" />
              <span>100% Legal &amp; Clear Land Titles</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-white uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Viviendha
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-slate-400 hover:text-white transition-colors">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-slate-400 hover:text-white transition-colors">
                  Leadership &amp; Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-slate-400 hover:text-[#3B746A] transition-colors inline-flex items-center gap-1.5 pt-1"
                >
                  <Lock className="w-3.5 h-3.5 text-[#3B746A]" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Projects */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-white uppercase mb-4">
              Portfolio
            </h4>
            <ul className="space-y-2.5 text-sm">
              {publicProjects && publicProjects.length > 0 ? (
                publicProjects.map((project) => {
                  const badge = getProjectBadge(project.status);
                  return (
                    <li key={project.id || project.slug}>
                      <Link
                        to={`/projects/${project.slug || project.id}`}
                        className="text-slate-400 hover:text-white transition-colors flex items-center justify-between gap-2 group"
                      >
                        <span className="truncate group-hover:text-white transition-colors">
                          {project.title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li className="text-xs text-slate-500 italic">No published projects</li>
              )}
            </ul>
          </div>

          {/* Contact Coordinates */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-white uppercase mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:+919686696364"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-[#3B746A] shrink-0" />
                  <span>+91 9686696364</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:satya@viviendhadevelopers.com"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2.5"
                >
                  <Mail className="w-4 h-4 text-[#3B746A]" />
                  <span>satya@viviendhadevelopers.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-[#3B746A] shrink-0 mt-0.5" />
                <span>Hyderabad, Telangana</span>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Viviendha Developers. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Clear Titles &amp; Quality Assured</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              title="Viviendha Administrative Console"
            >
              <Lock className="w-3.5 h-3.5 text-[#3B746A]" />
              <span>Admin Access</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
