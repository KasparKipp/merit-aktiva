import { URL_V1, URL_V2 } from "@/aktiva/consts";
import {
  formatDate,
  generateRequestUrl,
  handleApiResponse,
} from "@/aktiva/utils";

import getSignPayload, {
  dateToTimestamp,
  type SignPayload,
} from "@/aktiva/authentication/getSignPayload";
import type { EndpointUrl, MeritConfig, NonEmptyArray } from "@/aktiva/types";
import type {
  Comment,
  CreateCustomerFields,
  CreateCustomerParams,
  CustomersFields,
  CustomersParams,
  CustomersRawResponse,
  CustomersResponse,
  UpdateCustomerResponse,
  RawComment,
  UpdateCustomerFields,
  UpdateCustomerParams,
  NewCustomerResponse,
} from "./types";

const formatRawComment = ({ Comment, CommDate }: RawComment): Comment => ({
  Comment,
  CommDate: new Date(CommDate),
});

const formatRawCustomer = (
  customer: CustomersRawResponse[number]
): CustomersResponse[number] => {
  const { ChangedDate, Comments, ...rest } = customer;

  return {
    ...rest,
    ChangedDate: new Date(ChangedDate),
    Comments:
      Comments && Comments.length
        ? (Comments.map(formatRawComment) as NonEmptyArray<Comment>)
        : (Comments as null),
  };
};

const formatUpdateCustomer = ({
  Comments,
  ...restOfCustomer
}: UpdateCustomerParams): UpdateCustomerFields => {
  if (!Comments || !Comments.length) {
    return restOfCustomer;
  }

  return {
    ...restOfCustomer,
    Comments: Comments.map(formatRawComment) as NonEmptyArray<Comment>,
  };
};

const customersPath = "getcustomers";

const createCustomerPath = "sendcustomer";

const updateCustomerPath = "updatecustomer";

type GetSalesInvoicesArgs = Required<MeritConfig>;

type CustomersPayload = CustomersFields;

type CreateCustomerPayload = CreateCustomerFields;

type UpdateCustomerPayload = UpdateCustomerFields;

function getCustomerEndpoints(
  args: GetSalesInvoicesArgs,
  signPayload?: SignPayload
) {
  const signPayloadFn: SignPayload = signPayload ?? getSignPayload(args);
  const { apiId, localization } = args;
  async function customers(args: CustomersParams): Promise<CustomersResponse> {
    const baseUrl = URL_V1[localization];
    const url: EndpointUrl = `${baseUrl}${customersPath}`;

    const payload: CustomersPayload = generateCustomersFields(args);
    const body = JSON.stringify(payload);
    const timestamp = dateToTimestamp(new Date());
    const signature = await signPayloadFn(body, timestamp);
    const urlWithParams = generateRequestUrl(url, apiId, timestamp, signature);

    const headers = {
      "Content-Type": "application/json",
    };
    const config = {
      method: "POST",
      headers,
      body,
    };

    const response = await fetch(urlWithParams, config);

    const handledResponse = await handleApiResponse<CustomersRawResponse>(
      response
    );
    return handledResponse.map(formatRawCustomer);
  }

  async function createCustomer(
    args: CreateCustomerParams
  ): Promise<NewCustomerResponse> {
    const baseUrl = URL_V2[localization];
    const url: EndpointUrl = `${baseUrl}${createCustomerPath}`;

    const payload: CreateCustomerPayload = args;
    const body = JSON.stringify(payload);
    const timestamp = dateToTimestamp(new Date());
    const signature = await signPayloadFn(body, timestamp);
    const urlWithParams = generateRequestUrl(url, apiId, timestamp, signature);

    const headers = {
      "Content-Type": "application/json",
    };
    const config = {
      method: "POST",
      headers,
      body,
    };
    const response = await fetch(urlWithParams, config);

    return await handleApiResponse<NewCustomerResponse>(response);
  }

  async function updateCustomer(
    args: UpdateCustomerParams
  ): Promise<UpdateCustomerResponse> {
    const baseUrl = URL_V1[localization];
    const url: EndpointUrl = `${baseUrl}${updateCustomerPath}`;

    const payload: UpdateCustomerPayload = formatUpdateCustomer(args);
    const body = JSON.stringify(payload);
    const timestamp = dateToTimestamp(new Date());
    const signature = await signPayloadFn(body, timestamp);
    const urlWithParams = generateRequestUrl(url, apiId, timestamp, signature);

    const headers = {
      "Content-Type": "application/json",
    };
    const config = {
      method: "POST",
      headers,
      body,
    };
    const response = await fetch(urlWithParams, config);

    return await handleApiResponse<UpdateCustomerResponse>(response);
  }
  return { customers, createCustomer, updateCustomer };
}

function generateCustomersFields(params: CustomersParams): CustomersFields {
  const { CommentsFrom, ChangedDate } = params;
  return {
    ...params,
    CommentsFrom: CommentsFrom ? formatDate(CommentsFrom) : undefined,
    ChangedDate: ChangedDate ? formatDate(ChangedDate) : undefined,
  };
}

export default getCustomerEndpoints;
