import { request, type APIRequestContext, type APIResponse } from "playwright";

export class ApiHelper {
  private context?: APIRequestContext;

  async initialize(baseURL?: string): Promise<void> {
    this.context = await request.newContext({ baseURL });
  }

  async get(path: string): Promise<APIResponse> {
    if (!this.context) throw new Error("API helper has not been initialized");
    return this.context.get(path);
  }

  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = undefined;
    }
  }
}
