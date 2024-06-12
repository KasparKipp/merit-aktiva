import { describe, it, expect } from "vitest";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { MeritConfig } from "@/types";
import getCustomerEndpoint from "@/aktiva/customer/getCustomerEndpoint";
import { isUuid } from "@/aktiva/testutils";
import {
  CreateCustomerParams,
} from "@/aktiva/customer/types";

const itemsTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const signPayload = getSignPayload(itemsTestConfig);
const { createCustomer } = getCustomerEndpoint(itemsTestConfig, signPayload);

describe("Customers endpoint", () => {
  it("Should create minimal customer", async () => {
    const payload: CreateCustomerParams = {
      Name: "Newly created customer 1",
      CountryCode: "EE",
    };
    const response = await createCustomer(payload);

    expect(response).not.toBe(null);
    expect(
      !!response.Id,
      "Expected newly created customer ID to be created"
    ).toBe(true);
    expect(
      isUuid(response.Id),
      `Expected id ${response.Id} to be a valid UUID`
    ).toBe(true);
    expect(
      typeof response.Name === "string",
      `Expected Name ${response.Name} to be a string`
    ).toBe(true);
    expect(
      response.Name === payload.Name,
      "Expected created customer to have same Name as specified in payload"
    ).toBe(true);
  });

  it("Should create customer with all fields", async () => {
    const payload: CreateCustomerParams = {
      Id: "0dd96ef1-d614-4493-891e-75f08fb667c6",
      Name: "Newly created customer 2",
      RegNo: "12345678",
      NotTDCustomer: true,
      VatRegNo: "123",
      CurrencyCode: "EUR",
      PaymentDeadLine: 7,
      OverDueCharge: 0.05,
      RefNoBase: "123",
      Address: "Adress",
      CountryCode: "EE", // Required
      County: "county",
      City: "City",
      PostalCode: "zipcode",
      PhoneNo: "Phone1",
      PhoneNo2: "Phone2",
      HomePage: "customer.ee",
      Email: "customer@email.ee",
      SalesInvLang: "ET", // ET,EN,RU,FI,PL,SV
      Contact: "Contact",
      GLNCode: "735005385",
      PartyCode: "PartyCode",
      EInvOperator: 1, // 1 - Not exist, 2 - E-invoices to the bank through Omniva, 3 - Bank ( full extent E-invoice), 4- Bank (limited extent E-invoice)
      EInvPaymId: undefined,
      BankAccount: "EE4206969",
      Dimensions: [],
      CustGrCode: undefined,
      CustGrId: "00000000-0000-0000-0000-000000000000",
      ShowBalance: true,
      ApixEInv: undefined,
    };
    const response = await createCustomer(payload);

    expect(response).not.toBe(null);
    expect(
      isUuid(response.Id),
      `Expected id ${response.Id} to be a valid UUID`
    ).toBe(true);
    expect(
      response.Id === payload.Id,
      "Expected created customer to have same Id as specified in payload"
    ).toBe(true);
    expect(
      typeof response.Name === "string",
      `Expected Name ${response.Name} to be a string`
    ).toBe(true);
    expect(
      response.Name === payload.Name,
      "Expected created customer to have same Name as specified in payload"
    ).toBe(true);
  });

  it("Should throw error when customer already exists", async () => {
    const payload: CreateCustomerParams = {
      Name: "Newly created customer 1",
      CountryCode: "EE",
    };

    expect(
      async () => await createCustomer(payload),
      "Expected createCustomer to throw error when customer already exists"
    ).rejects.toThrowError("api-custexists");
  });
});
