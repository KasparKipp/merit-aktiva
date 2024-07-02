import merit from "@/merit";
import { MeritConfig } from "@/types";
import { afterAll, describe, it, expect } from "vitest";

const config = {
  apiId: process.env.TEST_MERIT_API_ID,
  apiKey: process.env.TEST_MERIT_API_KEY,
  localization: "EE",
} as MeritConfig;

const aktiva = merit(config);

describe("aktiva", () => {
  it("Should return endpoint functions", () => {
    console.log("CONFIG", config)
    expect(typeof aktiva.signPayload).toBe("function");
    
    expect(typeof aktiva.customer.createCustomer).toBe("function");
    expect(typeof aktiva.customer.customers).toBe("function");
    expect(typeof aktiva.customer.updateCustomer).toBe("function");
    
    expect(typeof aktiva.items).toBe("function");

    expect(typeof aktiva.salesInvoices.createSalesInvoice).toBe("function");
    expect(typeof aktiva.salesInvoices.deleteSalesInvoice).toBe("function");
    expect(typeof aktiva.salesInvoices.salesInvoiceDetails).toBe("function");
    expect(typeof aktiva.salesInvoices.salesInvoicesList).toBe("function");

    expect(typeof aktiva.taxes).toBe("function");
  });
});

afterAll(async () => {
  // Clear all invoices after all tets have run
  const salesInvoices = await aktiva.salesInvoices.salesInvoicesList({
    PeriodStart: new Date("2024-01-01T00:00:00"),
    PeriodEnd: new Date("2024-06-01T00:00:00"),
  });
  if (!salesInvoices) throw Error("No salesInvoices to clean up");
  for (const invoice of salesInvoices) {
    await aktiva.salesInvoices.deleteSalesInvoice({ Id: invoice.SIHId });
  }
}, 30000);
