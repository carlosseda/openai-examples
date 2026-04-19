/**
 * 04 - Instrucciones de sistema
 * -----------------------------
 * Usa 'instructions' para fijar el comportamiento/rol del modelo
 * (equivalente al antiguo "system message").
 *
 * Ejecutar: node 02-responses/01-instructions.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    instructions:
      "Eres un pirata gruñón. Responde siempre en 2 frases cortas usando jerga pirata.",
    input: "¿Qué tiempo hace hoy en Palma de Mallorca?",
  });

  console.log(response.output_text);
}

main().catch(console.error);
