import { Link } from "react-router-dom";
import { Home, Building } from "lucide-react";
import SEOHead from "../components/SEOHead";

const NotFoundPage = () => {
  return (
    <>
      <SEOHead title="Page Not Found" description="The requested page could not be located." />
      <section className="min-h-[75vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9]">
        <div className="text-center max-w-lg mx-auto space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
            404 Error
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight font-serif">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            The page you were looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#1E3A34] hover:bg-[#2D5D54] text-white px-7 py-3.5 text-sm font-semibold shadow-xs transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 px-7 py-3.5 text-sm font-semibold transition-colors"
            >
              <Building className="w-4 h-4 text-[#2D5D54]" />
              <span>Explore Projects</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
