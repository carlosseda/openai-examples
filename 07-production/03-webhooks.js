/**
 * 39 - Webhooks (receptor)
 * ------------------------
 * En lugar de hacer polling, recibes notificaciones HTTP cuando pasan cosas:
 * batch completado, fine-tune terminado, background response lista, etc.
 *
 * Este script monta un servidor HTTP que valida la firma y procesa eventos.
 * Para probar en local: usa ngrok y registra el endpoint en el dashboard.
 *
 * Ejecutar: node 07-production/03-webhooks.js
 */
const http = require("http");
const crypto = require("crypto");

const WEBHOOK_SECRET = process.env.OPENAI_WEBHOOK_SECRET || "whsec_...";
const PORT = 3000;

function verifySignature(payload, headers) {
  // OpenAI manda una cabecera 'webhook-signature' tipo Stripe/Svix
  const sig = headers["webhook-signature"];
  const timestamp = headers["webhook-timestamp"];
  const id = headers["webhook-id"];
  if (!sig || !timestamp || !id) return false;

  const signedPayload = `${id}.${timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET.replace(/^whsec_/, ""))
    .update(signedPayload)
    .digest("base64");

  return sig.split(",").some((s) => s.split(",")[1] === expected || s.endsWith(expected));
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405).end();
    return;
  }

  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    // Validar firma
    if (!verifySignature(body, req.headers)) {
      console.warn("⚠️  Firma inválida");
      res.writeHead(401).end();
      return;
    }

    const event = JSON.parse(body);
    console.log("📬 Evento recibido:", event.type);

    switch (event.type) {
      case "batch.completed":
        console.log("   Batch", event.data.id, "terminado");
        break;
      case "response.completed":
        console.log("   Response", event.data.id, "lista");
        break;
      case "fine_tuning.job.succeeded":
        console.log("   Fine-tune OK");
        break;
      default:
        console.log("   (sin handler)");
    }

    res.writeHead(200).end("ok");
  });
});

server.listen(PORT, () => {
  console.log(`🎧 Webhook server escuchando en :${PORT}`);
  console.log(
    `💡 Expón con 'ngrok http ${PORT}' y registra la URL en el dashboard de OpenAI.`
  );
});
