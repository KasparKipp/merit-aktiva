import type { UUID } from "crypto";

import { URL_V2 } from "@/aktiva/consts";
import {
  formatDate,
  generateRequestUrl,
  handleApiResponse,
} from "@/aktiva/utils";

import getSignPayload, {
  dateToTimestamp,
  type SignPayload,
} from "@/aktiva/authentication/getSignPayload";
import type {
  CurrencyCodeType,
  CustomerIdType,
  EndpointUrl,
  MeritConfig,
  RequireAtLeastOne,
  UserNameType,
} from "@/aktiva/types";

const invoicesPath = "getinvoices";

const invoicesByIdentifierPath = "getinvoices2";

type InvoicesFields = {
  PeriodStart: string; // YYYYmmdd
  PeriodEnd: string; // YYYYmmdd
  UnPaid?: boolean; // Default: true
  BankId?: UUID;
  DateType?: 0 | 1; // Default: 0-Documentdate, 1- Changeddate
};

type InvoicesParams = {
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

type QueryByFields = QueryByInvoiceField &
  QueryByCustomerIdField &
  QueryByCustomerNameField;

type ByIdentifierFields = RequireAtLeastOne<QueryByFields>;

type InvoicesResponse = {
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
type GetSalesInvoicesArgs = Required<MeritConfig>;
type PayloadType = InvoicesFields | ByIdentifierFields;

export type SalesInvoicesParams = InvoicesParams | ByIdentifierFields;

function getSalesInvoices(
  args: GetSalesInvoicesArgs,
  signPayload?: SignPayload
) {
  const signPayloadFn: SignPayload = signPayload ?? getSignPayload(args);const { apiId, localization } = args;
  async function salesInvoices(args: SalesInvoicesParams) {
    const baseUrl = URL_V2[localization];
    let url: EndpointUrl;
    let payload: PayloadType;
    if (isInvoicesParams(args)) {
      url = `${baseUrl}${invoicesPath}`;
      payload = generateInvoicesFields(args);
    } else {
      url = `${baseUrl}${invoicesByIdentifierPath}`;
      payload = args;
    }
    const body = JSON.stringify(payload);
    const timestamp = dateToTimestamp(new Date());
    const signature = await signPayloadFn(body, timestamp);
    const urlWithParams = generateRequestUrl(url, apiId, timestamp, signature);
    const headers = {
      "Content-Type": "application/json",
    };
    const config = {
      method: "POST",
      headers,
      body,
    };
    console.log("Sending request with body:", body);

    const response = await fetch(urlWithParams, config);

    return handleApiResponse<InvoicesResponse>(response);
  }
  return salesInvoices;
}

function isInvoicesParams(args: SalesInvoicesParams): args is InvoicesParams {
  return "PeriodStart" in args && "PeriodEnd" in args;
}

function generateInvoicesFields(params: InvoicesParams): InvoicesFields {
  const {
    PeriodStart,
    PeriodEnd,
    UnPaid = true,
    BankId,
    ByChangedDate = false,
  } = params;

  return {
    PeriodStart: formatDate(PeriodStart),
    PeriodEnd: formatDate(PeriodEnd),
    UnPaid,
    BankId,
    DateType: ByChangedDate ? 1 : 0,
  };
}

export default getSalesInvoices;
