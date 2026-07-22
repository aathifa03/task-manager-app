"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password, role);
    } catch (error: any) {
      console.error(error);
      if (!error.response) {
        setErrorMsg("Connection failed: Could not connect to the backend server. Please verify the Express backend is running on port 5000.");
      } else {
        setErrorMsg(
          error.response.data?.message ??
            "Could not create account. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10 sm:px-6 overflow-hidden">
      {/* Background neon glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute left-10 top-10 h-70 w-70 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <section className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-2xl sm:p-8">
        <Link
          href="/"
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to home
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-400">
          Task Manager
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
          Create your account
        </h1>

        <p className="mt-2 text-slate-400">
          Choose your role and start managing tasks.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

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
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Choose your role
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            >
              <option value="viewer" className="bg-slate-950 text-white">Viewer - view and complete assigned tasks</option>
              <option value="assigner" className="bg-slate-950 text-white">Assigner - create and assign tasks</option>
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Enter password again"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                required
              />
            </div>
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
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}