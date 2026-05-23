import { useState } from "react";
import RequestDemoModal from "./RequestDemoModal";

export default function Hero() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section id="home"
      className="relative min-h-[80vh] flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.65), rgba(2,6,23,0.65)), url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left-aligned content */}
      <div className="px-6 sm:px-12 lg:px-20 max-w-3xl text-white">

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Build Smarter with CivilPortal
        </h1>

        {/* Supporting paragraph */}
        <p className="mt-6 text-lg sm:text-xl text-gray-200 leading-relaxed">
          Manage construction sites, materials, and workforce in one
          mobile-friendly dashboard. Designed to save time, cut costs, and
          improve collaboration.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="#features"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-900 font-medium shadow-lg hover:bg-gray-100 transition"
          >
            🚀 Explore Features
          </a>

          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white text-white font-medium hover:bg-white/10 transition"
          >
            📞 Request Demo
          </button>
        </div>
      </div>

      {/* Modal */}
      <RequestDemoModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </section>
  );
}
