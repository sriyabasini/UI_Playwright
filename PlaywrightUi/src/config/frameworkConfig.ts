import "dotenv/config";

const booleanFromEnv = (name: string, fallback: boolean): boolean => {
  const value = process.env[name];
  if (value === undefined) return fallback;
  if (value.toLowerCase() !== "true" && value.toLowerCase() !== "false") {
    throw new Error(`${name} must be true or false`);
  }
  return value.toLowerCase() === "true";
};

type BrowserName = "chromium" | "firefox" | "webkit";

const browserFromEnv = (value: string | undefined): BrowserName => {
  const browser = value ?? "chromium";
  if (browser === "chromium" || browser === "firefox" || browser === "webkit") {
    return browser;
  }
  throw new Error("BROWSER must be chromium, firefox, or webkit");
};

export const frameworkConfig = {
  baseUrl: process.env.FLIPKART_BASE_URL ?? "https://www.flipkart.com/",
  browser: browserFromEnv(process.env.BROWSER),
  headless: booleanFromEnv("HEADLESS", false),
  testDataFile: process.env.TEST_DATA_FILE ?? "test-data/flipkart-test-data.xlsx",
  allowOrderSubmission: booleanFromEnv("ALLOW_ORDER_SUBMISSION", false),
  navigationTimeoutMs: 30_000
};
