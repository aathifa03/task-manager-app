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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as any,
  };

  const isOverdue = (t: Task) => {
    if (!t.dueDate || t.status === "done") return false;
    const due = new Date(t.dueDate);
    due.setHours(23, 59, 59, 999);
    return due < new Date();
  };

  const overdue = isOverdue(task);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-xl border p-3.5 shadow-xs transition duration-200 cursor-grab active:cursor-grabbing ${
        overdue
          ? "border-red-400 dark:border-red-500/50 bg-red-50/30 dark:bg-red-500/10"
          : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 hover:border-blue-300 dark:hover:border-blue-500/40"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug flex-1">
          {task.title}
        </h4>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
              task.status === "done"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            }`}
          >
            {task.status}
          </span>

          {task.priority && (
            <span
              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                task.priority === "high"
                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                  : task.priority === "low"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              }`}
            >
              {task.priority}
            </span>
          )}
        </div>
      </div>

      {task.description && (
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 border-t border-slate-100 dark:border-white/5 pt-2.5 text-xs">
        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[50%]">
          {task.assignedToName || task.assignedTo}
        </span>

        {task.dueDate && (
          <span
            className={`font-semibold text-[10px] ${
              overdue ? "text-red-600 dark:text-red-400" : "text-slate-500"
            }`}
          >
            {task.dueDate}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-2.5 flex items-center gap-2">
        {!isViewer && onToggleStatus && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(task);
            }}
            title={task.status === "done" ? "Mark pending" : "Mark done"}
            className="rounded-lg border border-emerald-300 dark:border-emerald-500/30 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer transition"
          >
            ✓ {task.status === "done" ? "Undo" : "Done"}
          </button>
        )}

        {isViewer && onToggleStatus && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(task);
            }}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-3 py-1 text-[10px] font-semibold transition cursor-pointer"
          >
            ✓ Mark {task.status === "done" ? "Pending" : "Done"}
          </button>
        )}

        {!isViewer && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="rounded-lg border border-red-300 dark:border-red-500/30 px-2.5 py-1 text-[10px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
