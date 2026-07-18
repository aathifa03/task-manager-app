"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getTasks, updateTask } from "@/services/task.service";
import { Task } from "@/types";

export default function ViewerDashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to load your assigned tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleStatus = async (task: Task) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      const newStatus = task.status === "pending" ? "done" : "pending";
      const updated = await updateTask(task.id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: updated.status } : t))
      );
      setSuccessMsg(`Task marked as ${updated.status}.`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to update task status.");
    }
  };

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  return (
    <ProtectedRoute roles={["viewer"]}>
      <main className="min-h-screen bg-slate-950 text-white px-4 py-8 sm:px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-120 w-120 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-120 w-120 rounded-full bg-blue-600/10 blur-3xl" />
        </div>

        <section className="mx-auto max-w-5xl">
          {/* Header */}
          <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                ← Back to home
              </Link>
              <h1 className="mt-3 text-3xl font-black bg-linear-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
                Viewer Dashboard
              </h1>
              <p className="mt-1 text-slate-400">
                Welcome, <span className="font-semibold text-slate-200">{user?.name}</span>. Track and complete your assignments.
              </p>
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 self-start sm:self-center"
            >
              Log out
            </button>
          </header>

          {/* Stats */}
          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
              <p className="text-sm font-semibold tracking-wide uppercase text-blue-400">My tasks</p>
              <p className="mt-2 text-4xl font-black">{totalTasks}</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="text-sm font-semibold tracking-wide uppercase text-amber-400">Pending</p>
              <p className="mt-2 text-4xl font-black text-amber-300">{pendingTasks}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-sm font-semibold tracking-wide uppercase text-emerald-400">Completed</p>
              <p className="mt-2 text-4xl font-black text-emerald-300">{completedTasks}</p>
            </div>
          </section>

          {/* Messages */}
          {(errorMsg || successMsg) && (
            <div className="mt-6 space-y-2">
              {errorMsg && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
                  {successMsg}
                </div>
              )}
            </div>
          )}

          {/* Tasks List */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center justify-between">
              <span>My Assigned Tasks</span>
              <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs text-violet-300">
                {totalTasks} Assigned
              </span>
            </h2>

            {isLoading ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-8 text-center text-slate-400">
                You do not have any tasks assigned to you. When an assigner delegates a task, it will appear here.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <article
                    key={task.id}
                    className="group relative rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-5 shadow-2xl hover:border-white/20 transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition duration-200">
                          {task.title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                            task.status === "done"
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        ID: {task.id}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition active:scale-[0.97] border ${
                          task.status === "pending"
                            ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                            : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        }`}
                      >
                        Mark as {task.status === "pending" ? "done" : "pending"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </ProtectedRoute>
  );
}
