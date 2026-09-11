import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectsContext";
import SEOHead from "../../components/SEOHead";

const AVAILABLE_ICONS = [
  "Sun",
  "ShieldCheck",
  "Zap",
  "Smile",
  "Dumbbell",
  "Droplets",
  "ArrowUpDown",
  "BatteryCharging",
  "Waves",
  "Laptop",
  "Building",
  "Trophy",
  "Heart",
  "Car",
  "Music",
  "Flower",
  "Dog",
];

const CONFIG_OPTIONS = ["1 BHK", "2 BHK", "2.5 BHK", "3 BHK", "3.5 BHK", "4 BHK", "Penthouse", "Villa"];

const DEFAULT_FORM_STATE = {
  title: "",
  subtitle: "",
  tagline: "",
  slug: "",
  category: "Twin Residential Towers",
  status: "Completed",
  badge: "Landmark Project",
  isPublished: true,
  location: "Bowrampet, Hyderabad, Telangana",
  coordinates: { lat: 17.5318209, lng: 78.3463257 },
  googleMapsUrl: "",
  reraNumber: "",
  possession: "",
  totalUnits: "",
  configurations: ["2 BHK", "3 BHK"],
  areaRange: "",
  pricing: "",
  heroImage: "/apartment.png",
  coverImage: "/hero.png",
  brochurePdf: "",
  projectPlanPdf: "",
  overview: "",
  keyHighlights: [""],
  amenities: [
    { name: "24/7 Security", description: "Monitored CCTV surveillance across entry/exit points", icon: "ShieldCheck" },
  ],
  specifications: [
    { category: "Structure", details: "R.C.C framed structure designed to withstand wind & seismic loads" },
  ],
  gallery: [
    { url: "/apartment.png", title: "Elevation Perspective", category: "Exterior" },
  ],
  floorPlans: [
    { type: "2 BHK", superBuiltUp: "1,240 sq.ft", facing: "East", features: "2 Bed, 2 Bath, Balcony", image: "" },
  ],
  constructionProgress: {
    percentage: 100,
    status: "Completed",
    latestUpdate: "Project completed with all statutory occupancy clearances.",
  },
  faqs: [
    { question: "Are clear titles and municipal sanctions available for this project?", answer: "Yes, 100% verified clear land titles and approved municipal building permissions." },
  ],
};

