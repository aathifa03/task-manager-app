"use client";

import { useState, FormEvent } from "react";
import { Task, Subtask } from "@/types";
import { updateTask, addCommentToTask } from "@/services/task.service";
import toast from "react-hot-toast";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdateSuccess?: () => void;
  currentUserEmail?: string;
  currentRole?: "assigner" | "viewer";
}

export default function TaskDetailModal({
  task,
  onClose,
  onUpdateSuccess,
  currentUserEmail,
  currentRole,
}: TaskDetailModalProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdatingSubtasks, setIsUpdatingSubtasks] = useState(false);

  // Subtask Progress calculation
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleToggleSubtask = async (index: number) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);

    try {
      setIsUpdatingSubtasks(true);
      await updateTask(task.id, { subtasks: updated });
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subtask status.");
    } finally {
      setIsUpdatingSubtasks(false);
    }
  };

  const handleAddSubtask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: "sub-" + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    const updated = [...subtasks, newSubtask];
    setSubtasks(updated);
    setNewSubtaskTitle("");

    try {
      setIsUpdatingSubtasks(true);
      await updateTask(task.id, { subtasks: updated });
      toast.success("Subtask added.");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add subtask.");
    } finally {
      setIsUpdatingSubtasks(false);
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      await addCommentToTask(task.id, commentText.trim());
      setCommentText("");
      toast.success("Comment posted.");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getIssueBadge = (type?: string) => {
    switch (type) {
      case "bug":
        return <span className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase">🐞 Bug</span>;
      case "feature":
        return <span className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase">✨ Feature</span>;
      case "improvement":
        return <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase">⚡ Improvement</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase">📌 Task</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getIssueBadge(task.issueType)}
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                task.priority === "high"
                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                  : task.priority === "low"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              }`}>
                {task.priority || "medium"}
              </span>
              <span className="text-[10px] text-slate-400">ID: {task.id}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Description & Assignee */}
        <div className="space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-200/60 dark:border-white/5">
            {task.description}
          </p>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Assigned to: <strong className="text-slate-800 dark:text-slate-200">{task.assignedToName}</strong> ({task.assignedTo})</span>
            {task.dueDate && <span>📅 Due: <strong className="text-slate-700 dark:text-slate-300">{task.dueDate}</strong></span>}
          </div>
        </div>

        {/* Subtasks Checklist & Progress Bar */}
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/40 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>☑️</span> Subtasks Checklist
            </h3>
            <span className="text-[10px] font-bold text-slate-500">
              {completedSubtasks}/{totalSubtasks} ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Subtask list */}
          {subtasks.length > 0 ? (
            <div className="space-y-1.5">
              {subtasks.map((sub, idx) => (
                <label
                  key={sub.id || idx}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 p-1.5 rounded transition"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => handleToggleSubtask(idx)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={sub.completed ? "line-through text-slate-400" : ""}>
                    {sub.title}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">No subtasks added yet.</p>
          )}

          {/* Add Subtask Form */}
          <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Add a subtask item..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isUpdatingSubtasks}
              className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-xs font-semibold cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        {/* Comments Section */}
        <div className="space-y-3 pt-1">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>💬</span> Comments & Discussion
          </h3>

          {task.comments && task.comments.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {task.comments.map((c) => (
                <div key={c.id} className="rounded-lg bg-slate-100 dark:bg-white/5 p-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{c.authorName}</span>
                    <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">No comments yet. Start the conversation!</p>
          )}

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 text-xs font-bold transition cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>

        {/* Activity Log Timeline */}
        {task.activityLog && task.activityLog.length > 0 && (
          <div className="border-t border-slate-100 dark:border-white/10 pt-3 space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Activity Log</h4>
            <div className="space-y-1 text-[10px] text-slate-400">
              {task.activityLog.map((act) => (
                <div key={act.id} className="flex items-center justify-between">
                  <span>• {act.action}</span>
                  <span>{new Date(act.timestamp).toLocaleDateString()} {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
