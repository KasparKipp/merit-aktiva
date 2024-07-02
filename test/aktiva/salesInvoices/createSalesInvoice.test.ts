import { describe, it, expect } from "vitest";
import merit, { type MeritConfig, CreateSalesInvoiceParams, ItemObjectTypes, MinimalItemObject,  } from "@/index";
import { isUuid } from "@/aktiva/testutils";

const createSalesInvoiceTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;


const aktiva = merit(createSalesInvoiceTestConfig);
const { createSalesInvoice } = aktiva.salesInvoices;

describe("createSalesInvoice", () => {
  it("Should create an invoice with minimal info", async () => {
    const payload: CreateSalesInvoiceParams = {
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
    const res = await createSalesInvoice(payload);
    expect(res).not.toBe(null);
    if (res === null) throw Error();

    expect(
      isUuid(res.CustomerId),
      `Expected CustomerId ${res.CustomerId} to be a valid UUID`
    ).toBe(true);
    expect(
      isUuid(res.InvoiceId),
      `Expected InvoiceId ${res.InvoiceId} to be a valid UUID`
    ).toBe(true);
    expect(
      typeof res.InvoiceNo === "string",
      `Expected InvoiceNo ${res.InvoiceNo} to be a string`
    ).toBe(true);
    expect(
      res.InvoiceNo === payload.InvoiceNo,
      `Expected returned InvoiceNo ${res.InvoiceNo} to equal payload InvoiceNo ${payload.InvoiceNo}`
    ).toBe(true);
    expect(
      typeof res.RefNo === "string",
      `Expected RefNo ${res.InvoiceNo} to be a string`
    ).toBe(true);
    expect(
      res.NewCustomer === null,
      `Expected no new customer to be created, but got ${res.NewCustomer}`
    ).toBe(true);
  });

  it("Should throw when Customer.CountryCode missing", async () => {
    const payload: CreateSalesInvoiceParams = {
      // @ts-expect-error
      Customer: {
        Name: "Customer 1",
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
    await expect(
      async () => await createSalesInvoice(payload),
      "Expected createSalesInvoice to throw error when Customer.CountryCode missing"
    ).rejects.toThrowError("Kliendil mõni kohustuslik väli puudu.\n");
  });

  it("Should throw when Customer.Name missing", async () => {
    const payload: CreateSalesInvoiceParams = {
      // @ts-expect-error
      Customer: {
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
    await expect(
      async () => await createSalesInvoice(payload),
      "Expected createSalesInvoice to throw error when Customer.Name missing"
    ).rejects.toThrowError("Kliendil mõni kohustuslik väli puudu.\n");
  });

  it("Should throw when Customer missing", async () => {
    // @ts-expect-error
    const payload: CreateSalesInvoiceParams = {
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
    await expect(
      async () => await createSalesInvoice(payload),
      "Expected createSalesInvoice to throw error when Customer missing"
    ).rejects.toThrowError("Internal Server Error");
  });
  it("Should throw when DocDate missing", async () => {
    // @ts-expect-error
    const payload: CreateSalesInvoiceParams = {
      Customer: {
        Name: "Customer 1",
        CountryCode: "EE",
      },
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
    await expect(
      async () => await createSalesInvoice(payload),
      "Expected createSalesInvoice to throw error when DocDate missing"
    ).rejects.toThrowError(
      "Cannot read properties of undefined (reading 'getFullYear')"
    );
  });
  it("Should create invoice without InvoiceNo", async () => {
    const payload: CreateSalesInvoiceParams = {
      Customer: {
        Name: "Customer 1",
        CountryCode: "EE",
      },
      DocDate: new Date("2024-01-01T00:00:00"),
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
    const res = await createSalesInvoice(payload);
    expect(res).not.toBe(null);
    if (res === null) throw Error();

    expect(
      isUuid(res.CustomerId),
      `Expected CustomerId ${res.CustomerId} to be a valid UUID`
    ).toBe(true);
    expect(
      isUuid(res.InvoiceId),
      `Expected InvoiceId ${res.InvoiceId} to be a valid UUID`
    ).toBe(true);
    expect(
      res.InvoiceNo === null,
      `Expected no InvoiceNo to be assigned, but got ${res.InvoiceNo}`
    ).toBe(true);
    expect(
      typeof res.RefNo === "string",
      `Expected RefNo ${res.InvoiceNo} to be a string`
    ).toBe(true);
    expect(
      res.NewCustomer === null,
      `Expected no new customer to be created, but got ${res.NewCustomer}`
    ).toBe(true);
  });
  it("Should throw when TaxAmout missing", async () => {
    // @ts-expect-error
    const payload: CreateSalesInvoiceParams = {
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
    };
    await expect(
      async () => await createSalesInvoice(payload),
      "Expected createSalesInvoice to throw error when TaxAmount missing"
    ).rejects.toThrowError("Internal Server Error");
  });

  it("Should throw when InvoiceRow missing", async () => {
    // @ts-expect-error
    const payload: CreateSalesInvoiceParams = {
      Customer: {
        Name: "Customer 1",
        CountryCode: "EE",
      },
      DocDate: new Date("2024-01-01T00:00:00"),
      InvoiceNo: "9",
      TaxAmount: [],
    };
    await expect(
      async () => await createSalesInvoice(payload),
      "Expected createSalesInvoice to throw error when TaxAmount missing"
    ).rejects.toThrowError("Internal Server Error");
  });

  it("Should throw when InvoiceRow has no Item", async () => {
    const payload: CreateSalesInvoiceParams = {
      Customer: {
        Name: "Customer 1",
        CountryCode: "EE",
      },
      DocDate: new Date("2024-01-01T00:00:00"),
      InvoiceNo: "9",

      InvoiceRow: [
        // @ts-expect-error
        {
          Quantity: 2.0,
          TaxId: "307000b4-f1f2-4bc7-a110-24cb18d77212",
        },
      ],
      TaxAmount: [],
    };
    await expect(
      async () => await createSalesInvoice(payload),
      "Expected createSalesInvoice to throw error when TaxAmount missing"
    ).rejects.toThrowError("Internal Server Error");
  });
});