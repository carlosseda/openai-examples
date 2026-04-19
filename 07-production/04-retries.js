/**
 * 40 - Reintentos con backoff exponencial
 * ---------------------------------------
 * El SDK ya reintenta por defecto (2 veces), pero puedes configurarlo.
 * Y siempre es buena idea envolver tus llamadas con tu propio wrapper
 * para errores transitorios.
 *
 * Ejecutar: node 07-production/04-retries.js
 */
const OpenAI = require("openai");
require("dotenv").config();

// Opción 1: configurar el SDK
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3, // por defecto 2
  timeout: 60_000, // ms
});

// Opción 2: wrapper manual (te da más control)
async function withRetry(fn, { retries = 3, baseDelay = 1000 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      // Solo reintentar en errores transitorios
      const transient =
        e.status === 429 || e.status >= 500 || e.code === "ECONNRESET";
      if (!transient || i === retries) throw e;

      const delay = baseDelay * 2 ** i + Math.random() * 500;
      console.warn(
        `⚠️  Intento ${i + 1} falló (${e.status || e.code}). Reintentando en ${Math.round(delay)}ms...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

async function main() {
  const response = await withRetry(() =>
    client.responses.create({
      model: "gpt-4o-mini",
      input: "Di 'Hola resiliencia' en tres idiomas.",
    })
  );

  console.log(response.output_text);
}

main().catch(console.error);
