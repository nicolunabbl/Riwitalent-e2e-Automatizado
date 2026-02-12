import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

const ENV = process.env.ENV || "qa";
const baseURLs: Record<string, string> = {
  dev: "https://dev.talent.riwi.io",
  qa: "https://qa.talent.riwi.io",
  // prod: 'https://talent.riwi.io',
};

export default defineConfig({
  testDir: "./tests-e2e/specs",
  fullyParallel: true,
  retries: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "./tests-e2e/reports/html" }],
  ],
  use: {
    baseURL: baseURLs[ENV],
    trace: "on-first-retry",
    video: "on",
    screenshot: "on",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    locale: "es-ES",
    testIdAttribute: "data-test-id",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // { name: 'chrome', use: { channel: 'chrome' } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'msedge', use: { channel: 'msedge' } }
    // Brave opcional: usar channel/executablePath si se requiere
  ],
});
