/**
 * 34 - Realtime API via WebSocket
 * -------------------------------
 * Conexión bidireccional para audio/texto en tiempo real.
 * Envías audio → recibes audio + transcripción mientras se genera.
 *
 * Este ejemplo sólo demuestra la conexión y un intercambio de texto.
 * Para audio de micrófono necesitas un navegador (WebRTC) o grabación local.
 *
 * Instalar: npm install ws
 *
 * Ejecutar: node 06-realtime/01-realtime-websocket.js
 */
require("dotenv").config();
let WebSocket;
try {
  WebSocket = require("ws");
} catch {
  console.log("⚠️  Instala: npm install ws");
  process.exit(0);
}

async function main() {
  const url =
    "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17";

  const ws = new WebSocket(url, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Beta": "realtime=v1",
    },
  });

  ws.on("open", () => {
    console.log("🔌 Conectado");

    // Configurar la sesión
    ws.send(
      JSON.stringify({
        type: "session.update",
        session: {
          modalities: ["text"],
          instructions: "Responde en español y de forma breve.",
        },
      })
    );

    // Enviar mensaje
    ws.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "Di hola en 5 idiomas." }],
        },
      })
    );

    // Pedir respuesta
    ws.send(JSON.stringify({ type: "response.create" }));
  });

  ws.on("message", (data) => {
    const event = JSON.parse(data.toString());
    if (event.type === "response.text.delta") {
      process.stdout.write(event.delta);
    } else if (event.type === "response.done") {
      console.log("\n\n✅ Fin");
      ws.close();
    } else if (event.type === "error") {
      console.error("❌", event.error);
      ws.close();
    }
  });

  ws.on("close", () => console.log("🔌 Desconectado"));
  ws.on("error", (e) => console.error("Error WS:", e.message));
}

main().catch(console.error);
