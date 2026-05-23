import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import FAQSection from "./components/FAQSection";
import HowItWorks from "./components/HowItWorks"; 

import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-900">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks /> 
        <Stats />
        <Testimonials /> 
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
