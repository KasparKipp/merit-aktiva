import { ItemObjectTypes, URL_V2 } from "@/aktiva/consts";
import { generateRequestUrl, handleApiResponse } from "@/aktiva/utils";

import getSignPayload, {
  dateToTimestamp,
  type SignPayload,
} from "@/aktiva/authentication/getSignPayload";
import type {
  EndpointUrl,
  MeritConfig,
  EInvOperatorType,
  AccountingDocType,
  Timestamp,
  Dimension,
  ItemObjectType,
  UUID,
} from "@/aktiva/types";

const path = "sendinvoice";

type NewCustomerType = {
  Name: string; // Str 150
  RegNo?: string; // Str 30
  NotTDCustomer?: boolean; // EE True for physical persons and foreign companies. PL True for physical persons.
  VatRegNo?: string;
  CurrencyCode?: string;
  PaymentDeadline?: number; // If missing taken from default settings
  OverDueCharge?: number; // decimal 5.2 If missing then taken from default settings
  Address?: string; // Str 100
  City?: string; // Str 30
  Country?: string; // Str 100
  PostalCode?: string; // Str 15
  CountryCode: "EE" | "EN" | "RU" | "FI" | "PL" | "SV"; // TODO add country codes
  PhoneNo?: string; // Str 50
  PhoneNo2?: string; // Str 50
  HomePage?: string; // Str 80
  SalesInvLang?: "ET" | "EN" | "RU" | "FI" | "PL" | "SV"; // Invoice language for this specific customer
  RefNoBase?: string; //Str 36
  EInvPaymId?: string; // Str 20
  EInvOperator?: EInvOperatorType;
  BankAccount?: string; // Str 50
  Contact?: string; // Str 35
  ApixEinv?: string; // Str 20
  GroupInv?: boolean;
};

type ExistingPayer = {
  Id: UUID;
};

type NewPayer = Omit<
  NewCustomerType,
  "BankAccount" | "ApixEinv" | "GroupInv"
> & {
  email?: string; // Str 80
  GLNCode?: string; // Str 10
  PartyCode?: string; // Str 20
  Dimensions: Dimension[];
  CustGrCode?: string; // Str 20
  ShowBalance?: boolean;
};

type Payer = ExistingPayer | NewPayer;

type ExistingCustomerByNameAndCountryCodeType = Pick<
  NewCustomerType,
  "Name" | "CountryCode"
>;

type ExistingCustomerByIdType = {
  Id: UUID;
};

type CustomerType =
  | NewCustomerType
  | ExistingCustomerByIdType
  | ExistingCustomerByNameAndCountryCodeType;
export type TaxObject = {
  TaxId: UUID; // Use gettaxes endpoint to detect the guid needed
  Amount?: number; // Decimal 18.7
};
type CreateSalesInvoiceFields = {
  Customer: CustomerType;
  AccountingDoc?: AccountingDocType;
  DocDate: Timestamp;
  DueDate?: Timestamp;
  TransactionDate?: Timestamp;
  InvoiceNo?: string; // Str 35
  CurrencyCode?: string; // Str 4
  CurrencyRate?: string; //Decimal 18.7 If not included, taken from EU central bank request for the day
  DepartmentCode?: string; // Str 20 If used then must be found in the compamny database
  Dimensions?: Dimension[];
  InvoiceRow: InvoiceRowObjectType[]; // TODO check
  TaxAmount: TaxObject[];
  RoundingAmount?: number; // Decimal 18.2
  TotalAmount?: number; // Decimal 18.2 Without VAT
  Payment?: {
    // TODO test this payment thing
    PaymentMethod: string; // Str 150 Name of the payment method. Must be found in the company database.
    PaidAmount: number; // Deximal 18.2 Amount with VAT (not more) or less if partial payment
    PaymDate: Timestamp;
  };
  RefNo?: string; // Str 36 unvalidated https://www.pangaliit.ee/arveldused/viitenumber/7-3-1meetod
  Hcomment?: string; // String 4k If not specified, API will get it from client record, if it is written there.
  Fcomment?: string; // String 4k If not specified, API will get it from client record, if it is written there.
  ReserveItems?: boolean;
  ContractNo?: string; // String 35
  PDF?: string; // String 4k Pdf filein Base64 format
  FileName?: string; // String 100 Name of PDF file
  Payer?: Payer;
  DeliveryType?: boolean;
};

