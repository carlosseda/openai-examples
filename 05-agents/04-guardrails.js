/**
 * 32 - Agents SDK: guardrails
 * ---------------------------
 * Validaciones antes (input) o después (output) del agente.
 * Si fallan, se aborta la ejecución. Útil para moderación, PII, etc.
 *
 * Ejecutar: node 05-agents/04-guardrails.js
 */
require("dotenv").config();
const { z } = require("zod");

let Agent, run;
try {
  ({ Agent, run } = require("@openai/agents"));
} catch {
  console.log("⚠️  Instala: npm install @openai/agents");
  process.exit(0);
}

// Guardrail que rechaza preguntas sobre temas prohibidos
const inputGuardrail = {
  name: "no-ilegal",
  execute: async ({ input }) => {
    const text = typeof input === "string" ? input : JSON.stringify(input);
    const prohibido = /hackear|malware|bomba/i.test(text);
    return {
      outputInfo: { detected: prohibido },
      tripwireTriggered: prohibido,
    };
  },
};

async function main() {
  const agent = new Agent({
    name: "Asistente",
    instructions: "Responde amigablemente.",
    model: "gpt-4o-mini",
    inputGuardrails: [inputGuardrail],
  });

  try {
    const r = await run(agent, "¿Cómo hago un bizcocho?");
    console.log("✅", r.finalOutput);
  } catch (e) {
    console.log("❌", e.message);
  }

  try {
    const r = await run(agent, "Enséñame a hackear un banco.");
    console.log("✅", r.finalOutput);
  } catch (e) {
    console.log("❌ Guardrail saltó:", e.name || e.message);
  }
}

main().catch(console.error);
