import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const ANDREANI_USER = process.env.ANDREANI_USER || "testinternoqa_gla";
const ANDREANI_PASS = process.env.ANDREANI_PASS || "iqVsIeR0q6voXcrs7HDV!";
const ANDREANI_CLIENT_CODE = process.env.ANDREANI_CLIENT_CODE || "CL0003750";
const ANDREANI_CONTRACT_DOM = process.env.ANDREANI_CONTRACT_DOM || "400006709";

// 🚚 URL absoluta con fallback
const API_URL = process.env.ANDREANI_API_URL || "https://apisqa.andreani.com/v1";
const url = `${API_URL}/ordenes-de-envio`;
console.log("URL usada:", url);

const authString = `${ANDREANI_USER}:${ANDREANI_PASS}`;
const authBase64 = Buffer.from(authString).toString("base64");
console.log("Authorization header:", `Basic ${authBase64}`);

const envioData = {
  contrato: ANDREANI_CONTRACT_DOM,
  origen: { codigoPostal: process.env.VITE_ORIGEN_CP || "4000" },
  destino: { codigoPostal: "4000" },
  bultos: [{ peso: 1 }]
};

async function testEnvio() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authBase64}`,
        "Content-Type": "application/json",
        "x-ibm-client-id": ANDREANI_CLIENT_CODE
      },
      body: JSON.stringify(envioData),
    });

    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Body:", text);
  } catch (err) {
    console.error("❌ Error en testEnvio:", err);
  }
}

testEnvio();

