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
import toast from "react-hot-toast";

export default function ViewerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

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

          {/* Main View Area: Pure Kanban Board */}
          {isLoading ? (
            <div className="flex h-36 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-violet-500" />
            </div>
          ) : (
            <KanbanBoard tasks={tasks} columns={columns} onMoveTask={handleMoveTask} />
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
