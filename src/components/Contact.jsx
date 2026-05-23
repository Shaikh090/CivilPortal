import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // save to localStorage (mock backend)
    const stored = JSON.parse(localStorage.getItem("messages") || "[]");
    stored.push({ ...form, date: new Date().toLocaleString() });
    localStorage.setItem("messages", JSON.stringify(stored));

    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex justify-between mb-6">
        <Link
          to="/"
          className="px-4 py-2 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800"
        >
          ← Back to Home
        </Link>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>

      {submitted && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          ✅ Thank you! Your message has been sent.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-800"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
