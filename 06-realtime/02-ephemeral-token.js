/**
 * 35 - Realtime: token efímero para el cliente
 * --------------------------------------------
 * Patrón recomendado: tu backend genera un token efímero (dura 1 min)
 * que el navegador usa para conectar por WebRTC. Así no expones tu API key.
 *
 * Ejecutar: node 06-realtime/02-ephemeral-token.js
 */
const { openai } = require("../shared/client");

async function main() {
  const session = await openai.beta.realtime.sessions.create({
    model: "gpt-4o-realtime-preview-2024-12-17",
    voice: "verse",
    instructions: "Eres un asistente amable.",
  });

  console.log("🔑 Token efímero (pásaselo al cliente):");
  console.log(session.client_secret.value);
  console.log("\nExpira en:", new Date(session.client_secret.expires_at * 1000).toLocaleTimeString());
  console.log("\n💡 El navegador lo usa así:");
  console.log(`
  const pc = new RTCPeerConnection();
  const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
  pc.addTrack(ms.getTracks()[0]);
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  const r = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", {
    method: "POST",
    body: offer.sdp,
    headers: { Authorization: "Bearer " + EPHEMERAL_TOKEN, "Content-Type": "application/sdp" },
  });
  await pc.setRemoteDescription({ type: "answer", sdp: await r.text() });
  `);
}

main().catch(console.error);
