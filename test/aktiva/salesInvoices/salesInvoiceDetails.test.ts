import { describe, it, expect } from "vitest";
import merit, {
  type MeritConfig,
  CreateSalesInvoiceParams,
  UUID,
  ItemObjectTypes,
  MinimalItemObject,
  InvoiceFields,
  getSalesInvoicesEndpoints,
} from "@/index";

const salesInvoiceDetailsTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const aktiva = merit(salesInvoiceDetailsTestConfig);
const { salesInvoiceDetails, createSalesInvoice } = aktiva.salesInvoices;

describe("getSalesInvoiceDetails", () => {
  it("Should return salesInvoiceDetails function", async () => {
    expect(typeof salesInvoiceDetails).toBe("function");
  });

  it("Should return invoice details", async () => {
    const invoicePrams: CreateSalesInvoiceParams = {
      Customer: {
        Name: "Customer 1",
        CountryCode: "EE",
      },
      DocDate: new Date("2024-01-01T00:00:00"),
      InvoiceNo: "9",
      InvoiceRow: [
        {
          Item: {
            Code: "1",
            Description: "Service 1",
            Type: ItemObjectTypes.service,
          } satisfies MinimalItemObject,
          Quantity: 2.0,
          TaxId: "307000b4-f1f2-4bc7-a110-24cb18d77212",
        },
      ],
      TaxAmount: [],
    };
    const createdInvoice = await createSalesInvoice(invoicePrams);
    expect(createdInvoice).not.toBe(null);
    if (createdInvoice === null) throw Error();
    const existingInvoiceParams: InvoiceFields = {
      Id: createdInvoice.InvoiceId,
    };

    const response = await salesInvoiceDetails(existingInvoiceParams);
    expect(response).not.toBe(null);
    expect(response?.Lines.length).toBe(1);
  });

  it("Should throw when Unauthorized because apiId invalid", async () => {
    const existingInvoiceParams: InvoiceFields = {
      Id: "819a692d-2c8a-4bc9-9226-fc9d6989c5a5",
    };
    const { apiId, ...restOfValidConfig } = salesInvoiceDetailsTestConfig;
    const invalidApiId = `${apiId.slice(0, 14)}1${apiId.slice(15)}` as UUID;

    const invalidConfig: Required<MeritConfig> = {
      apiId: invalidApiId,
      ...restOfValidConfig,
    };

    const { salesInvoiceDetails } = getSalesInvoicesEndpoints(invalidConfig);

    await expect(
      async () => await salesInvoiceDetails(existingInvoiceParams)
    ).rejects.toThrowError("Unauthorized: The apiId is invalid");
  });

  // THIS TEST SHOULD NOT PASS, apiKey is not validated with this request
  it.skip("Should throw when Unauthorized because apiKey invalid", async () => {
    const existingInvoiceParams: InvoiceFields = {
      Id: "819a692d-2c8a-4bc9-9226-fc9d6989c5a5",
    };
    const { apiKey, ...restOfValidConfig } = salesInvoiceDetailsTestConfig;
    const invalidApiKey = "invalid=";

    const invalidConfig = {
      apiKey: invalidApiKey as MeritConfig["apiKey"],
      ...restOfValidConfig,
    };
    
    const { salesInvoiceDetails } = getSalesInvoicesEndpoints(invalidConfig);

    await expect(
      async () => await salesInvoiceDetails(existingInvoiceParams)
    ).rejects.toThrowError(
      "Unauthorized: Your request is missing url params or the apiKey is invalid"
    );
  });
});
