/**
 * 29 - Agents SDK: agente básico
 * ------------------------------
 * El Agents SDK es una capa por encima de Responses para construir
 * agentes con menos boilerplate (tools, handoffs, tracing, guardrails).
 *
 * Instalar: npm install @openai/agents
 *
 * Ejecutar: node 05-agents/01-basic-agent.js
 */
require("dotenv").config();
let Agent, run;
try {
  ({ Agent, run } = require("@openai/agents"));
} catch {
  console.log("⚠️  Instala el SDK: npm install @openai/agents");
  process.exit(0);
}

async function main() {
  const agent = new Agent({
    name: "Asistente",
    instructions: "Eres un asistente útil y conciso. Respondes en español.",
    model: "gpt-4o-mini",
  });

  const result = await run(agent, "Dime 3 consejos para aprender JavaScript.");
  console.log(result.finalOutput);
}

main().catch(console.error);
