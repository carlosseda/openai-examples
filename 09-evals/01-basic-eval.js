/**
 * 49 - Evals: evaluar un prompt
 * -----------------------------
 * Creas un dataset con inputs + respuestas esperadas, y un "grader" (criterio
 * de calificación). La plataforma ejecuta tu modelo contra el dataset y mide
 * qué porcentaje pasa.
 *
 * Este script crea una eval mínima. Los resultados se ven mejor en el dashboard:
 * https://platform.openai.com/evaluations
 *
 * Ejecutar: node 09-evals/01-basic-eval.js
 */
const { openai } = require("../shared/client");

async function main() {
  // 1. Crear la definición de la eval
  const evaluation = await openai.evals.create({
    name: "Test traducción ES→EN",
    data_source_config: {
      type: "custom",
      item_schema: {
        type: "object",
        properties: {
          input: { type: "string" },
          expected: { type: "string" },
        },
        required: ["input", "expected"],
      },
      include_sample_schema: true,
    },
    testing_criteria: [
      {
        type: "string_check",
        name: "contiene_esperado",
        input: "{{ sample.output_text }}",
        reference: "{{ item.expected }}",
        operation: "ilike",
      },
    ],
  });
  console.log("📋 Eval creada:", evaluation.id);

  // 2. Lanzar un run con el dataset inline
  const run = await openai.evals.runs.create(evaluation.id, {
    name: "run-1",
    data_source: {
      type: "responses",
      source: {
        type: "file_content",
        content: [
          { item: { input: "Hola mundo", expected: "hello" } },
          { item: { input: "Buenos días", expected: "good morning" } },
          { item: { input: "Gracias", expected: "thank" } },
        ],
      },
      input_messages: {
        type: "template",
        template: [
          { role: "system", content: "Traduce al inglés. Solo la traducción." },
          { role: "user", content: "{{ item.input }}" },
        ],
      },
      model: "gpt-4o-mini",
    },
  });

  console.log("🚀 Run lanzado:", run.id);
  console.log(
    "👉 Ver resultados en: https://platform.openai.com/evaluations/" +
      evaluation.id
  );
}

main().catch(console.error);
