import { createHmac } from "node:crypto";
import { MeritConfig, Timestamp } from "../types";
import { dateToTimestamp } from "../utils";

type GetSignPayloadParams = Pick<MeritConfig, "apiId" | "apiKey">;
function getSignPayload({ apiId, apiKey }: GetSignPayloadParams) {
  if (!apiId) throw Error("MeritConfig is missing apiId");
  if (!apiKey) throw Error("MeritConfig is missing apiKey");
  async function signPayload(bodyAsString: string, timestamp: Timestamp) {
    const dataString = apiId + timestamp + bodyAsString;

    const hash = createHmac("sha256", apiKey)
      .update(dataString)
      .digest("base64");

    const signature = btoa(hash);
    return signature;
  }
  return signPayload;
}

type SignPayload = ReturnType<typeof getSignPayload>;
export type { SignPayload };
export { dateToTimestamp };
export default getSignPayload;
