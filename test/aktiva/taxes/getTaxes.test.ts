import { describe, it, expect } from "vitest";
import getTaxes from "@/aktiva/taxes/getTaxes";
import { isUuid } from "@/aktiva/testutils";
import { MeritConfig } from "@/types";

const taxesTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const taxes = getTaxes(taxesTestConfig);

describe("getDeleteSalesInvoice", () => {
  it("Should return deleteSalesInvoice function", async () => {
    expect(typeof taxes).toBe("function");
  });
});

describe("taxes", () => {
  it("Should return taxes array", async () => {
    const response = await taxes();

    expect(response, "Expected resposne not to be null").not.toBe(null);
    if (!response) throw Error();
    expect(
      response,
      "Expected response to be an array of tax objects"
    ).toBeInstanceOf(Array);
    expect(
      response.length !== 0,
      "Expected response array to not be empty"
    ).toBe(true);
    const firstResponseItem = response.at(0)!;
    expect(
      isUuid(firstResponseItem.Id),
      `Expected tax Id ${firstResponseItem.Id} to be UUID`
    ).toBe(true);
    expect(
      typeof firstResponseItem.Code === "string",
      "Expected tax Code to be a string"
    ).toBe(true);
    expect(
      typeof firstResponseItem.Name === "string",
      "Expected tax Name to be a string"
    ).toBe(true);
    expect(
      typeof firstResponseItem.NameEN === "string",
      "Expected tax NameEN to be a string"
    ).toBe(true);
    expect(
      typeof firstResponseItem.NameRU === "string",
      "Expected tax NameRu to be a string"
    ).toBe(true);
    expect(
      typeof firstResponseItem.TaxPct === "number",
      "Expected tax TaxPct to be a number"
    ).toBe(true);
    expect(
      typeof firstResponseItem.NonActive === "boolean",
      "Expected tax NonActive status to be a boolean"
    ).toBe(true);
  });
});
