import type { Page } from "playwright";
import { BasePage } from "./basePage";

export class PaymentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async chooseTestMethod(method: string): Promise<void> {
    await this.page.getByText(method, { exact: false }).first().click();
    await this.page.getByRole("button", { name: /continue|confirm/i }).last().click();
  }

  async placeOrder(): Promise<void> {
    await this.page.getByRole("button", { name: /place order|pay now/i }).last().click();
  }
}
