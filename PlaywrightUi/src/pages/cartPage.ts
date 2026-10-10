import type { Page } from "playwright";
import { BasePage } from "./basePage";

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.getByRole("link", { name: /cart/i }).first().click();
  }

  async hasItems(): Promise<boolean> {
    return this.page.getByText(/price details|place order/i).first().isVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByRole("button", { name: /place order|continue/i }).first().click();
  }
}
