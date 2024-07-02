import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { MeritConfig } from "@/aktiva/types";
import getSalesInvoices from "@/aktiva/salesInvoices/getSalesInvoicesEndpoints";
import getTaxes from "@/aktiva/taxes/getTaxes";
import getCustomerEndpoints from "@/aktiva/customer/getCustomerEndpoints";
import getItemsEndpoint from "@/aktiva/items/getItemsEndpoint";
import getSalesInvoicesEndpoints from "@/aktiva/salesInvoices/getSalesInvoicesEndpoints";

export default function aktiva(opts: MeritConfig) {
  const { localization = "EE", ...rest } = opts;
  const resolvedDefaults = { localization, ...rest };

  const signPayload = getSignPayload(opts);
  
  const customer = getCustomerEndpoints(resolvedDefaults, signPayload);

  const items = getItemsEndpoint(resolvedDefaults, signPayload);

  const salesInvoices = getSalesInvoicesEndpoints(resolvedDefaults, signPayload);

  const taxes = getTaxes(resolvedDefaults, signPayload);

  return {
    signPayload,
    salesInvoices,
    taxes,
    customer,
    items
  };
}
