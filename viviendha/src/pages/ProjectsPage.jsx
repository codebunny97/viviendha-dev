import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Search,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import { useProjects } from "../context/ProjectsContext";
import EnquiryModal from "../components/EnquiryModal";

const STATUS_FILTERS = [
  { label: "All Projects", value: "All" },
  { label: "Completed", value: "Completed" },
  { label: "Ongoing", value: "Ongoing" },
  { label: "Upcoming", value: "Upcoming" },
];

const ProjectsPage = () => {
  const { publicProjects: projects } = useProjects();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalProject, setActiveModalProject] = useState(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus =
        selectedStatus === "All" ||
        project.status.toLowerCase() === selectedStatus.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        (Array.isArray(project.configurations) &&
          project.configurations.some((c) => c.toLowerCase().includes(query)));

      return matchesStatus && matchesSearch;
    });
  }, [projects, selectedStatus, searchQuery]);

  return (
    <>
      <SEOHead
        title="Residential Projects in Hyderabad"
        description="Explore Viviendha's residential communities including completed Viviendha Twins in Bowrampet and upcoming high-rise ventures."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
              Portfolio of Residences
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Architectural Living, <br />
              <span className="text-[#2D5D54] font-serif italic">Built for Generations.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal pt-2">
              Every Viviendha development reflects our focus on structural longevity, generous setbacks, high natural daylight, and strategic connectivity to Hyderabad's prime avenues.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {STATUS_FILTERS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedStatus(tab.value)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap ${
                  selectedStatus === tab.value
                    ? "bg-[#1E3A34] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, BHK..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2D5D54] focus:ring-2 focus:ring-[#2D5D54]/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] min-h-[50vh]">
        <div className="mx-auto max-w-7xl">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Hero Photo */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={proj.heroImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5">
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
                      {proj.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium tracking-wide">
                          {proj.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                      {proj.configurations.join(", ")}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        {proj.category}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1 group-hover:text-[#2D5D54] transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-[#2D5D54] font-medium mb-2">{proj.subtitle}</p>
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {proj.overview}
                      </p>
                    </div>

                    {/* Metadata Summary */}
                    <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-[#2D5D54] shrink-0" />
                        <span className="truncate">{proj.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 font-medium">
                        <span>Sizes: {proj.areaRange}</span>
                        <span className="text-[#1E3A34] font-bold">{proj.pricing}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Possession: <span className="text-slate-600 font-medium">{proj.possession}</span>
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        to={`/projects/${proj.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white py-3 text-xs font-semibold transition-colors"
                      >
                        <span>View Project Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(proj)}
                        className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 max-w-xl mx-auto p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Projects Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any developments matching your current filter criteria "{searchQuery || selectedStatus}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#1E3A34] text-white px-6 py-2.5 text-xs font-semibold hover:bg-[#2D5D54] transition-colors"
              >
                <span>Reset Filters</span>
              </button>
            </div>
          )}
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

export default ProjectsPage;
