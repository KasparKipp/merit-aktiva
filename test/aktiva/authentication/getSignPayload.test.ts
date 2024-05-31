import { describe, it, expect } from "vitest";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { MeritConfig } from "@/types";

const authTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
} as const;

const signPayload = getSignPayload(authTestConfig);

describe("getSignPayload", () => {
  it("Should return signPayload function", () => {
    expect(typeof signPayload).toBe("function");
  });

  it("Should error if apiId missing", async () => {
    const invalidConfig = {
      apiKey: authTestConfig.apiKey,
    };
    expect(() =>
      // @ts-expect-error
      getSignPayload(invalidConfig)
    ).toThrowError("MeritConfig is missing apiId");
  });

  it("Should error if apiKey missing", async () => {
    const invalidConfig = {
      apiId: authTestConfig.apiId,
    };
    expect(() =>
      // @ts-expect-error
      getSignPayload(invalidConfig)
    ).toThrowError("MeritConfig is missing apiKey");
  });
});

describe("signPayload", () => {
  it("Should produce different signatures for different timestamps", async () => {
    const bodyAsString = '{"key":"value"}';
    const timestamp1 = "2024-05-21T15:00:00Z";
    const timestamp2 = "2024-05-21T16:00:00Z";

    const signature1 = await signPayload(bodyAsString, timestamp1);
    const signature2 = await signPayload(bodyAsString, timestamp2);

    expect(signature1).not.toBe(signature2);
  });

  it("Should correctly sign the payload", async () => {
    const signPayload = getSignPayload({
      apiId: "b0aa16a1-535a-4f04-940c-913cee739d88",
      apiKey: "KwTUxemO9a/+o6w+Tip08LWtB8sugQ7+ZqKXePZ1WnE=",
    });
    const bodyAsString = '{"key":"value"}';
    const timestamp = "2024-04-12T16:00:00Z";
    const expectedSignature =
      "ZHFwa3JYVDJoRTJFNDVtK1VqMlMzeTFQRWt2YjZXR2lMNEZ1YnExODc3dz0="; // Replace with the actual expected signature

    const signature = await signPayload(bodyAsString, timestamp);
    expect(signature).toBe(expectedSignature);
  });

  it("Should produce different signatures for different payloads", async () => {
    const timestamp = "2024-05-21T15:00:00Z";
    const bodyAsString1 = '{"key":"value1"}';
    const bodyAsString2 = '{"key":"value2"}';

    const signature1 = await signPayload(bodyAsString1, timestamp);
    const signature2 = await signPayload(bodyAsString2, timestamp);

    expect(signature1).not.toBe(signature2);
  });

  it("Should produce different signatures for different apiId", async () => {
    const signPayload1 = getSignPayload({
      apiId: "1baa16a1-535a-4f04-940c-913cee739d88",
      apiKey: "KwTUxemO9a/+o6w+Tip08LWtB8sugQ7+ZqKXePZ1WnE=",
    });
    const signPayload2 = getSignPayload({
      apiId: "2baa16a1-535a-4f04-940c-913cee739d88",
      apiKey: "KwTUxemO9a/+o6w+Tip08LWtB8sugQ7+ZqKXePZ1WnE=",
    });
    const bodyAsString = '{"key":"value"}';
    const timestamp = "2024-04-12T16:00:00Z";

    const signature1 = await signPayload1(bodyAsString, timestamp);
    const signature2 = await signPayload2(bodyAsString, timestamp);

    expect(signature1).not.toBe(signature2);
  });

  it("Should produce different signatures for different apiKey", async () => {
    const signPayload1 = getSignPayload({
      apiId: "b0aa16a1-535a-4f04-940c-913cee739d88",
      apiKey: "LwTUxemO9a/+o6w+Tip08LWtB8sugQ7+ZqKXePZ1WnE=",
    });
    const signPayload2 = getSignPayload({
      apiId: "b0aa16a1-535a-4f04-940c-913cee739d88",
      apiKey: "KwTUxemO9a/+o6w+Tip08LWtB8sugQ7+ZqKXePZ1WnE=",
    });
    const bodyAsString = '{"key":"value"}';
    const timestamp = "2024-04-12T16:00:00Z";

    const signature1 = await signPayload1(bodyAsString, timestamp);
    const signature2 = await signPayload2(bodyAsString, timestamp);

    expect(signature1).not.toBe(signature2);
  });

  it("Should return a base64 encoded string", async () => {
    const bodyAsString = '{"key":"value"}';
    const timestamp = "2024-05-21T15:00:00Z";

    const signature = await signPayload(bodyAsString, timestamp);
    expect(signature).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
  });
});
