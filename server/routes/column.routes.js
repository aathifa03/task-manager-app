const express = require("express");
const { columns, save } = require("../data");
const authenticateToken = require("../middleware/authenticateToken");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// Get all columns
router.get("/", authenticateToken, (req, res) => {
  try {
    const sorted = [...columns].sort((a, b) => a.position - b.position);
    res.status(200).json(sorted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching columns." });
  }
});

// Create a new column (Assigner only)
router.post("/", authenticateToken, requireRole(["assigner"]), (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Column title is required." });
    }

    const maxPosition = columns.reduce((max, c) => Math.max(max, c.position), -1);

    const newColumn = {
      id: "col-" + Date.now(),
      title: title.trim(),
      position: maxPosition + 1,
    };

    columns.push(newColumn);
    save();

    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ message: "Error creating column." });
  }
});

// Reorder columns (Assigner only) — MUST come before /:id to match correctly
router.put("/reorder/all", authenticateToken, requireRole(["assigner"]), (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds array is required." });
    }

    orderedIds.forEach((id, index) => {
      const col = columns.find((c) => c.id === id);
      if (col) col.position = index;
    });

    columns.sort((a, b) => a.position - b.position);
    save();

    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ message: "Error reordering columns." });
  }
});

// Update a column (Assigner only)
router.put("/:id", authenticateToken, requireRole(["assigner"]), (req, res) => {
  try {
    const { id } = req.params;
    const { title, position } = req.body;

    const column = columns.find((c) => c.id === id);
    if (!column) {
      return res.status(404).json({ message: "Column not found." });
    }

    if (title !== undefined) column.title = title.trim();
    if (position !== undefined) column.position = position;

    // Re-sort column positions to avoid gaps
    columns.sort((a, b) => a.position - b.position);
    columns.forEach((c, i) => { c.position = i; });

    save();
    res.status(200).json(column);
  } catch (error) {
    res.status(500).json({ message: "Error updating column." });
  }
});

// Delete a column and its tasks (Assigner only)
router.delete("/:id", authenticateToken, requireRole(["assigner"]), (req, res) => {
  try {
    const { id } = req.params;
    const index = columns.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Column not found." });
    }

    columns.splice(index, 1);

    // Prevent orphan tasks — delete tasks in this column too
    const { tasks } = require("../data");
    let i = tasks.length;
    while (i--) {
      if (tasks[i].columnId === id) {
        tasks.splice(i, 1);
      }
    }

    save();
    res.status(200).json({ message: "Column and its tasks deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting column." });
  }
});

module.exports = router;
