/**
 * 02 - Listar modelos
 * -------------------
 * Muestra todos los modelos disponibles para tu cuenta.
 * Útil para saber qué puedes usar en cada momento.
 *
 * Ejecutar: node 01-basics/02-list-models.js
 */
const { openai } = require("../shared/client");

async function main() {
  const models = await openai.models.list();

  // models.data es un array. Los ordenamos por id.
  const ids = models.data.map((m) => m.id).sort();
  console.log(`Modelos disponibles (${ids.length}):\n`);
  ids.forEach((id) => console.log(" -", id));
}

main().catch(console.error);
