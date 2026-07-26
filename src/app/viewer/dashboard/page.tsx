"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { subscribeToTasks, updateTask, moveTask } from "@/services/task.service";
import { getColumns } from "@/services/column.service";
import { Task, KanbanColumn } from "@/types";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import TaskDetailModal from "@/components/TaskDetailModal";
import AnalyticsView from "@/components/AnalyticsView";
import toast from "react-hot-toast";

export default function ViewerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

  // View Switcher State
  const [viewMode, setViewMode] = useState<"cards" | "kanban" | "analytics">("kanban");

  // Selected Task for Detail Modal
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "done">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [sortBy, setSortBy] = useState<"newest" | "dueDate" | "priority">("newest");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchColumns = async () => {
    try {
      const fetched = await getColumns();
      setColumns(fetched);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (user?.email) {
      setIsLoading(true);
      fetchColumns();
      unsubscribe = subscribeToTasks("viewer", user.email, (liveTasks) => {
        setTasks(liveTasks);
        setIsLoading(false);

        if (selectedDetailTask) {
          const updated = liveTasks.find((t) => t.id === selectedDetailTask.id);
          if (updated) setSelectedDetailTask(updated);
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleToggleStatus = async (task: Task) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      const newStatus = task.status === "pending" ? "done" : "pending";
      await updateTask(task.id, { status: newStatus });
      setSuccessMsg(`Task marked as ${newStatus}.`);
      toast.success(`Task marked as ${newStatus}.`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to update task status.");
      toast.error("Failed to update task status.");
    }
  };

  const handleMoveTask = async (taskId: string, targetColumnId: string) => {
    try {
      const updatedTask = await moveTask(taskId, { columnId: targetColumnId });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
      toast.success("Task moved successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to move task.");
    }
  };

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  // Filter Logic
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && (task.priority || "medium") !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = task.description.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Sort Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const weight = { high: 3, medium: 2, low: 1 };
      const pA = weight[a.priority || "medium"];
      const pB = weight[b.priority || "medium"];
      return pB - pA;
    } else if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    }
  });

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === "done") return false;
    const due = new Date(task.dueDate);
    due.setHours(23, 59, 59, 999);
    return due < new Date();
  };

  const getIssueBadge = (type?: string) => {
    switch (type) {
      case "bug":
        return <span className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase">🐞 Bug</span>;
      case "feature":
        return <span className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase">✨ Feature</span>;
      case "improvement":
        return <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase">⚡ Improvement</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase">📌 Task</span>;
    }
  };

  return (
    <ProtectedRoute roles={["viewer"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold bg-linear-to-r from-violet-600 to-blue-600 dark:from-violet-300 dark:to-blue-300 bg-clip-text text-transparent">
                My Assigned Issues
              </h1>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>. Track work, manage subtasks & leave comments.
              </p>
            </div>

            {/* View Switcher */}
            <div className="flex rounded-lg bg-slate-200/70 dark:bg-white/5 p-1 text-xs self-start sm:self-auto">
              <button
                onClick={() => setViewMode("cards")}
                className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                🎴 Cards
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                📊 Board
              </button>
              <button
                onClick={() => setViewMode("analytics")}
                className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                  viewMode === "analytics"
                    ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                📈 Analytics
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <section className="grid gap-3 grid-cols-3 mb-5">
            <div className="rounded-xl border border-violet-200 dark:border-violet-500/20 bg-violet-50/50 dark:bg-violet-500/5 p-3 shadow-2xs">
              <p className="text-[10px] font-bold tracking-wider uppercase text-violet-600 dark:text-violet-400">
                Assigned
              </p>
              <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{totalTasks}</p>
            </div>
            <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-3 shadow-2xs">
              <p className="text-[10px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
                Pending
              </p>
              <p className="mt-1 text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-300">{pendingTasks}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 p-3 shadow-2xs">
              <p className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                Completed
              </p>
              <p className="mt-1 text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-300">{completedTasks}</p>
            </div>
          </section>

          {/* Main View Area */}
          {viewMode === "analytics" ? (
            <AnalyticsView tasks={tasks} />
          ) : viewMode === "kanban" ? (
            <KanbanBoard tasks={tasks} columns={columns} onMoveTask={handleMoveTask} />
          ) : (
            <div className="space-y-4">
              {/* Search & Filter Controls */}
              <div className="space-y-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="🔍 Search assigned issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-violet-500"
                  />

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="dueDate">Sort: Due Date</option>
                    <option value="priority">Sort: Priority</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-white/5 pt-2 text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-500">Status:</span>
                    {(["all", "pending", "done"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize transition ${
                          statusFilter === filter
                            ? "bg-violet-600 text-white"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-500">Priority:</span>
                    {(["all", "high", "medium", "low"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriorityFilter(p)}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize transition ${
                          priorityFilter === p
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task Cards Grid */}
              {isLoading ? (
                <div className="flex h-36 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-violet-500" />
                </div>
              ) : sortedTasks.length === 0 ? (
                <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No assigned issues match your search or filters.
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {sortedTasks.map((task) => {
                    const overdue = isOverdue(task);
                    const subtasksCount = task.subtasks?.length || 0;
                    const completedSubtasksCount = task.subtasks?.filter((s) => s.completed).length || 0;
                    const commentsCount = task.comments?.length || 0;

                    return (
                      <article
                        key={task.id}
                        onClick={() => setSelectedDetailTask(task)}
                        className={`group relative flex flex-col justify-between rounded-xl border p-3.5 shadow-2xs transition duration-200 hover:border-violet-500/50 cursor-pointer ${
                          overdue
                            ? "border-red-400 dark:border-red-500/50 bg-red-50/20 dark:bg-red-500/5"
                            : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                {getIssueBadge(task.issueType)}
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md ${
                                  task.priority === "high"
                                    ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                    : task.priority === "low"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                                }`}>
                                  {task.priority || "medium"}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {task.title}
                              </h3>
                            </div>

                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                                task.status === "done"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30"
                              }`}
                            >
                              STAGE: {columns.find((c) => c.id === task.columnId)?.title || task.status}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-normal line-clamp-2">
                            {task.description}
                          </p>
                        </div>

                        <div className="mt-3.5 space-y-2">
                          {(subtasksCount > 0 || commentsCount > 0) && (
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                              {subtasksCount > 0 && (
                                <span>☑️ {completedSubtasksCount}/{subtasksCount} subtasks</span>
                              )}
                              {commentsCount > 0 && (
                                <span>💬 {commentsCount} comments</span>
                              )}
                            </div>
                          )}

                          <div className="border-t border-slate-100 dark:border-white/5 pt-2 flex items-center justify-between text-[11px]">
                            {task.dueDate ? (
                              <span className={`font-semibold text-[10px] ${overdue ? "text-red-600 dark:text-red-400 animate-pulse" : "text-slate-500"}`}>
                                📅 {task.dueDate} {overdue && "(OVERDUE)"}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">No due date</span>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(task);
                              }}
                              className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-2.5 py-1 text-[11px] font-semibold transition shadow-2xs cursor-pointer"
                            >
                              Mark as {task.status === "pending" ? "done" : "pending"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Task Detail Modal */}
        {selectedDetailTask && (
          <TaskDetailModal
            task={selectedDetailTask}
            onClose={() => setSelectedDetailTask(null)}
            currentUserEmail={user?.email}
            currentRole="viewer"
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
