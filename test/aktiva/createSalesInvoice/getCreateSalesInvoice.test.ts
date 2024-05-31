import { describe, it, expect } from "vitest";
import getSignPayload from "@/aktiva/authentication/getSignPayload";

import getCreateSalesInvoice, {
} from "@/aktiva/createSalesInvoice/getCreateSalesInvoice";
import { MeritConfig } from "@/types";

const config = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const signPayload = getSignPayload(config);
const createSalesInvoice = getCreateSalesInvoice(config, signPayload);

describe("getCreateSalesInvoice", () => {
  it("Should return deleteSalesInvoice function", () => {
    expect(typeof createSalesInvoice).toBe("function");
  });
});

