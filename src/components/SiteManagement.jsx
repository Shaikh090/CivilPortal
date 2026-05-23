// src/components/SiteManagement.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DashboardLayout from "./DashboardLayout";
import { Building2, Calendar, MapPin, Plus, Trash2, TrendingUp, CheckCircle, Clock } from "lucide-react";

// Helper function to compress and convert image to base64
const compressAndGetBase64 = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function SiteManagement() {
  const [sites, setSites] = useState(() => {
    const saved = localStorage.getItem("sites");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "In Progress",
    imageUrl: null,
  });

  const [isCompressing, setIsCompressing] = useState(false);

  // Save to localStorage whenever sites change
  useEffect(() => {
    localStorage.setItem("sites", JSON.stringify(sites));
  }, [sites]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (!file) return;
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressAndGetBase64(file);
        setForm((prev) => ({ ...prev, imageUrl: compressedBase64 }));
      } catch (err) {
        console.error("Image compression failed:", err);
        alert("Failed to process image. Please try another one.");
      } finally {
        setIsCompressing(false);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.startDate || !form.endDate) return;

    const newSite = {
      id: Date.now(),
      name: form.name,
      location: form.location,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description,
      status: form.status,
      imageUrl: form.imageUrl,
    };

    setSites([...sites, newSite]);

    setForm({
      name: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      status: "In Progress",
      imageUrl: null,
    });

    // Reset file input element
    const fileInput = document.getElementById("site-image-input");
    if (fileInput) fileInput.value = "";
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      setSites(sites.filter((site) => site.id !== id));
    }
  };

  const exportToExcel = () => {
    // Exclude imageUrl from Excel data to avoid massive base64 strings in the file
    const worksheet = XLSX.utils.json_to_sheet(
      sites.map(({ imageUrl, ...rest }) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sites");
    XLSX.writeFile(workbook, "sites.xlsx");
  };

  return (
    <DashboardLayout>
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Project Sites Tracker</h2>
          <p className="text-slate-500 text-sm">Register new sites, track progress states, and export reporting sheets.</p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={sites.length === 0}
          className="self-start md:self-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-sm flex items-center gap-2 cursor-pointer"
        >
          Export Projects Report
        </button>
      </div>

      {/* Modern Stats Cards Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sites</span>
            <span className="text-xl font-bold text-slate-800">{sites.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</span>
            <span className="text-xl font-bold text-slate-800">
              {sites.filter((s) => s.status === "In Progress").length}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
            <span className="text-xl font-bold text-slate-800">
              {sites.filter((s) => s.status === "Completed").length}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Planned</span>
            <span className="text-xl font-bold text-slate-800">
              {sites.filter((s) => s.status === "Planned").length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Form Container */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" /> Create Project Site
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Site Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Skyline Towers"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Sector 5, Mumbai"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                required
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Progress Image
              </label>
              <input
                id="site-image-input"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-750 hover:file:bg-blue-100 cursor-pointer"
              />
              {isCompressing && (
                <p className="text-xs text-blue-600 mt-1 animate-pulse">Processing & compressing image...</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief project details, scope, or current updates..."
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isCompressing}
              className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              Add Project Site
            </button>
          </form>
        </div>

        {/* List Container */}
        <div className="lg:col-span-2">
          {sites.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="text-slate-350 mb-4 text-5xl">🏗️</div>
              <h3 className="font-bold text-slate-700 text-lg mb-1">No Project Sites Registered</h3>
              <p className="text-slate-400 text-sm">Add your first construction project using the form on the left.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    {site.imageUrl ? (
                      <img
                        src={site.imageUrl}
                        alt={site.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400">
                        <span className="text-sm italic">No progress image</span>
                      </div>
                    )}
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        site.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : site.status === "In Progress"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}
                    >
                      {site.status || "In Progress"}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                      {site.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {site.location}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs mb-4 text-slate-650">
                      <div>
                        <span className="block text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Start Date</span>
                        <span className="flex items-center gap-1 font-medium"><Calendar className="w-3 h-3 text-slate-400" /> {site.startDate}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-bold mb-0.5 uppercase tracking-wider">End Date</span>
                        <span className="flex items-center gap-1 font-medium"><Calendar className="w-3 h-3 text-slate-400" /> {site.endDate}</span>
                      </div>
                    </div>

                    <p className="text-slate-550 text-sm line-clamp-3 mb-5 flex-1 leading-relaxed">
                      {site.description || <span className="italic text-slate-400 text-xs">No description provided</span>}
                    </p>

                    <div className="border-t border-slate-100 pt-3.5 flex justify-end">
                      <button
                        onClick={() => handleDelete(site.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}


