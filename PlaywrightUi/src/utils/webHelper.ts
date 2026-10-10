import type { Locator, Page } from "playwright";

export class WebHelper {
  constructor(private readonly page: Page) {}

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }

  async text(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return (await locator.innerText()).trim();
  }

  async open(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }
}
