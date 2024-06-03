import type { Localization, BaseUrl } from "@/aktiva/types";

export const URL_V1 = {
  EE: "https://aktiva.merit.ee/api/v1/",
  PL: "https://program.360ksiegowosc.pl/api/v1/",
} as const satisfies Record<Localization, BaseUrl>;

export const URL_V2 = {
  EE: "https://aktiva.merit.ee/api/v2/",
  PL: "https://program.360ksiegowosc.pl/api/v2/",
} as const satisfies Record<Localization, BaseUrl>;

export const EInvOperatorTypes = {
  none: 1,
  omniva: 2,
  bank_full: 3,
  bank_limited: 4,
} as const;

export const AccountingDocTypes = {
  faktura: 1,
  rachunek: 2,
  paragon: 3,
  nodoc: 4,
  credit: 5,
  prepinvoice: 6,
  fincchrg: 7,
  delivorder: 8,
  grpinv: 9,
} as const;

export const OfferDocTypeTypes = {
  not_applicable: null,
  quote: 1,
  sales_order: 2,
  prepayment_invoice: 3,
} as const;

export const PolandProcCodes = [
  "SW",
  "EE",
  "TP",
  "TT_WNT",
  "TT_D",
  "MR_T",
  "MR_UZ",
  "I_42",
  "I_63",
  "B_SPV",
  "B_SPV_DOSTAWA",
  "B_MRV_PROWIZJA",
  "MPP",
  "WSTO_EE",
  "IED",
] as const;

export const PolandDocumentTypes = {
  RO: 1,
  WEW: 2,
  FP: 3,
  OJPK: 4,
} as const;

export const ItemObjectTypes = {
  stock_item: 1,
  service: 2,
  item: 3,
} as const;

export const ItemUsageTypes = {
  invoices: 1,
  bills: 2,
  invoices_bills: 3,
  inavtive_: 4,
} as const;
