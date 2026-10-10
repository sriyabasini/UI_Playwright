import type { Page } from "playwright";
import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder(/enter email\/mobile number/i).fill(username);
    await this.page.getByRole("button", { name: /continue/i }).click();
    await this.page.getByPlaceholder(/enter password/i).fill(password);
    await this.page.getByRole("button", { name: /login/i }).last().click();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.getByText(/my account/i).first().isVisible();
  }

  async hasLoginError(): Promise<boolean> {
    return this.page.getByText(/incorrect|invalid|please enter|wrong/i).first().isVisible();
  }
}
