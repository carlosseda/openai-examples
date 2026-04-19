/**
 * 42 - Manejo de errores y rate limits
 * ------------------------------------
 * Tipos de errores del SDK y cómo diferenciarlos.
 *
 * Ejecutar: node 07-production/06-error-handling.js
 */
const OpenAI = require("openai");
const { openai } = require("../shared/client");

async function demo(label, fn) {
  console.log(`\n--- ${label} ---`);
  try {
    await fn();
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      console.log("  Tipo:", err.constructor.name);
      console.log("  Status:", err.status);
      console.log("  Código:", err.code);
      console.log("  Mensaje:", err.message);
    } else {
      console.log("  Error genérico:", err.message);
    }
  }
}

async function main() {
  // Error: modelo que no existe
  await demo("Modelo inexistente", () =>
    openai.responses.create({ model: "modelo-que-no-existe", input: "hola" })
  );

  // Error: parámetros inválidos
  await demo("Parámetro inválido", () =>
    openai.responses.create({
      model: "gpt-4o-mini",
      input: "hola",
      temperature: 99, // fuera de rango
    })
  );

  // Comprobar headers de rate limit después de una llamada OK
  const { response, data } = await openai.responses
    .create({ model: "gpt-4o-mini", input: "hola" })
    .withResponse();

  console.log("\n--- Headers de rate limit ---");
  console.log("  Límite req/min:", response.headers.get("x-ratelimit-limit-requests"));
  console.log("  Restantes:", response.headers.get("x-ratelimit-remaining-requests"));
  console.log("  Reset en:", response.headers.get("x-ratelimit-reset-requests"));
}

main().catch(console.error);
