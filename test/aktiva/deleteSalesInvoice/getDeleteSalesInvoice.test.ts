import { describe, it, expect } from "vitest";
import getDeleteSalesInvoice, {
  DeleteInvoiceParams,
} from "@/aktiva/deleteSalesInvoice/getDeleteSalesInvoice";
import getCreateSalesInvoice, {
  CreateSalesInvoiceParams,
  MinimalItemObject,
} from "@/aktiva/createSalesInvoice/getCreateSalesInvoice";
import { ItemObjectTypes } from "@/aktiva/consts";
import { MeritConfig } from "@/types";

const deleteSalesInvoiceTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const deleteSalesInvoice = getDeleteSalesInvoice(deleteSalesInvoiceTestConfig);
const createSalesInvoice = getCreateSalesInvoice(deleteSalesInvoiceTestConfig);

describe("getDeleteSalesInvoice", () => {
  it("Should return deleteSalesInvoice function", async () => {
    expect(typeof deleteSalesInvoice).toBe("function");
  });
});

describe("deleteSalesInvoice", () => {
  it("Should return message 'Müügiarve <InvoiceNo> <dd/MM/yyyy> kustutatud.'", async () => {
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

    const deleteInvoiceParams: DeleteInvoiceParams = {
      Id: createdInvoice.InvoiceId,
    };
    const response = await deleteSalesInvoice(deleteInvoiceParams);

    expect(response).not.toBe(null);
    expect(typeof response).toBe("string");
    expect(response).toContain("kustutatud");
  });
});
