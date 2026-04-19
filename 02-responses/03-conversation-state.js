/**
 * 06 - Estado de conversación con previous_response_id
 * ----------------------------------------------------
 * La Responses API puede guardar el estado en los servidores de OpenAI.
 * En lugar de reenviar todo el historial, pasas el ID de la respuesta anterior.
 * Ventajas: menos tokens enviados, más simple de mantener.
 *
 * Ejecutar: node 02-responses/03-conversation-state.js
 */
const { openai } = require("../shared/client");

async function main() {
  // Turno 1
  const r1 = await openai.responses.create({
    model: "gpt-4o-mini",
    input: "Mi color favorito es el azul.",
    store: true, // necesario para poder referenciarla después
  });
  console.log("🤖 1:", r1.output_text);

  // Turno 2 - referenciamos el anterior
  const r2 = await openai.responses.create({
    model: "gpt-4o-mini",
    previous_response_id: r1.id,
    input: "¿Qué color te he dicho que me gustaba?",
  });
  console.log("🤖 2:", r2.output_text);

  // Turno 3
  const r3 = await openai.responses.create({
    model: "gpt-4o-mini",
    previous_response_id: r2.id,
    input: "Recomiéndame tres camisetas de ese color.",
  });
  console.log("🤖 3:", r3.output_text);
}

main().catch(console.error);
