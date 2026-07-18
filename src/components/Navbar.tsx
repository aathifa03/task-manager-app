"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-blue-500 to-violet-600 font-bold shadow-lg shadow-blue-500/30 text-white">
            ✓
          </div>
          <span className="text-lg font-bold tracking-tight text-white">TaskFlow</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>
          <a href="#roles" className="transition hover:text-white">
            Roles
          </a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-xs text-slate-400 sm:inline-block">
                Logged in as <span className="font-semibold text-slate-200">{user.name}</span> ({user.role})
              </span>
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
