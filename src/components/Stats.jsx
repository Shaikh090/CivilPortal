// src/components/Stats.jsx
import React from "react";
import CountUp from "react-countup";

export default function Stats() {
  const stats = [
    { id: 1, label: "Projects Completed", value: 120 },
    { id: 2, label: "Workers Managed", value: 450 },
    { id: 3, label: "Materials Tracked", value: 15000 },
    { id: 4, label: "Happy Engineers", value: 95 },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Our Impact in Numbers</h2>
          <p className="mt-2 text-gray-600">
            See how CivilPortal helps engineers deliver projects on time and within budget.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-3xl md:text-4xl font-extrabold text-blue-900">
                <CountUp end={stat.value} duration={3} />+
              </h3>
              <p className="mt-2 text-gray-700 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
