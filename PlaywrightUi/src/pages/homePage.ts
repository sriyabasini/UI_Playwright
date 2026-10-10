import type { Page } from "playwright";
import { frameworkConfig } from "../config/frameworkConfig";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.web.open(frameworkConfig.baseUrl);
  }

  async search(term: string): Promise<void> {
    const searchBox = this.page.getByPlaceholder(/search for products/i).first();
    await this.web.fill(searchBox, term);
    await searchBox.press("Enter");
  }

  async openLogin(): Promise<void> {
    await this.page.getByText("Login", { exact: true }).first().click();
  }
}
