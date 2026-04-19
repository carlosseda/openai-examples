/**
 * 19 - Traducción de audio (cualquier idioma → inglés)
 * ---------------------------------------------------
 * El endpoint 'translations' de Whisper transcribe Y traduce a inglés.
 * Útil para procesar audio multilingüe en un solo paso.
 *
 * Ejecutar: node 03-multimodal/06-audio-translation.js
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

  const result = await openai.audio.translations.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1", // translations solo soporta whisper-1
  });

  console.log("🌍 Traducido al inglés:\n", result.text);
}

main().catch(console.error);
