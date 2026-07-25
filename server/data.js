const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_PATH = path.join(__dirname, "db.json");

let users = [];
let tasks = [];
let columns = [];

const save = () => {
  try {
    const data = { users, tasks, columns };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving data to db.json:", error);
  }
};

const load = async () => {
  if (fs.existsSync(DB_PATH)) {
    try {
      const fileData = fs.readFileSync(DB_PATH, "utf8");
      const parsed = JSON.parse(fileData);
      users = parsed.users || [];
      tasks = parsed.tasks || [];
      columns = parsed.columns || [];
      console.log(`Loaded ${users.length} user(s), ${tasks.length} task(s), ${columns.length} column(s) from db.json`);
      return;
    } catch (error) {
      console.error("Error reading db.json, re-initializing:", error);
    }
  }

  // Seed data if db.json doesn't exist
  const hash = await bcrypt.hash("password123", 10);
  const now = new Date().toISOString();

  users = [
    {
      id: "1",
      name: "Aathifa",
      email: "assigner@taskflow.com",
      passwordHash: hash,
      role: "assigner",
    },
    {
      id: "2",
      name: "Maya",
      email: "viewer@taskflow.com",
      passwordHash: hash,
      role: "viewer",
    },
  ];

  columns = [
    { id: "col-todo", title: "To Do", position: 0 },
    { id: "col-progress", title: "In Progress", position: 1 },
    { id: "col-done", title: "Done", position: 2 },
  ];

  tasks = [
    {
      id: "t1",
      title: "Design login screen",
      description: "Build the responsive login screen with a dark glassmorphic design.",
      status: "done",
      priority: "high",
      dueDate: null,
      assignedTo: "viewer@taskflow.com",
      assignedToName: "Maya",
      createdAt: now,
      columnId: "col-done",
      position: 0,
    },
    {
      id: "t2",
      title: "Connect Register API",
      description: "Integrate registration page with Express authentication endpoints.",
      status: "pending",
      priority: "medium",
      dueDate: null,
      assignedTo: "viewer@taskflow.com",
      assignedToName: "Maya",
      createdAt: now,
      columnId: "col-todo",
      position: 0,
    },
  ];

  save();
  console.log("Initialized and saved default seed data to db.json");
};

load();

module.exports = {
  users,
  tasks,
  columns,
  save,
};
