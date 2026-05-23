import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DashboardLayout from "./DashboardLayout";
import { Users, Briefcase, DollarSign, CalendarCheck, Plus, Trash2 } from "lucide-react";

export default function LabourManagement() {
  const [labours, setLabours] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", wage: "" });

  // Load labour data from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("labourData")) || [];
    setLabours(stored);
  }, []);

  // Save labour data whenever updated
  useEffect(() => {
    localStorage.setItem("labourData", JSON.stringify(labours));
  }, [labours]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add labour
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.wage) {
      alert("Please fill all required fields");
      return;
    }

    const newLabour = {
      id: Date.now(),
      ...form,
      wage: parseInt(form.wage, 10),
      attendance: {}, // will store daily attendance
    };

    setLabours([...labours, newLabour]);
    setForm({ name: "", role: "", wage: "" });
  };

  // Toggle attendance for a given labour and day
  const toggleAttendance = (labourId, day) => {
    setLabours((prev) =>
      prev.map((labour) =>
        labour.id === labourId
          ? {
              ...labour,
              attendance: {
                ...labour.attendance,
                [day]: !labour.attendance[day],
              },
            }
          : labour
      )
    );
  };

  // Delete labour
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this labour record?")) {
      setLabours(labours.filter((l) => l.id !== id));
    }
  };

  // Export to Excel
  const downloadExcel = () => {
    const exportData = labours.map((labour) => {
      const totalDays = Object.values(labour.attendance).filter(Boolean).length;
      const totalWages = totalDays * labour.wage;
      return {
        Name: labour.name,
        Role: labour.role,
        Wage: labour.wage,
        "Days Worked": totalDays,
        "Total Wages": totalWages,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Labours");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "LabourData.xlsx");
  };

  // Generate simple days (1-7 for demo, can extend to 30/31)
  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  const totalWorkedDays = labours.reduce((acc, l) => acc + Object.values(l.attendance).filter(Boolean).length, 0);
  const totalWagesGenerated = labours.reduce((acc, l) => {
    const worked = Object.values(l.attendance).filter(Boolean).length;
    return acc + (worked * l.wage);
  }, 0);
  const uniqueRoles = new Set(labours.map(l => l.role.toLowerCase().trim())).size;

  return (
    <DashboardLayout>
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Workforce & Labour Tracker</h2>
          <p className="text-slate-500 text-sm">Manage daily attendance sheets, trade roles, and auto wage summaries.</p>
        </div>
        <button
          onClick={downloadExcel}
          disabled={labours.length === 0}
          className="self-start md:self-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 text-sm flex items-center gap-2 cursor-pointer"
        >
          Export Attendance
        </button>
      </div>

      {/* Workforce Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Workers</span>
            <span className="text-xl font-bold text-slate-800">{labours.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Trade Roles</span>
            <span className="text-xl font-bold text-slate-800">{uniqueRoles}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Days Worked</span>
            <span className="text-xl font-bold text-slate-800">{totalWorkedDays} Man-days</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Wages Pay</span>
            <span className="text-xl font-bold text-slate-800">₹{totalWagesGenerated.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid gap-8 lg:grid-cols-4 items-start">
        {/* Form Container */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-1 animate-fade-in">
          <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" /> Register Worker
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Labour Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Role / Trade
              </label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Mason, Welder, Helper"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Daily Wage (₹)
              </label>
              <input
                type="number"
                name="wage"
                value={form.wage}
                onChange={handleChange}
                placeholder="e.g. 600"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              Add Labour Record
            </button>
          </form>
        </div>

        {/* Attendance Grid */}
        <div className="lg:col-span-3">
          {labours.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="text-slate-300 mb-4 text-5xl">👷</div>
              <h3 className="font-bold text-slate-700 text-lg mb-1">No Labour Registered</h3>
              <p className="text-slate-400 text-sm">Add workers using the form on the left to start tracking attendance.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 font-bold text-xs uppercase">
                      <th className="p-4">Name</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Daily Wage</th>
                      {days.map((day) => (
                        <th key={day} className="p-4 text-center">
                          Day {day}
                        </th>
                      ))}
                      <th className="p-4 text-center">Worked</th>
                      <th className="p-4 text-center">Total Pay</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {labours.map((labour) => {
                      const totalDays = Object.values(labour.attendance).filter(Boolean).length;
                      const totalWages = totalDays * labour.wage;

                      return (
                        <tr key={labour.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-slate-800">{labour.name}</td>
                          <td className="p-4">
                            <span className="bg-slate-100/80 text-slate-650 text-xs px-3 py-1 rounded-full font-bold border border-slate-200/40">
                              {labour.role}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-600">₹{labour.wage}</td>
                          {days.map((day) => (
                            <td key={day} className="p-4 text-center">
                              <button
                                onClick={() => toggleAttendance(labour.id, day)}
                                className={`w-8 h-8 rounded-full font-bold text-xs border flex items-center justify-center mx-auto transition-all duration-200 shadow-sm cursor-pointer hover:scale-105 ${
                                  labour.attendance[day]
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50"
                                }`}
                              >
                                {labour.attendance[day] ? "✔️" : "—"}
                              </button>
                            </td>
                          ))}
                          <td className="p-4 text-center font-bold text-slate-800">{totalDays} days</td>
                          <td className="p-4 text-center font-bold text-blue-600">₹{totalWages.toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDelete(labour.id)}
                              className="text-xs font-bold text-slate-400 hover:text-rose-605 transition-colors flex items-center justify-end gap-1 cursor-pointer ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
