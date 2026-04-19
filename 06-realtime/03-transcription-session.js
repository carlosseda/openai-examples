/**
 * 36 - Realtime: transcripción en directo
 * ---------------------------------------
 * Sesiones de solo transcripción (sin generar respuesta).
 * Útil para subtítulos en vivo, dictado, notas de reuniones.
 *
 * Este script sólo crea la sesión y muestra cómo conectarse.
 * La captura de micrófono se hace desde el cliente.
 *
 * Ejecutar: node 06-realtime/03-transcription-session.js
 */
const { openai } = require("../shared/client");

async function main() {
  const session = await openai.beta.realtime.transcriptionSessions.create({
    input_audio_transcription: {
      model: "gpt-4o-mini-transcribe",
      language: "es",
    },
    input_audio_noise_reduction: { type: "near_field" },
    turn_detection: { type: "server_vad" },
  });

  console.log("🎙️  Sesión de transcripción creada");
  console.log("Token:", session.client_secret.value);
  console.log(
    "\nConéctate por WebSocket enviando chunks de audio con 'input_audio_buffer.append'"
  );
}

main().catch(console.error);
