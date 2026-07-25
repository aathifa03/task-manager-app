"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [apiUrlOverride, setApiUrlOverride] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("api_url_override");
    if (saved) {
      setApiUrlOverride(saved);
    }
  }, []);

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiUrlOverride.trim()) {
      localStorage.setItem("api_url_override", apiUrlOverride.trim());
      const msg = "API URL override saved! Requests will target this URL.";
      setSavedMsg(msg);
      toast.success(msg);
    } else {
      localStorage.removeItem("api_url_override");
      const msg = "Reset to default API URL.";
      setSavedMsg(msg);
      toast.success(msg);
    }
    setTimeout(() => setSavedMsg(""), 4000);
  };

  const handleClearOverride = () => {
    localStorage.removeItem("api_url_override");
    setApiUrlOverride("");
    const msg = "API URL override cleared.";
    setSavedMsg(msg);
    toast.success(msg);
    setTimeout(() => setSavedMsg(""), 4000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight">App Settings</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Customize your application preferences and connections.
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Appearance Theme</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Toggle between Light Mode and Dark Mode interface styles.
                  </p>
                </div>

                <button
                  onClick={toggleTheme}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2.5 text-sm font-bold transition hover:bg-slate-200 dark:hover:bg-white/10"
                >
                  Current: <span className="capitalize text-blue-600 dark:text-blue-400">{theme} Mode</span>
                </button>
              </div>
            </div>

            {/* API Connection Settings */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-xs">
              <h2 className="text-lg font-bold border-b border-slate-100 dark:border-white/10 pb-3">
                API Connection (Tunnel Override)
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Override the default backend API endpoint URL (useful when connecting Netlify frontend to an ngrok/Cloudflare tunnel live).
              </p>

              {savedMsg && (
                <div className="mt-4 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                  {savedMsg}
                </div>
              )}

              <form onSubmit={handleSaveApiUrl} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Backend API Base URL
                  </label>
                  <input
                    type="url"
                    value={apiUrlOverride}
                    onChange={(e) => setApiUrlOverride(e.target.value)}
                    placeholder="https://your-tunnel-id.ngrok-free.app/api"
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Default: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
                  >
                    Save Override
                  </button>

                  {apiUrlOverride && (
                    <button
                      type="button"
                      onClick={handleClearOverride}
                      className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
