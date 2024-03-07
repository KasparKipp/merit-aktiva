import {createHmac} from "node:crypto"
/**
 * Formats the current date and time into a string representation using the "yyyyMMddHHmmss" format.
 * Designed for use with the Merit Aktiva API to ensure proper representation of date and time in requests.
 *
 * @returns {string} A formatted string representing the current date and time in the "yyyyMMddHHmmss" format.
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
const formatCurrentDate = (dateToFormat: Date) => {
  const year = dateToFormat.getFullYear();
  const month = (dateToFormat.getMonth() + 1).toString().padStart(2, "0");
  const day = dateToFormat.getDate().toString().padStart(2, "0");
  const hours = dateToFormat.getHours().toString().padStart(2, "0");
  const minutes = dateToFormat.getMinutes().toString().padStart(2, "0");
  const seconds = dateToFormat.getSeconds().toString().padStart(2, "0");

  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return formattedDate;
};

function getSignPayload(apiId: string, apiKey: string) {
  async function signPayload(payload: Object, currentDate: Date) {
    const timestamp = formatCurrentDate(currentDate);
    const dataString = apiId + timestamp + JSON.stringify(payload);

    const hash = createHmac("sha256", apiKey)
      .update(dataString)
      .digest("base64");

    const signature = btoa(hash);
    return signature;
  }
  return signPayload;
}

export { getSignPayload };
