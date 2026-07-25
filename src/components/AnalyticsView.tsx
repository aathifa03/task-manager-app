"use client";

import { Task } from "@/types";

interface AnalyticsViewProps {
  tasks: Task[];
}

export default function AnalyticsView({ tasks }: AnalyticsViewProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const bugs = tasks.filter((t) => t.issueType === "bug").length;
  const features = tasks.filter((t) => t.issueType === "feature").length;
  const improvements = tasks.filter((t) => t.issueType === "improvement").length;
  const standardTasks = tasks.filter((t) => !t.issueType || t.issueType === "task").length;

  const highPriority = tasks.filter((t) => t.priority === "high").length;
  const mediumPriority = tasks.filter((t) => !t.priority || t.priority === "medium").length;
  const lowPriority = tasks.filter((t) => t.priority === "low").length;

  const overdueCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;
    const due = new Date(t.dueDate);
    due.setHours(23, 59, 59, 999);
    return due < new Date();
  }).length;

  return (
    <div className="space-y-4">
      {/* Top Banner Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
            Completion Rate
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{completionRate}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
            Completed Tasks
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-300">{completed} / {total}</p>
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
            In Progress / Pending
          </p>
          <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-300">{pending}</p>
        </div>

        <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
            Overdue Risks
          </p>
          <p className="mt-1 text-2xl font-black text-red-600 dark:text-red-400">{overdueCount}</p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Issue Type Distribution */}
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>🏷️</span> Issue Types Distribution
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">🐞 Bugs</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{bugs}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">✨ Features</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{features}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">⚡ Improvements</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{improvements}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">📌 Standard Tasks</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{standardTasks}</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>🚨</span> Priority Breakdown
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-red-600 dark:text-red-400">High Priority</span>
              <span className="font-bold">{highPriority}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-amber-600 dark:text-amber-400">Medium Priority</span>
              <span className="font-bold">{mediumPriority}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-600 dark:text-blue-400">Low Priority</span>
              <span className="font-bold">{lowPriority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
