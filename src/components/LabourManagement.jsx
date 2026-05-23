import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

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
    setLabours(labours.filter((l) => l.id !== id));
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Labour Management</h1>

      {/* Back button */}
      <Link
        to="/"
        className="inline-block mb-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
      >
        ⬅ Back to Home
      </Link>

      {/* Add Labour Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 grid md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Labour Name"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role (Mason, Helper, etc.)"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="wage"
          value={form.wage}
          onChange={handleChange}
          placeholder="Wage per Day"
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-800"
        >
          Add Labour
        </button>
      </form>

      {/* Labour Table */}
      {labours.length === 0 ? (
        <p className="text-gray-500">No labour records yet.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Wage</th>
                {days.map((day) => (
                  <th key={day} className="border p-2">
                    Day {day}
                  </th>
                ))}
                <th className="border p-2">Total Days</th>
                <th className="border p-2">Total Wages</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labours.map((labour) => {
                const totalDays = Object.values(labour.attendance).filter(Boolean).length;
                const totalWages = totalDays * labour.wage;

                return (
                  <tr key={labour.id}>
                    <td className="border p-2">{labour.name}</td>
                    <td className="border p-2">{labour.role}</td>
                    <td className="border p-2">₹{labour.wage}</td>
                    {days.map((day) => (
                      <td
                        key={day}
                        className="border p-2 text-center cursor-pointer"
                        onClick={() => toggleAttendance(labour.id, day)}
                      >
                        {labour.attendance[day] ? "✔️" : "❌"}
                      </td>
                    ))}
                    <td className="border p-2 text-center">{totalDays}</td>
                    <td className="border p-2 text-center">₹{totalWages}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleDelete(labour.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Download Excel */}
          <button
            onClick={downloadExcel}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-800"
          >
            Download Excel
          </button>
        </div>
      )}
    </div>
  );
}
