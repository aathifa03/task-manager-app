const bcrypt = require("bcryptjs");

const users = [];
const tasks = [];

// Initialize default users and tasks
const initData = async () => {
  const hash = await bcrypt.hash("password123", 10);

  users.push({
    id: "1",
    name: "Aathifa",
    email: "assigner@taskflow.com",
    passwordHash: hash,
    role: "assigner",
  });

  users.push({
    id: "2",
    name: "Maya",
    email: "viewer@taskflow.com",
    passwordHash: hash,
    role: "viewer",
  });

  // Seed tasks
  tasks.push({
    id: "t1",
    title: "Design login screen",
    description: "Build the responsive login screen with a dark glassmorphic design.",
    status: "done",
    assignedTo: "viewer@taskflow.com",
    assignedToName: "Maya",
  });

  tasks.push({
    id: "t2",
    title: "Connect Register API",
    description: "Integrate registration page with Express authentication endpoints.",
    status: "pending",
    assignedTo: "viewer@taskflow.com",
    assignedToName: "Maya",
  });
};

initData();

module.exports = {
  users,
  tasks,
};
