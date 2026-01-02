import { ApiClient } from "@/services/ApiClient.service";

// Example: Create a public API client
class PricingPublicApiClient extends ApiClient {
  constructor() {
    super("package"); // or whatever your public module path is
  }

  async getPublicData() {
    return this.get("/data");
  }
}

// Use it
const publicApi = new PricingPublicApiClient();

export default publicApi;
