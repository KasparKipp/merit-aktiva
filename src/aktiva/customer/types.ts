import type { EInvOperatorType, NonEmptyArray, SalesInvoiceLanguageType, UUID } from "@/aktiva/types";
import { Dimensions } from "@/aktiva/dimensions/types";
export type CustomersFields = {
  Id?: UUID;
  Name?: string;
  RegNo?: string;
  VatRegNo?: string;
  WithComments?: boolean;
  CommentsFrom?: string; // YYYYmmdd
  ChangedDate?: string; // YYYYmmdd
};

export type OptionalParams = Pick<CustomersFields, "WithComments"> & {
  CommentsFrom?: Date;
  ChangedDate?: Date;
};
export type AllCustomersParams = {};
export type ByOptionalParams = OptionalParams;
export type ByCustomerIdParams = Pick<CustomersFields, "Id">;
export type ByRegNoParams = Pick<CustomersFields, "RegNo">;
export type ByVatRegNoParams = Pick<CustomersFields, "VatRegNo">;
export type ByNameParams = Pick<CustomersFields, "Name">;

type QueryByParams =
  | ByOptionalParams
  | ByCustomerIdParams
  | ByRegNoParams
  | ByVatRegNoParams
  | ByNameParams;
export type CustomersParams = QueryByParams & OptionalParams;

export type CustomersRawResponse = (Omit<
  CustomersResponse[number],
  "ChangedDate" | "Comments"
> & { ChangedDate: string; Comments: NonEmptyArray<RawComment> | null })[];

export type CustomersResponse = {
  CustomerId: UUID;
  Name: string;
  RegNo: string | null;
  Contact: string | null;
  PhoneNo: string | null;
  PhoneNo2: string | null;
  Address: string | null;
  City: string | null;
  County: string | null;
  PostalCode: string | null;
  CountryCode: "EE" | "EN" | "RU" | "FI" | "PL" | "SV"; // TODO: add more
  CountryName: string;
  FaxNo: string | null;
  Email: string | null;
  HomePage: string | null;
  PaymentDeadLine: number;
  OverdueCharge: number;
  CurrencyCode: "EUR" | "USD" | "RUB";
  CustomerGroupId: UUID | "00000000-0000-0000-0000-000000000000";
  CustomerGroupName: string | null;
  VatRegNo: string | null;
  BankName: string | null;
  BankAccount: string | null;
  NotTDCustomer: boolean; // true - Natural person or foreign company
  SalesInvLang: SalesInvoiceLanguageType;
  RefNoBase: string | null;
  Comments: NonEmptyArray<Comment> | null;
  Dimensions: Dimensions | null;
  ChangedDate: Date;
  InvSendPref: unknown | null; // TODO
}[];

export type RawComment = Omit<Comment, "CommDate"> & { CommDate: string };
export type Comment = {
  CommDate: Date;
  Comment: string;
};

export type CreateCustomerParams = {
  Id?: UUID;
  Name: string; // Str 150
  RegNo?: string; // Str 30
  NotTDCustomer?: boolean; // default false, EE True for physical persons and foreign companies. PL True for physical persons.
  VatRegNo?: string;
  CurrencyCode?: string; // TODO ADD CURRENCYCODES
  PaymentDeadLine?: number; // If missing taken from default settings
  OverDueCharge?: number; // decimal 5.2 If missing then taken from default settings
  RefNoBase?: string; //Str 36
  Address?: string; // Str 100
  CountryCode: "EE" | "EN" | "RU" | "FI" | "PL" | "SV"; // TODO add country codes Str 2
  County?: string; // Str 100
  City?: string; // Str 30
  PostalCode?: string; // Str 15
  PhoneNo?: string; // Str 50
  PhoneNo2?: string; // Str 50
  HomePage?: string; // Str 80
  Email?: string;
  SalesInvLang?: SalesInvoiceLanguageType; // Invoice language for this specific customer
  Contact?: string; // Str 35
  GLNCode?: string; // Str 10
  PartyCode?: string; // Str 20
  EInvOperator?: EInvOperatorType;
  EInvPaymId?: string; // Str 20
  BankAccount?: string; // Str 50
  Dimensions?: Dimensions;
  CustGrCode?: string; // Str 20
  CustGrId?: UUID;
  ShowBalance?: boolean;
  ApixEInv?: string; // Str 20
};

export type NewCustomerResponse = {
  Id: UUID;
  Name: string;
};
