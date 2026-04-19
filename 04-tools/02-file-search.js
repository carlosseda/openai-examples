/**
 * 23 - File Search (RAG integrado)
 * --------------------------------
 * OpenAI gestiona el RAG por ti:
 *   1. Creas un Vector Store.
 *   2. Subes archivos (los chunkea, vectoriza e indexa).
 *   3. Activas la tool 'file_search' apuntando al vector store.
 *   4. El modelo busca automáticamente en los docs.
 *
 * Ejecutar: node 04-tools/02-file-search.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  // Crea un archivo de prueba si no existe
  const docPath = path.join(__dirname, "..", "assets", "faq.txt");
  fs.mkdirSync(path.dirname(docPath), { recursive: true });
  if (!fs.existsSync(docPath)) {
    fs.writeFileSync(
      docPath,
      `FAQ de Cafetería Luna\n\n` +
        `Horario: Abrimos de lunes a sábado de 8:00 a 20:00. Domingos cerrado.\n` +
        `Wifi: La contraseña es "cafeluna2024".\n` +
        `Pagos: Aceptamos efectivo, tarjeta y Bizum al 600 123 456.\n` +
        `Reservas: Solo para grupos de más de 6 personas, llamando al 971 000 000.\n` +
        `Alérgenos: Todos los productos están etiquetados. Hay opciones sin gluten y veganas.\n`
    );
  }

  // Paso 1: crear vector store
  const store = await openai.vectorStores.create({ name: "demo-cafe-faq" });
  console.log("📦 Vector store creado:", store.id);

  // Paso 2: subir archivo al store (todo en uno)
  await openai.vectorStores.files.uploadAndPoll(store.id, fs.createReadStream(docPath));
  console.log("✅ Archivo indexado");

  // Paso 3: usar file_search
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: "¿A qué hora abrís los sábados? ¿Aceptáis Bizum?",
    tools: [
      {
        type: "file_search",
        vector_store_ids: [store.id],
      },
    ],
  });

  console.log("\n🤖", response.output_text);

  // Limpieza
  await openai.vectorStores.del(store.id);
  console.log("\n🧹 Vector store eliminado");
}

main().catch(console.error);
