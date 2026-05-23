// src/components/Testimonials.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Arsh Shaikh",
      role: "Site Engineer",
      feedback:
        "CivilPortal has made site management so much easier. I can track labour and materials on my phone anytime.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      rating: 5,
    },
    {
      id: 2,
      name: "Tarique Ansari",
      role: "Project Manager",
      feedback:
        "We saved at least 20% on material wastage thanks to CivilPortal’s inventory alerts. Highly recommended!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      rating: 4,
    },
    {
      id: 3,
      name: "Armash Momin",
      role: "Contractor",
      feedback:
        "Labour attendance and wage management is now automatic. No more disputes or delays in payment.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
      rating: 5,
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What Engineers Say About Us
        </h2>
        <p className="mt-3 text-gray-600">
          Trusted by site engineers, contractors, and project managers.
        </p>

        {/* Slider container with fixed height */}
        <div className="relative mt-12 h-[400px]">
          {testimonials.map((t, index) => (
            <div
              key={t.id}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full border border-gray-100">
                {/* Profile */}
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-100 shadow-md"
                />

                {/* Name & Role */}
                <h3 className="mt-6 text-xl font-semibold text-gray-800">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.role}</p>

                {/* Rating */}
                <div className="flex justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Feedback */}
                <p className="mt-5 text-gray-600 italic text-lg leading-relaxed">
                  “{t.feedback}”
                </p>
              </div>
            </div>
          ))}

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === current ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrent(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
