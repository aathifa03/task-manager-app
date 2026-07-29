"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition duration-300 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-13 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="grid h-7.5 w-7.5 place-items-center rounded-lg bg-linear-to-br from-blue-500 to-violet-600 font-bold shadow-md shadow-blue-500/20 text-white group-hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 022 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300 md:flex">
            <Link href="/#features" className="hover:text-slate-900 dark:hover:text-white transition">Features</Link>
            <Link href="/#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition">How it works</Link>
            <Link href="/#roles" className="hover:text-slate-900 dark:hover:text-white transition">Roles</Link>
          </div>

          {/* Desktop Action Icons / User Controls */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Theme Toggle Icon Button */}
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <>
                {/* Dashboard Icon Button */}
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  title="Dashboard"
                  aria-label="Dashboard"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Link>

                {/* Profile Icon Button */}
                <Link
                  href="/profile"
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition"
                  title="Profile"
                  aria-label="Profile"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>

                {/* Log Out Icon Button */}
                <button
                  onClick={logout}
                  className="rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-2 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                  title="Log out"
                  aria-label="Log out"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>

                {/* Profile Avatar + Name + Role Badge */}
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 shadow-2xs ml-1">
                  <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-violet-500 font-bold text-[9px] text-white">
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
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-slate-900 dark:bg-white px-3.5 py-1.5 text-xs font-bold text-white dark:text-slate-950 transition hover:bg-slate-800"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Container (Theme Toggle + Hamburger) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-1.5 text-xs"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              onClick={toggleMenu}
              className="rounded-lg border border-slate-200 dark:border-white/10 p-1.5 text-slate-600 dark:text-slate-300 cursor-pointer"
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

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-white/10 py-3 space-y-2 animate-in fade-in">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-xs">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
                >
                  📊 Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
                >
                  👤 Profile
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg cursor-pointer"
                >
                  🚪 Log out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-3 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
