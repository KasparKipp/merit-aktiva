import { URL_V1 } from "@/aktiva/consts";
import { generateRequestUrl, handleApiResponse } from "@/aktiva/utils";

import getSignPayload, {
  dateToTimestamp,
  type SignPayload,
} from "@/aktiva/authentication/getSignPayload";
import type { EndpointUrl, MeritConfig } from "@/aktiva/types";
import type { ItemsParams, ItemsResponse } from "./types";

const path = "getitems";

type GetItemsEndpointConfig = Required<MeritConfig>;

function getItemsEndpoint(
  args: GetItemsEndpointConfig,
  signPayload?: SignPayload
) {
  const signPayloadFn: SignPayload = signPayload ?? getSignPayload(args);
  const { apiId, localization } = args;
  async function items(params: ItemsParams = {}) {
    const url: EndpointUrl = `${URL_V1[localization]}${path}`;
    const body = JSON.stringify(params);
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

    return handleApiResponse<ItemsResponse>(response);
  }
  return items;
}

export default getItemsEndpoint;
