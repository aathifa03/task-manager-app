"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ??
          "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 text-white px-6 py-12 overflow-hidden">
      {/* Background neon glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-10 top-10 h-70 w-70 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <section className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-8 shadow-2xl">
        <Link
          href="/"
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to home
        </Link>

        <h1 className="mt-6 text-3xl font-black tracking-tight text-white">Welcome back</h1>

        <p className="mt-2 text-slate-400">
          Log in to view your task dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          {errorMsg && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-linear-to-r from-blue-500 to-violet-600 px-5 py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition">
            Register here
          </Link>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-8 rounded-lg border border-white/5 bg-white/5 p-4 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Demo Credentials:</p>
          <p>Assigner: <span className="text-blue-300">assigner@taskflow.com</span> / <span className="text-slate-300">password123</span></p>
          <p>Viewer: <span className="text-violet-300">viewer@taskflow.com</span> / <span className="text-slate-300">password123</span></p>
        </div>
      </section>
    </main>
  );
}