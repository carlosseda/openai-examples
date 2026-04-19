/**
 * 37 - Batch API (50% de descuento)
 * ---------------------------------
 * Envías miles de peticiones en un archivo JSONL, OpenAI las procesa
 * en background (hasta 24h) y devuelve otro JSONL con los resultados.
 * Coste: mitad que la API normal.
 *
 * Ejecutar: node 07-production/01-batch-api.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  // 1. Preparar archivo JSONL con las peticiones
  const requests = [
    { id: "1", input: "Traduce al inglés: Hola mundo" },
    { id: "2", input: "Traduce al inglés: Buenos días" },
    { id: "3", input: "Traduce al inglés: ¿Cómo estás?" },
  ];

  const jsonl = requests
    .map((r) =>
      JSON.stringify({
        custom_id: `req-${r.id}`,
        method: "POST",
        url: "/v1/responses",
        body: { model: "gpt-4o-mini", input: r.input },
      })
    )
    .join("\n");

  const batchPath = path.join(__dirname, "..", "assets", "batch.jsonl");
  fs.mkdirSync(path.dirname(batchPath), { recursive: true });
  fs.writeFileSync(batchPath, jsonl);

  // 2. Subir el archivo
  const file = await openai.files.create({
    file: fs.createReadStream(batchPath),
    purpose: "batch",
  });
  console.log("📤 Archivo subido:", file.id);

  // 3. Crear el batch
  const batch = await openai.batches.create({
    input_file_id: file.id,
    endpoint: "/v1/responses",
    completion_window: "24h",
  });
  console.log("🚀 Batch creado:", batch.id, "- estado:", batch.status);

  // 4. Hacer polling (en producción usa webhooks, no poll cada segundo)
  console.log("\n⏳ Esperando... (esto puede tardar varios minutos)");
  let status = batch;
  while (status.status !== "completed" && status.status !== "failed") {
    await new Promise((r) => setTimeout(r, 10_000));
    status = await openai.batches.retrieve(batch.id);
    console.log("   estado:", status.status);
  }

  if (status.status === "completed" && status.output_file_id) {
    const content = await openai.files.content(status.output_file_id);
    const text = await content.text();
    console.log("\n📥 Resultados:\n", text);
  }
}

main().catch(console.error);
