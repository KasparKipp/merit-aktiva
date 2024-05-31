import aktiva from "@/aktiva/aktiva";
import getSignPayload from "@/aktiva/authentication/getSignPayload";
import getSalesInvoices from "@/aktiva/salesInvoices/getSalesInvoices";
import getSalesInvoiceDetails from "@/aktiva/salesInvoiceDetails/getSalesInvoiceDetails";
import getCreateSalesInvoice from "@/aktiva/createSalesInvoice/getCreateSalesInvoice";
import getDeleteSalesInvoice from "@/aktiva/deleteSalesInvoice/getDeleteSalesInvoice";
import getTaxes from "@/aktiva/taxes/getTaxes";

export default aktiva;
export {
  aktiva,
  getSignPayload,
  getSalesInvoices,
  getSalesInvoiceDetails,
  getCreateSalesInvoice,
  getDeleteSalesInvoice,
  getTaxes,
};
