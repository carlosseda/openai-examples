/**
 * 48 - Clasificación con embeddings
 * ---------------------------------
 * Alternativa más barata que usar un LLM para clasificar:
 *   1. Calculas embeddings de etiquetas de ejemplo.
 *   2. Para cada texto nuevo, comparas su embedding con cada etiqueta.
 *   3. Ganadora = la más cercana.
 *
 * Ejecutar: node 08-specialized/05-classification.js
 */
const { openai } = require("../shared/client");

function cosine(a, b) {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    d += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return d / (Math.sqrt(na) * Math.sqrt(nb));
}

async function embed(texts) {
  const r = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return r.data.map((d) => d.embedding);
}

async function main() {
  const categorias = {
    positivo: "Comentario positivo, elogio, satisfacción, contento, feliz.",
    negativo: "Queja, crítica, insatisfacción, enfado, decepción.",
    pregunta: "Duda, consulta, solicitud de información.",
  };

  const labels = Object.keys(categorias);
  const labelVectors = await embed(labels.map((l) => categorias[l]));

  const reviews = [
    "El envío llegó súper rápido y el producto es genial.",
    "Llevo 3 días esperando y nadie me contesta, qué vergüenza.",
    "¿Puedo devolver un pedido si ya lo he abierto?",
  ];

  const reviewVectors = await embed(reviews);

  reviews.forEach((review, i) => {
    const scores = labelVectors.map((lv) => cosine(reviewVectors[i], lv));
    const best = labels[scores.indexOf(Math.max(...scores))];
    console.log(`[${best.padEnd(10)}] ${review}`);
  });
}

main().catch(console.error);
