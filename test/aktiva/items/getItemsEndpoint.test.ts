import { describe, it, expect } from "vitest";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { MeritConfig } from "@/types";
import getItemsEndpoint from "@/aktiva/items/getItemsEndpoint";
import {
  ItemsByCodeParams,
  ItemsByDescriptionParams,
  ItemsByIdParams,
  ItemsResponse,
} from "@/aktiva/items/types";
import { isUuid } from "@/aktiva/testutils";

const itemsTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const signPayload = getSignPayload(itemsTestConfig);
const items = getItemsEndpoint(itemsTestConfig, signPayload);

describe("getItemsEndpoint", () => {
  it("Should return items function", async () => {
    expect(typeof items).toBe("function");
  });
});

describe("items", () => {
  it("Should return some items", async () => {
    const response = await items();

    expect(response).not.toBe(null);
    expect(response?.length !== 0).toBe(true);
  });
  it("Returned items should be of correct type", async () => {
    const res = await items();

    expect(res).not.toBe(null);
    expect(res?.length !== 0).toBe(true);
    if (res === null) throw Error();

    const expectCorrectReturnType = (item: ItemsResponse[number]) => {
      expect(
        isUuid(item.ItemId),
        `Expected ItemId ${item.ItemId} to be a valid UUID`
      ).toBe(true);
      expect(
        typeof item.Code === "string",
        `Expected Code ${item.Code} to be a string`
      ).toBe(true);
      expect(
        typeof item.Name === "string",
        `Expected Name ${item.Name} to be a string`
      ).toBe(true);
      expect(
        typeof item.UnitofMeasureName === "string" ||
          item.UnitofMeasureName === null,
        `Expected UnitOfMeasureName ${item.UnitofMeasureName} to be a string or null`
      ).toBe(true);
      expect(
        typeof item.Type0 === "number",
        `Expected Type0 ${item.Type0} to be a number`
      ).toBe(true);
      expect(
        item.Type0 >= 0 && item.Type0 <= 3,
        `Expected Type0 ${item.Type0} to be a known value of ItemObjectType`
      ).toBe(true);
      expect(
        typeof item.Type === "string",
        `Expected Type ${item.Type} to be a string`
      ).toBe(true);
      expect(
        typeof item.SalesPrice === "number",
        `Expected SalesPrice ${item.SalesPrice} to be a number`
      ).toBe(true);
      expect(
        typeof item.InventoryQty === "number",
        `Expected InventoryQty ${item.InventoryQty} to be a number`
      ).toBe(true);
      expect(
        typeof item.ReservedQty === "number",
        `Expected ReservedQty ${item.ReservedQty} to be a number`
      ).toBe(true);
      expect(
        typeof item.VatTaxName === "string" || item.VatTaxName === null,
        `Expected VatTaxName ${item.VatTaxName} to be a string or null`
      ).toBe(true);
      expect(
        typeof item.Usage0 === "number",
        `Expected Usage0 ${item.Usage0} to be a number`
      ).toBe(true);
      expect(
        item.Usage0 >= 0 && item.Usage0 <= 4,
        `Expected Usage0 ${item.Usage0} to be a known value of ItemObjectType`
      ).toBe(true);
      expect(
        typeof item.Usage === "string",
        `Expected Usage ${item.Usage} to be a string`
      ).toBe(true);
      expect(
        typeof item.SalesAccountCode === "string",
        `Expected SalesAccountCode ${item.SalesAccountCode} to be a string`
      ).toBe(true);
      expect(
        typeof item.PurchaseAccountCode === "string",
        `Expected PurchaseAccountCode ${item.PurchaseAccountCode} to be a string`
      ).toBe(true);
      expect(
        typeof item.InventoryAccountCode === "string",
        `Expected InventoryAccountcode ${item.InventoryAccountCode} to be a string`
      ).toBe(true);
      expect(
        typeof item.DiscountPct === "number",
        `Expected DiscountPct ${item.DiscountPct} to be a number`
      ).toBe(true);
      expect(
        typeof item.LastPurchasePrice === "number",
        `Expected LastPurchasePrice ${item.LastPurchasePrice} to be a number`
      ).toBe(true);
      expect(
        typeof item.ItemUnitCost === "number",
        `Expected ItemUnitCost ${item.ItemUnitCost} to be a number`
      ).toBe(true);
      expect(
        typeof item.InventoryCost === "number",
        `Expected InventoryCost ${item.InventoryCost} to be a number`
      ).toBe(true);

      expect(
        typeof item.ItemGroupName === "string" || item.ItemGroupName === null,
        `Expected ItemGroupName ${item.ItemGroupName} to be a string or null`
      ).toBe(true);

      expect(
        typeof item.DefLoc_Name === "string" || item.DefLoc_Name === null,
        `Expected DefLoc_Name ${item.DefLoc_Name} to be a string or null`
      ).toBe(true);

      expect(
        typeof item.EANCode === "string" || item.EANCode === null,
        `Expected EANCode ${item.EANCode} to be a string or null`
      ).toBe(true);

      expect(
        item.GTUCodes === null || typeof item.GTUCodes[0] === "string",
        `Expected GTUCodes ${item.GTUCodes} to be a string array or null`
      ).toBe(true);
    };
    res.forEach(expectCorrectReturnType);
  });

  it("Should return item with matching id", async () => {
    const itemsByIdParams: ItemsByIdParams = {
      Id: "d7549594-309b-46a7-a43f-4e3f60fe5c0b",
    };
    const response = await items(itemsByIdParams);
    expect(response).not.toBeNull();

    expect(
      response?.length === 1,
      "Expected to return only one item matching Id"
    ).toBe(true);
  });
  it("Should return item with matching code", async () => {
    const itemsByCodeParams: ItemsByCodeParams = {
      Code: "22% teen",
    };
    const response = await items(itemsByCodeParams);
    expect(response).not.toBeNull();
    expect(
      response?.length === 1,
      "Expected to return only one item matching Code"
    ).toBe(true);
  });
  it("Should return some items matching Description", async () => {
    const ItemsByDescParams: ItemsByDescriptionParams = {
      Description: "auto",
    };
    const response = await items(ItemsByDescParams);
    expect(response).not.toBeNull();
    expect(
      response?.length !== 0,
      `Expected to return some items matching the description '${ItemsByDescParams.Description}'`
    ).toBe(true);
  });
});
