/**
 * 21 - PDF como input
 * -------------------
 * Puedes enviar un PDF directamente al modelo para que lo lea.
 * Dos opciones:
 *   a) Subirlo con la Files API y referenciarlo por file_id
 *   b) Enviarlo en base64 como input_file
 *
 * Ejecutar: node 03-multimodal/08-pdf-input.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  const pdfPath = path.join(__dirname, "..", "assets", "documento.pdf");

  if (!fs.existsSync(pdfPath)) {
    console.log(
      `⚠️  Pon un PDF en ${pdfPath} para probar este script.`
    );
    return;
  }

  // Opción A: subir el archivo y referenciarlo
  const file = await openai.files.create({
    file: fs.createReadStream(pdfPath),
    purpose: "user_data",
  });
  console.log("📎 Archivo subido, id:", file.id);

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_file", file_id: file.id },
          {
            type: "input_text",
            text: "Resume este documento en 5 puntos clave.",
          },
        ],
      },
    ],
  });

  console.log("\n📄 Resumen:\n", response.output_text);

  // Limpieza opcional
  await openai.files.del(file.id);
}

main().catch(console.error);
