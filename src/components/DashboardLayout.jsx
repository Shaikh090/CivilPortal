import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  HardHat,
  Users,
  Boxes,
  Image as ImageIcon,
  Menu,
  X,
  Building2,
  MessageSquare
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Landing Home", href: "/", icon: Home },
    { name: "Site Management", href: "/site-management", icon: HardHat },
    { name: "Labour Management", href: "/labour-management", icon: Users },
    { name: "Material Management", href: "/material-management", icon: Boxes },
    { name: "Project Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Messages & Inquiries", href: "/messages", icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path;

  // Dynamic document title update (SEO best practice)
  useEffect(() => {
    const currentNavItem = navigation.find((item) => isActive(item.href));
    if (currentNavItem) {
      document.title = `${currentNavItem.name} | CivilPortal Admin`;
    } else {
      document.title = "Admin Dashboard | CivilPortal";
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans antialiased">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-slate-100 border-r border-slate-900/60 shrink-0 shadow-2xl z-20">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-900">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5 animate-pulse-slow" />
          </div>
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            CivilPortal
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const ActiveIcon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-400 rounded-r-full" />
                )}
                <ActiveIcon
                  className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-900 text-xs text-slate-600 text-center font-medium">
          © {new Date().getFullYear()} CivilPortal Admin
        </div>
      </aside>

      {/* Sidebar - Mobile Navigation Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-sm transition-opacity">
          <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col h-full animate-slideInLeft shadow-2xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-900">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-wider">CivilPortal</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const ActiveIcon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <ActiveIcon className="w-4 h-4 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-900 text-xs text-slate-600 text-center font-medium">
              © {new Date().getFullYear()} CivilPortal
            </div>
          </aside>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-650 hover:text-slate-900 hover:bg-slate-100 md:hidden focus:outline-none transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {navigation.find((item) => isActive(item.href))?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full shadow-sm">
              Admin Mode
            </span>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
