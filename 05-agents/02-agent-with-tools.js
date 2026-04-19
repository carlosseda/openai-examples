/**
 * 30 - Agents SDK: agente con herramientas
 * ----------------------------------------
 * Define tus propias funciones como tools con `tool()` + Zod.
 * El agente las llama automáticamente cuando le hacen falta.
 *
 * Ejecutar: node 05-agents/02-agent-with-tools.js
 */
require("dotenv").config();
const { z } = require("zod");

let Agent, run, tool;
try {
  ({ Agent, run, tool } = require("@openai/agents"));
} catch {
  console.log("⚠️  Instala: npm install @openai/agents");
  process.exit(0);
}

const getWeather = tool({
  name: "get_weather",
  description: "Obtiene el tiempo actual en una ciudad",
  parameters: z.object({ city: z.string() }),
  execute: async ({ city }) => {
    const mocks = { Palma: "22°C soleado", Madrid: "15°C nublado" };
    return mocks[city] || "desconocido";
  },
});

const addToCalendar = tool({
  name: "add_to_calendar",
  description: "Añade un evento al calendario",
  parameters: z.object({
    title: z.string(),
    datetime: z.string().describe("ISO 8601"),
  }),
  execute: async ({ title, datetime }) => {
    return `✅ Creado: "${title}" el ${datetime}`;
  },
});

async function main() {
  const agent = new Agent({
    name: "Planificador",
    instructions:
      "Ayudas a planificar actividades. Si el tiempo es bueno, propón salir y añade al calendario.",
    model: "gpt-4o-mini",
    tools: [getWeather, addToCalendar],
  });

  const result = await run(
    agent,
    "¿Qué tiempo hace en Palma? Si está bueno, ponme un picnic mañana a las 13:00."
  );
  console.log(result.finalOutput);
}

main().catch(console.error);
