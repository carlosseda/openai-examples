/**
 * 07 - Streaming de respuestas
 * ----------------------------
 * En lugar de esperar a la respuesta completa, recibes tokens según se generan.
 * Imprescindible para UX tipo chat (ChatGPT, Claude...).
 *
 * Ejecutar: node 02-responses/04-streaming.js
 */
const { openai } = require("../shared/client");

async function main() {
  const stream = await openai.responses.create({
    model: "gpt-4o-mini",
    input: "Cuenta del 1 al 20 explicando cada número con una palabra.",
    stream: true,
  });

  // Cada evento tiene un 'type'. Los más comunes:
  //  - response.output_text.delta  → fragmento de texto nuevo
  //  - response.completed          → final
  //  - response.error              → error
  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      process.stdout.write(event.delta);
    } else if (event.type === "response.completed") {
      console.log("\n\n✅ Stream completado");
    }
  }
}

main().catch(console.error);
