/**
 * 44 - Embeddings: vector a partir de texto
 * -----------------------------------------
 * Convierte texto en un vector numérico. Sirve para búsqueda semántica,
 * clustering, recomendaciones, clasificación...
 *
 * Modelos: text-embedding-3-small (barato) | text-embedding-3-large (mejor)
 *
 * Ejecutar: node 08-specialized/01-embeddings-basic.js
 */
const { openai } = require("../shared/client");

async function main() {
  const result = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "El gato se sentó en la alfombra",
    // dimensions: 512,  // opcional: recortar el vector para ahorrar espacio
  });

  const vector = result.data[0].embedding;
  console.log("Dimensiones:", vector.length); // 1536 por defecto
  console.log("Primeros 5 valores:", vector.slice(0, 5));
  console.log("\nUso:", result.usage);
}

main().catch(console.error);
