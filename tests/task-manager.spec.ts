import { test, expect } from "@playwright/test";

test.describe("TaskFlow End-to-End Task Manager", () => {
  // Clear localStorage before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("should handle bad login credentials and show error", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "invalid@user.com");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');
    
    const errorAlert = page.locator('p:has-text("Invalid email")');
    await expect(errorAlert).toBeVisible();
  });

  test("should protect dashboard routes from unauthenticated users", async ({ page }) => {
    await page.goto("/assigner/dashboard");
    await page.waitForURL("/login");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should support complete Assigner & Viewer E2E task workflow", async ({ page }) => {
    // 1. Log in as Assigner
    await page.goto("/login");
    await page.fill("#email", "assigner@taskflow.com");
    await page.fill("#password", "password123");
    await page.click('button[type="submit"]');

    // Wait for redirect to Assigner dashboard
    await page.waitForURL("/assigner/dashboard");
    await expect(page.locator("h1")).toContainText("Assigner Dashboard");

    // Create a new task assigned to Maya (viewer@taskflow.com)
    const taskTitle = `Playwright E2E Task - ${Date.now()}`;
    await page.fill('input[placeholder*="Design Landing Page"]', taskTitle);
    await page.selectOption("select", "viewer@taskflow.com");
    await page.fill("textarea", "This task was created by automated Playwright test.");
    await page.click('button:has-text("Add task")');

    // Verify task is added to the list
    await expect(page.locator(`h3:has-text("${taskTitle}")`)).toBeVisible();
    await expect(page.locator("article").first()).toContainText("viewer@taskflow.com");
    
    // Log out of Assigner
    await page.click('button:has-text("Log out")');
    await page.waitForURL("/");

    // 2. Log in as Viewer (Maya)
    await page.goto("/login");
    await page.fill("#email", "viewer@taskflow.com");
    await page.fill("#password", "password123");
    await page.click('button[type="submit"]');

    // Wait for redirect to Viewer dashboard
    await page.waitForURL("/viewer/dashboard");
    await expect(page.locator("h1")).toContainText("Viewer Dashboard");

    // Find the newly assigned task card and verify status is pending
    const taskCard = page.locator("article", { hasText: taskTitle });
    await expect(taskCard).toBeVisible();
    await expect(taskCard.locator('span:has-text("pending")')).toBeVisible();

    // Mark task as done
    await taskCard.locator('button:has-text("Mark as done")').click();

    // Verify status changes to done
    await expect(taskCard.locator('span:has-text("done")')).toBeVisible();

    // Log out of Viewer
    await page.click('button:has-text("Log out")');
    await page.waitForURL("/");

    // 3. Log in as Assigner again to verify and delete the task
    await page.goto("/login");
    await page.fill("#email", "assigner@taskflow.com");
    await page.fill("#password", "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/assigner/dashboard");

    // Locate the task card and verify it's marked as done
    const updatedCard = page.locator("article", { hasText: taskTitle });
    await expect(updatedCard).toBeVisible();
    await expect(updatedCard.locator('span:has-text("done")')).toBeVisible();

    // Delete the task
    await updatedCard.locator('button:has-text("Delete")').click();

    // Verify the task card is removed
    await expect(page.locator(`h3:has-text("${taskTitle}")`)).not.toBeVisible();

    // Log out
    await page.click('button:has-text("Log out")');
    await page.waitForURL("/");
  });
});
