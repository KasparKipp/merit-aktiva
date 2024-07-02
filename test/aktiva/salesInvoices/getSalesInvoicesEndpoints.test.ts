import { describe, it, expect } from "vitest";
import type { SalesInvoicesListParams } from "@/aktiva/salesInvoices/types";
import { MeritConfig } from "@/types";
import merit from "@/merit";

const salesInvoicesTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const aktiva = merit(salesInvoicesTestConfig)

describe("getSalesInvoiceDetails", () => {
  it("Should return salesInvoices function", async () => {

    expect(typeof aktiva.salesInvoices.createSalesInvoice).toBe("function");

    expect(typeof aktiva.salesInvoices.salesInvoiceDetails).toBe("function");
    
    expect(typeof aktiva.salesInvoices.salesInvoicesList).toBe("function");
  });
});