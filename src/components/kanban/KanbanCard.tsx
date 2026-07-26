"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";

interface KanbanCardProps {
  task: Task;
  onToggleStatus?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isViewer?: boolean;
}

export default function KanbanCard({
  task,
  onToggleStatus,
  onDelete,
  isViewer = false,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : ("auto" as any),
  };

  // Due status checks
  const isOverdue = (t: Task) => {
    if (!t.dueDate || t.status === "done") return false;
    const due = new Date(t.dueDate);
    due.setHours(23, 59, 59, 999);
    return due < new Date();
  };

  const isDueSoon = (t: Task) => {
    if (!t.dueDate || t.status === "done" || isOverdue(t)) return false;
    const due = new Date(t.dueDate).getTime();
    const now = new Date().getTime();
    const hoursLeft = (due - now) / (1000 * 60 * 60);
    return hoursLeft >= 0 && hoursLeft <= 48;
  };

  const overdue = isOverdue(task);
  const dueSoon = isDueSoon(task);

  // Subtask calculations
  const subtasks = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Comments count
  const commentsCount = task.comments?.length || 0;

  // Formatted Issue Key (e.g. TF-101)
  const formatIssueKey = (id: string) => {
    const num = id.replace(/\D/g, "").slice(-3) || "101";
    return `TF-${num}`;
  };

  // Assignee Avatar Initial
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative rounded-xl border p-3.5 shadow-2xs transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md ${
        overdue
          ? "border-red-400 dark:border-red-500/50 bg-red-50/30 dark:bg-red-500/10"
          : dueSoon
          ? "border-amber-400 dark:border-amber-500/50 bg-amber-50/20 dark:bg-amber-500/10"
          : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 hover:border-blue-400 dark:hover:border-blue-500/40"
      }`}
    >
      {/* Top Header: Issue Key, Type & Priority */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-extrabold text-slate-400 dark:text-slate-500">
            {formatIssueKey(task.id)}
          </span>
          {getIssueBadge(task.issueType)}
        </div>

        <div className="flex items-center gap-1">
          {dueSoon && (
            <span className="animate-pulse bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded text-[9px] font-black uppercase">
              ⚠️ Due Soon
            </span>
          )}

          <span
            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
              task.priority === "high"
                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                : task.priority === "low"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            }`}
          >
            {task.priority || "medium"}
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Subtask Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
            <span>☑️ Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks} ({progressPercent}%)</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Info: Assignee Avatar, Comments Count & Due Date */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div
            className="grid h-5 w-5 place-items-center rounded-full bg-linear-to-br from-blue-500 to-violet-600 text-[9px] font-black text-white shadow-2xs"
            title={`Assigned to ${task.assignedToName || task.assignedTo}`}
          >
            {getInitials(task.assignedToName || task.assignedTo)}
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[90px]">
            {task.assignedToName || task.assignedTo.split("@")[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {commentsCount > 0 && (
            <span className="text-slate-400 font-semibold" title={`${commentsCount} comments`}>
              💬 {commentsCount}
            </span>
          )}

          {task.dueDate && (
            <span
              className={`font-semibold ${
                overdue
                  ? "text-red-600 dark:text-red-400 animate-pulse font-bold"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              📅 {task.dueDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
