import { expect, test } from "@playwright/test";
import { frameworkConfig } from "../src/config/frameworkConfig";
import { CartPage } from "../src/pages/cartPage";
import { CheckoutPage } from "../src/pages/checkoutPage";
import { HomePage } from "../src/pages/homePage";
import { LoginPage } from "../src/pages/loginPage";
import { PaymentPage } from "../src/pages/paymentPage";
import { SearchResultsPage } from "../src/pages/searchResultsPage";
import type { ScenarioData } from "../src/models/testData";
import { TestDataReader } from "../src/utils/testDataReader";

const testData = new TestDataReader();

async function openApplication(page: import("@playwright/test").Page): Promise<void> {
  await new HomePage(page).open();
  await expect(page.locator("body")).toBeVisible();
}

async function loadLoginData(id: string): Promise<ScenarioData> {
  const data = await testData.getScenario(id);
  if (!data.username || !data.password) {
    throw new Error(`Excel row "${id}" must contain username and password`);
  }
  if (data.username.startsWith("replace-with-") || data.password.startsWith("replace-with-")) {
    throw new Error(`Replace the placeholder credentials in Excel row "${id}" with a test account`);
  }
  return data;
}

test("application launches successfully", async ({ page }) => {
  await openApplication(page);
  expect(page.url()).not.toBe("about:blank");
});

test("guest searches below 10000 and adds a matching mobile to the cart", async ({ page }) => {
  await openApplication(page);
  const data = await testData.getScenario("guest-under-10000");
  await new HomePage(page).search(data.searchTerm);
  const results = new SearchResultsPage(page);
  const range = { min: data.minPrice, max: data.maxPrice };

  await results.assertMatchingPriceExists(range);
  await results.addFirstMatchingProductToCart(range);
  expect(await new CartPage(page).hasItems()).toBe(true);
});

test("guest finds a mobile above 50000", async ({ page }) => {
  await openApplication(page);
  const data = await testData.getScenario("guest-over-50000");
  await new HomePage(page).search(data.searchTerm);
  await new SearchResultsPage(page).assertMatchingPriceExists({
    min: data.minPrice,
    max: data.maxPrice
  });
});

test("registered user login succeeds with Excel credentials", async ({ page }) => {
  await openApplication(page);
  const data = await loadLoginData("valid-user");
  await new HomePage(page).openLogin();
  await new LoginPage(page).login(data.username, data.password);
  await expect(page.getByText(/my account/i).first()).toBeVisible();
});

test("invalid user login is rejected", async ({ page }) => {
  await openApplication(page);
  const data = await loadLoginData("invalid-user");
  await new HomePage(page).openLogin();
  await new LoginPage(page).login(data.username, data.password);
  await expect(page.getByText(/incorrect|invalid|please enter|wrong/i).first()).toBeVisible();
});

test("authenticated order placement uses the configured test payment method", async ({ page }) => {
  test.skip(!frameworkConfig.allowOrderSubmission, "Order placement is disabled by default.");

  const hostname = new URL(frameworkConfig.baseUrl).hostname.toLowerCase();
  if (hostname === "flipkart.com" || hostname.endsWith(".flipkart.com")) {
    throw new Error("Order placement is blocked on production Flipkart; configure a non-production test store.");
  }

  const data = await loadLoginData("order-placement");
  await openApplication(page);
  await new HomePage(page).openLogin();
  await new LoginPage(page).login(data.username, data.password);
  await new HomePage(page).search(data.searchTerm);
  const range = { min: data.minPrice, max: data.maxPrice };
  await new SearchResultsPage(page).addFirstMatchingProductToCart(range);
  const cart = new CartPage(page);
  await cart.open();
  await cart.proceedToCheckout();
  await new CheckoutPage(page).enterAddress(data);
  const payment = new PaymentPage(page);
  await payment.chooseTestMethod(data.paymentMethod);
  await payment.placeOrder();
  await expect(page.getByText(/order confirmed|order placed|thank you for your order/i).first())
    .toBeVisible();
});
