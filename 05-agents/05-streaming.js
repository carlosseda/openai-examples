/**
 * 33 - Agents SDK: streaming
 * --------------------------
 * Los agentes también se pueden ejecutar en streaming, viendo pasos
 * intermedios: llamadas a tools, handoffs, deltas de texto...
 *
 * Ejecutar: node 05-agents/05-streaming.js
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
  const agent = new Agent({
    name: "Narrador",
    instructions: "Narras historias cortas e imaginativas.",
    model: "gpt-4o-mini",
  });

  const stream = await run(agent, "Cuéntame una historia de 80 palabras sobre un robot que descubre el mar.", {
    stream: true,
  });

  // stream.toTextStream() te da sólo el texto
  for await (const chunk of stream.toTextStream()) {
    process.stdout.write(chunk);
  }
  console.log("\n\n✅ Listo");
}

main().catch(console.error);
