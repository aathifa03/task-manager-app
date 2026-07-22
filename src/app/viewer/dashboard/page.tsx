"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { getTasks, updateTask } from "@/services/task.service";
import { Task } from "@/types";

export default function ViewerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "done">("all");

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

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "all") return true;
    return task.status === statusFilter;
  });

  return (
    <ProtectedRoute roles={["viewer"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar />

        <main className="px-4 py-6 sm:py-8 sm:px-6 relative overflow-hidden">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/4 top-0 h-120 w-120 rounded-full bg-violet-600/5 dark:bg-violet-600/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-120 w-120 rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-3xl" />
          </div>

          <section className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-8">
            {/* Header info */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-black bg-linear-to-r from-violet-600 to-blue-600 dark:from-violet-300 dark:to-blue-300 bg-clip-text text-transparent">
                Viewer Dashboard
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>. Track and complete your assignments.
              </p>
            </div>

            {/* Stats - Single Row on Mobile */}
            <section className="grid gap-2.5 sm:gap-4 grid-cols-3">
              <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-3.5 sm:p-5 shadow-xs text-center sm:text-left">
                <p className="text-[10px] sm:text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400">
                  My <span className="hidden sm:inline">tasks</span>
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-4xl font-black text-slate-900 dark:text-white">{totalTasks}</p>
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-3.5 sm:p-5 shadow-xs text-center sm:text-left">
                <p className="text-[10px] sm:text-sm font-semibold tracking-wide uppercase text-amber-600 dark:text-amber-400">
                  Pending
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-4xl font-black text-amber-600 dark:text-amber-300">{pendingTasks}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 p-3.5 sm:p-5 shadow-xs text-center sm:text-left">
                <p className="text-[10px] sm:text-sm font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                  Done
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-300">{completedTasks}</p>
              </div>
            </section>

            {/* Messages */}
            {(errorMsg || successMsg) && (
              <div className="mt-5 space-y-2">
                {errorMsg && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-600 dark:text-red-400">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                    {successMsg}
                  </div>
                )}
              </div>
            )}

            {/* Tasks List */}
            <section className="mt-6 sm:mt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span>My Assigned Tasks</span>
                  <span className="rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 px-3 py-1 text-xs text-violet-600 dark:text-violet-300 font-semibold">
                    {filteredTasks.length} {statusFilter !== "all" ? statusFilter : ""}
                  </span>
                </h2>
                
                {/* Status Filter */}
                <div className="flex gap-1.5 self-start sm:self-auto">
                  {(["all", "pending", "done"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`rounded-lg px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition border cursor-pointer ${
                        statusFilter === filter
                          ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/20"
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                        {filter}
                      </button>
                    ))}
                </div>
              </div>

              {isLoading ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-md">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-violet-500" />
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-md p-8 text-center text-slate-500 dark:text-slate-400">
                  {statusFilter === "all"
                    ? "You do not have any tasks assigned to you. When an assigner delegates a task, it will appear here."
                    : `No ${statusFilter} tasks found.`}
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTasks.map((task) => (
                    <article
                      key={task.id}
                      className="group relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition duration-200">
                            {task.title}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                              task.status === "done"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-slate-100 dark:border-white/5 pt-4 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          ID: {task.id}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(task)}
                          className={`rounded-lg px-4 py-2 text-xs font-semibold transition active:scale-[0.97] border cursor-pointer ${
                            task.status === "pending"
                              ? "border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                              : "border-amber-300 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
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
      </div>
    </ProtectedRoute>
  );
}
