import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Lightbox = ({ images = [], currentIndex = 0, isOpen, onClose, onNavigate }) => {
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % images.length);
    },
    [isOpen, currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md animate-fade-in p-4 sm:p-6 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen image viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header Controls */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 text-white z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium tracking-wider bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs border border-white/20">
            {currentIndex + 1} / {images.length}
          </span>
          {currentImage.category && (
            <span className="text-xs uppercase tracking-[0.2em] text-[#3B746A] hidden sm:inline-block">
              {currentImage.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B746A]"
            aria-label="Close fullscreen gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative max-w-6xl max-h-[82vh] flex items-center justify-center">
        <img
          src={currentImage.url}
          alt={currentImage.title || "Project photo"}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200"
        />

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-[#3B746A]"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-[#3B746A]"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Caption & Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center z-10">
        <p className="text-white text-sm sm:text-base font-medium drop-shadow">
          {currentImage.title}
        </p>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3 overflow-x-auto py-1 max-w-lg mx-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigate(idx)}
                className={`relative h-12 w-16 shrink-0 rounded overflow-hidden transition-all ${
                  idx === currentIndex
                    ? "ring-2 ring-[#3B746A] scale-105 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
