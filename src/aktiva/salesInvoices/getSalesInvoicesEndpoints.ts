import { URL_V1, URL_V2 } from "@/aktiva/consts";
import {
  formatDate,
  generateRequestUrl,
  handleApiResponse,
} from "@/aktiva/utils";

import getSignPayload, {
  dateToTimestamp,
  type SignPayload,
} from "@/aktiva/authentication/getSignPayload";
import type { EndpointUrl, MeritConfig } from "@/aktiva/types";
import type {
  DeleteInvoiceParams,
  DeleteSalesInvoiceResponse,
  InvoiceFields,
  InvoicesFields,
  InvoicesParams,
  SalesInvoicesesListResponse,
  PayloadType,
  SalesInvoiceDetailsResponse,
  SalesInvoicesListParams,
  CreateSalesInvoiceParams,
  CreateSalesInvoiceFields,
  CreateSalesInvoiceResponse,
} from "./types";

const createSalesInvoicePath = "sendinvoice";
const salesInvoicesListPath = "getinvoices";
const invoicesByIdentifierPath = "getinvoices2";
const salesInvoiceDetailsPath = "getinvoice";
const deleteInvoicePath = "deleteinvoice";

type GetSalesInvoicesEndpointsArgs = Required<MeritConfig>;

function getSalesInvoicesEndpoints(
  args: GetSalesInvoicesEndpointsArgs,
  signPayload?: SignPayload
) {
  const signPayloadFn: SignPayload = signPayload ?? getSignPayload(args);
  const { apiId, localization } = args;
  async function createSalesInvoice(args: CreateSalesInvoiceParams) {
    const url: EndpointUrl = `${URL_V2[localization]}${createSalesInvoicePath}`;
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
  async function salesInvoicesList(args: SalesInvoicesListParams) {
    const baseUrl = URL_V2[localization];
    let url: EndpointUrl;
    let payload: PayloadType;
    if (isInvoicesParams(args)) {
      url = `${baseUrl}${salesInvoicesListPath}`;
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

    const response = await fetch(urlWithParams, config);

    return handleApiResponse<SalesInvoicesesListResponse>(response);
  }
  async function salesInvoiceDetails(args: InvoiceFields) {
    const url: EndpointUrl = `${URL_V2[localization]}${salesInvoiceDetailsPath}`;
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
  async function deleteSalesInvoice(args: DeleteInvoiceParams) {
    const url: EndpointUrl = `${URL_V1[localization]}${deleteInvoicePath}`;
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

    return handleApiResponse<DeleteSalesInvoiceResponse>(response);
  }
  return {
    createSalesInvoice,
    salesInvoicesList,
    salesInvoiceDetails,
    deleteSalesInvoice,
  };
}

function isInvoicesParams(
  args: SalesInvoicesListParams
): args is InvoicesParams {
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
export default getSalesInvoicesEndpoints;
