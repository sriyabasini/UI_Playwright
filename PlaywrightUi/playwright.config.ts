import { defineConfig } from "@playwright/test";
import { frameworkConfig } from "./src/config/frameworkConfig";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/playwright-report", open: "never" }]
  ],
  timeout: frameworkConfig.navigationTimeoutMs * 2,
  expect: {
    timeout: frameworkConfig.navigationTimeoutMs
  },
  outputDir: "test-results",
  use: {
    baseURL: frameworkConfig.baseUrl,
    browserName: frameworkConfig.browser,
    headless: frameworkConfig.headless,
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  }
});
