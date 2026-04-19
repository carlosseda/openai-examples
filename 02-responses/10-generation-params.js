/**
 * 13 - Parámetros de generación
 * -----------------------------
 * Demuestra el efecto de los parámetros más importantes:
 *   - temperature: aleatoriedad (0 = determinista, 2 = muy creativo)
 *   - top_p: sampling por núcleo (alternativa a temperature)
 *   - max_output_tokens: límite superior de tokens generados
 *
 * Ejecutar: node 02-responses/10-generation-params.js
 */
const { openai } = require("../shared/client");

async function main() {
  console.log("--- TEMPERATURE 0 (determinista) ---");
  for (let i = 0; i < 2; i++) {
    const r = await openai.responses.create({
      model: "gpt-4o-mini",
      input: "Dime un nombre inventado para una cafetería.",
      temperature: 0,
      max_output_tokens: 50,
    });
    console.log(i + 1, ":", r.output_text);
  }

  console.log("\n--- TEMPERATURE 1.5 (creativo) ---");
  for (let i = 0; i < 2; i++) {
    const r = await openai.responses.create({
      model: "gpt-4o-mini",
      input: "Dime un nombre inventado para una cafetería.",
      temperature: 1.5,
      max_output_tokens: 50,
    });
    console.log(i + 1, ":", r.output_text);
  }
}

main().catch(console.error);
