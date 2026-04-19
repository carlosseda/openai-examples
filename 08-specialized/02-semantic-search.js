/**
 * 45 - Búsqueda semántica con embeddings
 * --------------------------------------
 * Patrón RAG manual: calculamos embeddings de varios documentos,
 * luego al buscar comparamos con similaridad coseno.
 *
 * Ejecutar: node 08-specialized/02-semantic-search.js
 */
const { openai } = require("../shared/client");

// Similaridad coseno
function cosine(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function embed(texts) {
  const r = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return r.data.map((d) => d.embedding);
}

async function main() {
  const docs = [
    "Los gatos son mamíferos y les gusta dormir al sol.",
    "Para hacer pan necesitas harina, agua, sal y levadura.",
    "Python es un lenguaje de programación muy popular en IA.",
    "La Torre Eiffel está en París y mide 330 metros.",
    "JavaScript se usa principalmente para desarrollo web.",
  ];

  console.log("📚 Indexando documentos...");
  const docVectors = await embed(docs);

  const query = "¿Qué lenguajes se usan en programación?";
  console.log(`\n🔍 Búsqueda: "${query}"\n`);

  const [queryVec] = await embed([query]);

  const scored = docs
    .map((doc, i) => ({ doc, score: cosine(queryVec, docVectors[i]) }))
    .sort((a, b) => b.score - a.score);

  scored.forEach((s, i) => {
    console.log(`${i + 1}. [${s.score.toFixed(3)}] ${s.doc}`);
  });
}

main().catch(console.error);
