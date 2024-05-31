import { describe, it, expect } from "vitest";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { SalesInvoicesParams } from "@/aktiva/salesInvoices/getSalesInvoices";
import getSalesInvoices from "@/aktiva/salesInvoices/getSalesInvoices";
import { MeritConfig } from "@/types";

const salesInvoicesTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const signPayload = getSignPayload(salesInvoicesTestConfig);
const salesInvoices = getSalesInvoices(salesInvoicesTestConfig, signPayload);

describe("getSalesInvoiceDetails", () => {
  it("Should return salesInvoices function", async () => {
    expect(typeof salesInvoices).toBe("function");
  });
});

describe("salesInvoices", () => {
  it("Should return zero results", async () => {
    const existingInvoiceParams: SalesInvoicesParams = {
      PeriodStart: new Date("2069-01-01T00:00:00"),
      PeriodEnd: new Date("2069-01-01T00:00:00"),
    };
    const response = await salesInvoices(existingInvoiceParams);

    expect(response).not.toBe(null);
    expect(response?.length === 0).toBe(true);
  });
  it("Should return empty invoices array when no salesInvoices in timeframe", async () => {
    const existingInvoiceParams: SalesInvoicesParams = {
      PeriodStart: new Date("1971-01-01T00:00:00"),
      PeriodEnd: new Date("1971-03-01T00:00:00"),
    };
    const response = await salesInvoices(existingInvoiceParams);
    expect(response).not.toBeNull();
    expect(
      response,
      "Response should be [] if there are no salesInvoices in the specified timeframe"
    ).toStrictEqual([]);
  });
  it("Should error if period over 3 months", async () => {
    const existingInvoiceParams: SalesInvoicesParams = {
      PeriodStart: new Date("2024-01-01T00:00:00"),
      PeriodEnd: new Date("2024-08-01T00:00:00"),
    };

    await expect(
      async () => await salesInvoices(existingInvoiceParams)
    ).rejects.toThrowError("Periood liiga pikk(max 3 kuud)");
  });

  // Even though docs and error message is "max 3 months" period of 6 months passes
  it.skip("Should error with period 6 months", async () => {
    const existingInvoiceParams: SalesInvoicesParams = {
      PeriodStart: new Date("2024-01-01T00:00:00"),
      PeriodEnd: new Date("2024-07-01T00:00:00"),
    };

    await expect(
      async () => await salesInvoices(existingInvoiceParams)
    ).rejects.toThrowError("Periood liiga pikk(max 3 kuud)");
  });
});
