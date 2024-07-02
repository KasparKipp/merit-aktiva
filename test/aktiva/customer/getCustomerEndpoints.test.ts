import { describe, it, expect } from "vitest";
import { MeritConfig } from "@/types";
import getCustomerEndpoint from "@/aktiva/customer/getCustomerEndpoints";

const itemsTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const { customers, createCustomer, updateCustomer } =
  getCustomerEndpoint(itemsTestConfig);

describe("getCustomerEndpoint", () => {
  it("Should return endpoint function(-s", async () => {
    expect(typeof customers).toBe("function");
    expect(typeof createCustomer).toBe("function");
    expect(typeof updateCustomer).toBe("function");
  });
});
