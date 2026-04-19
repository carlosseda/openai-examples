/**
 * 12 - Modelos de razonamiento (reasoning)
 * ----------------------------------------
 * Modelos como o1, o3-mini, gpt-5 piensan antes de responder.
 * Usa `reasoning.effort` para controlar cuánto tiempo/dinero dedican.
 * Valores: "minimal" | "low" | "medium" | "high"
 *
 * Ejecutar: node 02-responses/09-reasoning.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "o4-mini", // modelo de razonamiento
    reasoning: { effort: "medium" },
    input:
      "Tengo 3 cajas. La primera pesa el doble que la segunda. La tercera pesa 5 kg más que la primera. Juntas pesan 45 kg. ¿Cuánto pesa cada una? Razona paso a paso.",
  });

  console.log("🧠 Respuesta:\n", response.output_text);

  // Los modelos de razonamiento reportan tokens de "reasoning" aparte
  console.log("\n📊 Uso de tokens:", response.usage);
}

main().catch(console.error);
