import getSignPayload from "@/aktiva/authentication/getSignPayload";
import { MeritConfig } from "@/aktiva/types";
import getSalesInvoices from "@/aktiva/salesInvoices/getSalesInvoices";
import getSalesInvoiceDetails from "@/aktiva/salesInvoiceDetails/getSalesInvoiceDetails";
import getCreateSalesInvoice from "@/aktiva/createSalesInvoice/getCreateSalesInvoice";
import getDeleteSalesInvoice from "@/aktiva/deleteSalesInvoice/getDeleteSalesInvoice";
import getTaxes from "@/aktiva/taxes/getTaxes";

export default function aktiva(opts: MeritConfig) {
  const { localization = "EE", ...rest } = opts;
  const resolvedDefaults = { localization, ...rest };
  const signPayload = getSignPayload(opts);

  const salesInvoices = getSalesInvoices(resolvedDefaults, signPayload);
  const salesInvoicesDetails = getSalesInvoiceDetails(
    resolvedDefaults,
    signPayload
  );
  const createSalesInvoice = getCreateSalesInvoice(
    resolvedDefaults,
    signPayload
  );
  const deleteSalesInvoice = getDeleteSalesInvoice(
    resolvedDefaults,
    signPayload
  );
  const taxes = getTaxes(resolvedDefaults, signPayload);

  return {
    signPayload,
    salesInvoices,
    salesInvoicesDetails,
    createSalesInvoice,
    deleteSalesInvoice,
    taxes,
  };
}
