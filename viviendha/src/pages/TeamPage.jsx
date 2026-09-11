import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import { teamMembers, leadershipOverview, strongCombination } from "../data/team";

const TeamPage = () => {
  return (
    <>
      <SEOHead
        title="Our Leadership | Experience. Expertise. One Vision."
        description="Meet the directors of Viviendha Developers bringing together banking, finance, construction, technology, and civil engineering expertise."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
              {leadershipOverview.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Experience. Expertise. <br />
              <span className="text-[#2D5D54] font-serif italic">One Vision.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal pt-2">
              Our leadership team brings together diverse expertise in{" "}
              <strong className="text-slate-900 font-semibold">
                Banking, Finance, construction, technology, and civil engineering
              </strong>
              , creating a strong foundation for delivering quality construction and real estate projects.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Profiles Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
              Executive Board
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
              Board of Directors
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Uniting institutional rigor, structural engineering prowess, and forward-thinking operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-8 sm:p-10 rounded-3xl bg-[#F8FAF9] border border-slate-200/90 shadow-subtle hover:shadow-xl hover:border-[#2D5D54]/50 transition-all duration-300 space-y-6 group"
              >
                {/* Top Avatar & Department Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#1E3A34] text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-md border-2 border-[#2D5D54] group-hover:scale-105 transition-transform">
                    {member.initials}
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold tracking-wide shadow-xs">
                    {member.department}
                  </span>
                </div>

                {/* Name, Role & Credential */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight group-hover:text-[#2D5D54] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#2D5D54] mt-0.5">
                    {member.role}
                  </p>
                  {member.credential && (
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {member.credential}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A Strong Combination Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#1E3A34] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="mx-auto max-w-5xl text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#A8D5BA] text-xs font-semibold uppercase tracking-[0.25em]">
            {strongCombination.title}
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-serif italic text-white/95 max-w-3xl mx-auto leading-relaxed">
            “{strongCombination.vision}”
          </h2>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-3xl mx-auto font-normal">
            {strongCombination.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8 text-left">
            {strongCombination.pillars.map((pillar) => {
              const icons = {
                "01": Award,
                "02": ShieldCheck,
                "03": Sparkles,
                "04": TrendingUp,
              };
              const IconComponent = icons[pillar.number] || Award;

              return (
                <div
                  key={pillar.number}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#A8D5BA]/40 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold text-[#A8D5BA]">
                      {pillar.number}
                    </span>
                    <IconComponent className="w-5 h-5 text-[#A8D5BA] group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <div className="mx-auto max-w-2xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
            Direct Engagement
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Connect Directly with our Leadership
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Have inquiries regarding strategic land collaborations, upcoming residential developments, or our construction standards?
          </p>
          <div className="pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E3A34] hover:bg-[#2D5D54] text-white px-8 py-3.5 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <span>Speak with Our Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamPage;
