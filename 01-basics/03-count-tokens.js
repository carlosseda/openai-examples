/**
 * 03 - Contar tokens
 * ------------------
 * Estima cuántos tokens consume un texto ANTES de enviarlo a la API.
 * Clave para controlar costes y no pasarse del límite de contexto.
 *
 * Nota: la forma recomendada es usar 'tiktoken' o 'js-tiktoken'.
 * Aquí uso una aproximación simple para no añadir más dependencias,
 * pero para producción instala: npm install js-tiktoken
 *
 * Ejecutar: node 01-basics/03-count-tokens.js
 */

// Aproximación muy burda: ~4 caracteres por token en inglés, ~3 en español.
function estimateTokens(text) {
  return Math.ceil(text.length / 3.5);
}

// Versión real con js-tiktoken (descomenta si la instalas):
// const { encodingForModel } = require("js-tiktoken");
// function countTokens(text, model = "gpt-4o") {
//   const enc = encodingForModel(model);
//   return enc.encode(text).length;
// }

const textos = [
  "Hola mundo",
  "La API de OpenAI permite generar texto, imágenes, audio y más.",
  "JavaScript".repeat(100),
];

for (const t of textos) {
  const tokens = estimateTokens(t);
  const preview = t.length > 50 ? t.slice(0, 50) + "..." : t;
  console.log(`[${tokens} tokens] ${preview}`);
}

console.log(
  "\n💡 Para un conteo exacto instala 'js-tiktoken' y usa encodingForModel()."
);
