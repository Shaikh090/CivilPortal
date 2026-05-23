// src/components/Features.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Core Features</h2>
          <p className="mt-2 text-gray-600">
            Everything your site team needs — simple, mobile-first, and ready for scale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Site Management */}
          <Link
            to="/site-management"
            className="block transform transition duration-300 hover:scale-105 hover:shadow-lg rounded-xl overflow-hidden"
          >
            <article className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=70&w=600&auto=format&fit=crop"
                alt="Site Management"
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Site Management
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Create and track sites with photos, milestones, deadlines, budgets and progress.
                </p>
              </div>
            </article>
          </Link>

          {/* Labour Management */}
          <Link
            to="/labour-management"
            className="block transform transition duration-300 hover:scale-105 hover:shadow-lg rounded-xl overflow-hidden"
          >
            <article className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <img
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=70&w=600&auto=format&fit=crop"
                alt="Labour Management"
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Labour Management
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Daily attendance, wages, roles and auto wage calculation with Excel export.
                </p>
              </div>
            </article>
          </Link>

          {/* Material Management */}
          <Link
            to="/material-management"
            className="block transform transition duration-300 hover:scale-105 hover:shadow-lg rounded-xl overflow-hidden"
          >
            <article className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <img
                src="/images/material_card.png"
                alt="Material Management"
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Material Management
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Track stock, logs, auto low-inventory alerts and purchase requests.
                </p>
              </div>
            </article>
          </Link>

          {/* Mobile Friendly */}
          <div className="transform transition duration-300 hover:scale-105">
            <article className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=70&w=600&auto=format&fit=crop"
                alt="Mobile Friendly"
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Mobile Friendly
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Engineers can update progress directly from their phones.
                </p>
              </div>
            </article>
          </div>

          {/* Role-based Access */}
          <div className="transform transition duration-300 hover:scale-105">
            <article className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <img
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=70&w=600&auto=format&fit=crop"
                alt="Role-based Access"
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Role-based Access
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Separate access for Admin, Contractor, Engineer, and Supervisor.
                </p>
              </div>
            </article>
          </div>

          {/* Chat & Notifications */}
          <div className="transform transition duration-300 hover:scale-105">
            <article className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=70&w=600&auto=format&fit=crop"
                alt="Chat & Notifications"
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Chat & Notifications
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Built-in chat and alerts to keep teams connected in real time.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
