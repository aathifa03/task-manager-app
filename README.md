# TaskFlow - Modern Task Management Web Application

TaskFlow is a production-grade, full-stack Task Management application built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and an **Express.js REST API backend**. 

It features Role-Based Access Control (**Assigner** vs. **Viewer**) and a **zero-cloud temporary memory data layer** (data is reset whenever the server process is restarted).

---

## ⚡ Highlights & Key Features

* **Role-Based Access Control (RBAC):**
  * **Assigner Role:** Create tasks, assign them to team members (viewers), filter by status, and delete tasks.
  * **Viewer Role:** Focused dashboard displaying only tasks assigned to the logged-in viewer with quick one-click status toggling (`pending` ⇄ `done`).
* **Temporary Data Layer (Zero Cloud / No External Dependencies):** Data is managed in-memory by the Express backend (`server/data.js`), pre-seeded with default demo data, and resets when the backend restarts.
* **Modern UI & Aesthetic Experience:** Dark/Light theme toggle, responsive layout, glassmorphic styling, stats counters, and smooth micro-animations.
* **End-to-End Testing (Playwright):** Pre-configured automated E2E test suite covering login validation, route guards, and full task lifecycle.

---

## 🏗️ System Architecture

```
  ┌──────────────────────────────┐              ┌─────────────────────────────┐
  │   Next.js 16 (Port 3000)     │              │    Express API (Port 5000)  │
  │   App Router / TypeScript    ├─────────────►│    JWT Auth & Rest Endpoints │
  └──────────────────────────────┘   HTTP REST  └──────────────┬──────────────┘
                                                               │
                                                               ▼
                                                     In-Memory Data Store
                                                    (users = [], tasks = [])
```

---

## 🚀 Quick Start & Running the Application

### 1. Install Dependencies

```bash
# Install root (client) dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### 2. Start Both Client & Server (Unified Command)

Run a single command in the root folder to start both the Next.js frontend (port 3000) and the Express backend (port 5000):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Demo Credentials

For quick evaluation during interviews or testing, the backend is pre-populated with these default accounts (Password: `password123`):

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Assigner** | `assigner@taskflow.com` | `password123` | Create, Edit, Delete & Assign tasks to anyone |
| **Viewer** | `viewer@taskflow.com` | `password123` | View assigned tasks & update completion status |

---

## 🧪 Running End-to-End Tests

The repository includes a complete Playwright test suite validating user flows, invalid credentials, protected route guards, and real-time task lifecycle.

```bash
# Run Playwright tests headlessly
npm run test

# Run Playwright tests with UI Mode
npx playwright test --ui
```

---

## 📄 License
ISC License © 2026 TaskFlow.
