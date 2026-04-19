/**
 * 16 - Generación de imágenes con gpt-image-1
 * --------------------------------------------
 * Genera una imagen a partir de un prompt y la guarda en disco.
 *
 * Ejecutar: node 03-multimodal/03-image-generation.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt:
      "Un gato astronauta flotando en el espacio con estilo acuarela, colores suaves",
    size: "1024x1024", // 1024x1024 | 1024x1536 | 1536x1024 | auto
    quality: "medium", // low | medium | high | auto
    n: 1,
  });

  // gpt-image-1 devuelve base64
  const b64 = result.data[0].b64_json;
  const outPath = path.join(__dirname, "..", "assets", "generated.png");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(b64, "base64"));

  console.log("✅ Imagen guardada en", outPath);
}

main().catch(console.error);
