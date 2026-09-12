import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Building,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Phone,
  ArrowLeft,
  ArrowUpRight,
  Sun,
  Zap,
  Smile,
  Dumbbell,
  Droplets,
  ArrowUpDown,
  BatteryCharging,
  Waves,
  Laptop,
  Trophy,
  Heart,
  Car,
  Music,
  Flower,
  Dog,
  Compass,
  FileText,
  Download,
  HelpCircle,
  Activity,
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import { useProjects } from "../context/ProjectsContext";
import Lightbox from "../components/Lightbox";
import EnquiryModal from "../components/EnquiryModal";

// Icon mapping helper
const ICON_MAP = {
  Sun,
  ShieldCheck,
  Zap,
  Smile,
  Dumbbell,
  Droplets,
  ArrowUpDown,
  BatteryCharging,
  Waves,
  Laptop,
  Building,
  Trophy,
  Heart,
  Car,
  Music,
  Flower,
  Dog,
};

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { getProjectBySlug } = useProjects();
  const project = getProjectBySlug(slug);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedPlanTab, setSelectedPlanTab] = useState(0);

  if (!project) {
    return (
      <div className="pt-40 pb-24 text-center px-4 max-w-lg mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-slate-600 text-sm">
          The project you are trying to view does not exist or has been updated.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-full bg-[#1E3A34] text-white px-6 py-3 text-sm font-semibold hover:bg-[#2D5D54] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <SEOHead
        title={`${project.title} - ${project.subtitle}`}
        description={`${project.title} by Viviendha Developers. ${project.tagline}. Located in ${project.location}.`}
      />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/projects" className="hover:text-slate-900 transition-colors">
              Projects
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{project.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Header Specs */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                    project.status === "Completed"
                      ? "bg-emerald-600 text-white"
                      : project.status === "Ongoing"
                      ? "bg-amber-600 text-white"
                      : "bg-[#1E3A34] text-white"
                  }`}
                >
                  {project.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-medium">
                  {project.category}
                </span>
                {project.reraNumber && (
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D5D54]" />
                    <span>{project.reraNumber}</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
                {project.title}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-[#2D5D54] font-serif italic">
                {project.tagline}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-600 pt-1">
                <MapPin className="w-4 h-4 text-[#2D5D54] shrink-0" />
                <span>{project.location}</span>
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500 font-medium">Pricing</span>
                <span className="text-lg font-bold text-[#1E3A34]">{project.pricing}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Configurations</span>
                  <span className="font-semibold text-slate-800">
                    {project.configurations.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Super Built-Up</span>
                  <span className="font-semibold text-slate-800">{project.areaRange}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Residences</span>
                  <span className="font-semibold text-slate-800">{project.totalUnits}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Possession Status</span>
                  <span className="font-semibold text-emerald-700">{project.possession}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white py-3.5 text-sm font-semibold shadow-xs transition-colors"
                >
                  <span>Enquire for Price &amp; Floor Plans</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                {project.brochurePdf && (
                  <a
                    href={project.brochurePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 py-3 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#2D5D54]" />
                    <span>Download Project Brochure (PDF)</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.projectPlanPdf && (
                  <a
                    href={project.projectPlanPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 py-3 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download Sanctioned Plan (PDF)</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.googleMapsUrl && (
                  <a
                    href={project.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 text-xs font-semibold transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#2D5D54]" />
                    <span>View Site on Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Image Banner & Gallery Teaser */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group bg-slate-900">
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-[400px] sm:h-[550px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute bottom-6 right-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold shadow-lg backdrop-blur-xs transition-all"
            >
              <Maximize2 className="w-4 h-4 text-[#2D5D54]" />
              <span>View Fullscreen Gallery ({project.gallery.length} Photos)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Overview & Key Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Architectural Concept
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                About the Development
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {project.overview}
              </p>

              {/* Key Highlights List */}
              <div className="pt-4 space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Key Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-slate-200/80 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2D5D54] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Project Gallery</h3>
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  className="text-xs font-semibold text-[#2D5D54] hover:underline"
                >
                  Fullscreen Viewer &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {project.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    className="relative h-36 rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 border border-slate-200"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Maximize2 className="w-5 h-5 text-white drop-shadow" />
                    </div>
                    <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      {img.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floor Plans Section */}
      {project.floorPlans && project.floorPlans.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-t border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl mb-10 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Configurations &amp; Layouts
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Floor Plans &amp; Space Planning
              </h2>
              <p className="text-sm text-slate-600">
                100% Vastu compliant, zero common walls in select units, and designed for optimal cross-ventilation.
              </p>
            </div>

            {/* Plan Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto">
              {project.floorPlans.map((plan, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPlanTab(idx)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedPlanTab === idx
                      ? "bg-[#1E3A34] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {plan.type} ({plan.superBuiltUp})
                </button>
              ))}
            </div>

            {/* Active Plan Card */}
            {project.floorPlans[selectedPlanTab] && (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#E5EDEA] text-[#1E3A34] text-xs font-bold">
                    {project.floorPlans[selectedPlanTab].facing}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {project.floorPlans[selectedPlanTab].type}
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <strong>Super Built-Up Area:</strong> {project.floorPlans[selectedPlanTab].superBuiltUp}
                    </p>
                    <p>
                      <strong>Orientation:</strong> {project.floorPlans[selectedPlanTab].facing} (100% Vastu Compliant)
                    </p>
                    <p className="leading-relaxed">
                      <strong>Features &amp; Spatial Flow:</strong> {project.floorPlans[selectedPlanTab].features}
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setEnquiryModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white px-6 py-3 text-xs font-semibold transition-colors"
                    >
                      <span>Request Detailed Blueprints &amp; Pricing</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                  <Compass className="w-12 h-12 text-[#2D5D54] mx-auto opacity-70" />
                  <h4 className="font-bold text-slate-800 text-base">Architectural Blueprint</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Detailed CAD diagrams and sanctioned layout approvals available upon direct enquiry.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(true)}
                    className="text-xs font-semibold text-[#2D5D54] hover:underline"
                  >
                    Download Floor Plan PDF &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Amenities Section */}
      {project.amenities && project.amenities.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl mb-12 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Lifestyle Infrastructure
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Amenities &amp; Facilities
              </h2>
              <p className="text-sm text-slate-600">
                Thoughtful residential conveniences engineered for safety, fitness, and community gatherings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.amenities.map((item, idx) => {
                const IconComp = ICON_MAP[item.icon] || Building;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#F8FAF9] border border-slate-200/80 hover:border-[#2D5D54] transition-all space-y-2.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1E3A34] text-white flex items-center justify-center shadow-xs">
                      <IconComp className="w-5 h-5 text-emerald-300" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Specifications Accordion / List */}
      {project.specifications && project.specifications.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-t border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl mb-10 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Engineering Details
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Technical Specifications
              </h2>
              <p className="text-sm text-slate-600">
                Transparent material benchmarks and electrical, plumbing, and structural grades.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-1.5"
                >
                  <h4 className="text-xs font-bold text-[#1E3A34] uppercase tracking-wider">
                    {spec.category}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {spec.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Construction Progress Section */}
      {project.constructionProgress && project.constructionProgress.status && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl mb-8 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Development Milestone
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Construction Progress
              </h2>
              <p className="text-sm text-slate-600">
                Transparent milestone tracking and execution status.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-slate-200/80 max-w-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Current Stage
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {project.constructionProgress.status}
                  </h3>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-[#1E3A34] text-white text-sm font-bold self-start sm:self-auto">
                  {project.constructionProgress.percentage || 0}% Completed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#2D5D54] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${project.constructionProgress.percentage || 0}%` }}
                />
              </div>

              {project.constructionProgress.latestUpdate && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200/80">
                  <strong>Latest Milestone Update:</strong> {project.constructionProgress.latestUpdate}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Project FAQs Section */}
      {project.faqs && project.faqs.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-t border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl mb-10 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Buyer Inquiries
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl space-y-4">
              {project.faqs.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#2D5D54]" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location Map & Directions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Location Connectivity
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Prime {project.location ? project.location.split(",")[0] : "Strategic"} Location
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enjoy serene, well-connected surroundings in {project.location ? project.location.split(",")[0] : "Hyderabad"} with rapid connectivity to Outer Ring Road (ORR), Miyapur Metro, reputed schools, and prime IT corridors.
              </p>

              <div className="pt-2 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5D54]" />
                  <span>Rapid connectivity to Nehru Outer Ring Road (ORR)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5D54]" />
                  <span>10 mins to Miyapur Metro &amp; Educational Hubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5D54]" />
                  <span>25 mins to Gachibowli &amp; Financial District / Hitec City</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <a
                  href={project.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E3A34] hover:bg-[#2D5D54] text-white px-6 py-3 text-xs font-semibold transition-colors shadow-xs"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 shadow-md h-80 sm:h-96 relative bg-slate-100">
              <iframe
                title={`Map of ${project.title}`}
                src={`https://maps.google.com/maps?q=${project.coordinates.lat},${project.coordinates.lng}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Enquiry Banner */}
      <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 px-4 sm:px-8 shadow-2xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
              Interested in {project.title}?
            </span>
            <span className="text-sm font-bold text-slate-900 hidden sm:inline-block">
              {project.pricing} &bull; {project.configurations.join(", ")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+919686696364"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 text-xs font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call +91 9686696364</span>
              <span className="sm:hidden">Call</span>
            </a>
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#1E3A34] hover:bg-[#2D5D54] text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Instant Enquiry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={project.gallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        projectTitle={project.title}
        defaultConfiguration={project.configurations[0]}
      />
    </>
  );
};

export default ProjectDetailPage;
