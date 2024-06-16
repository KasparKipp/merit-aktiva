import { describe, it, expect } from "vitest";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { MeritConfig } from "@/types";
import getCustomerEndpoint from "@/aktiva/customer/getCustomerEndpoint";
import { isUuid } from "@/aktiva/testutils";
import {
  ByCustomerIdParams,
  CreateCustomerParams,
  UpdateCustomerParams,
} from "@/aktiva/customer/types";

const itemsTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const customer = getCustomerEndpoint(itemsTestConfig);

describe("UpdateCustomer endpoint", () => {
  it("Should Update all fields", async () => {
    const payload: CreateCustomerParams = {
      Name: "Customer to update 2",
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
    const createdCustomer = await customer.createCustomer(payload);

    const updatePayload: UpdateCustomerParams = {
      Id: createdCustomer.Id,
      Name: "Customer updated 1",
      RegNo: "12345679",
      NotTDCustomer: false,
      VatRegNo: "1234",
      PaymentDeadLine: 8,
      OverDueCharge: 0.005,
      RefNoBase: "1234",
      Address: "Adressupdated",
      CountryCode: "EE", // Required
      City: "CityUpdated",
      PostalCode: "zipcodeUpdated",
      PhoneNo: "Phone1updated",
      PhoneNo2: "Phone2updated",
      Email: "customerupdated@email.ee",
      SalesInvLang: "ET", // ET,EN,RU,FI,PL,SV
      Contact: "Contacupdatedt",
      BankAccount: "EE4206969updated",
    };

    await customer.updateCustomer(updatePayload);
    const response = (await customer.customers({ Id: updatePayload.Id })).at(0);

    expect(!!response, "Expected to find the updated user").toBe(true);
    if (!response) throw Error("No response");

    expect(
      isUuid(response.CustomerId),
      `Expected CustomerId ${response.CustomerId} to be a valid UUID`
    ).toBe(true);
    expect(
      response.CustomerId === updatePayload.Id,
      "Expected customer id to match"
    ).toBe(true);
    expect(
      response.Name === updatePayload.Name,
      "Expected customer name to match"
    ).toBe(true);
    expect(
      response.RegNo === updatePayload.RegNo,
      "Expected customer regno to match"
    ).toBe(true);
    expect(
      response.Contact === updatePayload.Contact,
      "Expected customer contact to match"
    ).toBe(true);
    expect(
      response.PhoneNo === updatePayload.PhoneNo,
      "Expected customer phone to match"
    ).toBe(true);
    expect(
      response.PhoneNo2 === updatePayload.PhoneNo2,
      "Expected customer phone2 to match"
    ).toBe(true);
    expect(
      response.Address === updatePayload.Address,
      "Expected customer address to match"
    ).toBe(true);
    expect(
      response.City === updatePayload.City,
      "Expected customer city to match"
    ).toBe(true);
    /* Can't update with API
    expect(
      response.County === updatePayload.County,
      "Expected customer county to match"
    ).toBe(true);
    */
    expect(
      response.CountryCode === updatePayload.CountryCode,
      "Expected customer country to match"
    ).toBe(true);
    expect(
      response.PostalCode === updatePayload.PostalCode,
      "Expected customer postalcode to match"
    ).toBe(true);
    expect(
      response.CountryCode === updatePayload.CountryCode,
      "Expected customer country to match"
    ).toBe(true);
    expect(
      response.CountryName === "ESTONIA",
      "Expected customer country to match"
    ).toBe(true);
    expect(response.FaxNo === null, "Expected customer fax to be null").toBe(
      true
    );
    expect(
      response.Email === updatePayload.Email,
      "Expected customer email to match"
    ).toBe(true);
    expect(
      response.PaymentDeadLine === updatePayload.PaymentDeadLine,
      "Expected customer payment deadline to match"
    ).toBe(true);
    expect(
      response.OverdueCharge === updatePayload.OverDueCharge,
      "Expected customer over due charge to match"
    ).toBe(true);
    /* Can't update with API
    expect(
      response.CurrencyCode === updatePayload.CurrencyCode,
      "Expected customer currency to match"
    ).toBe(true);
    */
    expect(
      response.VatRegNo === updatePayload.VatRegNo,
      "Expected vat regno to match"
    ).toBe(true);
    expect(response.BankName === null, "Expected bank name to be null").toBe(
      true
    );
    expect(
      response.BankAccount === updatePayload.BankAccount,
      "Expected bank account to match"
    ).toBe(true);
    expect(
      response.NotTDCustomer === updatePayload.NotTDCustomer,
      "Expected notTdCustomer to match"
    ).toBe(true);
    expect(
      response.SalesInvLang === updatePayload.SalesInvLang,
      "Expected customer sales invoice language to match"
    ).toBe(true);
    expect(
      response.RefNoBase === updatePayload.RefNoBase,
      "Expected customer refno base to match"
    ).toBe(true);
  });
});
