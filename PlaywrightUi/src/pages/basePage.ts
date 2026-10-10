import type { Page } from "playwright";
import { WebHelper } from "../utils/webHelper";

export abstract class BasePage {
  protected readonly web: WebHelper;

  protected constructor(protected readonly page: Page) {
    this.web = new WebHelper(page);
  }
}
