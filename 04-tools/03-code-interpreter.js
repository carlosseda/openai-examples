/**
 * 24 - Code Interpreter
 * ---------------------
 * El modelo puede ejecutar Python en un sandbox para hacer cálculos,
 * análisis de datos, generar gráficos, procesar archivos, etc.
 *
 * Ejecutar: node 04-tools/03-code-interpreter.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    tools: [
      {
        type: "code_interpreter",
        container: { type: "auto" }, // OpenAI crea un contenedor automáticamente
      },
    ],
    input:
      "Calcula la media, mediana y desviación típica de estos números: [12, 45, 67, 23, 89, 34, 56, 78, 11, 90]. Muéstrame el código que has usado.",
  });

  console.log(response.output_text);

  // Si el código genera archivos (imágenes, csvs...), vendrán en las annotations
  for (const item of response.output || []) {
    if (item.type === "message") {
      for (const c of item.content || []) {
        for (const a of c.annotations || []) {
          if (a.type === "container_file_citation") {
            console.log("\n📎 Archivo generado:", a.filename, `(file_id: ${a.file_id})`);
          }
        }
      }
    }
  }
}

main().catch(console.error);
