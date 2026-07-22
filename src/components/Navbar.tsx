"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition duration-300">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-blue-500 to-violet-600 font-bold shadow-lg shadow-blue-500/30 text-white group-hover:scale-105 transition-transform duration-200">
              ✓
            </div>
            <span className="text-lg font-black tracking-tight text-white group-hover:text-blue-400 transition-colors duration-200">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="relative py-1 transition hover:text-white group">
              Features
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#how-it-works" className="relative py-1 transition hover:text-white group">
              How it works
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#roles" className="relative py-1 transition hover:text-white group">
              Roles
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          {/* Desktop Actions / Auth */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <>
                <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3.5 py-1.5 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{user.name}</span>
                  <span className="text-slate-600">|</span>
                  <span className="font-semibold text-blue-400 capitalize">{user.role}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-linear-to-r from-blue-500 to-violet-600 px-4.5 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] shadow-md shadow-blue-500/10"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl border border-white/10 bg-white/5 px-4.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon animated to X */}
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-white/10 bg-slate-950/95 backdrop-blur-xl ${
          isOpen ? "max-h-[350px] opacity-100 py-5" : "max-h-0 opacity-0"
        }`}
        id="mobile-menu"
      >
        <div className="space-y-4 px-5">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3.5">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-slate-300 transition hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-slate-300 transition hover:text-white"
            >
              How it works
            </a>
            <a
              href="#roles"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-slate-300 transition hover:text-white"
            >
              Roles
            </a>
          </div>

          <div className="border-t border-white/10 pt-4">
            {user ? (
              <div className="flex flex-col gap-4">
                {/* User Info Tag */}
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {user.name} (<span className="font-semibold text-blue-400 capitalize">{user.role}</span>)
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
                    className="rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-semibold text-slate-300 hover:bg-white/10 active:scale-[0.98] transition"
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
                  className="rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-white py-3 text-center text-sm font-bold text-slate-950 hover:bg-slate-100 transition"
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
