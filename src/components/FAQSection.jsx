import React, { useState } from "react";

const faqs = [
  {
    q: "Is this platform mobile friendly?",
    a: "Yes, engineers and supervisors can update site progress directly from their phones.",
  },
  {
    q: "Can I export reports?",
    a: "Absolutely! You can download site and material data into Excel for sharing.",
  },
  {
    q: "Is my data secure?",
    a: "We store your data safely in your browser or on secure servers (future upgrade).",
  },
  {
    q: "Can multiple roles use it?",
    a: "Yes, you can assign Engineer, Contractor, and Supervisor roles with controlled access.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-gray-900 font-medium focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        {q}
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          open ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-16 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
