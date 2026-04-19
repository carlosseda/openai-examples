/**
 * 41 - Prompt caching
 * -------------------
 * Si repites prompts largos (ej: mismo system prompt enorme), OpenAI
 * cachea automáticamente el prefijo común. Los tokens cacheados cuestan ~50% menos.
 *
 * No hace falta activar nada: ocurre automáticamente para prompts > 1024 tokens
 * que compartan prefijo. Verás el ahorro en `usage.prompt_tokens_details.cached_tokens`.
 *
 * Ejecutar: node 07-production/05-prompt-caching.js
 */
const { openai } = require("../shared/client");

const LONG_SYSTEM = `
Eres un experto en cocina mediterránea con 30 años de experiencia.
${"Conoces a fondo la historia, ingredientes y técnicas. ".repeat(200)}
Responde siempre en español, con tono cercano y recetas realistas.
`;

async function askRecipe(question) {
  const r = await openai.responses.create({
    model: "gpt-4o-mini",
    instructions: LONG_SYSTEM,
    input: question,
  });
  return r;
}

async function main() {
  const r1 = await askRecipe("Dame una receta de paella valenciana.");
  console.log("🍳 Primera llamada");
  console.log("  tokens input:", r1.usage.input_tokens);
  console.log("  cacheados:", r1.usage.input_tokens_details?.cached_tokens || 0);

  const r2 = await askRecipe("Ahora dame una receta de gazpacho.");
  console.log("\n🍳 Segunda llamada (misma system prompt larga)");
  console.log("  tokens input:", r2.usage.input_tokens);
  console.log("  cacheados:", r2.usage.input_tokens_details?.cached_tokens || 0);
  console.log(
    "\n💡 La segunda llamada debería tener muchos tokens cacheados → más barata."
  );
}

main().catch(console.error);
