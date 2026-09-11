import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SEOHead from "../../components/SEOHead";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const from = location.state?.from?.pathname || "/admin";

  // If already logged in, redirect directly
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password, remember);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || "Invalid credentials. Please verify and try again.");
      }
    } catch {
      setErrorMessage("An error occurred during authentication.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Admin Portal - Secure Login"
        description="Authorized administrator access for Viviendha Developers content and project management."
      />

      <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#1E3A34]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#2D5D54]/5 blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <Link to="/" className="group focus:outline-none">
              <img
                src="/logo.png"
                alt="Viviendha Developers"
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E3A34]/10 text-[#1E3A34] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5D54]" />
              <span>Restricted Management Portal</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Sign In to Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage residential projects, gallery assets, and published listings.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 sm:px-10 space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@viviendhadevelopers.com"
                    className="block w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A34] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Admin Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A34] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-slate-300 text-[#1E3A34] focus:ring-[#1E3A34] h-4 w-4"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#1E3A34] hover:bg-[#2D5D54] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A34] shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Viviendha Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
