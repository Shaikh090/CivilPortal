import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { Mail, Trash2, User, Calendar, MessageSquare, BookOpen, Clock } from "lucide-react";

export default function MessagesAdmin() {
  const [activeTab, setActiveTab] = useState("contacts"); // 'contacts' or 'demos'
  const [messages, setMessages] = useState([]);
  const [demos, setDemos] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    const savedDemos = JSON.parse(localStorage.getItem("demo_requests") || "[]");
    
    // Sort newest first
    setMessages(savedMessages.reverse());
    setDemos(savedDemos.reverse());
  }, []);

  const handleDeleteMessage = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const savedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
      const updated = savedMessages.filter((m) => m.id !== id);
      localStorage.setItem("messages", JSON.stringify(updated));
      setMessages(updated.reverse());
    }
  };

  const handleDeleteDemo = (id) => {
    if (window.confirm("Are you sure you want to delete this demo request?")) {
      const savedDemos = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      const updated = savedDemos.filter((d) => d.id !== id);
      localStorage.setItem("demo_requests", JSON.stringify(updated));
      setDemos(updated.reverse());
    }
  };

  return (
    <DashboardLayout>
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Messages & Inquiries</h2>
          <p className="text-slate-500 text-sm">Review submitted contact forms and schedule request demo inquiries.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "contacts"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <Mail className="w-4 h-4" /> Contact Forms
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
            activeTab === "contacts" ? "bg-blue-150 text-blue-700" : "bg-slate-100 text-slate-500"
          }`}>
            {messages.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("demos")}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "demos"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Demo Requests
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
            activeTab === "demos" ? "bg-blue-150 text-blue-700" : "bg-slate-100 text-slate-500"
          }`}>
            {demos.length}
          </span>
        </button>
      </div>

      {/* Messages List */}
      {activeTab === "contacts" ? (
        messages.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-4xl mx-auto">
            <div className="text-slate-300 mb-4 text-5xl">📥</div>
            <h3 className="font-bold text-slate-700 text-lg mb-1">No Messages Yet</h3>
            <p className="text-slate-400 text-sm">Submitted contact forms from landing page will be listed here.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {messages.map((m) => (
              <div
                key={m.id || m.date}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden group hover:shadow transition-all duration-200"
              >
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteMessage(m.id)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-rose-600 transition-colors p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>

                {/* Sender info */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-3 font-semibold">
                  <span className="flex items-center gap-1 text-slate-800 font-bold text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-200/30">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {m.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {m.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {m.date}
                  </span>
                </div>

                {/* Subject */}
                <h4 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> {m.subject}
                </h4>

                {/* Message Body */}
                <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        demos.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-4xl mx-auto">
            <div className="text-slate-300 mb-4 text-5xl">📅</div>
            <h3 className="font-bold text-slate-700 text-lg mb-1">No Demo Requests</h3>
            <p className="text-slate-400 text-sm">Requests submitted from the demo modal will be listed here.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {demos.map((d) => (
              <div
                key={d.id || d.date}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden group hover:shadow transition-all duration-200"
              >
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteDemo(d.id)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-rose-600 transition-colors p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Delete Request"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>

                {/* Sender info */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-3 font-semibold">
                  <span className="flex items-center gap-1 text-slate-800 font-bold text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-200/30">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {d.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {d.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {d.date}
                  </span>
                </div>

                {/* Message Body */}
                <div className="mt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">DEMO NOTE / REQUIREMENTS:</span>
                  <p className="text-slate-655 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-200/50 font-medium">
                    {d.message || <span className="italic text-slate-400 text-xs">No additional details provided</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </DashboardLayout>
  );
}
