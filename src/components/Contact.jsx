import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send, User, BookOpen, MessageSquare } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Set browser title for SEO
  useEffect(() => {
    document.title = "Contact Us | CivilPortal";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // save to localStorage (mock backend)
    const stored = JSON.parse(localStorage.getItem("messages") || "[]");
    stored.push({
      id: Date.now().toString(),
      ...form,
      date: new Date().toLocaleString(),
    });
    localStorage.setItem("messages", JSON.stringify(stored));

    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-12 px-6 font-sans">
      <div className="max-w-xl w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-slate-100 hover:bg-slate-800 text-xs font-bold shadow-sm transition-all mb-8 w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white border border-slate-200/85 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          {/* Header Panel */}
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-650 p-6 text-white text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Get in Touch</h2>
            <p className="text-blue-105 text-sm font-medium">Have questions or want to request a custom deployment?</p>
          </div>

          <div className="p-6 md:p-8">
            {submitted && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                <span>✅ Thank you! Your message has been received. Our team will get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Doe"
                    className="pl-10 w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. john@example.com"
                    className="pl-10 w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-455 mb-1.5">
                  Subject
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Integration request"
                    className="pl-10 w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-455 mb-1.5">
                  Message
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3.5 flex items-center pointer-events-none text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="Write your message details here..."
                    className="pl-10 w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
