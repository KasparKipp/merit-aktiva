import { type UUID } from "crypto";

import { URL_V1 } from "@/aktiva/consts";
import { generateRequestUrl, handleApiResponse } from "@/aktiva/utils";

import getSignPayload, {
  dateToTimestamp,
  type SignPayload,
} from "@/aktiva/authentication/getSignPayload";
import type { EndpointUrl, MeritConfig } from "@/aktiva/types";

const path = "deleteinvoice";

export type DeleteInvoiceFields = {
  Id: UUID;
};
export type DeleteInvoiceParams = DeleteInvoiceFields;

type GetDeleteSalesInvoice = Required<MeritConfig>;
type DeleteSalesInvoiceResponse = string;

function getDeleteSalesInvoice(
  args: GetDeleteSalesInvoice,
  signPayload?: SignPayload
) {
  const signPayloadFn: SignPayload = signPayload ?? getSignPayload(args);
  const { apiId, localization } = args;
  async function salesInvoices(args: DeleteInvoiceParams) {
    const url: EndpointUrl = `${URL_V1[localization]}${path}`;
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
  return salesInvoices;
}

export default getDeleteSalesInvoice;
