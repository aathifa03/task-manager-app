"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition duration-300 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-13 items-center justify-between gap-4">
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="grid h-7.5 w-7.5 place-items-center rounded-lg bg-linear-to-br from-blue-500 to-violet-600 font-bold shadow-md shadow-blue-500/20 text-white group-hover:scale-105 transition-transform duration-200">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                TaskFlow
              </span>
            </Link>

            <div className="hidden items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300 md:flex">
              <Link href="/#features" className="relative py-1 transition hover:text-slate-900 dark:hover:text-white group">
                Features
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/#how-it-works" className="relative py-1 transition hover:text-slate-900 dark:hover:text-white group">
                How it works
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/#roles" className="relative py-1 transition hover:text-slate-900 dark:hover:text-white group">
                Roles
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>

          {/* Desktop Actions / Auth / Theme Toggle */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="group relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle theme"
            >
              <div className="relative h-4 w-4 flex items-center justify-center">
                <svg
                  className={`absolute h-4 w-4 transform transition-all duration-500 ${
                    theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <svg
                  className={`absolute h-4 w-4 transform transition-all duration-500 ${
                    theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap shadow-md z-50">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>

            {user ? (
              <>
                {/* Dashboard Icon Button */}
                <Link
                  href="/dashboard"
                  className="group relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                  aria-label="Dashboard"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap shadow-md z-50">
                    Dashboard
                  </span>
                </Link>

                {/* Notifications Bell Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="group relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                    aria-label="Notifications"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
                    </svg>
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3 shadow-xl z-50 animate-in fade-in space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Notifications</h4>
                        <span className="text-[9px] text-slate-400 font-semibold">Live System</span>
                      </div>
                      <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400">
                        No new notifications
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Icon Button */}
                <Link
                  href="/profile"
                  className="group relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer"
                  aria-label="Profile"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap shadow-md z-50">
                    Profile
                  </span>
                </Link>

                {/* Settings Icon Button */}
                <Link
                  href="/settings"
                  className="group relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  aria-label="Settings"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap shadow-md z-50">
                    Settings
                  </span>
                </Link>

                {/* Log Out Icon Button */}
                <button
                  onClick={logout}
                  className="group relative rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-2 text-red-600 dark:text-red-400 transition hover:bg-red-500 hover:text-white cursor-pointer"
                  aria-label="Log out"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap shadow-md z-50">
                    Log out
                  </span>
                </button>

                {/* Profile + Role Badge */}
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 shadow-xs ml-1">
                  <div className="relative flex h-4.5 w-4.5 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-violet-500 font-bold text-[9px] text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className={`inline-flex items-center rounded-md px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                    user.role === "assigner" 
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20" 
                      : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-500/20"
                  }`}>
                    {user.role}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-slate-900 dark:bg-white px-3.5 py-1.5 text-xs font-bold text-white dark:text-slate-950 transition hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Container */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-1.5 text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              <div className="relative h-4 w-4 flex items-center justify-center">
                <svg
                  className={`absolute h-4 w-4 transform transition-all duration-500 ${
                    theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <svg
                  className={`absolute h-4 w-4 transform transition-all duration-500 ${
                    theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>
            </button>

            <button
              onClick={toggleMenu}
              className="rounded-lg border border-slate-200 dark:border-white/10 p-1.5 text-slate-600 dark:text-slate-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
