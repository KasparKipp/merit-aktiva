import { describe, it, expect } from "vitest";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { MeritConfig } from "@/types";
import getCustomerEndpoint from "@/aktiva/customer/getCustomerEndpoint";
import { isUuid } from "@/aktiva/testutils";
import {
  ByCustomerIdParams,
  CreateCustomerParams,
} from "@/aktiva/customer/types";

const itemsTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const signPayload = getSignPayload(itemsTestConfig);
const customer = getCustomerEndpoint(itemsTestConfig, signPayload);

describe("CreateCustomer endpoint", () => {
  it("Should create minimal customer", async () => {
    const payload: CreateCustomerParams = {
      Name: "Newly created customer 1",
      CountryCode: "EE",
    };
    const response = await customer.createCustomer(payload);

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
      Id: "0dd96ef1-d614-4493-891e-75f08fb667c2",
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
    const response = await customer.createCustomer(payload);

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

  it("Created customer should have all fields", async () => {
    const payload: CreateCustomerParams = {
      Id: "0dd96ef1-d614-4493-891e-75f08fb667c3",
      Name: "Newly created customer 3",
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
      BankAccount: "EE091276823174833589",
      Dimensions: [],
      CustGrCode: undefined,
      CustGrId: "00000000-0000-0000-0000-000000000000",
      ShowBalance: true,
      ApixEInv: undefined,
    };
    await customer.createCustomer(payload);
    const createdCustomer = (
      await customer.customers({ Id: payload.Id } satisfies ByCustomerIdParams)
    ).at(0);

    expect(
      !!createdCustomer,
      "Expected newly created customer to be returned"
    ).toBe(true);
    if (!createdCustomer) throw Error();
    expect(
      createdCustomer.CustomerId === payload.Id,
      "Expected customer id to match"
    ).toBe(true);
    expect(
      createdCustomer.Name === payload.Name,
      "Expected customer name to match"
    ).toBe(true);
    expect(
      createdCustomer.RegNo === payload.RegNo,
      "Expected customer regno to match"
    ).toBe(true);
    expect(
      createdCustomer.Contact === payload.Contact,
      "Expected customer contact to match"
    ).toBe(true);
    expect(
      createdCustomer.PhoneNo === payload.PhoneNo,
      "Expected customer phone to match"
    ).toBe(true);
    expect(
      createdCustomer.PhoneNo2 === payload.PhoneNo2,
      "Expected customer phone2 to match"
    ).toBe(true);
    expect(
      createdCustomer.Address === payload.Address,
      "Expected customer address to match"
    ).toBe(true);
    expect(
      createdCustomer.City === payload.City,
      "Expected customer city to match"
    ).toBe(true);
    expect(
      createdCustomer.County === payload.County,
      "Expected customer county to match"
    ).toBe(true);
    expect(
      createdCustomer.CountryCode === payload.CountryCode,
      "Expected customer country to match"
    ).toBe(true);
    expect(
      createdCustomer.PostalCode === payload.PostalCode,
      "Expected customer postalcode to match"
    ).toBe(true);
    expect(
      createdCustomer.CountryCode === payload.CountryCode,
      "Expected customer country to match"
    ).toBe(true);
    expect(
      createdCustomer.CountryName === "ESTONIA",
      "Expected customer country to match"
    ).toBe(true);
    expect(
      createdCustomer.FaxNo === null,
      "Expected customer fax to be null"
    ).toBe(true);
    expect(
      createdCustomer.Email === payload.Email,
      "Expected customer email to match"
    ).toBe(true);
    /* Just doesn't set the homepage, can only be added manually it seems
    expect(
      createdCustomer.HomePage === payload.HomePage,
      "Expected customer homepage to match"
    ).toBe(true);
    */
    expect(
      createdCustomer.PaymentDeadLine === payload.PaymentDeadLine,
      "Expected customer payment deadline to match"
    ).toBe(true);
    expect(
      createdCustomer.OverdueCharge === payload.OverDueCharge,
      "Expected customer over due charge to match"
    ).toBe(true);
    expect(
      createdCustomer.CurrencyCode === payload.CurrencyCode,
      "Expected customer currency to match"
    ).toBe(true);
    expect(
      createdCustomer.CustomerGroupId === payload.CustGrId,
      "Expected customer group id to match"
    ).toBe(true);
    expect(
      createdCustomer.CustomerGroupName === null,
      "Expected customer group name to be null"
    ).toBe(true);
    expect(
      createdCustomer.VatRegNo === payload.VatRegNo,
      "Expected vat regno to match"
    ).toBe(true);
    expect(
      createdCustomer.BankName === null,
      "Expected bank name to be null"
    ).toBe(true);
    expect(
      createdCustomer.BankAccount === payload.BankAccount,
      "Expected bank account to match"
    ).toBe(true);
    expect(
      createdCustomer.NotTDCustomer === payload.NotTDCustomer,
      "Expected notTdCustomer to match"
    ).toBe(true);
    expect(
      createdCustomer.SalesInvLang === payload.SalesInvLang,
      "Expected customer sales invoice language to match"
    ).toBe(true);
    expect(
      createdCustomer.RefNoBase === payload.RefNoBase,
      "Expected customer refno base to match"
    ).toBe(true);
    expect(
      createdCustomer.Comments === null,
      "Expected comments to be null"
    ).toBe(true);
    expect(
      createdCustomer.Dimensions === null,
      "Expected dimensions to be null"
    ).toBe(true);
    expect(
      createdCustomer.InvSendPref === null,
      "Expected invSendPref to be null"
    ).toBe(true);
  });

  it("Should throw error when customer already exists", async () => {
    const payload: CreateCustomerParams = {
      Name: "Newly created customer 1",
      CountryCode: "EE",
    };

    expect(
      async () => await customer.createCustomer(payload),
      "Expected createCustomer to throw error when customer already exists"
    ).rejects.toThrowError("api-custexists");
  });
});
