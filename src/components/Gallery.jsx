import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Gallery() {
  const [sites, setSites] = useState([]);

  // Load sites from localStorage
  useEffect(() => {
    const storedSites = localStorage.getItem("sites");
    if (storedSites) {
      setSites(JSON.parse(storedSites));
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Back Button */}
      <div className="mb-6 flex justify-between items-center">
        <Link
          to="/"
          className="px-4 py-2 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800"
        >
          ← Back to Home
        </Link>
        <Link
          to="/site-management"
          className="px-4 py-2 rounded-md bg-green-700 text-white font-medium hover:bg-green-600"
        >
          ➕ Add New Site
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>

      {sites.length === 0 ? (
        <p className="text-gray-500">No project images available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {sites
            .filter((site) => site.image) // only show if image uploaded
            .map((site) => (
              <div
                key={site.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={site.image}
                  alt={site.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{site.name}</h3>
                  <p className="text-sm text-gray-600">
                    {site.location || "Location not set"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {site.startDate} → {site.endDate}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      site.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : site.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {site.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
