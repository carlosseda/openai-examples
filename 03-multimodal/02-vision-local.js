/**
 * 15 - Vision: imagen local en base64
 * -----------------------------------
 * Si la imagen está en tu disco, la codificas en base64 y la mandas
 * como data URL. Útil cuando no es pública.
 *
 * Ejecutar: node 03-multimodal/02-vision-local.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  // Usa cualquier imagen local. Si no tienes, descárgate una a ./assets/foto.jpg
  const imgPath = path.join(__dirname, "..", "assets", "foto.jpg");

  if (!fs.existsSync(imgPath)) {
    console.log(
      `⚠️  Pon una imagen en ${imgPath} para probar este script.`
    );
    return;
  }

  const imageBase64 = fs.readFileSync(imgPath, "base64");
  const dataUrl = `data:image/jpeg;base64,${imageBase64}`;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: "Describe esta imagen y extrae cualquier texto visible (OCR)." },
          { type: "input_image", image_url: dataUrl },
        ],
      },
    ],
  });

  console.log(response.output_text);
}

main().catch(console.error);
