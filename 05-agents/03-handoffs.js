/**
 * 31 - Agents SDK: handoffs entre agentes
 * ---------------------------------------
 * Un agente 'triage' decide a qué agente especializado pasar la conversación.
 * Patrón clásico para sistemas multi-agente.
 *
 * Ejecutar: node 05-agents/03-handoffs.js
 */
require("dotenv").config();
let Agent, run;
try {
  ({ Agent, run } = require("@openai/agents"));
} catch {
  console.log("⚠️  Instala: npm install @openai/agents");
  process.exit(0);
}

async function main() {
  const spanishAgent = new Agent({
    name: "Agente Español",
    instructions: "Respondes siempre en español.",
    model: "gpt-4o-mini",
  });

  const englishAgent = new Agent({
    name: "English Agent",
    instructions: "You always respond in English.",
    model: "gpt-4o-mini",
  });

  const triage = new Agent({
    name: "Triage",
    instructions:
      "Detectas el idioma del usuario y haces handoff al agente adecuado.",
    model: "gpt-4o-mini",
    handoffs: [spanishAgent, englishAgent],
  });

  const r1 = await run(triage, "Hola, ¿cómo estás?");
  console.log("ES →", r1.finalOutput);

  const r2 = await run(triage, "Hello, how are you?");
  console.log("EN →", r2.finalOutput);
}

main().catch(console.error);
