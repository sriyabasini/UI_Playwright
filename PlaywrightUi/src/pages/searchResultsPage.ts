import type { Locator, Page } from "playwright";
import { GenericHelper } from "../utils/genericHelper";
import type { PriceRange } from "../utils/genericHelper";
import { BasePage } from "./basePage";

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get productCards(): Locator {
    return this.page.locator("div[data-id]").filter({ hasText: /₹/ });
  }

  async assertMatchingPriceExists(range: PriceRange): Promise<void> {
    const count = await this.productCards.count();
    if (count === 0) throw new Error("No priced mobile listings were found");
    let matchingProducts = 0;
    for (let index = 0; index < count; index += 1) {
      const card = this.productCards.nth(index);
      const priceText = await card.locator(".Nx9bqj, ._30jeq3").first().innerText();
      const price = GenericHelper.parsePrice(priceText);
      if (price >= range.min && price <= range.max) matchingProducts += 1;
    }
    if (matchingProducts === 0) {
      throw new Error(`No mobile listings were priced between ₹${range.min} and ₹${range.max}`);
    }
  }

  async addFirstMatchingProductToCart(range: PriceRange): Promise<void> {
    const count = await this.productCards.count();
    for (let index = 0; index < count; index += 1) {
      const card = this.productCards.nth(index);
      const priceText = await card.locator(".Nx9bqj, ._30jeq3").first().innerText();
      const price = GenericHelper.parsePrice(priceText);
      if (price >= range.min && price <= range.max) {
        await card.locator("a").first().click();
        await this.page.getByRole("button", { name: /add to cart/i }).click();
        return;
      }
    }
    throw new Error(`No mobile listing was available between ₹${range.min} and ₹${range.max}`);
  }
}
