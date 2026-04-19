/**
 * Cliente de OpenAI compartido entre todos los scripts.
 * Carga la API key desde .env y exporta una instancia del cliente.
 */
require("dotenv").config();
const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Falta OPENAI_API_KEY. Copia .env.example a .env y pon tu key.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // organization: process.env.OPENAI_ORG_ID,
  // project: process.env.OPENAI_PROJECT_ID,
});

module.exports = { openai };