const ProjectForm = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const { createProject, updateProject, getProjectById } = useProjects();

  const [formData, setFormData] = useState(() => {
    if (mode === "edit" && id) {
      const existing = getProjectById(id);
      if (existing) {
        return {
          ...DEFAULT_FORM_STATE,
          ...existing,
          keyHighlights: existing.keyHighlights?.length ? existing.keyHighlights : [""],
          amenities: existing.amenities?.length ? existing.amenities : [],
          specifications: existing.specifications?.length ? existing.specifications : [],
          gallery: existing.gallery?.length ? existing.gallery : [],
          floorPlans: existing.floorPlans?.length ? existing.floorPlans : [],
          faqs: existing.faqs?.length ? existing.faqs : [],
          constructionProgress: existing.constructionProgress || {
            percentage: 0,
            status: "In Progress",
            latestUpdate: "",
          },
        };
      }
    }
    return DEFAULT_FORM_STATE;
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sync if editing and projects loaded asynchronously
  useEffect(() => {
    if (mode === "edit" && id) {
      const existing = getProjectById(id);
      if (existing && formData.title === "") {
        queueMicrotask(() => {
          setFormData({
            ...DEFAULT_FORM_STATE,
            ...existing,
            keyHighlights: existing.keyHighlights?.length ? existing.keyHighlights : [""],
            amenities: existing.amenities?.length ? existing.amenities : [],
            specifications: existing.specifications?.length ? existing.specifications : [],
            gallery: existing.gallery?.length ? existing.gallery : [],
            floorPlans: existing.floorPlans?.length ? existing.floorPlans : [],
            faqs: existing.faqs?.length ? existing.faqs : [],
            constructionProgress: existing.constructionProgress || {
              percentage: 0,
              status: "In Progress",
              latestUpdate: "",
            },
          });
        });
      }
    }
  }, [mode, id, getProjectById, formData.title]);

  // Helper to handle simple field changes
  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title in create mode if slug wasn't manually edited
      if (field === "title" && mode === "create" && (!prev.slug || prev.slug === slugify(prev.title))) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  // Upload file helper
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      alert("File exceeds maximum allowed size of 15MB.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const payload = {
          fileData: reader.result,
          fileName: file.name,
          fileType: file.type,
        };

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success && data.url) {
          callback(data.url);
        } else {
          alert(data.message || "Failed to upload file.");
        }
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Upload request failed.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.title.trim()) {
      setErrorMessage("Project Title is required.");
      setActiveTab("basic");
      return;
    }

    setSaving(true);

    try {
      let res;
      if (mode === "create") {
        res = await createProject(formData);
      } else {
        res = await updateProject(id, formData);
      }

      if (res.success) {
        setSuccessMessage(`Project "${formData.title}" saved successfully.`);
        setTimeout(() => {
          navigate("/admin");
        }, 1200);
      } else {
        setErrorMessage(res.error || "Failed to save project.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Error saving project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEOHead
        title={`${mode === "create" ? "Add New Project" : "Edit Project"} - Viviendha Admin`}
        description="Comprehensive project data, multimedia and PDF documents configuration."
      />

      <div className="min-h-screen bg-[#F8FAF9] text-slate-900 pb-28">
        {/* Header navigation */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {mode === "create" ? "Create New Project" : `Edit: ${formData.title || "Project"}`}
                </h1>
                <p className="text-xs text-slate-500">
                  {mode === "create" ? "Add a new residential development" : `ID: ${id}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {formData.isPublished !== false && formData.slug && (
                <Link
                  to={`/projects/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  <span>Preview Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || isUploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
              >
                {saving || isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isUploading ? "Uploading..." : "Save Project"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
            {[
              { id: "basic", label: "Basic Details" },
              { id: "location", label: "Location & Highlights" },
              { id: "amenities", label: "Amenities & Specs" },
              { id: "media", label: "Gallery & Documents" },
              { id: "floorplans", label: "Floor Plans" },
              { id: "construction", label: "Progress & FAQs" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#1E3A34] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main form body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Notifications */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* TAB 1: BASIC DETAILS */}
            {activeTab === "basic" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Project Identity &amp; Publishing Status
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g. Viviendha Twins"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Subtitle / Phase
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => handleChange("subtitle", e.target.value)}
                      placeholder="e.g. Mukundha & Murari"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Tagline / Marketing Hook
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                      placeholder="e.g. Symmetric Elegance & Harmonious Living in Bowrampet"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleChange("slug", slugify(e.target.value))}
                      placeholder="viviendha-twins"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Live URL: /projects/{formData.slug || "slug"}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Project Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Upcoming">Upcoming</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      placeholder="e.g. Twin Residential Towers, Luxury High-Rise"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => handleChange("badge", e.target.value)}
                      placeholder="e.g. Landmark Project, Under Construction"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 p-5 rounded-2xl bg-[#F8FAF9] border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Publishing Visibility</p>
                      <p className="text-xs text-slate-500">
                        When enabled, this project is live and publicly accessible on the website.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished !== false}
                        onChange={(e) => handleChange("isPublished", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A34]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LOCATION & HIGHLIGHTS */}
            {activeTab === "location" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Location, Pricing &amp; Key Highlights
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Location Address
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="e.g. Bowrampet, Hyderabad, Telangana"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Google Maps URL / Coordinates
                    </label>
                    <input
                      type="text"
                      value={formData.googleMapsUrl}
                      onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Statutory / Municipal Approval Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.reraNumber}
                      onChange={(e) => handleChange("reraNumber", e.target.value)}
                      placeholder="e.g. Sanction Ref / Clear Title Reference (Optional)"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Possession Date / Handover
                    </label>
                    <input
                      type="text"
                      value={formData.possession}
                      onChange={(e) => handleChange("possession", e.target.value)}
                      placeholder="e.g. Ready to Move (Handed Over), December 2026"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Total Units Count
                    </label>
                    <input
                      type="text"
                      value={formData.totalUnits}
                      onChange={(e) => handleChange("totalUnits", e.target.value)}
                      placeholder="e.g. 50+ Luxury Residences"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Area Range
                    </label>
                    <input
                      type="text"
                      value={formData.areaRange}
                      onChange={(e) => handleChange("areaRange", e.target.value)}
                      placeholder="e.g. 1,240 - 1,880 sq.ft"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Pricing / Investment Band
                    </label>
                    <input
                      type="text"
                      value={formData.pricing}
                      onChange={(e) => handleChange("pricing", e.target.value)}
                      placeholder="e.g. ₹65 Lakhs - ₹98 Lakhs, Price on Request"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                    />
                  </div>

                  {/* Configurations checkboxes */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Available Configurations
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {CONFIG_OPTIONS.map((cfg) => {
                        const checked = formData.configurations?.includes(cfg);
                        return (
                          <button
                            key={cfg}
                            type="button"
                            onClick={() => {
                              const current = formData.configurations || [];
                              const next = checked
                                ? current.filter((c) => c !== cfg)
                                : [...current, cfg];
                              handleChange("configurations", next);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                              checked
                                ? "bg-[#1E3A34] text-white border-[#1E3A34]"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {cfg}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Overview Textarea */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Project Overview &amp; Narrative
                    </label>
                    <textarea
                      rows={5}
                      value={formData.overview}
                      onChange={(e) => handleChange("overview", e.target.value)}
                      placeholder="Comprehensive architectural narrative describing the community, construction standards, lifestyle amenities..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Key Highlights list */}
                  <div className="sm:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Key Project Highlights (Bullet Points)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          handleChange("keyHighlights", [...(formData.keyHighlights || []), ""]);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#2D5D54] hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Highlight</span>
                      </button>
                    </div>

                    {formData.keyHighlights?.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => {
                            const next = [...formData.keyHighlights];
                            next[idx] = e.target.value;
                            handleChange("keyHighlights", next);
                          }}
                          placeholder={`Highlight #${idx + 1}`}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#1E3A34] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.keyHighlights.filter((_, i) => i !== idx);
                            handleChange("keyHighlights", next);
                          }}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          title="Remove highlight"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AMENITIES & SPECIFICATIONS */}
            {activeTab === "amenities" && (
              <div className="space-y-8">
                {/* Amenities section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Amenities &amp; Facilities</h2>
                      <p className="text-xs text-slate-500">Add lifestyle facilities with designated icons</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleChange("amenities", [
                          ...(formData.amenities || []),
                          { name: "", description: "", icon: "Building" },
                        ]);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1E3A34] text-white text-xs font-semibold hover:bg-[#2D5D54]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Amenity</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.amenities?.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#F8FAF9] border border-slate-200 space-y-3 relative"
                      >
                        <div className="flex items-center gap-3">
                          <select
                            value={amenity.icon || "Building"}
                            onChange={(e) => {
                              const next = [...formData.amenities];
                              next[idx] = { ...next[idx], icon: e.target.value };
                              handleChange("amenities", next);
                            }}
                            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                          >
                            {AVAILABLE_ICONS.map((ico) => (
                              <option key={ico} value={ico}>
                                {ico}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            value={amenity.name}
                            onChange={(e) => {
                              const next = [...formData.amenities];
                              next[idx] = { ...next[idx], name: e.target.value };
                              handleChange("amenities", next);
                            }}
                            placeholder="Amenity Name (e.g. Sky Lounge)"
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const next = formData.amenities.filter((_, i) => i !== idx);
                              handleChange("amenities", next);
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700"
                            title="Remove amenity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={amenity.description}
                          onChange={(e) => {
                            const next = [...formData.amenities];
                            next[idx] = { ...next[idx], description: e.target.value };
                            handleChange("amenities", next);
                          }}
                          placeholder="Short description of facility..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Engineering Specifications</h2>
                      <p className="text-xs text-slate-500">Material standards, structural benchmarks, electrical and plumbing</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleChange("specifications", [
                          ...(formData.specifications || []),
                          { category: "Structure", details: "" },
                        ]);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1E3A34] text-white text-xs font-semibold hover:bg-[#2D5D54]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Specification</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.specifications?.map((spec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#F8FAF9] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                      >
                        <input
                          type="text"
                          value={spec.category}
                          onChange={(e) => {
                            const next = [...formData.specifications];
                            next[idx] = { ...next[idx], category: e.target.value };
                            handleChange("specifications", next);
                          }}
                          placeholder="Category (e.g. Structure, Flooring)"
                          className="w-full sm:w-1/3 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        />

                        <input
                          type="text"
                          value={spec.details}
                          onChange={(e) => {
                            const next = [...formData.specifications];
                            next[idx] = { ...next[idx], details: e.target.value };
                            handleChange("specifications", next);
                          }}
                          placeholder="Specification details..."
                          className="w-full sm:flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.specifications.filter((_, i) => i !== idx);
                            handleChange("specifications", next);
                          }}
                          className="p-2 text-rose-500 hover:text-rose-700 self-end sm:self-center"
                          title="Remove specification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GALLERY & DOCUMENTS */}
            {activeTab === "media" && (
              <div className="space-y-8">
                {/* Hero & Cover Images */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                    Primary Cover &amp; Hero Images
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hero Image */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Hero Banner Image
                      </label>
                      <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                        <img
                          src={formData.heroImage || "/apartment.png"}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.heroImage}
                          onChange={(e) => handleChange("heroImage", e.target.value)}
                          placeholder="/apartment.png or image URL"
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => handleChange("heroImage", url))}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Secondary Cover Image
                      </label>
                      <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                        <img
                          src={formData.coverImage || "/hero.png"}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.coverImage}
                          onChange={(e) => handleChange("coverImage", e.target.value)}
                          placeholder="/hero.png or image URL"
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => handleChange("coverImage", url))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDF Documents */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                    Official Documents (PDF Uploads)
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brochure PDF */}
                    <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#2D5D54]" />
                          <span className="font-bold text-sm text-slate-900">Project Brochure PDF</span>
                        </div>
                        {formData.brochurePdf && (
                          <a
                            href={formData.brochurePdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-[#2D5D54] hover:underline flex items-center gap-1"
                          >
                            <span>Preview</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.brochurePdf}
                          onChange={(e) => handleChange("brochurePdf", e.target.value)}
                          placeholder="/uploads/brochure.pdf or URL"
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#1E3A34] text-white text-xs font-semibold hover:bg-[#2D5D54] flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload PDF</span>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => handleChange("brochurePdf", url))}
                          />
                        </label>
                      </div>
                      {formData.brochurePdf && (
                        <button
                          type="button"
                          onClick={() => handleChange("brochurePdf", "")}
                          className="text-[11px] font-semibold text-rose-600 hover:underline"
                        >
                          Remove brochure file
                        </button>
                      )}
                    </div>

                    {/* Project Plan PDF */}
                    <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#2D5D54]" />
                          <span className="font-bold text-sm text-slate-900">Sanctioned Project Plan PDF</span>
                        </div>
                        {formData.projectPlanPdf && (
                          <a
                            href={formData.projectPlanPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-[#2D5D54] hover:underline flex items-center gap-1"
                          >
                            <span>Preview</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.projectPlanPdf}
                          onChange={(e) => handleChange("projectPlanPdf", e.target.value)}
                          placeholder="/uploads/project-plan.pdf or URL"
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#1E3A34] text-white text-xs font-semibold hover:bg-[#2D5D54] flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload PDF</span>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => handleChange("projectPlanPdf", url))}
                          />
                        </label>
                      </div>
                      {formData.projectPlanPdf && (
                        <button
                          type="button"
                          onClick={() => handleChange("projectPlanPdf", "")}
                          className="text-[11px] font-semibold text-rose-600 hover:underline"
                        >
                          Remove project plan file
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gallery Items & Reordering */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Interactive Photo Gallery</h2>
                      <p className="text-xs text-slate-500">
                        Upload photos, manage captions, and use the arrow buttons to reorder images.
                      </p>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1E3A34] text-white text-xs font-semibold hover:bg-[#2D5D54]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload to Gallery</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url) => {
                            handleChange("gallery", [
                              ...(formData.gallery || []),
                              { url, title: "New Perspective", category: "Exterior" },
                            ]);
                          })
                        }
                      />
                    </label>
                  </div>

                  {formData.gallery?.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No gallery images added yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.gallery?.map((img, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-[#F8FAF9] border border-slate-200 space-y-2.5 relative group"
                        >
                          <div className="h-36 rounded-xl overflow-hidden bg-slate-200 relative">
                            <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                              #{idx + 1}
                            </span>
                          </div>

                          <input
                            type="text"
                            value={img.title}
                            onChange={(e) => {
                              const next = [...formData.gallery];
                              next[idx] = { ...next[idx], title: e.target.value };
                              handleChange("gallery", next);
                            }}
                            placeholder="Caption / Title"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                          />

                          <div className="flex items-center justify-between gap-1 pt-1">
                            <input
                              type="text"
                              value={img.category}
                              onChange={(e) => {
                                const next = [...formData.gallery];
                                next[idx] = { ...next[idx], category: e.target.value };
                                handleChange("gallery", next);
                              }}
                              placeholder="Exterior, Grounds..."
                              className="w-1/2 px-2 py-1 rounded-md border border-slate-300 text-[11px] bg-white"
                            />

                            {/* Reorder and Delete controls */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  if (idx === 0) return;
                                  const next = [...formData.gallery];
                                  const temp = next[idx - 1];
                                  next[idx - 1] = next[idx];
                                  next[idx] = temp;
                                  handleChange("gallery", next);
                                }}
                                className="p-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-30"
                                title="Move up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === formData.gallery.length - 1}
                                onClick={() => {
                                  if (idx === formData.gallery.length - 1) return;
                                  const next = [...formData.gallery];
                                  const temp = next[idx + 1];
                                  next[idx + 1] = next[idx];
                                  next[idx] = temp;
                                  handleChange("gallery", next);
                                }}
                                className="p-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-30"
                                title="Move down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = formData.gallery.filter((_, i) => i !== idx);
                                  handleChange("gallery", next);
                                }}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50"
                                title="Delete image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: FLOOR PLANS */}
            {activeTab === "floorplans" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Floor Plans &amp; Layouts</h2>
                    <p className="text-xs text-slate-500">Add unit types, dimensions, facing, and architectural diagrams</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange("floorPlans", [
                        ...(formData.floorPlans || []),
                        { type: "3 BHK Premium", superBuiltUp: "1,650 sq.ft", facing: "East", features: "", image: "" },
                      ]);
                    }}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1E3A34] text-white text-xs font-semibold hover:bg-[#2D5D54]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Floor Plan</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.floorPlans?.map((plan, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#F8FAF9] border border-slate-200 space-y-4 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1E3A34] text-white text-[11px] font-bold">
                          Plan #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.floorPlans.filter((_, i) => i !== idx);
                            handleChange("floorPlans", next);
                          }}
                          className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Plan</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Unit Type
                          </label>
                          <input
                            type="text"
                            value={plan.type}
                            onChange={(e) => {
                              const next = [...formData.floorPlans];
                              next[idx] = { ...next[idx], type: e.target.value };
                              handleChange("floorPlans", next);
                            }}
                            placeholder="e.g. 2 BHK Executive"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Super Built-Up Area
                          </label>
                          <input
                            type="text"
                            value={plan.superBuiltUp}
                            onChange={(e) => {
                              const next = [...formData.floorPlans];
                              next[idx] = { ...next[idx], superBuiltUp: e.target.value };
                              handleChange("floorPlans", next);
                            }}
                            placeholder="e.g. 1,240 sq.ft"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Facing / Orientation
                          </label>
                          <input
                            type="text"
                            value={plan.facing}
                            onChange={(e) => {
                              const next = [...formData.floorPlans];
                              next[idx] = { ...next[idx], facing: e.target.value };
                              handleChange("floorPlans", next);
                            }}
                            placeholder="e.g. East / West (Vastu Compliant)"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Features &amp; Spatial Flow
                          </label>
                          <input
                            type="text"
                            value={plan.features}
                            onChange={(e) => {
                              const next = [...formData.floorPlans];
                              next[idx] = { ...next[idx], features: e.target.value };
                              handleChange("floorPlans", next);
                            }}
                            placeholder="2 Bedrooms, 2 Bathrooms, Spacious Living & Dining, Utility, Private Balcony"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: CONSTRUCTION PROGRESS & FAQS */}
            {activeTab === "construction" && (
              <div className="space-y-8">
                {/* Construction progress */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                    Construction Milestone &amp; Timeline Progress
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Completion Percentage ({formData.constructionProgress?.percentage || 0}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.constructionProgress?.percentage || 0}
                        onChange={(e) => {
                          handleChange("constructionProgress", {
                            ...formData.constructionProgress,
                            percentage: parseInt(e.target.value, 10),
                          });
                        }}
                        className="w-full accent-[#1E3A34]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Current Stage Status
                      </label>
                      <input
                        type="text"
                        value={formData.constructionProgress?.status || ""}
                        onChange={(e) => {
                          handleChange("constructionProgress", {
                            ...formData.constructionProgress,
                            status: e.target.value,
                          });
                        }}
                        placeholder="e.g. Structure & Slab Casting, Handover Completed"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Latest Site Milestone Update
                      </label>
                      <textarea
                        rows={3}
                        value={formData.constructionProgress?.latestUpdate || ""}
                        onChange={(e) => {
                          handleChange("constructionProgress", {
                            ...formData.constructionProgress,
                            latestUpdate: e.target.value,
                          });
                        }}
                        placeholder="e.g. Internal finishing underway across Tower A. External waterproofing completed."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* FAQs Section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
                      <p className="text-xs text-slate-500">Provide answers to common buyer questions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleChange("faqs", [
                          ...(formData.faqs || []),
                          { question: "", answer: "" },
                        ]);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1E3A34] text-white text-xs font-semibold hover:bg-[#2D5D54]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.faqs?.map((faq, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#F8FAF9] border border-slate-200 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">FAQ #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = formData.faqs.filter((_, i) => i !== idx);
                              handleChange("faqs", next);
                            }}
                            className="p-1 text-rose-500 hover:text-rose-700"
                            title="Remove FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const next = [...formData.faqs];
                            next[idx] = { ...next[idx], question: e.target.value };
                            handleChange("faqs", next);
                          }}
                          placeholder="Question..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        />

                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const next = [...formData.faqs];
                            next[idx] = { ...next[idx], answer: e.target.value };
                            handleChange("faqs", next);
                          }}
                          placeholder="Answer..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom sticky save bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <Link
                to="/admin"
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel &amp; Return
              </Link>

              <button
                type="submit"
                disabled={saving || isUploading}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
              >
                {saving || isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {isUploading
                    ? "Uploading File..."
                    : mode === "create"
                    ? "Create & Publish Project"
                    : "Save Changes"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
