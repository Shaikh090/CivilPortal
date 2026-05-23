import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { Image as ImageIcon, Search, MapPin, Calendar, Filter } from "lucide-react";

export default function Gallery() {
  const [sites, setSites] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Load sites from localStorage
  useEffect(() => {
    const storedSites = localStorage.getItem("sites");
    if (storedSites) {
      setSites(JSON.parse(storedSites));
    }
  }, []);

  const imageSites = sites.filter((site) => site.imageUrl || site.image);

  const filteredSites = imageSites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || site.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["All", "Planned", "In Progress", "Completed"];

  return (
    <DashboardLayout>
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Project Progress Gallery</h2>
          <p className="text-slate-500 text-sm">Visual updates and snapshots from active site projects.</p>
        </div>
      </div>

      {imageSites.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-4xl mx-auto">
          <div className="text-slate-300 mb-4 text-5xl">📸</div>
          <h3 className="font-bold text-slate-700 text-lg mb-1">No Progress Images Available</h3>
          <p className="text-slate-400 text-sm mb-6">
            Go to Site Management and upload a progress image for any of your project sites.
          </p>
          <a
            href="/site-management"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            Upload Progress Image
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters and Search Panel */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Status Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-slate-450 font-bold text-xs uppercase tracking-wider flex items-center gap-1 mr-2">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filterStatus === status
                      ? "bg-blue-605 text-blue-700 bg-blue-50 border border-blue-200"
                      : "bg-slate-50 text-slate-550 border border-slate-200/60 hover:bg-slate-100/50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or location..."
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {filteredSites.length === 0 ? (
            <div className="p-16 text-center text-slate-450 text-sm font-medium italic">
              No matching sites found for the current search and filter criteria.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSites.map((site) => (
                <div
                  key={site.id}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all duration-300 group"
                >
                  <div className="h-52 bg-slate-100 relative overflow-hidden">
                    <img
                      src={site.imageUrl || site.image}
                      alt={site.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
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
                    <h3 className="font-bold text-slate-800 text-base mb-1 group-hover:text-blue-600 transition-colors">
                      {site.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {site.location || "Location not set"}
                    </p>

                    <div className="border-t border-slate-100 pt-3.5 mt-auto text-xs text-slate-500 flex justify-between font-medium">
                      <span className="font-bold text-slate-405 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> TIMELINE
                      </span>
                      <span className="text-slate-650 font-semibold">
                        {site.startDate} → {site.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

