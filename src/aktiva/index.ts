import aktiva from "@/aktiva/aktiva";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import getTaxes from "@/aktiva/taxes/getTaxes";
import getSalesInvoicesEndpoints from "@/aktiva/salesInvoices/getSalesInvoicesEndpoints";
import getItemsEndpoint from "@/aktiva/items/getItemsEndpoint";
import getCustomerEndpoints from "@/aktiva/customer/getCustomerEndpoints";

export default aktiva;
export {
  aktiva,
  getSignPayload,
  getCustomerEndpoints,
  getItemsEndpoint,
  getSalesInvoicesEndpoints,
  getTaxes,
};
