import type {
  CurrencyCodeType,
  CustomerIdType,
  UserNameType,
  EInvOperatorType,
  AccountingDocType,
  OfferDocTypeType,
  RequireAtLeastOne,
  SalesInvoiceLanguageType,
  Timestamp,
  ItemObjectType,
  UUID,
} from "@/aktiva/types";

import type { Dimensions, Dimension } from "@/aktiva/dimensions/types";
// CreateSalesInvoice types

export type NewCustomerType = {
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
    SalesInvLang?: SalesInvoiceLanguageType; // Invoice language for this specific customer
    RefNoBase?: string; //Str 36
    EInvPaymId?: string; // Str 20
    EInvOperator?: EInvOperatorType;
    BankAccount?: string; // Str 50
    Contact?: string; // Str 35
    ApixEinv?: string; // Str 20
    GroupInv?: boolean;
  };
  
  export type ExistingPayer = {
    Id: UUID;
  };
  
  export type NewPayer = Omit<
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
  
  export type ExistingCustomerByNameAndCountryCodeType = Pick<
    NewCustomerType,
    "Name" | "CountryCode"
  >;
  
  export type ExistingCustomerByIdType = {
    Id: UUID;
  };
  
  export type CustomerType =
    | NewCustomerType
    | ExistingCustomerByIdType
    | ExistingCustomerByNameAndCountryCodeType;
  export type TaxObject = {
    TaxId: UUID; // Use gettaxes endpoint to detect the guid needed
    Amount?: number; // Decimal 18.7
  };
  export type CreateSalesInvoiceFields = {
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
  
  export type InvoiceRowObjectType = {
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
  export type NewItemObject = MinimalItemObject & {
    UOMName?: string; // Name of the unit
    DefLocationCode?: string; // If company has more than one (default) stock, stock code in this field is required for all stock items.
    GTUCode?: number; // Poland only, values: 1...13
    SalesAccCode?: string; // Str 10 Can only be used when creating new stock items
    PurchaseAccCode?: string; // Str 10 Can only be used when creating new stock items
    InventoryAccCode?: string; // Str 10 Can only be used when creating new stock items
    CostAccCode?: string; // Str 10 Can only be used when creating new stock items
  };
  type ItemObject = ExistingItemObject | NewItemObject;
  export type CreateSalesInvoiceParams = Omit<
    CreateSalesInvoiceFields,
    "DueDate" | "DocDate" | "TransactionDate"
  > & { DocDate: Date; DueDate?: Date; TransactionDate?: Date };
  export type CreateSalesInvoiceResponse = {
    CustomerId: UUID;
    InvoiceId: UUID;
    InvoiceNo: string;
    RefNo: string;
    NewCustomer: string | null; // Returns the name of the new customer or null
  };
// CreateSalesInvoice types /
// SalesInvoicesList types
export type InvoicesFields = {
  PeriodStart: string; // YYYYmmdd
  PeriodEnd: string; // YYYYmmdd
  UnPaid?: boolean; // Default: true
  BankId?: UUID;
  DateType?: 0 | 1; // Default: 0-Documentdate, 1- Changeddate
};

export type InvoicesParams = {
  PeriodStart: Date;
  PeriodEnd: Date;
  UnPaid?: boolean; // If unpaid invoices should be included in the response. Default: true
  BankId?: UUID;
  ByChangedDate?: boolean; // Default: false -> DateType: 0-Documentdate, true -> DateType: 1-Changeddate
};

export type QueryByInvoiceField = {
  InvNo: string;
};
export type QueryByCustomerIdField = {
  CustId: CustomerIdType;
};
export type QueryByCustomerNameField = {
  CustName: string;
};

export type QueryByFields = QueryByInvoiceField &
  QueryByCustomerIdField &
  QueryByCustomerNameField;

export type ByIdentifierFields = RequireAtLeastOne<QueryByFields>;

export type SalesInvoicesesListResponse = {
  SIHId: UUID;
  DepartmentCode: string | null;
  DepartmentName: string | null;
  Dimension1Code: string | null;
  Dimension2Code: string | null;
  Dimension3Code: string | null;
  Dimension4Code: string | null;
  Dimension5Code: string | null;
  Dimension6Code: string | null;
  Dimension7Code: string | null;

  AccountingDoc: number; // TODO wtf is this 0 | 1 ?
  BatchInfo: string; // TODO umm what? example: "MA-11" GL transaction code and #
  InvoiceNo: string;
  DocumentDate: Date;
  TransactionDate: Date;
  CustomerId: CustomerIdType;
  CustomerName: string;
  CustomerRegNo: string | null; // TODO: pole kindel kas string
  HComment: string | null;
  FComment: string | null;
  DueDate: Date;
  CurrencyCode: CurrencyCodeType;
  CurrencyRate: number;
  TaxAmount: number;
  RoundingAmount: number;
  TotalAmount: number;
  ProfitAmount: number;
  TotalSum: number;
  UserName: UserNameType;
  ReferenceNo: string;
  PriceInclVat: boolean;
  VatRegNo: string | null;
  PaidAmount: number;
  EInvSent: boolean;
  EInvSentDate: Date;
  EmailSent: Date;
  Paid: boolean;
  ChangedDate: Date;
}[];
export type PayloadType = InvoicesFields | ByIdentifierFields;

export type SalesInvoicesListParams = InvoicesParams | ByIdentifierFields;

//SalesInvoicesList types /
// SalesInvoiceDetails types

export type InvoiceFields = {
  Id: UUID;
  AddAttachment?: boolean; // TODO: CHECK DEFAULT Default: true
};

export type Header = {
  Dimensions: Dimensions;
  SIHId: UUID;
  DepartmentCode: string | null;
  DepartmentName: string | null;
  ProjectCode: string | null;
  ProjectName: string | null;
  AccountingDoc: AccountingDocType;
  BatchInfo: string; // TODO umm what? example: "MA-11" GL transaction code and #
  InvoiceNo: string;
  DocumentDate: Date;
  TransactionDate: Date;
  CustomerId: CustomerIdType;
  CustomerName: string;
  CustomerRegNo: string | null; // TODO: pole kindel kas string
  HComment: string | null;
  FComment: string | null;
  DueDate: Date;
  CurrencyCode: CurrencyCodeType;
  CurrencyRate: number;
  TaxAmount: number;
  RoundingAmount: number;
  TotalAmount: number;
  ProfitAmount: number;
  TotalSum: number;
  UserName: UserNameType;
  ReferenceNo: string;
  PriceInclVat: boolean;
  VatRegNo: string | null;
  PaidAmount: number;
  EInvSent: boolean;
  EInvSentDate: Date;
  EmailSent: Date;
  EInvOperator: EInvOperatorType;
  OfferId: UUID; // If not exist: "00000000-0000-0000-0000-000000000000"
  OfferDocType: OfferDocTypeType; // 1-quote, 2-sales order, 3-prepayment invoice
  OfferNo: string | null;
  FileExists: boolean;
  PerSHId: UUID; // If not exist: "00000000-0000-0000-0000-000000000000"
  ContractNo: string | null;
  Paid: boolean;
  Contact: string | null;
};
export type DimensionAllocation = {
  DimId: string;
  Code: string;
  AllocPct: number;
  AllocAmount: number;
};

export type Line = {
  SILId: UUID;
  ArticleCode: string; //"22% teen"
  LocationCode: string | null;
  Quantity: number; // 1.0;
  Price: number; // 669.0;
  TaxId: UUID;
  TaxName: string; // "22% käibemaks";
  TaxPct: number; // 22.0;
  AmountExclVat: number; // 669.0;
  AmountInclVat: number; // 816.18;
  VatAmount: number; // 147.18;
  AccountCode: string; // "3000";
  DepartmentCode: string | null;
  DepartmentName: string | null;
  ItemCostAmount: number; // 0.0;
  ProfitAmount: number; // 669.0;
  DiscountPct: number; // 0.0;
  DiscountAmount: number; // 0.0;
  Description: string; // "Teenuse müük 22%";
  UOMName: string | null;
  FixAsset: boolean;
  DimAllocation: DimensionAllocation[];
};
export type Attachment = {
  Filename: string;
  FileContent: string;
};
export type Payment = {
  PaymDate: Date;
  Amount: number;
  PaymentMethod: string;
  PaymentId: UUID;
};
export type NonEmptyLines = [Line, ...Line[]];
export type SalesInvoiceDetailsResponse = {
  Header: Header;
  Lines: NonEmptyLines;
  Payments: Payment[];
  Attachment: Attachment | null;
};
//SalesInvoiceDetails types /
// DeleteSalesInvoice types
export type DeleteInvoiceFields = {
  Id: UUID;
};
export type DeleteInvoiceParams = DeleteInvoiceFields;

export type DeleteSalesInvoiceResponse = string;
// DeleteSalesInvoice types /
