"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must contain at least 6 characters.");
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password, role);
      toast.success("Account created successfully! Welcome to TaskFlow.");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || error.message || "Could not create account. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex items-center justify-center px-4 py-10 sm:px-6 overflow-hidden">
      {/* Background neon glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-3xl" />
        <div className="absolute left-10 top-10 h-70 w-70 rounded-full bg-violet-600/5 dark:bg-violet-600/10 blur-3xl" />
      </div>

      <section className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-2xl sm:p-8">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
        >
          ← Back to home
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Task Manager
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Create your account
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Choose your role and start managing tasks.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
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
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-950/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
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
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-950/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Choose your role
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-950/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
              required
            >
              <option value="viewer" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">Viewer - view and complete assigned tasks</option>
              <option value="assigner" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">Assigner - create and assign tasks</option>
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-950/60 pl-4 pr-12 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter password again"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-950/60 pl-4 pr-12 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition focus:outline-none cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
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
            className="w-full rounded-lg bg-linear-to-r from-blue-500 to-violet-600 px-5 py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}