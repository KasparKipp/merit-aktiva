const getManyPath = "getinvoices";

const byNumberOrCustomer = "getinvoices2";

type QueryInvoicesPayload = {
  PeriodStart: string; // YYYYmmdd
  PeriodEnd: string; //YYYYmmdd
  UnPaid: boolean;
};

type InvoiceIdentifier = {
  InvNo: string;
};

type CustomerIdentifier = {
  CustName: string;
  CustId: string;
};

type QueryInvoiceByIdentifierPayload = InvoiceIdentifier | CustomerIdentifier;

type InvoiceResult = {
  SIHId: string;
  DepartmentCode: string | null;
  DepartmentName: string | null;
  Dimension1Code: string | null;
  Dimension2Code: string | null;
  Dimension3Code: string | null;
  Dimension4Code: string | null;
  Dimension5Code: string | null;
  Dimension6Code: string | null;
  Dimension7Code: string | null;

  AccountingDoc: string; // TODO AccDoc type?
  BatchInfo: string;
  InvoiceNo: string;
  DocumentDate: string;
  TransactionDate: string;
  CustomerName: string;
  CustomerRegNo: string | null;
  CustomerId: string;
  HComment: string | null;
  FComment: string | null;
  DueDate: string;
  CurrencyCode: string;
  CurrencyRate: number;
  TaxAmount: number;
  RoundingAmount: number;
  TotalAmount: number;
  ProfitAmount: number;
  TotalSum: number;
  UserName: string;
  ReferenceNo: string;
  PriceInclVat: boolean;
  VatRegNo: string | null;
  PaidAmount: number;
  EInvSent: boolean;
  EmailSent: string; // DATE
  Paid: boolean;
};
