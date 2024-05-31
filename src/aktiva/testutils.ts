import z from "zod";

function isUuid(maybeUuid: string): boolean {
  try {
    z.string().uuid().parse(maybeUuid);
    return true;
  } catch {
    return false;
  }
}

export { isUuid };
