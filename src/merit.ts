import { getSignPayload } from "./authentication/functions";

export function merit(apiId: string, apiKey: string) {
  return { signPayload: getSignPayload(apiId, apiKey) };
}
