import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

const ENV = process.env.ENV || "qa";
const baseURLs: Record<string, string> = {
  dev: "https://dev.talent.riwi.io",
  qa: "https://qa.talent.riwi.io",
  // prod: 'https://talent.riwi.io',
};

export default defineConfig({

  fullyParallel: true,
  retries: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "./reports/html" }],
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
    {
      name: 'RiwiTalent',
      testDir: './RiwiTalent/specs',
      use: {
        baseURL: baseURLs.qa,
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'RiwiJoin',
      testDir: './RiwiJoin/specs',
      use: {
        baseURL: 'https://join.riwi.io/register',
        ...devices['Desktop Chrome'],
        launchOptions: { slowMo: 800 },
      },
    },
    {
      name: 'RiwiJoin-Performance',
      testDir: './RiwiJoin/specs',
      testMatch: '**/PruebaRendimiento150.spec.ts',
      retries: 0,
      workers: 60,
      timeout: 60_000,
      use: {
        baseURL: 'https://join.riwi.io',
        ...devices['Desktop Chrome'],
        headless: true,
        video: 'off',
        screenshot: 'only-on-failure',
      },
    },
    {
      name: 'RiwiMind',
      testDir: './RiwiMind/specs',
      use: {
        baseURL: 'https://qa.mind.riwi.io',
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
