"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn as ColumnType, Task } from "@/types";
import KanbanColumnComponent from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

interface KanbanBoardProps {
  columns: ColumnType[];
  tasks: Task[];
  isViewer?: boolean;
  onMoveTask: (taskId: string, columnId: string, position?: number) => void;
  onToggleStatus?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  onRenameColumn?: (columnId: string, title: string) => void;
  showColumnControls?: boolean;
  addColumnButton?: React.ReactNode;
}

export default function KanbanBoard({
  columns,
  tasks,
  isViewer = false,
  onMoveTask,
  onToggleStatus,
  onDelete,
  onDeleteColumn,
  onRenameColumn,
  showColumnControls = false,
  addColumnButton,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => a.position - b.position),
    [columns]
  );

  // Build a map: columnId -> tasks
  const columnTaskMap = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const col of sortedColumns) {
      map[col.id] = tasks.filter(
        (t) => (t.columnId || "col-todo") === col.id
      );
    }
    // Tasks with columnId not matching any existing column go to first column
    const firstColId = sortedColumns[0]?.id || "col-todo";
    const unassigned = tasks.filter(
      (t) => !sortedColumns.find((c) => c.id === (t.columnId || "col-todo"))
    );
    if (unassigned.length > 0) {
      map[firstColId] = [...(map[firstColId] || []), ...unassigned];
    }
    return map;
  }, [tasks, sortedColumns]);

  const activeTask = useMemo(
    () => (activeId ? tasks.find((t) => t.id === activeId) : null),
    [activeId, tasks]
  );

  const findColumnId = useCallback(
    (taskId: string): string | null => {
      for (const [colId, colTasks] of Object.entries(columnTaskMap)) {
        if (colTasks.some((t) => t.id === taskId)) return colId;
      }
      return null;
    },
    [columnTaskMap]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeIdStr = active.id as string;
      const overId = over.id as string;

      // Find which column the active task is in
      const activeColId = findColumnId(activeIdStr);
      if (!activeColId) return;

      // Determine droppable column
      let overColId: string | null = null;
      if (sortedColumns.some((c) => c.id === overId)) {
        overColId = overId;
      } else {
        overColId = findColumnId(overId);
      }

      if (!overColId || activeColId === overColId) return;

      // Move to new column (position 0 — top)
      onMoveTask(activeIdStr, overColId, 0);
    },
    [findColumnId, onMoveTask, sortedColumns]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeIdStr = active.id as string;
      const overId = over.id as string;

      // If dropped on a column directly, move to that column at top
      if (sortedColumns.some((c) => c.id === overId)) {
        const currentCol = findColumnId(activeIdStr);
        if (currentCol !== overId) {
          onMoveTask(activeIdStr, overId, 0);
        }
        return;
      }

      // If dropped on another task, reorder
      if (activeIdStr !== overId) {
        const overColId = findColumnId(overId);
        if (overColId) {
          const tasksInCol = columnTaskMap[overColId] || [];
          const overIndex = tasksInCol.findIndex((t) => t.id === overId);
          const position = overIndex >= 0 ? overIndex : 0;
          onMoveTask(activeIdStr, overColId, position);
        }
      }
    },
    [findColumnId, onMoveTask, sortedColumns, columnTaskMap]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {sortedColumns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            tasks={columnTaskMap[column.id] || []}
            isViewer={isViewer}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onDeleteColumn={onDeleteColumn}
            onRenameColumn={onRenameColumn}
            showColumnControls={showColumnControls}
          />
        ))}

        {/* Add Column Button */}
        {addColumnButton && (
          <div className="shrink-0 w-72 flex items-start pt-2">
            {addColumnButton}
          </div>
        )}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="w-72 rotate-3 shadow-xl">
            <KanbanCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
