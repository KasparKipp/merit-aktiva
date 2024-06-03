import { type UUID } from "crypto";

import { URL_V1 } from "@/aktiva/consts";
import { generateRequestUrl, handleApiResponse } from "@/aktiva/utils";

import getSignPayload, {
  dateToTimestamp,
  type SignPayload,
} from "@/aktiva/authentication/getSignPayload";
import type { EndpointUrl, MeritConfig, NonEmptyArray } from "@/aktiva/types";

const path = "gettaxes";

type GetTaxes = Required<MeritConfig>;

type Tax = {
  Id: UUID;
  Code: string;
  Name: string;
  NameEN: string;
  NameRU: string;
  TaxPct: number;
  NonActive: boolean;
};
type TaxResponse = NonEmptyArray<Tax>;

function getTaxes(args: GetTaxes, signPayload?: SignPayload) {
  const signPayloadFn: SignPayload = signPayload ?? getSignPayload(args);
  const { apiId, localization } = args;
  async function taxes() {
    const url: EndpointUrl = `${URL_V1[localization]}${path}`;
    const body = JSON.stringify({});
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

    return handleApiResponse<TaxResponse>(response);
  }
  return taxes;
}

export default getTaxes;
