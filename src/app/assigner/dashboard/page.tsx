"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { getTasks, createTask, updateTask, deleteTask } from "@/services/task.service";
import { getViewers } from "@/services/auth.service";
import { Task, User } from "@/types";

export default function AssignerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewers, setViewers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "create">("tasks");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "done">("all");

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [fetchedTasks, fetchedViewers] = await Promise.all([
        getTasks(),
        getViewers(),
      ]);
      setTasks(fetchedTasks);
      setViewers(fetchedViewers);
      if (fetchedViewers.length > 0) {
        setAssignedTo(fetchedViewers[0].email);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title || !description || !assignedTo) {
      setErrorMsg("Please fill in all task fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newTask = await createTask({ title, description, assignedTo });
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setSuccessMsg("Task created and assigned successfully!");
      setActiveTab("tasks"); // Switch back to see the newly created task
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message ?? "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      const newStatus = task.status === "pending" ? "done" : "pending";
      const updated = await updateTask(task.id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: updated.status } : t))
      );
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to update task status.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setSuccessMsg("Task deleted successfully.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to delete task.");
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
    <ProtectedRoute roles={["assigner"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar />
        
        <main className="px-4 py-6 sm:py-8 sm:px-6 relative overflow-hidden">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/4 top-0 h-120 w-120 rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-120 w-120 rounded-full bg-violet-600/5 dark:bg-violet-600/10 blur-3xl" />
          </div>

          <section className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-8">
            {/* Header info */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-black bg-linear-to-r from-blue-600 to-violet-600 dark:from-blue-300 dark:to-violet-300 bg-clip-text text-transparent">
                Assigner Dashboard
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>. Plan and delegate tasks.
              </p>
            </div>

            {/* Stats - Single Row on Mobile */}
            <section className="grid gap-2.5 sm:gap-4 grid-cols-3">
              <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-3.5 sm:p-5 shadow-xs text-center sm:text-left">
                <p className="text-[10px] sm:text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400">
                  Total <span className="hidden sm:inline">tasks</span>
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-4xl font-black text-slate-900 dark:text-white">{totalTasks}</p>
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-3.5 sm:p-5 shadow-xs text-center sm:text-left">
                <p className="text-[10px] sm:text-sm font-semibold tracking-wide uppercase text-amber-600 dark:text-amber-400">
                  Pending <span className="hidden sm:inline">tasks</span>
                </p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-4xl font-black text-amber-600 dark:text-amber-300">{pendingTasks}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 p-3.5 sm:p-5 shadow-xs text-center sm:text-left">
                <p className="text-[10px] sm:text-sm font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                  Done <span className="hidden sm:inline">tasks</span>
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

            {/* Mobile Tab Switcher */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 lg:hidden mt-6">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`flex-1 rounded-lg py-2.5 text-center text-xs font-semibold transition cursor-pointer ${
                  activeTab === "tasks"
                    ? "bg-white dark:bg-slate-900 shadow-xs text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Tasks ({totalTasks})
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 rounded-lg py-2.5 text-center text-xs font-semibold transition cursor-pointer ${
                  activeTab === "create"
                    ? "bg-white dark:bg-slate-900 shadow-xs text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Create & Assign
              </button>
            </div>

            <div className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
              {/* Create Task Form */}
              <section className={`lg:col-span-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-md p-5 sm:p-6 shadow-xl ${
                activeTab === "create" ? "block" : "hidden lg:block"
              }`}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-sm font-semibold">＋</span>
                  Create & Assign Task
                </h2>

                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Design Landing Page"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Assign To (Viewer)
                    </label>
                    {viewers.length === 0 ? (
                      <div className="text-xs text-amber-600 dark:text-amber-300/80 border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-3 rounded-lg">
                        No Viewers registered yet. You can assign tasks to yourself or register a Viewer account first.
                      </div>
                    ) : (
                      <select
                        value={assignedTo}
                        onChange={(event) => setAssignedTo(event.target.value)}
                        disabled={isSubmitting}
                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
                        required
                      >
                        {viewers.map((viewer) => (
                          <option key={viewer.id} value={viewer.email} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                            {viewer.name} ({viewer.email})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Task Description
                    </label>
                    <textarea
                      placeholder="Detail the expectations..."
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      disabled={isSubmitting}
                      className="w-full min-h-28 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || viewers.length === 0}
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    {isSubmitting ? "Creating..." : "Add task"}
                  </button>
                </form>
              </section>

              {/* Tasks List */}
              <section className={`lg:col-span-2 space-y-4 ${
                activeTab === "tasks" ? "block" : "hidden lg:block"
              }`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <span>All Tasks</span>
                    <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 text-xs text-blue-600 dark:text-blue-300 font-semibold">
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
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
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
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-blue-500" />
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-md p-8 text-center text-slate-500 dark:text-slate-400">
                    {statusFilter === "all"
                      ? "No tasks have been created yet. Fill in the form on the left to assign a task!"
                      : `No ${statusFilter} tasks found.`}
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {filteredTasks.map((task) => (
                      <article
                        key={task.id}
                        className="group relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition duration-200">
                              {task.title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {task.description}
                            </p>
                          </div>
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

                        <div className="mt-4 border-t border-slate-100 dark:border-white/5 pt-4 flex flex-col gap-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Assigned to: <span className="font-medium text-slate-700 dark:text-slate-300">{task.assignedToName}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            Email: {task.assignedTo}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleToggleStatus(task)}
                            className="rounded-lg border border-blue-300 dark:border-blue-500/30 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-500/10 active:scale-[0.97] cursor-pointer"
                          >
                            Mark as {task.status === "pending" ? "done" : "pending"}
                          </button>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="rounded-lg border border-red-300 dark:border-red-500/30 px-3.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-[0.97] cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
