# Playwright TypeScript UI tests

This project uses the Playwright Test runner. Tests are executable TypeScript files in `tests/`, backed by reusable page objects in `src/pages/`.

## Setup

```powershell
npm install
npx playwright install chromium
Copy-Item .env.example .env
npm run setup:test-data
```

Update `.env` and `test-data/flipkart-test-data.xlsx` with the target application URL and any required test account data. Order placement is disabled by default and is blocked against production Flipkart.

## Run tests

```powershell
npm test
npm run test:list
npm run test:orders
npm run typecheck
```

Use `BROWSER=firefox` or `BROWSER=webkit` to select another browser, and `HEADLESS=false` to run with a visible browser. Test results are written to `test-results/`; the HTML report is written to `reports/playwright-report/`.
