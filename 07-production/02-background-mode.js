/**
 * 38 - Background mode
 * --------------------
 * Para tareas largas (deep research, agentes complejos) que pueden tardar minutos.
 * Envías la petición con `background: true` y te devuelve un ID inmediatamente.
 * Luego consultas su estado hasta que acabe.
 *
 * Ejecutar: node 07-production/02-background-mode.js
 */
const { openai } = require("../shared/client");

async function main() {
  // Lanzar en background
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: "Escribe un ensayo de 500 palabras sobre la historia de la computación.",
    background: true,
  });

  console.log("🚀 Tarea lanzada:", response.id, "- estado:", response.status);

  // Poll hasta completar
  let current = response;
  while (["queued", "in_progress"].includes(current.status)) {
    await new Promise((r) => setTimeout(r, 2000));
    current = await openai.responses.retrieve(response.id);
    console.log("   ...", current.status);
  }

  if (current.status === "completed") {
    console.log("\n✅ Resultado:\n", current.output_text);
  } else {
    console.log("❌ Falló:", current.status);
  }

  // También se puede cancelar: await openai.responses.cancel(response.id);
}

main().catch(console.error);
