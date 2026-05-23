import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Add Your Site",
      description:
        "Create a project with details like name, location, budget, and start/end dates.",
      icon: "🏗️",
    },
    {
      id: 2,
      title: "Manage Resources",
      description:
        "Add labour and materials. Track attendance, inventory, and assign tasks easily.",
      icon: "👷",
    },
    {
      id: 3,
      title: "Track Progress",
      description:
        "Update work completion status, upload images, and monitor project milestones in real-time.",
      icon: "📊",
    },
    {
      id: 4,
      title: "Download Reports",
      description:
        "Export site data into Excel or PDF and share updates with contractors and clients.",
      icon: "📥",
    },
  ];

  return (
    <section id="how" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-600">
            Get started in just a few steps. Our platform makes site management
            easy, fast, and reliable.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center
                         transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
