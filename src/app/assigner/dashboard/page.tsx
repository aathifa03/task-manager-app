"use client";

import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import {
  subscribeToTasks,
  createTask,
  deleteTask,
  moveTask,
  updateTask,
} from "@/services/task.service";
import {
  getColumns,
  createColumn,
  deleteColumn,
  updateColumn,
} from "@/services/column.service";
import { getViewers } from "@/services/auth.service";
import { Task, User, KanbanColumn, IssueType } from "@/types";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import TaskDetailModal from "@/components/TaskDetailModal";
import AnalyticsView from "@/components/AnalyticsView";
import toast from "react-hot-toast";

export default function AssignerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [viewers, setViewers] = useState<User[]>([]);

  // View Switcher State
  const [viewMode, setViewMode] = useState<"cards" | "kanban" | "analytics">("cards");

  // Selected Task for Detail Modal
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);

  // Create Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [issueType, setIssueType] = useState<IssueType>("task");
  const [dueDate, setDueDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete Confirmation Modal State
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Column State
  const [isAddColumnMode, setIsAddColumnMode] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "done">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [sortBy, setSortBy] = useState<"newest" | "dueDate" | "priority">("newest");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const initDashboard = async () => {
      try {
        setIsLoading(true);
        await fetchColumns();
        const fetchedViewers = await getViewers();
        setViewers(fetchedViewers);
        if (fetchedViewers.length > 0) {
          setAssignedTo(fetchedViewers[0].email);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }

      unsubscribe = subscribeToTasks("assigner", user?.email || "", (liveTasks) => {
        setTasks(liveTasks);
        setIsLoading(false);

        // Keep detail modal task data in sync
        if (selectedDetailTask) {
          const updated = liveTasks.find((t) => t.id === selectedDetailTask.id);
          if (updated) setSelectedDetailTask(updated);
        }
      });
    };

    if (user) {
      initDashboard();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleAddTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title || !description || !assignedTo) {
      setErrorMsg("Please fill in all required task fields.");
      toast.error("Please fill in all required task fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createTask({
        title,
        description,
        assignedTo,
        priority,
        issueType,
        dueDate: dueDate || null,
      } as any);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setIssueType("task");
      setSuccessMsg("Task created and assigned successfully!");
      toast.success("Task created and assigned successfully!");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message ?? err.message ?? "Failed to create task.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      const newStatus = task.status === "pending" ? "done" : "pending";
      await updateTask(task.id, { status: newStatus });
      toast.success(`Task marked as ${newStatus}.`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to update task status.");
      toast.error("Failed to update task status.");
    }
  };

  const onRequestDeleteTask = (taskId: string) => {
    setTaskToDeleteId(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDeleteId) return;
    try {
      setIsDeleting(true);
      await deleteTask(taskToDeleteId);
      setSuccessMsg("Task deleted successfully.");
      toast.success("Task deleted successfully.");
      setTaskToDeleteId(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to delete task.");
      toast.error("Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddColumnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    try {
      const newCol = await createColumn(newColumnTitle.trim());
      setColumns((prev) => [...prev, newCol]);
      setNewColumnTitle("");
      setIsAddColumnMode(false);
      toast.success("Column added.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add column.");
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

  // Filter & Search Logic
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && (task.priority || "medium") !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = task.description.toLowerCase().includes(query);
      const matchAssignee = (task.assignedToName || "").toLowerCase().includes(query) || task.assignedTo.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchAssignee) return false;
    }
    return true;
  });

  // Sorting Logic
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
    <ProtectedRoute roles={["assigner"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar />

        <main className="px-3 py-4 sm:py-5 sm:px-6 relative overflow-hidden">
          <section className="mx-auto max-w-7xl px-0 sm:px-2 lg:px-4">
            {/* Header info & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold bg-linear-to-r from-blue-600 to-violet-600 dark:from-blue-300 dark:to-violet-300 bg-clip-text text-transparent">
                  Assigner Dashboard (Jira Mode)
                </h1>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>. Plan, prioritize, and track issue progress.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {/* View Switcher Tabs */}
                <div className="flex rounded-lg bg-slate-200/70 dark:bg-white/5 p-1 text-xs">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                      viewMode === "cards"
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    🎴 Cards
                  </button>
                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                      viewMode === "kanban"
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    📊 Board
                  </button>
                  <button
                    onClick={() => setViewMode("analytics")}
                    className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                      viewMode === "analytics"
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    📈 Analytics
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs px-3.5 py-2 shadow-sm shadow-blue-500/20 transition active:scale-[0.98] cursor-pointer"
                >
                  <span className="text-sm leading-none">＋</span> Create Issue
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <section className="grid gap-2.5 sm:gap-3 grid-cols-3 mb-4">
              <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-3 shadow-2xs">
                <p className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  Total Issues
                </p>
                <p className="mt-0.5 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{totalTasks}</p>
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-3 shadow-2xs">
                <p className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
                  In Progress / Pending
                </p>
                <p className="mt-0.5 text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-300">{pendingTasks}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 p-3 shadow-2xs">
                <p className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                  Completed
                </p>
                <p className="mt-0.5 text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-300">{completedTasks}</p>
              </div>
            </section>

            {/* Main Content Area based on View Mode */}
            {viewMode === "analytics" ? (
              <AnalyticsView tasks={tasks} />
            ) : viewMode === "kanban" ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  {!isAddColumnMode ? (
                    <button
                      onClick={() => setIsAddColumnMode(true)}
                      className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      ＋ Add Custom Column
                    </button>
                  ) : (
                    <form onSubmit={handleAddColumnSubmit} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Column name..."
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1 text-xs outline-none"
                      />
                      <button type="submit" className="rounded-lg bg-blue-600 text-white px-3 py-1 text-xs font-bold">Add</button>
                      <button type="button" onClick={() => setIsAddColumnMode(false)} className="text-xs text-slate-400">Cancel</button>
                    </form>
                  )}
                </div>
                <KanbanBoard tasks={tasks} columns={columns} onMoveTask={handleMoveTask} />
              </div>
            ) : (
              /* Cards View */
              <div className="space-y-4">
                {/* Search, Sort & Filter Toolbar */}
                <div className="space-y-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="🔍 Search issues by title, description or assignee..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
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
                              ? "bg-blue-600 text-white"
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
                              ? "bg-violet-600 text-white"
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
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-blue-500" />
                  </div>
                ) : sortedTasks.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-8 text-center text-slate-500 dark:text-slate-400">
                    <p className="text-sm font-bold">No issues found</p>
                    <p className="text-xs mt-0.5">Click "+ Create Issue" above to add your first task!</p>
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
                          className={`group relative flex flex-col justify-between rounded-xl border p-3.5 shadow-2xs transition duration-200 hover:border-blue-500/50 cursor-pointer ${
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
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                  {task.title}
                                </h3>
                              </div>

                              <span
                                className={`rounded-full px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                                  task.status === "done"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>

                            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-normal line-clamp-2">
                              {task.description}
                            </p>
                          </div>

                          <div className="mt-3.5 space-y-2">
                            {/* Subtask & Comments Count Indicator */}
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

                            <div className="border-t border-slate-100 dark:border-white/5 pt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                              <span className="text-slate-500 dark:text-slate-400">
                                Assigned: <strong className="text-slate-700 dark:text-slate-200">{task.assignedToName}</strong>
                              </span>

                              {task.dueDate && (
                                <span className={`font-semibold text-[10px] ${overdue ? "text-red-600 dark:text-red-400 animate-pulse" : "text-slate-500"}`}>
                                  📅 {task.dueDate} {overdue && "(OVERDUE)"}
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleToggleStatus(task)}
                                className="rounded-lg border border-blue-300 dark:border-blue-500/30 px-2.5 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 cursor-pointer"
                              >
                                Mark as {task.status === "pending" ? "done" : "pending"}
                              </button>

                              <button
                                onClick={() => onRequestDeleteTask(task.id)}
                                className="rounded-lg border border-red-300 dark:border-red-500/30 px-2.5 py-1 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                              >
                                Delete
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
          </section>
        </main>

        {/* Task Detail Modal */}
        {selectedDetailTask && (
          <TaskDetailModal
            task={selectedDetailTask}
            onClose={() => setSelectedDetailTask(null)}
            currentUserEmail={user?.email}
            currentRole="assigner"
          />
        )}

        {/* Create Task Modal Popup */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in">
            <div className="relative w-full max-w-md rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3 mb-3">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-semibold">＋</span>
                  Create Jira Issue
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fix authentication token refresh"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Issue Type
                    </label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value as IssueType)}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="task">📌 Task</option>
                      <option value="bug">🐞 Bug</option>
                      <option value="feature">✨ Feature</option>
                      <option value="improvement">⚡ Improvement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Assign To (Viewer)
                    </label>
                    {viewers.length === 0 ? (
                      <div className="text-[10px] text-amber-600 dark:text-amber-300/80 border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-2 rounded-lg">
                        No Viewers registered.
                      </div>
                    ) : (
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 cursor-pointer"
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
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe issue reproduction steps or details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full min-h-20 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-white/10 pt-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || viewers.length === 0}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    {isSubmitting ? "Creating..." : "Create Issue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Glassmorphic Modal */}
        {taskToDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in">
            <div className="relative w-full max-w-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-xl text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Issue?</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Are you sure you want to delete this issue? This action cannot be undone.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setTaskToDeleteId(null)}
                  disabled={isDeleting}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteTask}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-600 hover:bg-red-500 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Issue"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
