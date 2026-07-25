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

  return (
    <div
      className={`flex shrink-0 w-72 flex-col rounded-2xl border ${
        isOver
          ? "border-blue-400 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-500/10"
          : "border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/60"
      } transition-colors duration-200`}
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
              className="rounded-lg border border-blue-400 bg-white dark:bg-slate-800 px-2 py-0.5 text-sm font-bold text-slate-900 dark:text-white outline-none w-full"
            />
          ) : (
            <h3
              className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
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

          <span className="shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
            {tasks.length}
          </span>
        </div>

        {showColumnControls && onDeleteColumn && (
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition cursor-pointer"
            title="Delete column"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2.5 p-3 min-h-24 overflow-y-auto max-h-[calc(100vh-280px)]"
      >
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

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Drop tasks here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
