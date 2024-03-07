const basePath = "https://aktiva.merit.ee/api/v2/";

const path = "sendinvoice";

type ExistingCustomerInput = { Id: string } | { Name: string };
type NewCustomerInput = {
  //"Id": null,
  Name: string;
  NotTDCustomer: boolean; // Required when customer is added. EE True for physical persons and foreign companies. PL True for physical persons. Allowed “true” or “false” (lowercase).

  RegNo?: string;
  VatRegNo?: string;
  CurrencyCode?: string;
  PaymentDeadLine?: number; // If missing, taken from default settings
  OverDueCharge?: number; // If missing, taken from default settings
  RefNoBase?: string;
  Address?: string;
  CountryCode: string;
  County?: string;
  City?: string;
  PostalCode?: string;
  PhoneNo?: string;
  PhoneNo2?: string;
  HomePage?: string;
  Email?: string;
  SalesInvLang?: "ET" | "EN" | "RU" | "FI" | "PL" | "SV"; // Invoice language for this specific customer
  Contact?: string;
  GLNCode: string;
  PartyCode: string;
  EInvOperator?: EInvOperatorType;
  EInvPaymId?: string;
  BankAccount?: string;
  Dimensions?: [DimensionsObject];
  GustGrCode?: string;
  ShowBalance?: boolean;
  ApixEinv?: string;
  GroupInv?: boolean;
};

const EInvOperatorTypes = {
  none: 1,
  omniva: 2,
  bank_full: 3,
  bank_limited: 4,
} as const;

type EInvOperatorType =
  (typeof EInvOperatorTypes)[keyof typeof EInvOperatorTypes];

type DimensionsObject = {
  DimId: number;
  DimValueId: string;
  DimCode: string;
};

type Customer = ExistingCustomerInput | NewCustomerInput;

const PolandProcCodes = [
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
const PolandDocumentTypes = {
  RO: 1,
  WEW: 2,
  FP: 3,
  OJPK: 4,
} as const;

type PolandDocumentType =
  (typeof PolandDocumentTypes)[keyof typeof PolandDocumentTypes];
type ProcCode = (typeof PolandProcCodes)[number];

type InvoiceResponse = {
  CustomerId: string;
  InvoiceId: string;
  InvoiceNo: string;
  RefNo: string;
  NewCustomer?: Customer;
};

type InvoiceRequest = {
  Customer: Customer;
  AccountingDoc?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // Values: 1 faktura, 2 rachunek, 3 paragon, 4 nodoc, 5 credit, 6 prepinvoice, 7 fincchrg, 8 delivorder, 9 grpinv

  DocDate?: string;
  DueDate?: string;
  TransactionDate?: string; // TODO ?

  InvoiceNo: string;
  CurrencyCode?: string; //TODO: currency code
  CurrencyRate?: number; // If the exchange rate is not included, we will take it from the EU central bank's request for the respective date
  DepartmentCode?: string; // If used then must be found in the company database.
  Dimensions?: [DimensionsObject];
  InvoiceRow?: [InvoiceRowObject];
  TaxAmount: [VATObject];
  RoundingAmount: number; // Use it for getting PDF invoice to round number. Does not affect TotalAmount.
  TotalAmount: number; // Amount without VAT
  Payment: Payment;
  /**
   * Invoice reference number
   * If not specified, generated automatically.
   * Please validate this number @see [yourself](https://api.merit.ee/connecting-robots/reference-manual/representation-formats/).
   */
  RefNo?: string;
  Hcomment?: string; // If not specified, API will get it from client record, if it is written there.
  Fcomment?: string; // If not specified, API will get it from client record, if it is written there.
  ReserveItems?: boolean;
  ContractNo?: string; // Contract number with operator
  PDF?: string; // Pdf file in Base64 format
  FileName?: string; // Name of PDF file
  Payer?: Payer;
  DeliveryType?: boolean;
};
/**
 * ProjectCode?: string; // If used then must be found in the company database.

  ProcCodes?: [ProcCode]; // Poland only. Values: SW, EE, TP, TT_WNT, TT_D, MR_T, MR_UZ, I_42, I_63, B_SPV, B_SPV_DOSTAWA, B_MRV_PROWIZJA, MPP, WSTO_EE, IED
  PolDocType?: PolandDocumentType; // Poland only. Values: 1-RO, 2 - WEW, 3 - FP, 4 - OJPK

 */
type ExistingPayer = { Id: string };
type NewPayer = {
  Name: string;
  NotTDCustomer: boolean; // Required when payer is added. True for physical persons and foreign companies. Allowed “true” or “false” (lowercase).
  RegNo?: string;
  VatRegNo?: string;
  CurrencyCode?: string;
  PaymentDeadLine?: number; // If missing, taken from default settings
  OverDueCharge?: number; // If missing, taken from default settings
  RefNoBase?: string;
  Address?: string;
  CountryCode: string;
  County?: string;
  City?: string;
  PostalCode?: string;
  PhoneNo?: string;
  PhoneNo2?: string;
  HomePage?: string;
  Email?: string;
  SalesInvLang?: "ET" | "EN" | "RU" | "FI" | "PL" | "SV"; // Invoice language for this specific customer
  Contact?: string;
  GLNCode: string;
  PartyCode: string;
  EInvOperator?: EInvOperatorType;
  EInvPaymId?: string;
  BankAccount?: string;
  Dimensions?: [DimensionsObject];
  GustGrCode?: string;
  ShowBalance?: boolean;
};
type Payer = ExistingPayer | NewPayer;
type Payment = {
  PaymentMethod: string; // Name of the payment method. Must be found in the company database.
  PaidAmount: number; // Amount with VAT (not more) or less if partial payment
  paymDate: string; // YYYYmmddHHii
};
type VATObject = {
  TaxId: string; //  Use gettaxes endpoint to detect the guid needed
  Amount: number;
};
type InvoiceRowObject = {
  Item: ItemObject;
  TaxId: string; // Use gettaxes endpoint to detect the guid needed
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

const ItemObjectTypes = {
  stock_item: 1,
  service: 2,
  item: 3,
};
type ItemObjectType = (typeof ItemObjectTypes)[keyof typeof ItemObjectTypes];
type ItemObject = {
  Code: string;
  Description: string;
  Type: ItemObjectType;
  UOMName?: string; // Name of the unit
  DefLocationCode?: string; // If company has more than one (default) stock, stock code in this field is required for all stock items.
  GTUCode?: number; // Poland only, values: 1...13
};
