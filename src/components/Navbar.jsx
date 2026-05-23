import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-transparent absolute top-0 left-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg shadow-sm">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12L12 3l9 9"
                  stroke="#fff"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21V12h6v9"
                  stroke="#fff"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">CivilPortal</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-white/90">
            <a href="/" className="hover:text-white">Home</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it Works</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="/contact" className="hover:text-white">Contact</a>

            {/* ✅ Get Started button */}
            <Link
              to="/site-management"
              className="ml-2 px-4 py-2 rounded-md bg-white text-blue-900 font-medium shadow hover:bg-gray-100"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md bg-white/10 text-white focus:outline-none"
              aria-expanded={open}
            >
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-2 text-white/90">
              <a href="/" className="px-2 py-2 rounded hover:bg-white/10">Home</a>
              <a href="#features" className="px-2 py-2 rounded hover:bg-white/10">Features</a>
              <a href="#how" className="px-2 py-2 rounded hover:bg-white/10">How it Works</a>
              <a href="#faq" className="px-2 py-2 rounded hover:bg-white/10">FAQ</a>
              <a href="/contact" className="px-2 py-2 rounded hover:bg-white/10">Contact</a>
              
              {/* ✅ Mobile Get Started button */}
              <Link
                to="/site-management"
                className="mt-2 px-4 py-2 rounded-md bg-white text-blue-900 font-medium inline-block text-center"
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
