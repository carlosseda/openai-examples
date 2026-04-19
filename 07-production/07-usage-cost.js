/**
 * 43 - Medir uso y coste
 * ----------------------
 * Cada respuesta incluye `usage` con el desglose de tokens.
 * Aquí calculamos el coste aproximado según precio por millón de tokens.
 *
 * Ejecutar: node 07-production/07-usage-cost.js
 */
const { openai } = require("../shared/client");

// Precios aproximados en USD por 1M tokens (actualiza según pricing oficial)
const PRICES = {
  "gpt-4o-mini": { input: 0.15, output: 0.6, cached: 0.075 },
  "gpt-4o": { input: 2.5, output: 10, cached: 1.25 },
  "o4-mini": { input: 1.1, output: 4.4, cached: 0.275 },
};

function calcCost(model, usage) {
  const p = PRICES[model];
  if (!p) return null;
  const cached = usage.input_tokens_details?.cached_tokens || 0;
  const fresh = usage.input_tokens - cached;
  return (
    (fresh * p.input + cached * p.cached + usage.output_tokens * p.output) /
    1_000_000
  );
}

async function main() {
  const model = "gpt-4o-mini";
  const r = await openai.responses.create({
    model,
    input: "Explica qué es una API REST en 3 frases.",
  });

  console.log("Respuesta:\n", r.output_text);
  console.log("\n📊 Uso:");
  console.log("  Input:", r.usage.input_tokens);
  console.log("  Cacheados:", r.usage.input_tokens_details?.cached_tokens || 0);
  console.log("  Output:", r.usage.output_tokens);
  console.log("  Total:", r.usage.total_tokens);

  const cost = calcCost(model, r.usage);
  if (cost !== null) {
    console.log(`\n💰 Coste estimado: $${cost.toFixed(6)}`);
  }
}

main().catch(console.error);
