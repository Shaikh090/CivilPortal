// src/components/SiteManagement.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

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
    image: null,
  });

  // Save to localStorage whenever sites change
  useEffect(() => {
    localStorage.setItem("sites", JSON.stringify(sites));
  }, [sites]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.startDate || !form.endDate) return;

    const newSite = {
      ...form,
      id: Date.now(),
      imageUrl: form.image ? URL.createObjectURL(form.image) : null,
    };

    setSites([...sites, newSite]);

    setForm({
      name: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      image: null,
    });
  };

  const handleDelete = (id) => {
    setSites(sites.filter((site) => site.id !== id));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sites.map(({ imageUrl, ...rest }) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sites");
    XLSX.writeFile(workbook, "sites.xlsx");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold border-b border-blue-800">
          CivilPortal
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3">
          <Link to="/" className="block px-3 py-2 rounded hover:bg-blue-800">
            Home
          </Link>
          <Link to="/site-management" className="block px-3 py-2 rounded bg-blue-800">
            Site Management
          </Link>
          <Link to="/gallery" className="block px-3 py-2 rounded hover:bg-blue-800">
            Gallery
          </Link>
        </nav>
        <div className="px-6 py-4 border-t border-blue-800 text-sm">
          © {new Date().getFullYear()} CivilPortal
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Site Management Dashboard</h1>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export to Excel
          </button>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Add New Site</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Site Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Progress Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Site
            </button>
          </form>

          {/* Site Cards */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <div key={site.id} className="bg-white p-4 rounded-lg shadow-md">
                {site.imageUrl && (
                  <img
                    src={site.imageUrl}
                    alt={site.name}
                    className="h-40 w-full object-cover rounded"
                  />
                )}
                <h3 className="text-lg font-semibold mt-3">{site.name}</h3>
                <p className="text-sm text-gray-600">📍 {site.location}</p>
                <p className="text-sm text-gray-600">
                  {site.startDate} → {site.endDate}
                </p>
                <p className="text-sm text-gray-500 mt-1">{site.description}</p>
                <button
                  onClick={() => handleDelete(site.id)}
                  className="mt-3 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
