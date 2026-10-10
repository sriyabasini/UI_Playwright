import type { Page } from "playwright";
import type { ScenarioData } from "../models/testData";
import { BasePage } from "./basePage";

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async enterAddress(data: ScenarioData): Promise<void> {
    await this.page.getByPlaceholder(/name/i).first().fill(data.fullName);
    await this.page.getByPlaceholder(/10-digit mobile/i).fill(data.phone);
    await this.page.getByPlaceholder(/pincode/i).fill(data.pincode);
    await this.page.getByPlaceholder(/address/i).fill(data.address);
    await this.page.getByRole("button", { name: /save|deliver here|continue/i }).first().click();
  }

  async hasOrderConfirmation(): Promise<boolean> {
    return this.page.getByText(/order confirmed|order placed|thank you for your order/i)
      .first().isVisible();
  }
}
