import dotenv from "dotenv";

dotenv.config();

const ANDREANI_USER = process.env.ANDREANI_USER || "testinternoqa_gla";
const ANDREANI_PASS = process.env.ANDREANI_PASS || "iqVsIeR0q6voXcrs7HDV!";

const authString = `${ANDREANI_USER}:${ANDREANI_PASS}`;
const authBase64 = Buffer.from(authString).toString("base64");

console.log("Auth string:", authString);
console.log("Authorization header:", `Basic ${authBase64}`);

