import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Building,
  RefreshCw,
  MapPin,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectsContext";
import SEOHead from "../../components/SEOHead";

const STATUS_OPTIONS = ["All", "Completed", "Ongoing", "Upcoming"];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { projects, loading, refreshProjects, togglePublish, deleteProject } = useProjects();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showDraftsOnly, setShowDraftsOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const published = projects.filter((p) => p.isPublished !== false).length;
    const drafts = total - published;
    const completed = projects.filter((p) => p.status?.toLowerCase() === "completed").length;
    const ongoing = projects.filter((p) => p.status?.toLowerCase() === "ongoing").length;
    const upcoming = projects.filter((p) => p.status?.toLowerCase() === "upcoming").length;
    return { total, published, drafts, completed, ongoing, upcoming };
  }, [projects]);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" ||
        p.status?.toLowerCase() === selectedStatus.toLowerCase();

      const matchesDrafts = !showDraftsOnly || p.isPublished === false;

      return matchesSearch && matchesStatus && matchesDrafts;
    });
  }, [projects, searchQuery, selectedStatus, showDraftsOnly]);

  const handleTogglePublish = async (project) => {
    setActionLoading(true);
    const newStatus = !(project.isPublished !== false);
    const res = await togglePublish(project.id, newStatus);
    setActionLoading(false);
    if (res.success) {
      setFeedbackNotice({
        type: "success",
        message: `Project "${project.title}" is now ${newStatus ? "Published" : "in Draft mode"}.`,
      });
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      setFeedbackNotice({
        type: "error",
        message: res.error || "Failed to update project status.",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    const res = await deleteProject(deleteTarget.id);
    setActionLoading(false);
    if (res.success) {
      setFeedbackNotice({
        type: "success",
        message: `Project "${deleteTarget.title}" deleted successfully.`,
      });
      setDeleteTarget(null);
      setTimeout(() => setFeedbackNotice(null), 4000);
    } else {
      setFeedbackNotice({
        type: "error",
        message: res.error || "Failed to delete project.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      <SEOHead
        title="Admin Dashboard - Projects Management"
        description="Comprehensive project administration and content publishing for Viviendha Developers."
      />

      <div className="min-h-screen bg-[#F8FAF9] text-slate-900 pb-20">
        {/* Top Navbar for Admin */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2">
                <img src="/logo.png" alt="Viviendha Developers" className="h-10 w-auto" />
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="px-2.5 py-1 rounded-md bg-[#1E3A34] text-white text-[11px] font-bold uppercase tracking-wider">
                  Admin Console
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {user?.email || "admin@viviendhadevelopers.com"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Open Public Website in new tab"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                title="Sign out of Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Notification banner */}
          {feedbackNotice && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm animate-fade-in ${
                feedbackNotice.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border border-rose-200 text-rose-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedbackNotice.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-medium">{feedbackNotice.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackNotice(null)}
                className="text-xs font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
                Residential Portfolio Management
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Projects &amp; Communities
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Create new landmarks, edit specifications, upload brochures and floor plans, or manage gallery images.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => refreshProjects()}
                disabled={loading}
                className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
                title="Refresh projects list"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>

              <Link
                to="/admin/projects/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </Link>
            </div>
          </div>

          {/* Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Projects</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Published</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-800">{stats.published}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider">Drafts</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-800">{stats.drafts}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stats.completed}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Ongoing</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stats.ongoing}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Upcoming</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stats.upcoming}</p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, location, category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A34] focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedStatus === status
                        ? "bg-white text-[#1E3A34] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowDraftsOnly(!showDraftsOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  showDraftsOnly
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showDraftsOnly ? "Showing Drafts" : "Drafts Only"}</span>
              </button>
            </div>
          </div>

          {/* Projects Table / Card List */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Projects Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                No residential projects matched your search criteria. Try modifying your filters or create a new project.
              </p>
              <Link
                to="/admin/projects/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E3A34] text-white text-xs font-semibold hover:bg-[#2D5D54]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((proj) => {
                const isPub = proj.isPublished !== false;
                return (
                  <div
                    key={proj.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* Project overview snippet */}
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={proj.heroImage || "/apartment.png"}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isPub
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isPub ? "Live on Site" : "Draft / Unpublished"}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            {proj.status}
                          </span>

                          <span className="text-xs text-slate-400 font-medium">
                            {proj.category}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                          {proj.title}
                          {proj.subtitle && (
                            <span className="text-slate-500 font-normal text-sm sm:text-base ml-2">
                              ({proj.subtitle})
                            </span>
                          )}
                        </h3>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#2D5D54]" />
                          <span>{proj.location}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                          <span><strong>Units:</strong> {proj.totalUnits || "N/A"}</span>
                          <span>&bull;</span>
                          <span><strong>Config:</strong> {proj.configurations?.join(", ") || "N/A"}</span>
                          {proj.reraNumber && (
                            <>
                              <span>&bull;</span>
                              <span><strong>Approval Ref:</strong> {proj.reraNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 self-end md:self-center">
                      {/* Publish / Unpublish Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(proj)}
                        disabled={actionLoading}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isPub
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                        title={isPub ? "Unpublish from public website" : "Publish to live website"}
                      >
                        {isPub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isPub ? "Unpublish" : "Publish"}</span>
                      </button>

                      {/* View live public page */}
                      {isPub && (
                        <Link
                          to={`/projects/${proj.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View live project page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}

                      {/* Edit Button */}
                      <Link
                        to={`/admin/projects/edit/${proj.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white text-xs font-semibold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(proj)}
                        className="p-2 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Delete Project?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Are you sure you want to permanently delete <strong>{deleteTarget.title}</strong>? This action cannot be undone and will immediately remove the project from the public website.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  {actionLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  <span>Yes, Delete Project</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
