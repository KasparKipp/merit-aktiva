import type { ItemObjectType, ItemUsageType, UUID } from "@/aktiva/types";

export type Item = {
  ItemId: UUID;
  Code: string;
  Name: string;
  UnitofMeasureName: string;
  Type0: ItemObjectType;
  Type: string; // TODO check if this is translated and make a const
  SalesPrice: number;
  InventoryQty: number;
  ReservedQty: number;
  VatTaxName: string | null;
  Usage0: ItemUsageType;
  Usage: string; // TODO check if this is translated and make a const eg. type
  SalesAccountCode: string;
  PurchaseAccountCode: string;
  InventoryAccountCode: string;
  DiscountPct: number;
  LastPurchasePrice: number;
  ItemUnitCost: number;
  InventoryCost: number;
  ItemGroupName: string | null;
  DefLoc_Name: string | null;
  EANCode: string | null;
  GTUCodes: string[] | null;
};

export type ItemsResponse = Item[];

export type AllItemsParams = {};
export type ItemsByIdParams = { Id: UUID };
export type ItemsByCodeParams = { Code: string };
export type ItemsByDescriptionParams = { Description: string };
export type ItemsByLocationCodeParams = { LocationCode: string };
export type FilteredItemsParams = Partial<
  ItemsByIdParams &
    ItemsByCodeParams &
    ItemsByDescriptionParams &
    ItemsByLocationCodeParams
>;
export type ItemsParams = AllItemsParams | FilteredItemsParams;
