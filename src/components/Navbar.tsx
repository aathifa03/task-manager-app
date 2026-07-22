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
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition duration-300 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-blue-500 to-violet-600 font-bold shadow-lg shadow-blue-500/30 text-white group-hover:scale-105 transition-transform duration-200">
              ✓
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
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

          {/* Desktop Actions / Auth / Theme Toggle */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white focus:outline-none cursor-pointer animate-none"
              aria-label="Toggle theme"
            >
              <div className="relative h-5 w-5 flex items-center justify-center">
                {/* Sun Icon (shows when dark, click to go light) */}
                <svg
                  className={`absolute h-5 w-5 transform transition-all duration-500 ${
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
                {/* Moon Icon (shows when light, click to go dark) */}
                <svg
                  className={`absolute h-5 w-5 transform transition-all duration-500 ${
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

            {user ? (
              <>
                {/* Stylized Profile + Role Tag */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                  <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-violet-500 font-bold text-[10px] text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    user.role === "assigner" 
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20" 
                      : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-500/20"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-linear-to-r from-blue-500 to-violet-600 px-4.5 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] shadow-md shadow-blue-500/10"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-bold text-white dark:text-slate-950 transition hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Container (Theme Toggle + Menu Toggle) */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white focus:outline-none"
              aria-label="Toggle theme"
            >
              <div className="relative h-5 w-5 flex items-center justify-center">
                <svg
                  className={`absolute h-5 w-5 transform transition-all duration-500 ${
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
                  className={`absolute h-5 w-5 transform transition-all duration-500 ${
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative flex h-5 w-5 flex-col justify-between overflow-hidden">
                <span
                  className={`h-0.5 w-full bg-current transform transition-all duration-300 ${
                    isOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-current transition-all duration-300 ${
                    isOpen ? "opacity-0 translate-x-3" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-current transform transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-2.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl ${
          isOpen ? "max-h-[350px] opacity-100 py-5" : "max-h-0 opacity-0"
        }`}
        id="mobile-menu"
      >
        <div className="space-y-4 px-5">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3.5">
            <Link
              href="/#features"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-slate-600 dark:text-slate-300 transition hover:text-slate-900 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-slate-600 dark:text-slate-300 transition hover:text-slate-900 dark:hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="/#roles"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-slate-600 dark:text-slate-300 transition hover:text-slate-900 dark:hover:text-white"
            >
              Roles
            </Link>
          </div>

          <div className="border-t border-slate-200 dark:border-white/10 pt-4">
            {user ? (
              <div className="flex flex-col gap-4">
                {/* User Info Tag */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-violet-500 font-bold text-xs text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    user.role === "assigner" 
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20" 
                      : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-500/20"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="grid gap-2 grid-cols-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl bg-linear-to-r from-blue-500 to-violet-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/10 active:scale-[0.98] transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 py-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 py-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-slate-900 dark:bg-white py-3 text-center text-sm font-bold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
