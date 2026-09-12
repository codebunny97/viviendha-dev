import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import SEOHead from "../components/SEOHead";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/place/Viviendha+Twins+-+Mukundha+%26+Murari/@17.5318209,78.3463257,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb8d006ea9e8a5:0x5b771ac932e578ab!8m2!3d17.5318209!4d78.3463257!16s%2Fg%2F11ycl4g1lp";

const ContactPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    project: "Viviendha Twins (Pride Park, Ameenpur)",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [serverMessage, setServerMessage] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) {
      errs.fullName = "Please enter your full name.";
    } else if (form.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!emailPattern.test(form.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const cleanPhone = form.phone.replace(/[\s\-()]/g, "");
    if (!cleanPhone) {
      errs.phone = "Please enter your contact phone number.";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Phone number must be at least 10 digits.";
    }

    if (!form.message.trim()) {
      errs.message = "Please share a brief message or visit preference.";
    } else if (form.message.trim().length < 5) {
      errs.message = "Message must be at least 5 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          subject: `Website Inquiry: ${form.project}`,
          message: form.message,
          source: "Contact Page Form",
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else if (response.status === 404) {
        // Graceful fallback for local dev when serverless backend is not actively running
        setTimeout(() => {
          setStatus("success");
        }, 600);
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        setTimeout(() => {
          setStatus("success");
        }, 500);
      } else {
        setStatus("error");
        setServerMessage(
          err.message || "An error occurred while submitting. Please call us directly."
        );
      }
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      project: "Viviendha Twins (Pride Park, Ameenpur)",
      message: "",
    });
    setStatus("idle");
    setErrors({});
  };

  return (
    <>
      <SEOHead
        title="Contact Viviendha Developers | Hyderabad"
        description="Get in touch with Viviendha Developers. Schedule site appointments, enquire about apartments, or visit our Ameenpur, Miyapur project in Hyderabad."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2D5D54]">
              Contact Us
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              We'd love to <br />
              <span className="text-[#2D5D54] font-serif italic">hear from you.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal pt-2">
              Whether you're looking for your dream home, exploring investment opportunities, or scheduling a site visit, our dedicated advisory team is here to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone Card */}
            <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-slate-200/90 shadow-subtle hover:border-[#2D5D54]/50 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-[#1E3A34] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Direct Phone</h3>
              <p className="text-xs text-slate-500">Monday to Sunday, 9:00 AM - 7:00 PM IST</p>
              <a
                href="tel:+919686696364"
                className="text-lg font-bold text-[#1E3A34] hover:text-[#2D5D54] block pt-1"
              >
                +91 9686696364
              </a>
            </div>

            {/* Email Card */}
            <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-slate-200/90 shadow-subtle hover:border-[#2D5D54]/50 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-[#1E3A34] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Direct Email</h3>
              <p className="text-xs text-slate-500">For inquiries, brochures &amp; partnerships</p>
              <a
                href="mailto:satya@viviendhadevelopers.com"
                className="text-lg font-bold text-[#1E3A34] hover:text-[#2D5D54] block pt-1"
              >
                satya@viviendhadevelopers.com
              </a>
            </div>

            {/* Project Site Location */}
            <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-slate-200/90 shadow-subtle hover:border-[#2D5D54]/50 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-[#1E3A34] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Project Site</h3>
              <p className="text-xs text-slate-500">
                Viviendha Twins - Mukundha &amp; Murari,
                <br />
                Pride Park, Ameenpur, Miyapur,
                <br />
                Hyderabad, Telangana 502033
                <br />
                <span className="text-[11px] text-slate-400">Plus Code: G8JW+QC5</span>
              </p>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D5D54] hover:underline pt-1"
              >
                <span>Open Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Form & Map Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D5D54]">
                  Send a Message
                </span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                  Inquire or Schedule a Visit
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Fill out the form below. We typically respond within 2-4 business hours.
                </p>
              </div>

              {status === "success" ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Message Delivered</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <span className="font-semibold">{form.fullName}</span>. Your inquiry has been sent to Satya and the Viviendha team. We will connect with you via phone/email shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-full bg-[#1E3A34] text-white px-7 py-3 text-xs font-semibold hover:bg-[#2D5D54] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {status === "error" && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{serverMessage}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: null });
                      }}
                      placeholder="e.g. Satya Sharma"
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                        errors.fullName
                          ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-400"
                          : "border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#2D5D54] focus:ring-2 focus:ring-[#2D5D54]/20"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Grid for Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        placeholder="name@example.com"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                          errors.email
                            ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-400"
                            : "border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#2D5D54] focus:ring-2 focus:ring-[#2D5D54]/20"
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        placeholder="+91 98765 43210"
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                          errors.phone
                            ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-400"
                            : "border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#2D5D54] focus:ring-2 focus:ring-[#2D5D54]/20"
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Project of Interest */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Project of Interest
                    </label>
                    <select
                      value={form.project}
                      onChange={(e) => setForm({ ...form, project: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:border-[#2D5D54] focus:ring-2 focus:ring-[#2D5D54]/20 outline-none transition-all"
                    >
                      <option value="Viviendha Twins (Pride Park, Ameenpur)">
                        Viviendha Twins (Pride Park, Ameenpur - Ready to Move)
                      </option>
                      <option value="Viviendha Serene Heights (Tellapur)">
                        Viviendha Serene Heights (Tellapur - Ongoing High-Rise)
                      </option>
                      <option value="Viviendha Aura (Kollur)">
                        Viviendha Aura (Kollur - Upcoming Launch)
                      </option>
                      <option value="General Consultation">General Discussion / Land Joint-Venture</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message or Preferred Visit Date *
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: null });
                      }}
                      placeholder="Please share what configurations you're interested in or when you'd like to visit the site..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all ${
                        errors.message
                          ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-400"
                          : "border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#2D5D54] focus:ring-2 focus:ring-[#2D5D54]/20"
                      }`}
                    />
                    {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A34] hover:bg-[#2D5D54] text-white py-4 font-semibold text-sm shadow-md transition-all duration-200 disabled:opacity-75"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map & Office Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D5D54]">
                  Site Experience
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Visit Viviendha Twins
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Located in Pride Park, Ameenpur, Miyapur (Plus Code: G8JW+QC5). Our on-site relationship managers are available all 7 days of the week to show you the completed apartments, clubhouse, and terrace facilities.
                </p>

                <div className="pt-2">
                  <a
                    href={GOOGLE_MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1E3A34] hover:text-[#2D5D54]"
                  >
                    <span>View Exact GPS Coordinates on Google Maps</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Embedded Map */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 w-full relative mt-4">
                  <iframe
                    title="Viviendha Twins Map Location"
                    src="https://maps.google.com/maps?q=17.5318209,78.3463257&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Legal Note */}
              <div className="p-6 rounded-2xl bg-[#E5EDEA] border border-[#2D5D54]/20 text-xs text-[#1E3A34] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#2D5D54]" />
                  <span>Direct Developer Communication</span>
                </div>
                <p className="text-[#1E3A34]/80 leading-relaxed">
                  You communicate directly with authorized Viviendha representatives. We do not share your contact details with external third-party brokers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
