/**
 * 47 - Deep Research
 * ------------------
 * Modelos 'o3-deep-research' y 'o4-mini-deep-research' que investigan
 * en profundidad: buscan en la web, leen muchas fuentes, sintetizan un informe.
 * Pueden tardar varios minutos. Recomendado usar con background + webhooks.
 *
 * Ejecutar: node 08-specialized/04-deep-research.js
 */
const { openai } = require("../shared/client");

async function main() {
  console.log("⏳ Lanzando deep research (puede tardar 2-10 min)...\n");

  const response = await openai.responses.create({
    model: "o4-mini-deep-research",
    input:
      "Investiga las tendencias 2025 en frameworks de JavaScript para frontend. Compara cuota de mercado y novedades. Devuelve un informe con citas.",
    tools: [{ type: "web_search" }],
    background: true,
  });

  console.log("🚀 Job:", response.id);

  // Poll
  let current = response;
  while (["queued", "in_progress"].includes(current.status)) {
    await new Promise((r) => setTimeout(r, 15_000));
    current = await openai.responses.retrieve(response.id);
    process.stdout.write(".");
  }

  if (current.status === "completed") {
    console.log("\n\n📋 INFORME:\n");
    console.log(current.output_text);
  }
}

main().catch(console.error);
