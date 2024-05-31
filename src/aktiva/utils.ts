import type { EndpointUrl, ServerErrorResponse } from "@/aktiva/types";
/**
 * Formats the current date and time into a string representation using the "yyyyMMddHHmmss" format.
 * Designed for use with the Merit Aktiva API to ensure proper representation of date and time in requests.
 *
 * @returns {string} A formatted date-timestamp representing the current date and time in the "yyyyMMddHHmmss" format.
 *
 * @example
 * const exampleDate = new Date('2024-04-20T13:37:00')
 * const formattedDateTime = formatCurrentDateTime(exampleDate);
 * console.log(formattedDateTime);
 * // Output: "20240420133700"  // (yyyyMMddHHmmss format)
 *
 * @see [Merit Aktiva API - Representation Formats](https://api.merit.ee/connecting-robots/reference-manual/representation-formats/)
 *
 * @notes
 * - Ensure that the formatted date and time string is used appropriately in your API requests
 *   according to the Merit Aktiva API documentation.
 * - Check the API documentation for any specific requirements or considerations
 *   regarding date and time representation in API requests.
 */
function dateToDateTimestamp(dateToFormat: Date): string {
  const year = dateToFormat.getFullYear();
  const month = (dateToFormat.getMonth() + 1).toString().padStart(2, "0");
  const day = dateToFormat.getDate().toString().padStart(2, "0");
  const hours = dateToFormat.getHours().toString().padStart(2, "0");
  const minutes = dateToFormat.getMinutes().toString().padStart(2, "0");
  const seconds = dateToFormat.getSeconds().toString().padStart(2, "0");

  const formattedDate =
    `${year}${month}${day}${hours}${minutes}${seconds}`;

  return formattedDate;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

function generateRequestUrl(
  url: EndpointUrl,
  apiId: string,
  timestamp: string,
  signature: string
) {
  return `${url}?ApiId=${apiId}&timestamp=${timestamp}&signature=${signature}` as const;
}

async function handleApiResponse<T>(response: Response): Promise<T | null> {
  if (response.ok) {
    return response.json();
  }

  switch (response.status) {
    case 400:
      const badRequestMessage: ServerErrorResponse = await response.json();
      throw Error(badRequestMessage.Message);
    case 401:
      const responseText = await response.text();
      if (responseText === "api-missingurlparam") {
        throw Error(
          "Unauthorized: Your request is missing url params or the apiId is invalid"
        );
      }
      if (responseText === "api-wronglicense") {
        throw Error(
          "Unauthorized: This company’s creator did not have PRO or PREMIUM license"
        );
      }
      break;
    case 500:
      const internalServerErrorMessage: ServerErrorResponse =
        await response.json();
      if (internalServerErrorMessage.ErrorCode === "FormatException") {
        throw Error(
          "Internal Server Error(FormatException): Request body in wrong format"
        );
      }
  }
  console.error(`Unknown response with status code ${response.status}`);
  throw new Error(response.statusText);
}


export {
  dateToDateTimestamp as dateToTimestamp,
  formatDate,
  generateRequestUrl,
  handleApiResponse,
};
