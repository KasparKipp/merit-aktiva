import type { UUID } from "crypto";

import { URL_V2 } from "@/aktiva/consts";
import { generateRequestUrl, handleApiResponse } from "@/aktiva/utils";

import getSignPayload, {
  dateToTimestamp,
  type SignPayload,
} from "@/aktiva/authentication/getSignPayload";
import type {
  EndpointUrl,
  CurrencyCodeType,
  CustomerIdType,
  MeritConfig,
  UserNameType,
  EInvOperatorType,
  Dimension,
  AccountingDocType,
  OfferDocTypeType,
} from "@/aktiva/types";

const path = "getinvoice";

export type InvoiceFields = {
  Id: UUID;
  AddAttachment?: boolean; // TODO: CHECK DEFAULT Default: true
};

type Header = {
  Dimensions: Dimension[];
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
type DimensionAllocation = {
  DimId: string;
  Code: string;
  AllocPct: number;
  AllocAmount: number;
};

type Line = {
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
type Attachment = {
  Filename: string;
  FileContent: string;
};
type Payment = {
  PaymDate: Date;
  Amount: number;
  PaymentMethod: string;
  PaymentId: UUID;
};
type NonEmptyLines = [Line, ...Line[]];
type SalesInvoiceDetailsResponse = {
  Header: Header;
  Lines: NonEmptyLines;
  Payments: Payment[];
  Attachment: Attachment | null;
};
type GetSalesInvoicesArgs = Required<MeritConfig>;
function getSalesInvoiceDetails(
  args: GetSalesInvoicesArgs,
  signPayload?: SignPayload
) {
  const signPayloadFn: SignPayload = signPayload ?? getSignPayload(args);const { apiId, localization } = args;
  async function salesInvoices(args: InvoiceFields) {
    const url: EndpointUrl = `${URL_V2[localization]}${path}`;
    const body = JSON.stringify(args);
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

    return handleApiResponse<SalesInvoiceDetailsResponse>(response);
  }
  return salesInvoices;
}

export default getSalesInvoiceDetails;
