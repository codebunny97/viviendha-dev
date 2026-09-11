import { Link } from "react-router-dom";
import {
  Compass,
  ShieldCheck,
  Target,
  Eye,
  ArrowRight,
  HardHat,
  Leaf,
} from "lucide-react";
import SEOHead from "../components/SEOHead";

const STATS = [
  { number: "50+", label: "Happy Families", detail: "Active residents at Viviendha Twins" },
  { number: "2+", label: "Years of Experience", detail: "Dedicated residential focus in Hyderabad" },
  { number: "1", label: "Project Completed", detail: "Delivered on schedule in Bowrampet" },
  { number: "100%", label: "Legal Transparency", detail: "Clear title deeds & zero surprises" },
];

const PILLARS = [
  {
    icon: HardHat,
    title: "Structural Precision",
    desc: "Rigorous quality control using high-grade TMT steel, ready-mix concrete, certified bricks, and anti-termite foundation treatments.",
  },
  {
    icon: Compass,
    title: "Vastu & Natural Harmony",
    desc: "Every residence is balanced with 100% Vastu compliance, optimal cross-ventilation, and maximum natural daylight.",
  },
  {
    icon: Leaf,
    title: "Sustainable Living",
    desc: "Rainwater harvesting percolation systems, energy-efficient fixtures, and landscaped greenery in every development.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Surprise Clear Titles",
    desc: "Clear bank titles, certified land ownership, and upfront transparent pricing with no hidden developer clauses.",
  },
];

const AboutPage = () => {
  return (
    <>
      <SEOHead
        title="About Viviendha | Vision, Mission & Craftsmanship"
        description="Discover how Viviendha Developers is redefining the home-buying experience in Hyderabad with architectural integrity, transparent ethics, and lasting quality."
      />

      {/* Hero / Header */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
              About Viviendha
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Helping you find <br />
              <span className="text-[#2D5D54] font-serif italic">more than just a place to live.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal pt-2">
              At Viviendha, we believe every property tells a story and every client deserves a seamless, honest experience. Whether you're searching for your first home, upgrading for your growing family, or securing a solid long-term investment, we empower your decisions with clarity and architectural excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Our Foundation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Built on Trust, Innovation, and Homeowner-First Values
              </h2>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Viviendha was founded to redefine the residential development experience in Hyderabad. In an industry often clouded by ambiguous timelines and unexpected extras, we set out with a clear charter: build homes where families truly belong, delivered with straightforward communication and high engineering standards.
                </p>
                <p>
                  Our journey began with <strong>Viviendha Twins (Mukundha & Murari)</strong> in Bowrampet—a residential enclave conceived around symmetry, natural ventilation, and peaceful community living. Today, that vision is a vibrant community home to over 50 families.
                </p>
                <p>
                  As Hyderabad continues to grow along the Outer Ring Road and western tech corridors, Viviendha continues to select prime residential pockets that guarantee peaceful living alongside high capital appreciation.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/team"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E3A34] hover:bg-[#2D5D54] text-white px-6 py-3 text-sm font-semibold transition-all"
                >
                  <span>Meet Our Leadership Team</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#1E3A34] transition-colors"
                >
                  <span>View Our Work</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <img
                  src="/apartment.png"
                  alt="Viviendha Residential Development"
                  className="w-full h-[450px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden sm:block p-6 rounded-2xl bg-[#1E3A34] text-white shadow-xl max-w-xs">
                <p className="text-2xl font-bold font-serif text-emerald-300">100%</p>
                <p className="text-xs text-slate-200 mt-1">
                  Commitment to on-time milestone delivery and regulatory transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-subtle space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1E3A34] text-white flex items-center justify-center">
                <Eye className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Our Vision
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                To become one of India's most trusted real estate developers by building spaces that enrich everyday life, foster warm community bonds, and stand as benchmarks of architectural integrity.
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-subtle space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1E3A34] text-white flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Deliver homes with exceptional structural quality, thoughtful spatial planning, and complete transparency from the initial blueprint to post-handover customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Construction Standards / Quality Pillars */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
              Quality Assurance
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Our Construction Standards
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              We never cut corners on what lies behind the paint. Here is how we ensure structural endurance for generations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-[#F8FAF9] border border-slate-200/80 hover:border-[#2D5D54] transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1E3A34] text-white flex items-center justify-center">
                    <IconComp className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{pillar.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-[#1E3A34] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-4xl sm:text-5xl font-bold text-white font-serif">{stat.number}</p>
                <p className="text-sm font-semibold text-emerald-100">{stat.label}</p>
                <p className="text-xs text-[#E5EDEA]/70">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
