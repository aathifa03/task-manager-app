"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn as ColumnType, Task } from "@/types";
import KanbanCard from "./KanbanCard";
import { useState } from "react";

interface KanbanColumnProps {
  column: ColumnType;
  tasks: Task[];
  isViewer?: boolean;
  onToggleStatus?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  onRenameColumn?: (columnId: string, title: string) => void;
  showColumnControls?: boolean;
}

export default function KanbanColumn({
  column,
  tasks,
  isViewer = false,
  onToggleStatus,
  onDelete,
  onDeleteColumn,
  onRenameColumn,
  showColumnControls = false,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const sortedTasks = [...tasks].sort((a, b) => {
    const posA = a.position ?? 999;
    const posB = b.position ?? 999;
    return posA - posB;
  });

  const taskIds = sortedTasks.map((t) => t.id);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== column.title && onRenameColumn) {
      onRenameColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  // Column status accent colors
  const getColumnAccent = (title: string, id: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("done") || lower.includes("completed") || id === "col-done") {
      return "border-t-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (lower.includes("progress") || lower.includes("in progress")) {
      return "border-t-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    }
    return "border-t-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  };

  const accentClass = getColumnAccent(column.title, column.id);

  return (
    <div
      className={`flex shrink-0 w-72 sm:w-80 flex-col rounded-2xl border-t-4 border-x border-b ${accentClass.split(" ")[0]} ${
        isOver
          ? "border-blue-400 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-500/10"
          : "border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60"
      } transition-all duration-200 shadow-2xs`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-3.5 py-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setEditTitle(column.title);
                  setIsEditing(false);
                }
              }}
              className="rounded-lg border border-blue-400 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-900 dark:text-white outline-none w-full"
            />
          ) : (
            <h3
              className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
              onDoubleClick={() => {
                if (showColumnControls) {
                  setEditTitle(column.title);
                  setIsEditing(true);
                }
              }}
              title="Double-click to rename"
            >
              {column.title}
            </h3>
          )}

          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${accentClass.split(" ").slice(1).join(" ")}`}>
            {tasks.length}
          </span>
        </div>

        {showColumnControls && onDeleteColumn && column.id !== "col-pending" && column.id !== "col-done" && (
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="rounded p-1 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition cursor-pointer text-xs"
            title="Delete Column"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Task List / Drop Area */}
      <div ref={setNodeRef} className="flex-1 p-2.5 space-y-2.5 min-h-[300px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {sortedTasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              isViewer={isViewer}
            />
          ))}
        </SortableContext>

        {sortedTasks.length === 0 && (
          <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-white/10 p-4 text-center text-xs text-slate-400 dark:text-slate-500">
            Drag issues here
          </div>
        )}
      </div>
    </div>
  );
}