type InvoiceRowObjectType = {
  Item: ItemObject;
  TaxId: UUID; // Use gettaxes endpoint to detect the guid needed
  Quantity?: number;
  Price?: number; // If there is no price field, the price is searched from the sales price table
  DiscountPct?: number;
  DiscountAmount?: number; // Amount * Price * (DiscountPCt / 100). This is not rounded. Will be substracted from row amount before row roundings.
  LocationCode?: string; // Used for stock items and multiple stocks. If used then must be found in the company database.
  DepartmentCode?: string; // If used then must be found in the company database.
  ItemCostAmount?: number; // Required for credit invoices when crediting stock items.
  GLAccountCode?: string; // If used, must be found in the company database.
  ProjectCode?: string; // If used, must be found in the company database.
  CostCenterCode?: string; // If used, must be found in the company database.
  VatDate?: string; // YYYYMMDD type date. In some countries where you have to specify VatDate.
};

export type ExistingItemObject = {
  Code: string;
};
export type MinimalItemObject = ExistingItemObject & {
  Description: string;
  Type: ItemObjectType;
};
type NewItemObject = MinimalItemObject & {
  UOMName?: string; // Name of the unit
  DefLocationCode?: string; // If company has more than one (default) stock, stock code in this field is required for all stock items.
  GTUCode?: number; // Poland only, values: 1...13
  SalesAccCode?: string; // Str 10 Can only be used when creating new stock items
  PurchaseAccCode?: string; // Str 10 Can only be used when creating new stock items
  InventoryAccCode?: string; // Str 10 Can only be used when creating new stock items
  CostAccCode?: string; // Str 10 Can only be used when creating new stock items
};
type ItemObject = ExistingItemObject | NewItemObject;
type GetCreateSalesInvoice = Required<MeritConfig>;
export type CreateSalesInvoiceParams = Omit<
  CreateSalesInvoiceFields,
  "DueDate" | "DocDate" | "TransactionDate"
> & { DocDate: Date; DueDate?: Date; TransactionDate?: Date };
type CreateSalesInvoiceResponse = {
  CustomerId: UUID;
  InvoiceId: UUID;
  InvoiceNo: string;
  RefNo: string;
  NewCustomer: string | null; // Returns the name of the new customer or null
};
function getCreateSalesInvoice(
  args: GetCreateSalesInvoice,
  signPayload?: SignPayload
) {
  const signPayloadFn: SignPayload = signPayload ?? getSignPayload(args);
  const { apiId, localization } = args;
  async function salesInvoices(args: CreateSalesInvoiceParams) {
    const url: EndpointUrl = `${URL_V2[localization]}${path}`;
    const { DocDate, DueDate, TransactionDate, ...rest } = args;
    const argsWithTimestamps: CreateSalesInvoiceFields = {
      DocDate: dateToTimestamp(DocDate),
      DueDate: DueDate ? dateToTimestamp(DueDate) : undefined,
      TransactionDate: TransactionDate
        ? dateToTimestamp(TransactionDate)
        : undefined,
      ...rest,
    };
    const body = JSON.stringify(argsWithTimestamps);
    const timestamp = dateToTimestamp(new Date());
    const signature = await signPayloadFn(body, timestamp);
    const urlWithParams = generateRequestUrl(url, apiId, timestamp, signature);

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    };

    const response = await fetch(urlWithParams, config);

    return handleApiResponse<CreateSalesInvoiceResponse>(response);
  }
  return salesInvoices;
}

export default getCreateSalesInvoice;
