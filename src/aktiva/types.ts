import {
  AccountingDocTypes,
  EInvOperatorTypes,
  OfferDocTypeTypes,
  PolandDocumentTypes,
  PolandProcCodes,
  ItemObjectTypes,
  ItemUsageTypes,
} from "@/aktiva/consts";
import { dateToTimestamp } from "@/aktiva/utils";

export type UUID = `${string}-${string}-4${string}-${string}-${string}`;

export type BaseUrl = `https://${string}/api/v${"1" | "2"}/`;
export type EndpointUrl = `${BaseUrl}${string}`;

export type Localization = "EE" | "PL";
export type MeritConfig = {
  apiId: UUID;
  apiKey: `${string}=`;
  localization?: Localization;
};
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Field types
export type CustomerIdType = UUID;

// TODO FIX
export type CurrencyCodeType = "EUR";

// If entity was created by an API call UserName is marked as "Merit API"
export type UserNameType = "Merit API" | string;

export type EInvOperatorType =
  (typeof EInvOperatorTypes)[keyof typeof EInvOperatorTypes];

export type AccountingDocType =
  (typeof AccountingDocTypes)[keyof typeof AccountingDocTypes];

export type OfferDocTypeType =
  | (typeof OfferDocTypeTypes)[keyof typeof OfferDocTypeTypes];

export type Dimension = {
  DimID: string;
  DimValueId: UUID;
  DimCode: string;
};

export type MeritErrorCode = "FormatException" | string;
export type ServerErrorResponse = {
  Id?: UUID;
  ErrorCode?: MeritErrorCode;
  Message: string;
};

export type Timestamp = ReturnType<typeof dateToTimestamp>;
export type ProcCodeType = (typeof PolandProcCodes)[number];

export type PolandDocumentType =
  (typeof PolandDocumentTypes)[keyof typeof PolandDocumentTypes];

export type ItemObjectType =
  (typeof ItemObjectTypes)[keyof typeof ItemObjectTypes];

export type ItemUsageType =
  (typeof ItemUsageTypes)[keyof typeof ItemUsageTypes];

export type NonEmptyArray<T> = [T, ...T[]];
