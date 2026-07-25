const express = require("express");
const { tasks, users, columns, save } = require("../data");
const authenticateToken = require("../middleware/authenticateToken");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// Get tasks based on user role
router.get("/", authenticateToken, (req, res) => {
  try {
    if (req.user.role === "assigner") {
      res.status(200).json(tasks);
    } else {
      const viewerTasks = tasks.filter(
        (task) => task.assignedTo.toLowerCase() === req.user.email.toLowerCase()
      );
      res.status(200).json(viewerTasks);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks." });
  }
});

// Create a task (Assigner only)
router.post("/", authenticateToken, requireRole(["assigner"]), (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, issueType, subtasks } = req.body;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({
        message: "Title, description, and assignee email are required.",
      });
    }

    const assignee = users.find(
      (u) => u.email.toLowerCase() === assignedTo.toLowerCase() && u.role === "viewer"
    );

    const newTask = {
      id: "t" + Date.now(),
      title: title.trim(),
      description: description.trim(),
      status: "pending",
      issueType: ["task", "bug", "feature", "improvement"].includes(issueType) ? issueType : "task",
      priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
      dueDate: dueDate || null,
      assignedTo: assignedTo.toLowerCase().trim(),
      assignedToName: assignee ? assignee.name : assignedTo.split("@")[0],
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      comments: [],
      activityLog: [
        {
          id: "act-" + Date.now(),
          action: `Created by ${req.user.name}`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task." });
  }
});

// Move a task between columns or reorder within a column (Assigner only)
router.put("/move/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { columnId, position } = req.body;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found." });
    }

    const task = tasks[taskIndex];

    if (req.user.role === "viewer") {
      if (task.assignedTo.toLowerCase() !== req.user.email.toLowerCase()) {
        return res.status(403).json({ message: "Forbidden: You can only move tasks assigned to you." });
      }
      if (columnId !== "col-done" && columnId !== undefined) {
        return res.status(403).json({ message: "Viewers can only move tasks to Done." });
      }
      task.columnId = "col-done";
      task.status = "done";
      save();
      return res.status(200).json(task);
    }

    if (req.user.role !== "assigner") {
      return res.status(403).json({ message: "Forbidden: Invalid role." });
    }

    if (columnId !== undefined) {
      task.columnId = columnId;
      if (columnId === "col-done") {
        task.status = "done";
      } else if (task.status === "done" && columnId !== "col-done") {
        task.status = "pending";
      }
    }
    if (position !== undefined) {
      task.position = position;
    }

    save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error moving task." });
  }
});

// Add comment to a task (Assigner or Assigned Viewer)
router.post("/:id/comments", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty." });
    }

    if (
      req.user.role === "viewer" &&
      task.assignedTo.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({ message: "Forbidden: You can only comment on tasks assigned to you." });
    }

    if (!Array.isArray(task.comments)) {
      task.comments = [];
    }

    const newComment = {
      id: "c-" + Date.now(),
      authorName: req.user.name,
      authorEmail: req.user.email,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    task.comments.push(newComment);

    if (!Array.isArray(task.activityLog)) {
      task.activityLog = [];
    }
    task.activityLog.push({
      id: "act-" + Date.now(),
      action: `Comment added by ${req.user.name}`,
      timestamp: new Date().toISOString(),
    });

    save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment." });
  }
});

// Update a task (Assigner or Viewer)
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found." });
    }

    const task = tasks[taskIndex];
    if (!Array.isArray(task.activityLog)) {
      task.activityLog = [];
    }

    if (req.user.role === "assigner") {
      const { title, description, status, priority, dueDate, assignedTo, issueType, subtasks, columnId, position } = req.body;

      if (title !== undefined) task.title = title.trim();
      if (description !== undefined) task.description = description.trim();
      if (status !== undefined) {
        if (!["pending", "done"].includes(status)) {
          return res.status(400).json({ message: "Status must be pending or done." });
        }
        if (task.status !== status) {
          task.activityLog.push({
            id: "act-" + Date.now(),
            action: `Status changed to ${status} by ${req.user.name}`,
            timestamp: new Date().toISOString(),
          });
        }
        task.status = status;
      }
      if (issueType !== undefined) task.issueType = issueType;
      if (subtasks !== undefined && Array.isArray(subtasks)) task.subtasks = subtasks;
      if (priority !== undefined && ["low", "medium", "high"].includes(priority)) {
        task.priority = priority;
      }
      if (dueDate !== undefined) {
        task.dueDate = dueDate || null;
      }
      if (assignedTo !== undefined) {
        const assignee = users.find(
          (u) => u.email.toLowerCase() === assignedTo.toLowerCase() && u.role === "viewer"
        );
        task.assignedTo = assignedTo.toLowerCase().trim();
        task.assignedToName = assignee ? assignee.name : assignedTo.split("@")[0];
      }
      if (columnId !== undefined) task.columnId = columnId;
      if (position !== undefined) task.position = position;

      save();
      return res.status(200).json(task);
    } else if (req.user.role === "viewer") {
      if (task.assignedTo.toLowerCase() !== req.user.email.toLowerCase()) {
        return res.status(403).json({
          message: "Forbidden: You can only update tasks assigned to you.",
        });
      }

      const { status, subtasks } = req.body;
      if (status !== undefined) {
        if (!["pending", "done"].includes(status)) {
          return res.status(400).json({ message: "Status must be pending or done." });
        }
        task.status = status;
        task.activityLog.push({
          id: "act-" + Date.now(),
          action: `Status changed to ${status} by ${req.user.name}`,
          timestamp: new Date().toISOString(),
        });
      }

      if (subtasks !== undefined && Array.isArray(subtasks)) {
        task.subtasks = subtasks;
      }

      save();
      return res.status(200).json(task);
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid role." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating task." });
  }
});

// Delete a task (Assigner only)
router.delete("/:id", authenticateToken, requireRole(["assigner"]), (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found." });
    }

    tasks.splice(taskIndex, 1);
    save();
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task." });
  }
});

module.exports = router;
