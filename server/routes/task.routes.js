const express = require("express");
const { tasks, users } = require("../data");
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
    const { title, description, assignedTo } = req.body;

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
      title,
      description,
      status: "pending",
      assignedTo: assignedTo.toLowerCase(),
      assignedToName: assignee ? assignee.name : assignedTo.split("@")[0],
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task." });
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

    if (req.user.role === "assigner") {
      // Assigner can update everything
      const { title, description, status, assignedTo } = req.body;

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) {
        if (!["pending", "done"].includes(status)) {
          return res.status(400).json({ message: "Status must be pending or done." });
        }
        task.status = status;
      }
      if (assignedTo !== undefined) {
        const assignee = users.find(
          (u) => u.email.toLowerCase() === assignedTo.toLowerCase() && u.role === "viewer"
        );
        task.assignedTo = assignedTo.toLowerCase();
        task.assignedToName = assignee ? assignee.name : assignedTo.split("@")[0];
      }

      return res.status(200).json(task);
    } else if (req.user.role === "viewer") {
      // Viewer can only update status of their own task
      if (task.assignedTo.toLowerCase() !== req.user.email.toLowerCase()) {
        return res.status(403).json({
          message: "Forbidden: You can only update tasks assigned to you.",
        });
      }

      const { status } = req.body;
      if (status === undefined) {
        return res.status(400).json({ message: "Status is required." });
      }

      if (!["pending", "done"].includes(status)) {
        return res.status(400).json({ message: "Status must be pending or done." });
      }

      task.status = status;
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
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task." });
  }
});

module.exports = router;
