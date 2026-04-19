/**
 * 14 - Vision: analizar imagen desde URL
 * --------------------------------------
 * El modelo puede "ver" imágenes. Le pasas la URL o un base64
 * como parte del input y le preguntas lo que quieras.
 *
 * Ejecutar: node 03-multimodal/01-vision-url.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: "¿Qué aparece en esta imagen? Descríbelo en detalle." },
          {
            type: "input_image",
            image_url:
              "https://infocar.dgt.es/etraffic/data/camaras/1386.jpg",
          },
        ],
      },
    ],
  });

  console.log(response.output_text);
}

main().catch(console.error);
