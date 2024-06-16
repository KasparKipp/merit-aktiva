import { describe, it, expect } from "vitest";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { MeritConfig } from "@/types";
import getCustomerEndpoint from "@/aktiva/customer/getCustomerEndpoint";
import { isUuid } from "@/aktiva/testutils";
import { AllCustomersParams, CustomersResponse } from "@/aktiva/customer/types";

const itemsTestConfig = {
  apiId: process.env.TEST_MERIT_API_ID as MeritConfig["apiId"],
  apiKey: process.env.TEST_MERIT_API_KEY as MeritConfig["apiKey"],
  localization: "EE",
} as const;

const customer = getCustomerEndpoint(itemsTestConfig);

describe("Customers endpoint", () => {
  it("Should return some customers", async () => {
    await customer.createCustomer({ Name: "Customer 1", CountryCode: "EE" });

    const payload: AllCustomersParams = {};
    const response = await customer.customers(payload);

    expect(response).not.toBe(null);
    expect(response?.length !== 0).toBe(true);
  });

  it("Returned items should be of correct type", async () => {
    const payload: AllCustomersParams = {};
    const response = await customer.customers(payload);

    expect(response).not.toBe(null);
    expect(response?.length !== 0).toBe(true);
    if (response === null) throw Error();

    const expectCorrectReturnType = (customer: CustomersResponse[number]) => {
      expect(
        isUuid(customer.CustomerId),
        `Expected CustomerId ${customer.CustomerId} to be a valid UUID`
      ).toBe(true);
      expect(
        typeof customer.Name === "string",
        `Expected Name ${customer.Name} to be a string`
      ).toBe(true);
      expect(
        typeof customer.RegNo === "string" || customer.RegNo === null,
        `Expected RegNo ${customer.RegNo} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.Contact === "string" || customer.Contact === null,
        `Expected Contact ${customer.Contact} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.PhoneNo === "string" || customer.PhoneNo === null,
        `Expected PhoneNo ${customer.PhoneNo} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.PhoneNo2 === "string" || customer.PhoneNo2 === null,
        `Expected PhoneNo2 ${customer.PhoneNo2} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.Address === "string" || customer.Address === null,
        `Expected Address ${customer.Address} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.City === "string" || customer.City === null,
        `Expected City ${customer.City} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.County === "string" || customer.County === null,
        `Expected County ${customer.County} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.PostalCode === "string" || customer.PostalCode === null,
        `Expected PostalCode ${customer.PostalCode} to be a string or null`
      ).toBe(true);
      expect(
        ["EE", "EN", "RU", "FI", "PL", "SV"].some(
          (countryCode) =>
            countryCode.toLowerCase() === customer.CountryCode.toLowerCase()
        ) === true,
        `Expected CountryCode ${
          customer.CountryCode
        } to be one of the following: ${[
          "EE",
          "EN",
          "RU",
          "FI",
          "PL",
          "SV",
        ].join(", ")}`
      ).toBe(true);
      expect(
        typeof customer.CountryName === "string",
        `Expected CountryName ${customer.CountryName} to be a string`
      ).toBe(true);
      expect(
        typeof customer.FaxNo === "string" || customer.FaxNo === null,
        `Expected FaxNo ${customer.FaxNo} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.Email === "string" || customer.Email === null,
        `Expected Email ${customer.Email} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.HomePage === "string" || customer.HomePage === null,
        `Expected HomePage ${customer.HomePage} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.PaymentDeadLine === "number",
        `Expected PaymentDeadLine ${customer.PaymentDeadLine} to be a number`
      ).toBe(true);
      expect(
        typeof customer.OverdueCharge === "number",
        `Expected OverdueCharge ${customer.OverdueCharge} to be a number`
      ).toBe(true);
      expect(
        typeof customer.OverdueCharge === "number",
        `Expected OverdueCharge ${customer.OverdueCharge} to be a number`
      ).toBe(true);
      expect(
        ["EUR", "USD", "RUB"].includes(customer.CurrencyCode) === true,
        `Expected CurrencyCode ${
          customer.CurrencyCode
        } to be one of the following: ${["EUR", "USD", "RUB"].join(", ")}`
      ).toBe(true);
      expect(
        isUuid(customer.CustomerGroupId),
        `Expected CustomerGroupId ${customer.CustomerGroupId} to be a valid UUID`
      ).toBe(true);
      expect(
        typeof customer.CustomerGroupName === "string" ||
          customer.CustomerGroupName === null,
        `Expected CustomerGroupName ${customer.CustomerGroupName} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.VatRegNo === "string" || customer.VatRegNo === null,
        `Expected VatRegNo ${customer.VatRegNo} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.BankName === "string" || customer.BankName === null,
        `Expected BankName ${customer.BankName} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.BankAccount === "string" ||
          customer.BankAccount === null,
        `Expected BankAccount ${customer.BankAccount} to be a string or null`
      ).toBe(true);
      expect(
        typeof customer.NotTDCustomer === "boolean",
        `Expected NotTDCustomer ${customer.NotTDCustomer} to be a boolean`
      ).toBe(true);
      expect(
        ["ET", "EN", "RU", "FI", "PL", "SV"].some(
          (lang) => lang.toLowerCase() === customer.SalesInvLang.toLowerCase()
        ) === true,
        `Expected SalesInvLang ${
          customer.SalesInvLang
        } to be one of the following: ${[
          "ET",
          "EN",
          "RU",
          "FI",
          "PL",
          "SV",
        ].join(", ")}`
      ).toBe(true);
      expect(
        typeof customer.RefNoBase === "string" || customer.RefNoBase === null,
        `Expected RefNoBase ${customer.RefNoBase} to be a string or null`
      ).toBe(true);
      expect(
        customer.Comments === null ||
          (customer.Comments[0].CommDate instanceof Date &&
            typeof customer.Comments[0].Comment === "string"),
        `Expected Comments ${customer.RefNoBase} to be null or a nonempty Comment Array`
      ).toBe(true);
      expect(
        Array.isArray(customer.Dimensions) || customer.Dimensions === null,
        `Expected Dimensions ${customer.Dimensions} to be an array or null`
      ).toBe(true);

      expect(
        customer.ChangedDate instanceof Date === true,
        `Expected ChangeDate ${customer.ChangedDate} to be a Date`
      ).toBe(true);
      // TODO InvSendPref
      /*
      expect(
        typeof customer.InvSendPref === "UNKNOWN" || customer.RefNoBase === null,
        `Expected RefNoBase ${customer.RefNoBase} to be a string or null`
      ).toBe(true);
       */
    };
    response.forEach(expectCorrectReturnType);
  });
});
