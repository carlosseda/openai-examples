/**
 * 18 - Speech to Text (transcripción)
 * -----------------------------------
 * Transcribe un archivo de audio a texto.
 * Modelos: whisper-1 (clásico), gpt-4o-transcribe, gpt-4o-mini-transcribe (nuevos)
 *
 * Ejecutar: node 03-multimodal/05-speech-to-text.js
 */
const { openai } = require("../shared/client");
const fs = require("fs");
const path = require("path");

async function main() {
  // Usa el audio generado por el script anterior, o pon uno propio
  const audioPath = path.join(__dirname, "..", "assets", "speech.mp3");

  if (!fs.existsSync(audioPath)) {
    console.log(
      `⚠️  No hay audio en ${audioPath}. Ejecuta antes 04-text-to-speech.js.`
    );
    return;
  }

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "gpt-4o-mini-transcribe",
    // language: "es",  // opcional, si no lo autodetecta
    // response_format: "json" | "text" | "srt" | "verbose_json" | "vtt"
  });

  console.log("📝 Transcripción:\n", transcription.text);
}

main().catch(console.error);
