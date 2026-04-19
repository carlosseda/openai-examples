/**
 * 25 - Image Generation como herramienta
 * --------------------------------------
 * Dentro de una conversación, el modelo decide cuándo generar una imagen.
 * Perfecto para flujos tipo "diséñame el logo y explícame los colores".
 *
 * Ejecutar: node 04-tools/04-image-gen-tool.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    tools: [{ type: "image_generation" }],
    input:
      "Necesito un logo minimalista para una cafetería llamada 'Luna'. Genera la imagen y luego explícame por qué has elegido ese estilo.",
  });

  console.log("🤖", response.output_text);

  // Buscar las imágenes generadas en el output
  for (const item of response.output || []) {
    if (item.type === "image_generation_call" && item.result) {
      const outPath = path.join(__dirname, "..", "assets", "logo-luna.png");
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, Buffer.from(item.result, "base64"));
      console.log("\n🎨 Imagen guardada en", outPath);
    }
  }
}

main().catch(console.error);
