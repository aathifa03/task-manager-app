"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getTasks, createTask, updateTask, deleteTask } from "@/services/task.service";
import { getViewers } from "@/services/auth.service";
import { Task, User } from "@/types";

export default function AssignerDashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewers, setViewers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <ProtectedRoute roles={["assigner"]}>
      <main className="min-h-screen bg-slate-950 text-white px-4 py-8 sm:px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-120 w-120 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-120 w-120 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <section className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                ← Back to home
              </Link>
              <h1 className="mt-3 text-3xl font-black bg-linear-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">
                Assigner Dashboard
              </h1>
              <p className="mt-1 text-slate-400">
                Welcome, <span className="font-semibold text-slate-200">{user?.name}</span>. Plan and delegate tasks.
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
              <p className="text-sm font-semibold tracking-wide uppercase text-blue-400">Total tasks</p>
              <p className="mt-2 text-4xl font-black">{totalTasks}</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="text-sm font-semibold tracking-wide uppercase text-amber-400">Pending tasks</p>
              <p className="mt-2 text-4xl font-black text-amber-300">{pendingTasks}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-sm font-semibold tracking-wide uppercase text-emerald-400">Completed tasks</p>
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

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Create Task Form */}
            <section className="lg:col-span-1 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/20 text-blue-300 text-sm">＋</span>
                Create & Assign Task
              </h2>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Design Landing Page"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Assign To (Viewer)
                  </label>
                  {viewers.length === 0 ? (
                    <div className="text-xs text-amber-300/80 border border-amber-500/20 bg-amber-500/5 p-3 rounded-lg">
                      No Viewers registered yet. You can assign tasks to yourself or register a Viewer account first.
                    </div>
                  ) : (
                    <select
                      value={assignedTo}
                      onChange={(event) => setAssignedTo(event.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      required
                    >
                      {viewers.map((viewer) => (
                        <option key={viewer.id} value={viewer.email} className="bg-slate-950 text-white">
                          {viewer.name} ({viewer.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Task Description
                  </label>
                  <textarea
                    placeholder="Detail the expectations..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={isSubmitting}
                    className="w-full min-h-28 rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || viewers.length === 0}
                  className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {isSubmitting ? "Creating..." : "Add task"}
                </button>
              </form>
            </section>

            {/* Tasks List */}
            <section className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center justify-between">
                <span>All Tasks</span>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs text-blue-300">
                  {totalTasks} Total
                </span>
              </h2>

              {isLoading ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
                </div>
              ) : tasks.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-8 text-center text-slate-400">
                  No tasks have been created yet. Fill in the form on the left to assign a task!
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {tasks.map((task) => (
                    <article
                      key={task.id}
                      className="group relative rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-5 shadow-2xl hover:border-white/20 transition duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition duration-200">
                            {task.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                            {task.description}
                          </p>
                        </div>
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

                      <div className="mt-4 border-t border-white/5 pt-4 flex flex-col gap-1">
                        <p className="text-xs text-slate-500">
                          Assigned to: <span className="font-medium text-slate-300">{task.assignedToName}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Email: {task.assignedTo}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <button
                          onClick={() => handleToggleStatus(task)}
                          className="rounded-lg border border-blue-500/30 px-3.5 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/10 active:scale-[0.97]"
                        >
                          Mark as {task.status === "pending" ? "done" : "pending"}
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="rounded-lg border border-red-500/30 px-3.5 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 active:scale-[0.97]"
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
    </ProtectedRoute>
  );
}
