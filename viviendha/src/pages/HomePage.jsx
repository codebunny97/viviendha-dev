import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Users,
  CheckCircle2,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import { useProjects } from "../context/ProjectsContext";
import EnquiryModal from "../components/EnquiryModal";

const ROTATING_WORDS = ["Dream.", "Family.", "Future."];

const METRICS = [
  { value: "50+", label: "Happy Resident Families", sub: "Thriving at Viviendha Twins" },
  { value: "2+", label: "Years of Craftsmanship", sub: "Delivering modern quality" },
  { value: "1", label: "Landmark Completed", sub: "Pride Park Twin Towers" },
  { value: "100%", label: "Legal Transparency", sub: "Clear titles & honest dealings" },
];

const WHY_CHOOSE = [
  {
    icon: MapPin,
    title: "Strategic Growth Locations",
    description:
      "Carefully chosen hubs like Ameenpur, Miyapur, and Tellapur with rapid ORR connectivity, top international schools, and seamless commutes to the IT corridors.",
  },
  {
    icon: Compass,
    title: "100% Vastu & Biophilic Design",
    description:
      "Harmonious layouts engineered with generous setbacks, abundant cross-ventilation, expansive natural daylight, and sustainable green construction principles.",
  },
  {
    icon: ShieldCheck,
    title: "100% Legal & Financial Clarity",
    description:
      "Complete regulatory compliance, approved bank loans with leading financial institutions, verified title deeds, and zero hidden construction charges.",
  },
  {
    icon: Users,
    title: "Relationship-Driven Care",
    description:
      "A personal, transparent home-buying journey with dedicated updates, milestone inspections, and enduring homeowner association support.",
  },
];

const HomePage = () => {
  const { publicProjects: projects } = useProjects();
  const [wordIndex, setWordIndex] = useState(0);
  const [activeModalProject, setActiveModalProject] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEOHead
        title="Spaces for Every Dream"
        description="Viviendha Developers creates thoughtfully planned residential communities in Hyderabad with architectural excellence and complete transparency."
      />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[92vh] flex items-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F8FAF9]">
        {/* Architectural subtle background texture */}
        <div
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/apartment.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAF9] via-[#F8FAF9]/90 to-[#F8FAF9]/40 z-0" />

        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Spaces for <br />
                Every{" "}
                <span className="inline-block text-[#2D5D54] min-w-[200px] transition-all duration-500 font-serif italic">
                  {ROTATING_WORDS[wordIndex]}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                Thoughtfully designed apartments in Hyderabad combining modern architecture, high-grade construction standards, and lasting family value.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E3A34] hover:bg-[#2D5D54] text-white px-7 py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-4 text-base font-semibold shadow-xs hover:border-slate-400 transition-all duration-300"
                >
                  <span>Schedule Site Visit</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5D54]" />
                  <span>100% Clear Titles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5D54]" />
                  <span>100% Vastu Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5D54]" />
                  <span>Bank Approved Loans</span>
                </div>
              </div>
            </div>

            {/* Right Architectural Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 group bg-slate-900">
                <img
                  src="/apartment.png"
                  alt="Viviendha Twins Landmark Residence"
                  className="w-full h-[440px] sm:h-[500px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white space-y-2">
                  <span className="px-3 py-1 rounded-full bg-[#2D5D54] text-[11px] font-semibold tracking-wider uppercase inline-block">
                    Completed Landmark
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight">Viviendha Twins</h3>
                  <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3B746A]" />
                    <span>Pride Park, Ameenpur, Miyapur, Hyderabad</span>
                  </p>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">50+ Resident Families</span>
                    <Link
                      to="/projects/viviendha-twins"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-white transition-colors"
                    >
                      <span>View Project Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="bg-[#1E3A34] text-white py-14 px-4 sm:px-6 lg:px-8 border-y border-[#2D5D54]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#2D5D54]">
            {METRICS.map((metric, idx) => (
              <div key={idx} className={`space-y-1 ${idx > 0 ? "pt-6 md:pt-0" : ""}`}>
                <p className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-serif">
                  {metric.value}
                </p>
                <p className="text-sm font-semibold text-emerald-100">{metric.label}</p>
                <p className="text-xs text-[#E5EDEA]/70">{metric.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Viviendha Preview Section */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                <img
                  src="/hero.png"
                  alt="Viviendha Architecture & Craftsmanship"
                  className="w-full h-[400px] sm:h-[460px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                About Viviendha
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Helping you find <br />
                <span className="text-[#2D5D54] font-serif italic">more than just a place to live.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                At Viviendha, we believe every property tells a story and every client deserves an empowering, transparent experience. Whether you're purchasing your first apartment, searching for an upgraded family residence, or evaluating a high-yield real estate asset, our team is committed to delivering homes that enrich everyday life.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-slate-200/80 hover:border-[#2D5D54]/50 transition-colors">
                  <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1">Our Vision</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    To become one of India's most trusted real estate developers by building enduring spaces that foster thriving communities.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-slate-200/80 hover:border-[#2D5D54]/50 transition-colors">
                  <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1">Our Mission</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Deliver homes with exceptional structural quality, thoughtful architectural planning, and radical transparency from inception to keys handover.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-slate-200/80 hover:border-[#2D5D54]/50 transition-colors">
                  <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1">Our Promise</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Every home is crafted with transparent agreements, tested materials, and punctual handover milestones.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A34] hover:text-[#2D5D54] group"
                >
                  <span>Read our full story and values</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54] mb-2">
                Curated Portfolio
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                Featured Residences
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
                Explore our ready-to-move twin tower community and upcoming residential landmarks in Hyderabad's premier corridors.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-800 text-sm font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all self-start md:self-auto shadow-xs"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Status Badge */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={proj.heroImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-xs ${
                        proj.status === "Completed"
                          ? "bg-emerald-600 text-white"
                          : proj.status === "Ongoing"
                          ? "bg-amber-600 text-white"
                          : "bg-[#1E3A34] text-white"
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                    {proj.configurations.join(", ")}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">
                      {proj.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-[#2D5D54] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[#2D5D54] font-medium mb-2">{proj.subtitle}</p>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {proj.overview}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#2D5D54] shrink-0" />
                      <span className="truncate">{proj.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span>Area: {proj.areaRange}</span>
                      <span className="text-[#1E3A34] font-semibold">{proj.pricing}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white py-2.5 text-xs font-semibold transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(proj)}
                      className="px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Viviendha Section */}
      <section id="team" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
              The Viviendha Advantage
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Why Choose Viviendha?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Four fundamental architectural and customer commitments that set our developments apart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-[#F8FAF9] border border-slate-200/80 hover:border-[#2D5D54]/50 hover:shadow-lg transition-all duration-300 space-y-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1E3A34] text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Enquiry Modal */}
      {activeModalProject && (
        <EnquiryModal
          isOpen={Boolean(activeModalProject)}
          onClose={() => setActiveModalProject(null)}
          projectTitle={activeModalProject.title}
          defaultConfiguration={activeModalProject.configurations[0]}
        />
      )}
    </>
  );
};

export default HomePage;
