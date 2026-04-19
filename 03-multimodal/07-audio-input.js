/**
 * 20 - Audio como input del modelo (no solo transcripción)
 * --------------------------------------------------------
 * gpt-4o-audio-preview acepta audio directamente y razona sobre él,
 * sin pasar por transcripción. Útil para análisis de tono, intención, etc.
 *
 * Nota: usa la chat.completions API (la Responses aún no soporta audio input
 * de esta forma en todos los modelos). Se conserva este patrón por utilidad.
 *
 * Ejecutar: node 03-multimodal/07-audio-input.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  const audioPath = path.join(__dirname, "..", "assets", "speech.mp3");

  if (!fs.existsSync(audioPath)) {
    console.log(`⚠️  No hay audio en ${audioPath}.`);
    return;
  }

  const audioB64 = fs.readFileSync(audioPath).toString("base64");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-audio-preview",
    modalities: ["text"],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Escucha este audio y dime: ¿qué tono usa el hablante? ¿Es alegre, serio, neutro?",
          },
          {
            type: "input_audio",
            input_audio: { data: audioB64, format: "mp3" },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

main().catch(console.error);
