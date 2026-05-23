import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import SiteManagement from "./components/SiteManagement";
import LabourManagement from "./components/LabourManagement"; 
import "./index.css";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/site-management" element={<SiteManagement />} />
      <Route path="/labour-management" element={<LabourManagement />} /> 
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);
