import { merit } from "./merit";

const m = merit("id", "key")

m.signPayload({hello: "world"}, new Date())