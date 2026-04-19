/**
 * 17 - Text to Speech (TTS)
 * -------------------------
 * Convierte texto en audio. Varias voces disponibles:
 * alloy, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer
 *
 * Modelos: tts-1 (rápido), tts-1-hd (calidad), gpt-4o-mini-tts (nuevo, controlable)
 *
 * Ejecutar: node 03-multimodal/04-text-to-speech.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "coral",
    input:
      "Hola, esto es una prueba de la API de Text to Speech de OpenAI. Suena bastante natural, ¿verdad?",
    // Con gpt-4o-mini-tts puedes darle instrucciones de tono:
    instructions: "Habla con tono alegre y entusiasta, como un presentador de radio.",
  });

  const outPath = path.join(__dirname, "..", "assets", "speech.mp3");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outPath, buffer);

  console.log("✅ Audio guardado en", outPath);
}

main().catch(console.error);
