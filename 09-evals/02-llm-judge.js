/**
 * 50 - Evals: LLM-as-judge
 * ------------------------
 * Cuando la respuesta correcta no es exacta (ej: resúmenes, creatividad),
 * usas otro LLM como "juez" para puntuar si la respuesta cumple un criterio.
 *
 * Ejecutar: node 09-evals/02-llm-judge.js
 */
const { openai } = require("../shared/client");

async function main() {
  const evaluation = await openai.evals.create({
    name: "Calidad de resúmenes",
    data_source_config: {
      type: "custom",
      item_schema: {
        type: "object",
        properties: {
          article: { type: "string" },
        },
        required: ["article"],
      },
      include_sample_schema: true,
    },
    testing_criteria: [
      {
        type: "label_model",
        name: "resumen_bueno",
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content:
              "Evalúa si este resumen es FIEL al artículo original, CONCISO (<50 palabras) y está en ESPAÑOL.",
          },
          {
            role: "user",
            content:
              "Artículo: {{ item.article }}\n\nResumen: {{ sample.output_text }}",
          },
        ],
        passing_labels: ["bueno"],
        labels: ["bueno", "malo"],
      },
    ],
  });

  console.log("📋 Eval creada:", evaluation.id);
  console.log(
    "👉 Crea un run desde el dashboard o con openai.evals.runs.create()"
  );
}

main().catch(console.error);
