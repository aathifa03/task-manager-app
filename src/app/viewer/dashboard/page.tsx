"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { subscribeToTasks, moveTask } from "@/services/task.service";
import { getColumns } from "@/services/column.service";
import { Task, KanbanColumn } from "@/types";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import TaskDetailModal from "@/components/TaskDetailModal";
import toast from "react-hot-toast";

export default function ViewerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "done">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [sortBy, setSortBy] = useState<"newest" | "dueDate" | "priority">("newest");

  // Selected Task for Detail Modal
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);

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
      if (!matchTitle && !matchDesc) return false;
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

  return (
    <ProtectedRoute roles={["viewer"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold bg-linear-to-r from-violet-600 to-blue-600 dark:from-violet-300 dark:to-blue-300 bg-clip-text text-transparent">
              My Assigned Issues
            </h1>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>. Track work, manage subtasks & leave comments.
            </p>
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

          {/* Search, Sort & Filter Toolbar */}
          <div className="space-y-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-3 shadow-2xs mb-4">
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
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-500">Status:</span>
                {(["all", "pending", "done"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold capitalize transition cursor-pointer ${
                      statusFilter === filter
                        ? "bg-violet-600 text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-500">Priority:</span>
                {(["all", "high", "medium", "low"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold capitalize transition cursor-pointer ${
                      priorityFilter === p
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main View Area: Pure Kanban Board */}
          {isLoading ? (
            <div className="flex h-36 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-violet-500" />
            </div>
          ) : (
            <KanbanBoard
              tasks={sortedTasks}
              columns={columns}
              onMoveTask={handleMoveTask}
              onClickTask={(task) => setSelectedDetailTask(task)}
              isViewer={true}
            />
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
